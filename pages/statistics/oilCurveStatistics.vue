<template>
	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
					<view class="qiun-title-dot-light">基本折线图</view>
				</view>
				<view class="qiun-charts" >
					<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
				</view>
	</view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
		var _self;
		var canvaLineA=null;
		var Data={
			"LineA": {
			  "categories": ["2012", "2013", "2014", "2015", "2016", "2017"],
			  "series": [{
				"name": "成交量A",
				"data": [35, 8, 25, 37, 4, 20]
			  }, {
				"name": "成交量B",
				"data": [70, 40, 65, 100, 44, 68]
			  }, {
				"name": "成交量C",
				"data": [100, 80, 95, 150, 112, 132]
			  }]
			}
		}
		export default {
			data() {
				return {
					cWidth:'',
					cHeight:'',
					pixelRatio:1,
					serverData:''
				}
			},
			onLoad() {
				_self = this;
				this.cWidth=uni.upx2px(750);
				this.cHeight=uni.upx2px(500);
				this.getServerData();
			},
			methods: {
				getServerData(){
					/* uni.request({
						url: 'https://www.easy-mock.com/mock/5cc586b64fc5576cba3d647b/uni-wx-charts/chartsdata2',
						data:{
						},
						success: function(res) {
							console.log(res.data.data)
							//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
							_self.serverData=Data;
							let LineA={categories:[],series:[]};
							//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
							LineA.categories=res.data.data.LineA.categories;
							LineA.series=res.data.data.LineA.series;
							_self.showLineA("canvasLineA",LineA);
						},
						fail: () => {
							console.log("网络错误，小程序端请检查合法域名");
						},
					}); */
					_self.serverData=Data;
					let LineA={categories:[],series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories=Data.LineA.categories;
					LineA.series=Data.LineA.series;
					_self.showLineA("canvasLineA",LineA);
				},
				showLineA(canvasId,chartData){
					canvaLineA=new uCharts({
						$this:_self,
						canvasId: canvasId,
						type: 'line',
						fontSize:11,
						legend:{show:true},
						dataLabel:true,
						dataPointShape:true,
						background:'#FFFFFF',
						pixelRatio:_self.pixelRatio,
						categories: chartData.categories,
						series: chartData.series,
						animation: false,
						enableScroll: true,//开启图表拖拽功能
						xAxis: {
							disableGrid:false,
							type:'grid',
							gridType:'dash',
							itemCount:4,
							scrollShow:true,
							scrollAlign:'left',
							scrollBackgroundColor:'#F7F7FF',
							scrollColor:'#DEE7F7',
						},
						yAxis: {
							//disabled:true
							gridType:'dash',
							splitNumber:8,
							min:10,
							max:180,
							format:(val)=>{return val.toFixed(0)+'元'}
						},
						width: _self.cWidth*_self.pixelRatio,
						height: _self.cHeight*_self.pixelRatio,
						extra: {
							lineStyle: 'straight'
						},
					});
					
				},
				touchLineA(e){
					canvaLineA.scrollStart(e);
				},
				moveLineA(e) {
					canvaLineA.scroll(e);
				},
				touchEndLineA(e) {
					canvaLineA.scrollEnd(e);
					//下面是toolTip事件，如果滚动后不需要显示，可不填写
					canvaLineA.showToolTip(e, {
						format: function (item, category) {
							return category + ' ' + item.name + ':' + item.data 
						}
					});
				},
			}
		}
	
</script>

<style>
	page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
	.qiun-padding{padding:2%; width:96%;}
	.qiun-wrap{display:flex; flex-wrap:wrap;}
	.qiun-rows{display:flex; flex-direction:row !important;}
	.qiun-columns{display:flex; flex-direction:column !important;}
	.qiun-common-mt{margin-top:10upx;}
	.qiun-bg-white{background:#FFFFFF;}
	.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
	.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
	.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
	.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
</style>
