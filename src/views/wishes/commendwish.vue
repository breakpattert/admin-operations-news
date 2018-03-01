<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
    </div>

    <el-table  :key='tableKey' index="index" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="80px" align="center" label="愿望id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="70px" label="愿望名称">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.wish_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="愿望顺序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>


      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
          <!--<el-button size="small" @click="changeShelfStatus(scope.row)" type="primary">{{scope.row.status | shelfStatusFilter('operationName')}}</el-button>-->
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
    <!-- <el-dialog :title="textMap[dialogStatus]" v-if="dialogFormVisible" size="large"> -->
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 80%; margin-left:50px;'>
      	 <el-form-item label="推荐理由">
          <el-input v-model="temp.recommend_reason" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="愿望名称">
          <el-input v-model="temp.wish_name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="正在实现愿望人数">
          <el-input v-model="temp.choose_count" placeholder="请输入内容" style="margin-top:12px;"></el-input>
        </el-form-item>

        <el-form-item label="愿望标签">
          <template>
            <el-radio class="radio" v-model="temp.category" v-for="wish in wishList" :label="wish.id" :key="wish.id">{{wish.name}}</el-radio>
          </template>
        </el-form-item>
         <el-form-item label="愿望时间">
   				<template>
  					<el-input-number v-model="temp.needs_days" :min="15" label="描述文字"></el-input-number>
					</template>
        </el-form-item>
        <!--<el-form-item label="愿望详情">
          <Tinymce :height=200
                :customButton="['editorImage']"
                v-model="temp.wish_content"
                ></Tinymce>
        </el-form-item>-->
        <el-form-item label="愿望详情">
        <el-input  type="textarea" v-model="temp.wish_content" placeholder="请输入内容" class="filter-item" style="min-height:100px"></el-input>
        </el-form-item>

        <el-form-item label="愿望金额">
          <el-input-number v-model="temp.amount" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="愿望顺序">
          <el-input-number v-model="temp.sort" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { fetchWishList, createWish, changeShelfStatus, fetchWishById, updateWish, remove } from 'api/commendwish';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { shelfStatus, wishList, shelfStatusList, wishListFilter, checkWithdrawFilter } from '@/filters';
    import Tinymce from 'components/Tinymce';
    import adminImages from 'components/Upload/adminImage';
//		import adminImage from 'components/Upload/adminImage';
		import adminSingleImage from 'components/Upload/adminSingleImage';

    export default {
      name: 'table_demo',
      data() {
        return {
          content: '',
          // 愿望类型
          wishList,
          shelfStatusList,
          content: '',

          dateSelect: [],
          list: null,
//        total: null,
          listLoading: true,
          listQuery: {
          },
          temp: {
		         id: undefined,
   					wish_name: '',
            category: 0,
            recommend_reason:'',
             sort: 1,
            amount: 0,
            choose_count:1,
          needs_days:1,
            wish_content: '',
            wish_sort: '',
            wish_content:'',
          },
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          tableKey: 0
        }
      },
      components: {
        Tinymce,
        adminImages,
        adminSingleImage
      },
      created() {
        var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
        var s_time = parseTime(lastWeek), e_time = parseTime(now);
        this.dateSelect = [s_time, e_time];
//      this.updateListQueryDate();
        this.getList();
      },
      filters: {
        parseTime,
        shelfStatus,
        wishListFilter,
        checkWithdrawFilter
      },
      methods: {
        getList() {
          this.listLoading = true;
          fetchWishList(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.datas){
              this.list = d.data.datas;
//            this.total = d.data.page_wish_market_d_t_o.count;
           console.log(d.data);
            }else{
              this.list = [];
//            this.total = 0;
            }
            this.listLoading = false;
          })
        },
        changeShelfStatus(row){
          var status = row.status == 0 ? 1 : 0, self = this;
          var params = {
            wish_id: row.id,
            status: status
          }
          changeShelfStatus(params).then(res => {
            var d = res.data;
            Message({
              message: d.msg,
              type: 'success',
              duration: 3000
            })
            self.getList();
          })
        },
        handleFilter() {
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.current_page = val;
          this.getList();
        },
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        handleCreate() {
          this.resetTemp();
          this.dialogStatus = 'create';
          this.$nextTick(() => {
            this.dialogFormVisible = true;
          })
        },
        handleUpdate(row) {

          const self = this;
					self.temp.id=row.id;
//        通过api里面的fetchWishById
          fetchWishById({id: row.id}).then(res => {
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          })

//         self.temp.img_url.splice(0,img_url.lengt
            self.getList();
        },
        checkTemp(){
          var temp = this.temp;
          if(!temp.name || temp.name == ""){
            Message({message: "请输入愿望名称", type: 'error', duration: 3 * 1000})
          }

        },
        create() {
          var self = this, temp = this.temp;

          var params = {
            wish_name: temp.wish_name,
            recommend_reason:temp.recommend_reason,
            category: temp.category,

            amount: temp.amount,
            sort: temp.sort,
            choose_count:temp.choose_count,
            needs_days:temp.needs_days,
            wish_content: temp.wish_content,

          }
          createWish(params).then(res => {
          	  console.log(res.data);
            self.dialogFormVisible = false;
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
            self.getList();

          })
        },
        update() {


          var temp = this.temp, self = this;
          self.getList();

          var params = {
            	id: temp.id,
            	 wish_name: temp.wish_name,
            recommend_reason:temp.recommend_reason,
            category: temp.category,

            amount: temp.amount,
            sort: temp.sort,
            choose_count:temp.choose_count,
            needs_days:temp.needs_days,
            wish_content: temp.wish_content,
          }

          updateWish(params).then(res => {
            self.dialogFormVisible = false;
             window.location.reload();
            console.log(res.data);
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });


          })
            sel.temp.img_url.splice(0,img_url.length);
            self.getList();

        },
        remove(row){
          const params = {
            id: row.id,
          },self = this;
          remove(params).then(res => {
            var d = res.data;
            if(res.data.code == "10000"){
              self.$message.success(d.msg || '操作成功')
            }else{
              self.$message.error(d.msg || '操作失败')
            }
            self.getList();
          })
        },
        resetTemp() {
          this.temp = {
            id: undefined,
            category: 4,
            wish_name: '',
            wish_content: '',
            amount: 0,
            sort: 1,
          };
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
.el-form--label-left .el-form-item__label{
	    line-height: 20px;
}



   
</style>