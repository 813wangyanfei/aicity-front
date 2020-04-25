<template>
	<view class="server-place">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">车牌号</view>
				<input placeholder="输入姓名" name="input" v-model="plateNo"></input>
				<view class="title">日期</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
				<button class='cu-btn bg-green shadow' @click="getPersonnelTrack">确定</button>
			</view>
		</form>
		<map
			id='map'
			ref='map'
			v-bind:style="{height: mapH + 'px'}"
			style="width: 100%;" 
			:latitude="latitude" 
			:longitude="longitude"
			:controls='controls'
			:polyline='polyline' 
			:scale="scale">
		</map>
		
	</view>
</template>

<script>
	import uniRequest from 'uni-request';
	const app = getApp()
	var QQMapWX = require('../../components/mi-map/qqmap-wx-jssdk.min.js')
	var qqmapsdk = new QQMapWX({
	  key: 'LXCBZ-NNIKD-UZ64F-H6AFI-UNJLH-OCFGE'
	})
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
				date: '',
				plateNo: '',
				title: 'map',
				mapH: 0,             // 地图高度，可在initMapH()中设置高度
				longitude: 0,        // 初始经度
				latitude: 0,         // 初始纬度
				markers: [],
				scale:16,  //地图缩放程度
				polyline:[{//指定一系列坐标点，从数组第一项连线至最后一项
					points:[
						{latitude: 34.722464,longitude: 113.638352},
						{latitude: 34.722648,longitude: 113.637944},
						{latitude: 34.722500,longitude: 113.638240},
						{latitude: 34.722568,longitude: 113.637784},
						{latitude: 34.722852,longitude: 113.637464}
					],
					color:"#0000AA",//线的颜色
					width:3,//线的宽度
					dottedLine:true,//是否虚线
					arrowLine:true,	//带箭头的线 开发者工具暂不支持该属性
				}],
			};
		},
		mounted() {
			this.getLocation()
			this.initMapH()
		},
		onLoad() {
			var today = new Date();
			this.date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
			uni.setNavigationBarColor({
			    frontColor: '#000000',
			    backgroundColor: '#ffffff'
			})
			uni.setNavigationBarTitle({
			    title: '车辆轨迹'
			});
			//判断用户是否已经登录过
			var userInfo = uni.getStorageSync('userInfo');
			if(!userInfo){
				uni.navigateTo({
					url: '../../pages/login/login'
				});
			}
		},
		methods:{
			getPersonnelTrack(){
				uni.request({
					url: this.websiteUrl+'api/getVehicleTrackData',
					method: 'POST',
					data: {
						plateNo: this.plateNo,
						date:this.date
					},
					success: res => {
						this.polyline.points = res.data.data
					},
					fail: () => {},
					complete: () => {}
				});
				
			},
			lower(){
				uni.showToast({
					title:'scroll-view的加载更多'
				})
				console.log("分页数据可以放这里~~~~~~嘿嘿")
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			// 查询现在的位置
			getLocation() {
				let this_ = this
				uni.getLocation({
					// type: 'gcj02', // 返回国测局坐标
					geocode: true,
					success: function(res) {
						this_.initMap(res)
						console.log(res);
					},
					fail: function(e) {
						uni.showToast({
							icon: 'none',
							title: '获取地址失败, 请检查是否开启定位权限~~'
						})
					}
				})
			},
			
			// 初始化我的位置
			async initMap(res) {
				this.longitude = res.longitude;
				this.latitude = res.latitude;
				this.myAddress = await this.getAddressName(res);
				
				this.addressObj = Object.assign({}, this.addressObj,{
					longitude: res.longitude,
					latitude: res.latitude,
					address: this.myAddress
				})
				console.log("我的位置是：lat:"+this.latitude+"lon:"+this.lon)
			},
			
			// 地图选择位置后 查询地点名称
			async checkMap(res) {
				this.addressObj = Object.assign({}, this.addressObj,{
					longitude: res.longitude,
					latitude: res.latitude,
					address: await this.getAddressName(res)
				})
				console.log('当前位置:' + res.latitude + '|' + res.longitude);
			},
			
			// 监听地图位置变化
			/* mapChange(e) {
				let that = this
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					if (e.type == 'end') {
						that.mapCtx = uni.createMapContext('map', this)
						that.mapCtx.getCenterLocation({
							success: res => {
								this.checkMap(res)
							},
							fail: err => {
								console.log(err);
							}
						})
					}
				}, 200)
			}, */
			// 查询地图中心点的名称
			getAddressName(addressObj) {
				
				return new Promise((res) => {
					// #ifdef APP-PLUS
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: addressObj.latitude,
								longitude: addressObj.longitude
							},
							get_poi: 1,
							poi_options: "page_size=1;page_index=1",
							output: 'jsonp',
							success: (e) => {
								res(e.result.formatted_addresses.recommend);
							},
							fail: err => {
								res(err);
							}
						})
					// #endif
					
					// #ifndef APP-PLUS
						// ======================== jsonp跨域 ======================== 
						const KEY = 'LXCBZ-NNIKD-UZ64F-H6AFI-UNJLH-OCFGE'
						let locationObj = addressObj.latitude+','+addressObj.longitude
						let url = 'https://apis.map.qq.com/ws/geocoder/v1?coord_type=5&get_poi=1&output=jsonp&poi_options=page_size=1;page_index=1';
						this.$jsonp(url,{
						  key: KEY,
						  location: locationObj
						}).then(e => {
							res(e.result.formatted_addresses.recommend);
						})
						.catch(err => {
							res(err);
						})
					// #endif
					
					
				})
				
			},
			// 计算地图的高度
			initMapH() {
				// #ifdef APP-PLUS
					this.mapH = uni.getSystemInfoSync().windowHeight;
				// #endif
				// #ifndef APP-PLUS
					this.mapH = uni.getSystemInfoSync().windowHeight;
				// #endif
			},
			// 移动到我的位置
			toMyLocation() {
				this.getLocation()
			},
			// 提交
			/* submitAdress() {
				this.controls = []
				setTimeout(() => {
					this.$emit('updateAddress', this.addressObj)
				}, 100)
			} */
		},
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