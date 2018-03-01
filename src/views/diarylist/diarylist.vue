<template>
  <div class="app-container">
    <div class="filter-container">
    	<!--用户手机号对应手机号做一个搜索-->
    <el-input v-model="listQuery.nick_name" placeholder="昵称" class="filter-item" style="width:180px"></el-input>
<!--这里的状态要改成处理-->
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sys_status" placeholder="全部">
        <el-option v-for="item in shelfStatusList" :key="item.id" :label="item.name" :value="item.status">
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

      <el-table-column width="80px" align="center" label="日记id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
<!--下面这些都拿掉-->

      <!--这里动态获取-->
	<el-table-column  align="center" label="昵称">
        <template scope="scope">
          <span>{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="日记内容">
        <template scope="scope">
          <span style="white-space: nowrap;">{{scope.row.diary_content}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
          <span>{{ scope.row.sys_status | shelfStatusFilter('name')}}</span>
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
       <!-- 	<template v-if="[0,1,2].indexOf(scope.row.status) == 0">
           	 <!-- <el-button type="info">信息按钮</el-button>-->
        <!--    <el-button size="small" type="primary" @click="editor(scope.row)">处理</el-button>
          </template>-->
    <!--      	<template>
           	 <!-- <el-button type="info">信息按钮</el-button>-->
            <!--<el-button size="small" type="primary" @click="editor(scope.row)">删除</el-button>
          </template>-->
          <el-button size="small" @click="changeShelfStatus(scope.row)" type="primary">{{scope.row.sys_status | shelfStatusFilter('operationName')}}</el-button>
   
        
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"  :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  <el-dialog title="查看详情" :visible.sync="dialogFormVisible" size="large">
   	<el-form class="small-space" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
    
        <el-form-item label="日记内容" >

      <div style="padding:10px;min-height:120px;border:1px solid rgba(0,0,0,0.2);overflow-y:auto;max-height:200px;width:100%;border-radius: 6px;">{{main ? main.diary_content: ''}}</div>  

        </el-form-item>
       
     
        <el-form-item label="日志图片">

          <div v-for="item in img_s" style="width:100px;height:150px;float:left;border:1px solid #fff;margin: 10px;">
          	<img :src="item" alt="" style="width:100%;height:100%;" />
          </div>
        </el-form-item>
        
         <el-form-item label="删除原因" >

         <div style="padding: 10px;min-height:120px;overflow-y:auto;max-height:200px;width:100%;border:1px solid rgba(0,0,0,0.2);border-radius: 6px;">{{main ? main.operate_desc: ''}}</div>  

        </el-form-item>
      </el-form>

      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
		<!--	处理-->
    </el-dialog>
          <el-dialog title="上下架" :visible.sync="dialogStatement" size="large">
      
      <el-form class="small-space" label-position="left" label-width="120px" style='width: 80%; margin-left:50px;'>
        <el-form-item label="下架原因">
        <el-input  type="textarea" v-model="temp.operate_desc" placeholder="请输入内容" class="filter-item" style="min-height:100px"></el-input>
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
    import { diaryList, detail, editor,changeShelfStatus} from 'api/diarylist';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { shelfStatus,shelfStatusList,shelfStatusFilter} from '@/filters';
		 import adminImages from 'components/Upload/adminImage';



    export default {
      name: 'table_demo',
      data() {
        return {
        	shelfStatusList,
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
//          mobile:null,
            current_page:1,
            page_size: 10,
            nick_name:'',
            sys_status:null,
          },
          temp: {
          },
           img_s:null,
           	
           
          main:{
          	
          },
         
   
          tableKey: 0
        }
      },
      components: {
       adminImages
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
         shelfStatusFilter
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
          
           diaryList(this.listQuery).then(res => {
            var d = res.data;
            if(d.data && d.data.pagination_d_t_o){
              this.list = d.data.pagination_d_t_o.datas;
              this.main = d.data.pagination_d_t_o.datas;
              this.total = d.data.pagination_d_t_o.total_count;
           console.log(this.list);
//            console.log(this.listQuery);
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        
        },
            changeShelfStatus(row){
          var status = row.sys_status == 0 ? 1 : 0, self = this;
          this.temp = {
          	operate_desc:'',
            id: row.id,
            sys_status:status
          }
          this.dialogStatement = true;
        },
         updateDeposit(){
          const self = this;
          changeShelfStatus(this.temp.id, this.temp.operate_desc,this.temp.sys_status).then(res => {
                  var d = res.data;
            Message({
              message: d.msg,
              type: 'success',
              duration: 3000
            })
            self.getList();
            this.dialogStatement = false;
          })
        },
				handleUpdate(row) {
								 const self = this;
					 self.dialogFormVisible = true;
		
					 var im = row.detail_pic;
					 var str = im;
					 var array = eval ("(" + str + ")");
					console.log(array);
					self.img_s=array;
//				    var imgUrls = JSON.parse(im);
//        self.img_s= imgUrls.map(item => {
//           return {url: item}
//         })
//         self.img_s=imgUrls.splice(0,im.length);
//         self.img_s = Object.assign({},self.img_s);
             
		
				
//				  console.log(self.img_s);
         this.main={
         		
         		operate_desc:row.operate_desc,
            id: row.id,
            sys_status:row.sys_status,
            diary_content:row.diary_content,
             operate_desc:row.operate_desc,
          detail_pic:im,
         }
 					
// 				console.log(this.main);
 						
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
div::-webkit-scrollbar {/*滚动条整体样式*/
            width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
            
        }
        div::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 12px;
            -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }
       div::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
            border-radius: 12px;
            background: rgba(0,0,0,0.1);
        }


   
</style>