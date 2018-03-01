<template>
  <div class="app-container">
    <div class="filter-container">


      <el-select clearable class="filter-item" style="width: 130px" v-model="listbanner.status" placeholder="启用状态">
        <el-option v-for="item in  shelfStatusList" :key="item.status" :label="item.name" :value="item.status">
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
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
    </div>

    <el-table  :key='tableKey' index="index" :data="pullist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
	<!--	在此处加一个愿望的封面图-->
			 <el-table-column width="180px" align="center" label="精品愿望图">
        <template scope="scope">
          <img :src="scope.row.cover_url" width="100%">
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="愿望id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="80px" label="愿望名称">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.wish_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>


      <el-table-column  label="创建时间">
        <template scope="scope">
          <span>{{scope.row.gmt_created | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="95">
        <template scope="scope">
          <span>{{ scope.row.status | shelfStatusFilter('name')}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.gmt_modified | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template scope="scope">
          <el-button size="small" @click="changeShelfStatus(scope.row)" type="primary">{{scope.row.status | shelfStatusFilter('operationName')}}</el-button>
          <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listbanner.page"  :page-size="listbanner.limit" layout="total, sizes, prev, pager, next, jumper" :total="btotal">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="large">
    <!-- <el-dialog :title="textMap[dialogStatus]" v-if="dialogFormVisible" size="large"> -->
    <el-form class="small-space" :model="temp" label-position="left" label-width="130px" style='width: 80%; margin-left:50px;'>

        		<el-form-item label="精品愿望封面图">
          		<adminImage v-model="temp.cover_url"></adminImage>
        		</el-form-item>

        	<el-form-item label="愿望id">
        				<el-button class="filter-item" style="margin-left: 10px;" v-on:click="toggle" type="primary" icon="edit">选择</el-button>
        				<el-button class="filter-item" style="display: inline;">{{wishbanner_id}}</el-button>
        				<div class="text item" style="width: 800px;height: 600px; border: 1px solid rgba(41, 52, 68, 0.37);margin: 32px; position: relative;" v-show="isshow">

  								<el-table  :key='tableKey' index="index" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      								<el-table-column align="center" label="序号" width="65" type="index">
      								</el-table-column>

      								<el-table-column width="80px" align="center" label="愿望id">
        								<template scope="scope">
         								 <span>{{scope.row.id}}</span>
        								</template>
      								</el-table-column>

      								<el-table-column min-width="100px" label="愿望名称">
        								<template scope="scope">
          								<span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.wish_name}}</span>
        								</template>
      								</el-table-column>
      								<el-table-column  align="center" label="操作">
        								<template scope="scope">

          						    <div style="">
  													 <el-tooltip class="item" effect="dark" content="选中愿望  ID" placement="left-start">
    													<el-button size="small" type="primary" plain label="选择" border-size="medium" @click="changesbanner(scope.row)">选择</el-button >
    												</el-tooltip>
  												</div>
        								</template>
      								</el-table-column>
    							</el-table>

    							<div v-show="!listLoading" class="pagination-container" style="position:absolute; bottom:10px;left: 10px;">
      								<el-pagination @size-change="wishhandleSizeChange" @current-change="wishhandleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="listQuery.limit"
        								:page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      								</el-pagination>
    							</div>

    					  	<div slot="footer" class="dialog-footer" style=" position:absolute;bottom:10px;right:12px;">

        						<el-button type="primary" @click="show">取 消</el-button>
        						<el-button type="primary" @click="toggle">确 定</el-button>

      						</div>
    						</div>

        		</el-form-item>

        		<el-form-item label="banner顺序">
          		<el-input-number v-model="temp.sort" :min="0"></el-input-number>
        		</el-form-item>
      </el-form>
      	<div slot="footer" class="dialog-footer">
        	<el-button @click="dialogFormVisible = false">取 消</el-button>
        	<el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        	<el-button v-else type="primary" @click="update">确 定</el-button>
      	</div>
      <!--里面的一层弹窗-->
      <!--<el-card class="box-card">
  			<div slot="header" class="clearfix">
    			<span>卡片名称</span>
    			<el-button style="float:left; padding: 3px 0" type="text" v-on:click="toggle">操作按钮</el-button>
  		</div>
  		<div v-for="o in 4" :key="o" class="text item"  v-show="isshow">
    			{{'列表内容 ' + o }}
  		</div>
			</el-card>-->


    </el-dialog>
  </div>
</template>

<script>
    import { bannerWishList,fetchWishList, createWish,createbannerWish, changeShelfStatus, fetchWishById, updateWish, remove } from 'api/qualitybanner';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { shelfStatus, wishList, shelfStatusList, wishListFilter, checkWithdrawFilter } from '@/filters';
    import Tinymce from 'components/Tinymce';
    import adminImage from 'components/Upload/adminSingleImage';


    export default {
      name: 'table_demo',
      data() {
        return {
        	wishbanner_id:0,
        	 radio: '1',
        	isshow:false,
          content: '',
          // 愿望类型
          wishList,
          shelfStatusList,
          content: '',

          dateSelect: [],
          list: null,
          pullist:null,
          total: null,
          btotal:null,
          listLoading: true,
          listQuery: {
          category: null,
            current_page: 1,
            page_size: 10,
            status: null,
            begin_date: '0000-00-00 00:00:00',
            end_date: '9999-00-00 00:00:00'
          },
          listbanner: {
//        	status:null,
            current_page: 1,
            page_size: 10,

            begin_date: '0000-00-00 00:00:00',
            end_date: '9999-00-00 00:00:00',
          },
          temp: {
       		  id: undefined,
            category: 0,
            wish_name: '',
            wish_content: '',
            wish_sort: '',
            amount: 0,
            sort: 1,
            img_url: [],
           	cover_url:''
          },
          dialogFormVisible: false,
          checked: true,
//        再一次的弹窗

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
        this.bannerList();
      },
      filters: {
        parseTime,
        shelfStatus,
        wishListFilter,
        checkWithdrawFilter
      },
      methods: {
        updateListQueryDate(){
          var dateSelect = this.dateSelect;
          if(dateSelect.length == 2){
            this.listbanner.begin_date = parseTime(dateSelect[0]);
            this.listbanner.end_date = parseTime(dateSelect[1]);
          }
        },
        getList() {
          this.listLoading = true;
          fetchWishList(this.listQuery).then(res => {
            var d = res.data;
           if(d.data && d.data.page_wish_market_d_t_o){
              this.list = d.data.page_wish_market_d_t_o.market_d_t_o_s;

              this.total = d.data.page_wish_market_d_t_o.count;
            }else{
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
        },
         bannerList() {
          this.listLoading = true;
          bannerWishList(this.listbanner).then(res => {

            var d = res.data;

           if(d.data && d.data.pagination_d_t_o){
              this.pullist = d.data.pagination_d_t_o.datas;

              this.btotal = d.data.pagination_d_t_o.total_count;
            }else{
              this.pullist = [];
              this.btotal = 0;
            }
            this.listLoading = false;
          })
        },
        changeShelfStatus(row){
          var status = row.status == 0 ? 1 : 0, self = this;
          var params = {
            id: row.id,
            status:status
          }
          changeShelfStatus(params).then(res => {
            var d = res.data;
            Message({
              message: d.msg,
              type: 'success',
              duration: 3000
            })
            self.bannerList();
          })
        },
        changesbanner(row){
        	var  row_id = row.id
        	if(this.checked==true){
        		this.wishbanner_id=row_id;
        	}
        },
        handleFilter() {
          this.bannerList();
        },
        handleSizeChange(val) {
          this.listbanner.limit = val;
          this.bannerList();
        },
        handleCurrentChange(val) {
          this.listbanner.current_page = val;
          this.bannerList();
        },
         wishhandleSizeChange(val) {
          this.listQuery.limit = val;
           this.getList();
        },
        wishhandleCurrentChange(val) {
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
   				this.wishbanner_id=0;
          this.dialogStatus = 'create';
          this.$nextTick(() => {
            this.dialogFormVisible = true;
          })
        },
//    愿望选择id再弹出
    	toggle(){
			//实现业务则只需要将isshow的值每次都取反即可
			this.isshow =!this.isshow;
		},
			show(){
				this.isshow=false;
				this.wishbanner_id=0;
			},
      handleUpdate(row) {
          const self = this;
//        通过api里面的fetchWishById
          fetchWishById({id: row.id}).then(res => {
          	this.wishbanner_id=row.id;
            var wish = res.data.data.boutique_wish_d_t_o;
//          try{
//            var imgUrls = JSON.parse(wish.cover_url);
//
//            wish.cover_url = imgUrls.map(item => {
//              return {url: item}
//            })
//          }catch(e){
//            wish.cover_url = [];
//          }
            // console.log('wish.img_url', wish.img_url);

            self.temp = Object.assign({}, wish)

            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          })
        },
        checkTemp(){
          var temp = this.temp;
          if(!temp.name || temp.name == ""){
            Message({message: "请输入愿望名称", type: 'error', duration: 3 * 1000})
          }

        },
        create() {
//      	sort wish_id cover_url
          var self = this, temp = this.temp;
//        var imgs = JSON.stringify(temp.cover_url.map(item => item.url));
          var params = {
//             wish_name: temp.wish_name,
//          category: temp.category,
            cover_url: temp.cover_url,
//          amount: temp.amount,
						wish_id:self.wishbanner_id,
            sort: temp.sort,
//          wish_content: temp.wish_content,
//          cover_url:imgs

          }
          createbannerWish(params).then(res => {
            self.dialogFormVisible = false;
            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
           self.bannerList();
          })

        },
        update() {
          var temp = this.temp, self = this;
//        var imgs = JSON.stringify(temp.cover_url.map(item => item.url));
          var params = {
              id: temp.id,
//          wish_name: temp.wish_name,
//						 category: temp.category,
            cover_url: temp.cover_url,
//          amount: temp.amount,
            sort: temp.sort,
            wish_id:self.wishbanner_id,
//          wish_content: temp.wish_content
          }
//        updateWish是是请求数据的api
          updateWish(params).then(res => {
            self.dialogFormVisible = false;

            self.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });

             self.bannerList();
          })
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
            self.bannerList();
          })
        },
        select(){
        	  var self = this, temp = this.temp;
//        var data =  parseTime(this.data);
          var params = {
             cover_url: temp.cover_url,
            sort: temp.sort,
            content_url: temp.content_url
          }
            create(params).then(res => {
//          	 console.log(res.data.homepage_banner_d_t_o);
              self.selectVisible = false;
              self.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });

              self.bannerList();
            })

        },
        resetTemp() {
          this.temp = {
            wish_id:this.wishbanner_id,
            sort: 1,
            cover_url: []
          };
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

	.el-form-item__content {
  	margin-left:120px!important;

}
.el-dialog{
	background:#F9FAFA!important;
}

/*.upload-container .image-uploader[data-v-c165036a] {
    width:60%!important;

}
.upload-container .image-preview[data-v-c165036a] {
    width:60%!important;
    margin-left: 0!important;


}*/


</style>
