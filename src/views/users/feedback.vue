<template>
  <div class="app-container">
    <div class="filter-container">
    	<!--用户手机号对应手机号做一个搜索-->
    	<el-input v-model="listQuery.mobile" placeholder="手机号" class="filter-item" style="width:130px"></el-input>
<!--这里的状态要改成处理-->
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="处理状态">
        <el-option v-for="item in  feedStatusList" :key="item.id" :label="item.name" :value="item.id">
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

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table  :key='tableKey' index="index" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序列" width="65" type="index">
      </el-table-column>

      <el-table-column width="80px" align="center" label="用户id">
        <template scope="scope">
          <span>{{scope.row.user_id}}</span>
        </template>
      </el-table-column>
<!--下面这些都拿掉-->

      <!--这里动态获取-->
	<el-table-column  align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
          <span>{{ scope.row.status | feedStatusListFilter}}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
  
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">查看</el-button>
       <!--   这个改成处理-->
        <template v-if="[0].indexOf(scope.row.status) == 0">
           	 <!-- <el-button type="info">信息按钮</el-button>-->
            <el-button size="small" type="primary" @click="editor(scope.row)">处理</el-button>
          </template>
   
        
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"  :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
       <el-dialog title="查看" :visible.sync="dialogFormVisible" size="large">
      <el-form class="small-space" :model="main" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="系统版本号">
          <span>{{main.source | appListFilter}}</span>
        </el-form-item>
        <el-form-item label="app版本号">
          <span>{{main ? main.app_version: ''}}</span>
        </el-form-item>

        <el-form-item label="反馈详情">
          <span>{{main ? main.suggestion : ''}}</span>
        </el-form-item>
				
				 <el-form-item label="处理详情">
          <span>{{main ? main.process_desc : ''}}</span>
      </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
		<!--	处理-->
    </el-dialog>
        <el-dialog title="处理" :visible.sync="dialogStatement" size="large">
      
      <el-form class="small-space" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="处理结果">
        <el-input  type="textarea" v-model="temp.process_desc" placeholder="请输入内容" class="filter-item" style="min-height:100px"></el-input>
        </el-form-item>
      </el-form> 
   
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStatement = false">取 消</el-button>
        <el-button type="primary" @click="updateDeposit">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
    import { fetchWishList, detail, editor} from 'api/feedback';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { shelfStatus, feedStatusList,feedStatusListFilter,appList,appListFilter} from '@/filters';


//		import adminImage from 'components/Upload/adminImage';


    export default {
      name: 'table_demo',
      data() {
        return {
      


          feedStatusList,
					appList,
          dialogFormVisible: false,
					dialogStatement :false,
          dateSelect: [],
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
           /* category: null,*/
            begin_date: '0000-00-00 00:00:00',
            end_date: '9999-00-00 00:00:00',
            mobile:null,
            current_page: 1,
            page_size: 10,
            status: null
          },
          temp: {
        
          },
          main:{
          	
          },
          dialogFormVisible: false,
       
          tableKey: 0
        }
      },
      components: {
     
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
        shelfStatus,
       
    appListFilter,
        feedStatusListFilter
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
          fetchWishList(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.pagination_d_t_o){
              this.list = d.data.pagination_d_t_o.datas;
              this.total = d.data.pagination_d_t_o.total_count;
           console.log(this.list);
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        },
        editor(row){
          this.temp = {
            id: row.id,
            process_desc:''
          }
          this.dialogStatement = true;
        },
        updateDeposit(){
          const self = this;
          editor(this.temp.id, this.temp.process_desc).then(res => {
            console.log(res.data);
              
            this.dialogStatement = false;
            
          })
             self.getList();
     
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
//      handleModifyStatus(row, status) {
//        this.$message({
//          message: '操作成功',
//          type: 'success'
//        });
//        row.status = status;
//      },

       handleUpdate(row) {
          var main = this.main, self= this;
          detail({id: row.id}).then(res => {
            var d = res.data;
//          console.log(d.data.suggestion_feedback_d_t_o)
            if(d.data && d.data.suggestion_feedback_d_t_o){
              self.main = d.data.suggestion_feedback_d_t_o || {};
              console.log(main);
         
              this.dialogFormVisible = true;
            }else{
              self.$message.error(d.msg || '操作失败')
            }
          })
        },


        remove(row){
          const params = {
            wish_id: row.id,
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
          };
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
.el-textarea__inner {
    height: 120px!important;
}


   
</style>