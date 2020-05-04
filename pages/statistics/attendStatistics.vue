<template>
	<view class="qiun-columns">
	        <view class="qiun-title-bar" style="">
	            <view class="qiun-title-dot-light">考勤统计</view>
	        </view>
	        <view class="qiun-charts" style="">
	            <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
	        </view>
	    </view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
		let _self;
		let canvaColumn = null;
		let data = {
		    "Column": {
		        "categories": ["2019/12/12", "2019/12/13", "2019/12/14","2019/12/15"],
		        "series": [{
		            "name": "正常",
		            "data": [15, 22, 37,12]
		        }, {
		            "name": "迟到",
		            "data": [0, 25, 14,1]
		        }, {
		            "name": "缺勤",
		            "data": [0, 20, 14,14]
		        } , {
		            "name": "早退",
		            "data": [1, 2, 1,6]
		        },{
		            "name": "补卡",
		            "data": [3, 5, 4,9]
		        }]
		    }
		};
		export default {
			data() {
				return {
					cWidth: '',
					cHeight: '',
					pixelRatio: 1,
					serverData: '',
				}
			},
			onLoad() {
				_self = this;
				uni.getSystemInfo({
					success: function(res) {}
				});
				
				this.cWidth = uni.upx2px(750);
				this.cHeight = uni.upx2px(500);
				//this.fillData(Data);
			},
			onReady() {
				this.getServerData();
			},
			methods: {
				getServerData() {
					uni.showLoading({
						title: "正在加载数据..."
					})
					/* uni.request({
						url: 'http://localhost:3000/data3',
						data: {},
						success: function(res) {
							_self.fillData(res.data);
						},
						fail: () => {},
						complete() {
							uni.hideLoading();
						}
					}); */
					_self.fillData(data);
					uni.hideLoading();
				},
				fillData(data) {
					this.serverData = data;
					let Column = {
						categories: [],
						series: []
					};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					Column.categories = data.Column.categories;
					//这里的series数据是后台做好的，如果您的数据没有和前面我注释掉的格式一样，请自行拼接数据
					Column.series = data.Column.series;
					this.showColumn("canvasColumn", Column);
				},
				showColumn(canvasId, chartData) {
					canvaColumn = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'column',
						legend: true,
						fontSize: 11,
						//  background: '#E5FDC3',
						pixelRatio: _self.pixelRatio,
						animation: true,
						categories: chartData.categories,
						series: chartData.series,
						xAxis: {
							disableGrid: true,
						},
						yAxis: {
							//disabled:true
						},
						dataLabel: true,
						width: _self.cWidth * _self.pixelRatio,
						height: _self.cHeight * _self.pixelRatio,
						extra: {
							column: {
								width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
							}
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
