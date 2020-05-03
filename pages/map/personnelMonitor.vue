<template>
	<view class="server-place">
	<form>
		<view class="cu-form-group margin-top">
			<view class="title">人员</view>
			<input placeholder="请选择人员" name="personnelName" v-model="personnelName" @tap="showModal" data-target="RadioModal"></input>
			<button class='cu-btn bg-green shadow' @click="getPersonnelMonitor">确定</button>
		</view>
	</form>
	
	<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
		<view class="cu-dialog" @tap.stop="">
			<radio-group class="block" @change="RadioChange">
				<view class="cu-list menu text-left">
					<view class="cu-item" v-for="(item,index) in personnelList" :key="index">
						<label class="flex justify-between align-center flex-sub">
							<view class="flex-sub">{{item.name}}</view>
							<radio class="round" :class="radio==index?'checked':''" :checked="radio==index?true:false"
							 :value="index"></radio>
						</label>
					</view>
				</view>
			</radio-group>
		</view>
	</view>
	<view class="server-place">
		<baidu-map 
		:center="center" 
		:zoom="zoom" @ready="handler" 
		style="height:100%" 
		:scroll-wheel-zoom="true">
		</baidu-map>
		
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				center: {
					lng: 116.404,
					lat: 39.915
				},
				zoom: 10,
				pointList:[],
				personnelList: [
					{name:'张三',id:'1'},
					{name:'李四',id:'3'},
					{name:'王五',id:'5'},
					],
				modalName: null,
				radio: '',
				itemName: '',
				personnelName: '',
				personnelId:''
			};
		},
		mounted() {
		},
		onLoad(option) {
			console.log(option.personnelId);
			this.getPersonnels();
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
				var icon = new BMap.Icon("../../h5/static/img/map/mark.png",new BMap.Size(32,32));
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
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			RadioChange(e) {
				this.radio = e.detail.value
				//this.name = e.detail
				//this.personnelName = e.detail.value;
				this.personnelName = this.personnelList[e.detail.value].name;
				this.personnelId = this.personnelList[e.detail.value].id;
				console.log(this.personnelName)
				console.log(this.personnelId)
				
			},
			getPersonnels(){
				const userInfo = uni.getStorageSync('userInfo');
				uni.request({
					url: '/api/getAllPersonnels',
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
						this.personnelList = res.data.data;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getPersonnelMonitor(){
				console.log("personnelId:"+this.personnelId);
				uni.navigateTo({
					url: '../../pages/map/personnelMonitor?personnelId='+this.personnelId
				});
			}
		}
	}
	
</script>

<style lang="scss">
	/* .main{background-image: linear-gradient(45deg, #0081ff, #1cbbb4);}
	// padding-bottom:120rpx;box-sizing: border-box;重要*************************保证页面底部内容不被隐藏也不会出现多余的滚动条
	.main_box{width:100vw;height: 100vh;padding-bottom:120rpx;box-sizing: border-box;}
	.main_centent{width: 100%;height: 100vh;color: #fff;letter-spacing: 4rpx;display: flex;align-items: center;justify-content: center;}
	image{width:750rpx;height: 750rpx;}
	.cu-btn{margin-left: 15rpx;} */
	.server-place{
		position: fixed;
		left: 0;
		top: 5;
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