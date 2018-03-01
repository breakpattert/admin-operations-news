<template>

    <div class="filter-container" style="margin-left:10px;margin-top:18px;">
      <el-date-picker
          class="filter-item"
          v-model="dateSelect"
          type="daterange"
          align="left"
          placeholder="选择日期范围"
          format="yyyy-MM-dd"
          @change="updateListQueryDate"
          :default-value="dateSelect"
          :editable="false"
          :clearable="false"
          >
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" >选择</el-button>
      <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>

    </div>
</template>

<script>
    import { bannerWishList} from 'api/statisticstable';
    import { Message } from 'element-ui';
    import { parseTime} from 'utils';
    import { completeDate} from 'utils';
    import { GetDateRegion } from 'utils';
    import { getYearAndMonth} from 'utils';
    import { datasplit} from 'utils';
    import { shelfStatus} from '@/filters';
    import Tinymce from 'components/Tinymce';
    import echarts from 'echarts'
    export default {
      name: 'table_demo',
      data() {
        return {
        	   chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                btn:null,
                listx:["存钱", "取钱", "留存款","存钱人数"],
//              listy:[10, 20, 36, 10, 10, 20],
       
        	 radio: '1',
          // 愿望类型
          dateSelect: [],
          btotal:null,
          listQuery: {
          },
          listbanner: {
          	begin_date:'2017-12-01 00:00:00',
	 		end_date:'2017-12-31 00:00:00',
	 		statistics_type:0,
          },
          listbannert:{
          	begin_date:'2017-12-01 00:00:00',
	 		end_date:'2017-12-31 00:00:00',
	 		statistics_type:1,
          	
          },
          listbanners:{
          	begin_date:'2017-12-01 00:00:00',
	 		end_date:'2017-12-31 00:00:00',
	 		statistics_type:2,
          	
          },
          listbannerf:{
          	begin_date:'2017-12-01 00:00:00',
	 		end_date:'2017-12-31 00:00:00',
	 		statistics_type:3,
          },
          temp: {
          },
          pullist:[],
     
          
          ypullist:[],
          tpullist:[],
          spullist:[],
          fpullist:[],
          checked: true,
//        再一次的弹窗

          dialogStatus: '',

          tableKey: 0,
        }
      },
      components: {
        Tinymce,
   
      },
      created() {
      	//获取当前时间
      var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
      var s_time = parseTime(lastWeek), e_time = parseTime(now);
      this.dateSelect = [s_time, e_time];
	  this.updateListQueryDate();
      this.bannerList();
      this.bannerone();
       this.bannertwo();
        this.bannertree();
      },
      filters: {
      	completeDate,
        parseTime,
        shelfStatus,
        GetDateRegion,
        getYearAndMonth,
        datasplit
      },
      methods: {
      updateListQueryDate(){
        var dateSelect = this.dateSelect;
          if(dateSelect.length == 2){
   		var m = new Date(parseTime(dateSelect[0]));
  
   		var s =  new Date(parseTime(dateSelect[1]));
		// console.log(completeDate(m,s,1));

 		if(completeDate(m,s,1)){
 	 		this.listbanner.begin_date = parseTime(dateSelect[0]);
            this.listbanner.end_date = parseTime(dateSelect[1]);
           	this.listbannert.begin_date = parseTime(dateSelect[0]);
            this.listbannert.end_date = parseTime(dateSelect[1]);
              	this.listbanners.begin_date = parseTime(dateSelect[0]);
            this.listbanners.end_date = parseTime(dateSelect[1]);
              	this.listbannerf.begin_date = parseTime(dateSelect[0]);
            this.listbannerf.end_date = parseTime(dateSelect[1]);
 		}else{
 			alert('只能选择查询一个月内的数据');
 			var now = Date.now(), lastWeek = now - 3600 * 1000 * 24 * 7;
      		var s_time = parseTime(lastWeek), e_time = parseTime(now);
      		this.dateSelect = [];
      		this.dateSelect = [s_time, e_time];
 				this.listbanner.begin_date = parseTime(dateSelect[0]);
            this.listbanner.end_date = parseTime(dateSelect[1]);
           	this.listbannert.begin_date = parseTime(dateSelect[0]);
            this.listbannert.end_date = parseTime(dateSelect[1]);
              	this.listbanners.begin_date = parseTime(dateSelect[0]);
            this.listbanners.end_date = parseTime(dateSelect[1]);
              	this.listbannerf.begin_date = parseTime(dateSelect[0]);
            this.listbannerf.end_date = parseTime(dateSelect[1]);
 		}
          }
        },
        bannerList(){
        	 const self = this;
        	
//      	 				var str = self.pullist;
        	bannerWishList(self.listbanner).then(res =>{
        		 self.pullist=[];
        		var d = res.data;
        		if(d.data && d.data.datas){
  			console.log(d.data);
  			
      			d.data.datas.forEach(function(item,index){
//    				console.log(item.statistics_date);
				self.pullist.push(datasplit(item.statistics_date));
				self.ypullist.push(item.amount_b_d);
				console.log(self.ypullist);
     			});
      				self.drawLineChart()

        		}
        	
        	})
        },
        bannerone(){
        	   const self = this;
//      	 				var str = self.pullist;
		
        	bannerWishList(self.listbannert).then(res =>{
        		self.pullist=[];
        		var o = res.data;
        		if(o.data && o.data.datas){
  			console.log(o.data);
  			
      			o.data.datas.forEach(function(item,index){
//    				console.log(item.statistics_date);
				self.pullist.push(datasplit(item.statistics_date));
				self.tpullist.push(item.amount_b_d);
				console.log(self.tpullist);
		
     			});
      				self.drawLineChart()

        		}
        	
        	})
        },
		 bannertwo(){
		 	const self = this;
		
//      	 				var str = self.pullist;
        	bannerWishList(self.listbanners).then(res =>{
        		self.pullist=[];
        		var t = res.data;
        		if(t.data && t.data.datas){
  			console.log(t.data);
      			t.data.datas.forEach(function(item,index){
//    				console.log(item.statistics_date);
				self.pullist.push(datasplit(item.statistics_date));
				self.spullist.push(item.amount_b_d);

				console.log(self.spullist);
		
     			});
      				self.drawLineChart()

        		}
        	
        	})
		 },
		  bannertree(){
		  	
		 	 const self = this;
		
//      	 				var str = self.pullist;
        	bannerWishList(self.listbannerf).then(res =>{
        		self.pullist=[];
        		var e = res.data;
        		if(e.data && e.data.datas){
  			console.log(e.data);
      			e.data.datas.forEach(function(item,index){
//    				console.log(item.statistics_date);
				self.pullist.push(datasplit(item.statistics_date));
			self.fpullist.push(item.amount_b_d);

				console.log(self.fpullist);	
			
     			});
      				self.drawLineChart()

        		}
        	
        	})
		 },
        drawLineChart() {
            	const self = this
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '默认显示存钱与存钱款',
                        textStyle:{
                        	
                        	fontSize:12
                        },
                        subtext:'当日时间没有默认为不显示',
                         subtextStyle:{
                        	fontSize:12
                        },
                       
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:self.listx
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
              	data:self.pullist,
//					data:[1,2,3,4,5],
                        axisLabel:{
                      	color:"#d62c52"
                        }
                    },
                    yAxis: {
                	  min:0,
//            		  max: 2000,
                      type: 'value',
                     
                    },
//                  dataZoom:[{
//                  	type:'slider',
//                  	start:0,
//                  	end:100
//                  }],
                    series: [
                        {
                            name: '存钱',
                            type: 'line',
                            stack: '总量',
               data: self.ypullist,
//					data:['200','300','500','600','1000']
                        },
                        {
                            name: '取钱',
                            type: 'line',
                            stack: '总量',
                            data: self.tpullist
                        },
                        {
                            name: '留存款',
                            type: 'line',
                            stack: '总量',
                            data:self.spullist
                        },
                        {
                            name: '存钱人数',
                            type: 'line',
                            stack: '总量',
                            data:self.fpullist
                        }
                    ]
                });
           },
          drawCharts() {
                this.drawLineChart();
            },
          handleFilter() {
       		this.pullist=[];
          	this.bannerList();
            this.bannerone();
       		this.bannertwo();
        	this.bannertree();
          	this.drawCharts();
          	console.log(2);
        },

        },
//      mounted: function () {
//          this.drawCharts()
//      },
//      updated: function () {
//          this.drawCharts()
//      }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/
	.filter-item{
		margin-left:20px;
	}
    .el-col {
        padding: 30px 20px;
    }
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
