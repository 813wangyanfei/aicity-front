<template>
	<view class="server-place">
		<baidu-map 
		:center="center" 
		:zoom="zoom" @ready="handler" 
		style="height:100%" 
		:scroll-wheel-zoom="true">
		</baidu-map>
		
	</view>
</template>

<script>
	export default {
		props: {
			tipText: {
				type: String,
				default: '选择位置'
			},
			descText: {
				type: String,
				default: '使用当前定位或在地图上标记位置'
			},
		},
		data() {
			return {
				center: {
					lng: 116.404,
					lat: 39.915
				},
				zoom: 10,
				pointList:[]
			};
		},
		mounted() {
			/* this.getLocation()
			this.initMapH() */
		},
		onLoad() {
			//this.ontrueGetList();
			this.getPointList();
		},
		methods:{
			handler ({BMap, map}) {
				console.log("pointList:>>>"+this.pointList)
				if(this.pointList == undefined || this.pointList.length <= 0){
					console.log("pointList为空")
					this.getPointList();
					console.log("再次调用getPointList接口"+this.pointList)
				}
				
				console.log("<<<<<"+this.pointList)
				for (var p of this.pointList) {
				  var point = new BMap.Point(p.lng, p.lat);
				  var icon = new BMap.Icon("../../static/img/map/mark.png",new BMap.Size(32,32));
				  this.center.lng = p.lng;
				  this.center.lat = p.lat;
				  var marker = new BMap.Marker(point,{icon:icon}) // 创建标注
				  map.addOverlay(marker) // 将标注添加到地图中
				  var label = new BMap.Label(p.name, {offset: new BMap.Size(5, 35)});
				  label.setStyle({
					  padding: "2px",
					  fontSize: "12px",
					  height: "20px",
					  backgroundColor: "#fbffd7",
					  color: "#333333",
					  fontWeight: "bold",
					  fontFamily: "微软雅黑",
					  border: "1px solid #999999",
					  maxWidth: "none",
					  position: "relative",
				  });
				  marker.setLabel(label);
				  map.centerAndZoom(point, 10)
				  }
			  //var point = new BMap.Point(109.49926175379778, 36.60449676862417)
			  
			},
			
			getPointList (){
				
				const userInfo = uni.getStorageSync('userInfo');
				console.log("userInfo:"+userInfo);
				if (userInfo) {
					console.log("id:"+userInfo.userId)
					uni.request({
						url: '/api/getPersonGPSDataForH5',
						method: 'POST',
						data: {
							userId:userInfo.userId
						},
						header: {
							'Access-Control-Allow-Origin': '*', //跨域加上头
							'Content-Type': 'application/json'
						},
						success: res => {
							console.log(res.data)
							console.log(res.data.data)
							this.pointList = res.data.data;
							console.log("查询数据成功："+this.pointList)
						},
						fail: () => {},
						complete: () => {}
					});
				}else{
					uni.navigateTo({
						url: '../login/login'
					});
				}
			}
		}
	}
	
</script>

<style lang="scss">
	.main{background-image: linear-gradient(45deg, #0081ff, #1cbbb4);}
	// padding-bottom:120rpx;box-sizing: border-box;重要*************************保证页面底部内容不被隐藏也不会出现多余的滚动条
	.main_box{width:100vw;height: 100vh;padding-bottom:120rpx;box-sizing: border-box;}
	.main_centent{width: 100%;height: 100vh;color: #fff;letter-spacing: 4rpx;display: flex;align-items: center;justify-content: center;}
	image{width:750rpx;height: 750rpx;}
	.cu-btn{margin-left: 15rpx;}
	.server-place{
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 100%;
		background: #ffffff;
		.icon-img{
			width: 36px;
			height: 36px;
			display: block;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			margin-top: -70px;
		}
	}
</style>