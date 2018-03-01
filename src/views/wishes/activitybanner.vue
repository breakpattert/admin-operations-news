<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="启用状态">
        <el-option v-for="item in  homebannerStatusList" :key="item.id" :label="item.name" :value="item.id"><!--:value绑定他们 的value、值-->
        </el-option>
      </el-select>
      
       <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          format="yyyy-MM-dd"
          @change="updateListQueryDate"
          :default-value="dateSelect"
          :editable="false"
          :clearable="false"
          >
      </el-date-picker>
				<!--搜索通过getlist里面的listQuery.delete_mark属性发送给后台-->
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
     <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
    </div>
		<!-- v-loading.body="listLoading控制我们的列表的显示影藏"-->
    <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="200px" align="center" label="banner封面图">
        <template scope="scope">
          <img :src="scope.row.cover_url" width="100%">
        </template>
      </el-table-column>
           <!--<el-table-column width="200px" align="center" label="banner内容图">
        <template scope="scope">
          <img :src="scope.row.content_url" width="100%">
        </template>
      </el-table-column>-->

      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
        	<!--bannerStatusListFilter是传入了我们的bannerStatusList这种数据的过滤相对的是我们上面bannerStatusList-->
          <span>{{ scope.row.status | homebannerStatusListFilter}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
        	<!--状态的一个管理  默认的是true是启用状态的-->
          <el-button size="small" type="primary" @click="changeShelfStatus(scope.row)">{{scope.row.status | homebannerStatusListFilter(true)}}</el-button>
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
     <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

<!--弹窗之后的的新增页面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
      <el-form class="small-space" :model="temp" label-position="left" label-width="100px" style='width: 80%; margin-left:50px;'>
          <el-form-item label="banner封面">
            <adminImage v-model="temp.cover_url"></adminImage>
          </el-form-item>
      </el-form>
       <el-form class="small-space" :model="temp" label-position="left" label-width="100px" style='width: 80%; margin-left:50px;'>
          <el-form-item label="banner详情">
            <adminImage v-model="temp.content_url"></adminImage>
          </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  <!--  修改版本的弹窗-->
<!--     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
   
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 80%; margin-left:50px;'>

        <el-form-item label="banner封面" label-width="100%">
          <adminImage v-model="temp.banner_url" style="width:100%;"></adminImage>
        </el-form-item>

        <el-form-item label="banner详情" style="width:100%;">
          <Tinymce :height=200 
                :customButton="['editorImage']" 
                v-model="temp.wish_content"
                ></Tinymce>
        </el-form-item>
        <el-form-item label="banner排序" style="width: 130px">
          <el-input-number v-model="temp.sort" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      	<!--点击取消的时候就是dialogFormVisible让这个状态就是false就是取消-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>-->

  </div>
</template>
<script>
		/*list列表git请求, update提交post, create 添加post请求, enable愿望bannerpost, detail详情post, remove删除post请求*/
    import {list, update, create, enable, detail, remove} from 'api/activitybanner';
  	/*shelfStatus上下架的，wishList愿望的一个状态购物，旅行，shelfStatusList是一个上下架的状态 ，
    wishListFilter对愿望的id做过滤里面的数组id，checkWithdrawFilter审核状态的方法，
    bannerStatusList启用和停用的状态，bannerStatusListFilter状态转换的需求，*/
    import { shelfStatus, wishList, shelfStatusList, wishListFilter, 
            checkWithdrawFilter, homebannerStatusList, homebannerStatusListFilter} from '@/filters';
   //parseTime事件日期的一个格式的处理
    import { parseTime } from 'utils';
    import { Message } from 'element-ui';
    //上传adiou ridio images 的处理
    import Tinymce from 'components/Tinymce';
    // import adminImage from 'components/Upload/adminImage';
    //上传图片的方法和html
    import adminImage from 'components/Upload/adminSingleImage';

    export default {
      name: 'wish_banner',
      data() {
        return {
          content: '',
          shelfStatusList,
          homebannerStatusList,
          
           dateSelect: [],
          /*数据的list*/
          list: null,
          total: null,
          listLoading: true,
          data:new Date(),
          listQuery: {
          	 begin_date: '0000-00-00 00:00:00',
            end_date: '9999-00-00 00:00:00',
             status:null,
            current_page: 1,
            page_size: 10,
            category:1,
          },
          temp: {
          	 id: undefined,
            sort: 1,
            content_url: '',
            cover_url: ''
          },
        /*  默认取消是属于flase,flase就是true*/
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
        adminImage
      },
      created() {
      	 var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
        var s_time = parseTime(lastWeek), e_time = parseTime(now);
        this.dateSelect = [s_time, e_time];
        this.updateListQueryDate();
        this.getList();
      },
      filters: {
        parseTime,
        homebannerStatusListFilter
      },
      methods: {
      	   updateListQueryDate(){
          var dateSelect = this.dateSelect;
          if(dateSelect.length == 2){
            this.listQuery.begin_date = parseTime(dateSelect[0]);
            this.listQuery.end_date = parseTime(dateSelect[1]);
          }
        },
        getList() {
          this.listLoading = true;
          //到时候修改list里面的url接口
          list(this.listQuery).then(res => {
            var d = res.data;
//          console.log(d.data.page_wish_market_d_t_o.market_d_t_o_s);
            if(d.data && d.data.page_wish_market_d_t_o){
                var data = d.data.page_wish_market_d_t_o;
              this.list = data.market_d_t_o_s;
              this.total = data.count;
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        },
//      getData(){
//    	 var m = time.getMonth() + 1;
//				var t = time.getFullYear() + "-" + m + "-"+ time.getDate() + " " + time.getHours() + ":"+ time.getMinutes() + ":" + time.getSeconds();
//				this.data=t;
//      },
        changeShelfStatus(row){
          var params = {
            id: row.id,
            status: row.status == 0 ? 1 : 0
          }
          enable(params).then(res => {
            var d = res.data;
            this.$message({
              message: d.msg || '操作成功',
              type: 'success'
            });

            this.getList();
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
        //新增的方法
        handleCreate() {
        
          this.resetTemp();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
         
        },
//      编辑的方法
        handleUpdate(row) {
          var temp = this.temp, self= this;
          detail({id: row.id}).then(res => {
            var d = res.data;
            if(d.data && d.data.homepage_banner_d_t_o){
              var info = d.data.homepage_banner_d_t_o;
              temp.id = info.id;
              temp.cover_url = info.cover_url;
              temp.content_url = info.content_url;
              this.dialogStatus = 'update';
              this.dialogFormVisible = true;
            }else{
              self.$message.error(d.msg || '操作失败')
            }
          })
        },
        handleDelete(row) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        },
       /* 确定*/
      
        create() {
           var self = this, temp = this.temp;
//        var data =  parseTime(this.data);
          var params = {
             cover_url: temp.cover_url,
            sort: temp.sort,
            content_url: temp.content_url
          }
            create(params).then(res => {
//          	 console.log(res.data.homepage_banner_d_t_o);
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
        /*最外层的确定*/
        update() {
       
//      	console.log(this.temp);
          var params = {
          	id:this.temp.id,
            cover_url: this.temp.cover_url,
            sort: this.temp.sort,
            content_url: this.temp.content_url
          }
          update(params).then(res => {
        
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            
          })
        },
//      删除的方法 就是针对当前的banner——id发送到后台然后就删除了删除了之后就对页面进行一个刷新
        remove(row){
        	console.log(row.id)
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
            cover_url: '',
            content_url:'',
            sort:1,
          };
        }

      }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-form--label-left .el-form-item__label {
    width: 100px!important;
    display: block;
	}
	.el-form-item__content {
  	margin-left:100px!important;
  
}
/*.upload-container .image-uploader[data-v-c165036a] {
    width:60%!important;
   
}
.upload-container .image-preview[data-v-c165036a] {
    width:60%!important;
    margin-left: 0!important;
    
 
}*/
</style>