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
		},
		onLoad() {
			this.getPointList();
		},
		methods:{
			async handler ({BMap, map}) {
				if(this.pointList == undefined || this.pointList.length <= 0){
					await this.getPointList();
				}
				
				for (var p of this.pointList) {
				  var point = new BMap.Point(p.lng, p.lat);
				  /* var icon = new BMap.Icon("../../static/img/map/mark.png",new BMap.Size(32,32));
				  this.center.lng = p.lng;
				  this.center.lat = p.lat;
				  var marker = new BMap.Marker(point,{icon:icon}) // 创建标注
				  map.addOverlay(marker) // 将标注添加到地图中 */
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
				  //marker.setLabel(label);
				  
				  let content = "<span style='font-weight:bold;'>设备号：</span>"+p. deviceId+"<br>"+
				                "<span style='font-weight:bold;'>simNo：</span>"+p.SimNo+"<br><span style='font-weight:bold;'>速度：</span>"+p.velocity+"<br>"+
								"<span style='font-weight:bold;'>服务器时间：</span>"+p.serverTime+"<br><span style='font-weight:bold;'>GPS时间：</span>"+p.gpsTime+"<br>"+
								"<span style='font-weight:bold;'>位置：</span>"+p.location;
				  
				  let infoWindow = new BMap.InfoWindow(content, {
					width: 155,     // 信息窗口宽度    
					height: 180,     // 信息窗口高度    
					title: "<span style='font-weight:bold;'>姓名：</span>"+p.name  // 信息窗口标题   
				  });
				  /* marker.addEventListener("click", function (event) {
					map.openInfoWindow(infoWindow, point);//参数：窗口、点  根据点击的点出现对应的窗口
				  }); */
				  //map.openInfoWindow(infoWindow, point);//参数：窗口、点  根据点击的点出现对应的窗口
				  
				  map.centerAndZoom(point, 16)
				  this.markerFun(p,point,infoWindow,label,map);
				  }
			  //var point = new BMap.Point(109.49926175379778, 36.60449676862417)
			  
			},
			markerFun(p,points, infoWindows, label,map) {
				var icon = new BMap.Icon("../../static/img/map/mark.png",new BMap.Size(32,32));
				let markers = new BMap.Marker(points,{icon:icon});
				markers.setRotation(p.direction);
				map.addOverlay(markers);  // 将标注添加到地图中
				markers.setLabel(label);  // 将data中的name添加到地图中
				// 标注的点击事件
				markers.addEventListener("click", function (event) {
				  map.openInfoWindow(infoWindows, points);//参数：窗口、点  根据点击的点出现对应的窗口
				});
			  },
			async getPointList (){
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					var [error, res] = await uni.request({
						url: '/api/getPersonGPSDataForH5',
						method: 'POST',
						data: {
							userId:userInfo.userId
						},
						header: {
							'Access-Control-Allow-Origin': '*', //跨域加上头
							'Content-Type': 'application/json'
						},
						/* success: res => {
							console.log(res.data.data)
							this.pointList = res.data.data;
							console.log("查询数据成功："+this.pointList)
						},
						fail: () => {},
						complete: () => {} */
					});
					this.pointList = res.data.data;
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