<template>
	<view class="server-place">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">车辆</view>
				<input placeholder="请选择车辆" name="personnelName" v-model="vehicleNo" @tap="showModal" data-target="RadioModal"></input>
				<view class="title">日期</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
				<button class='cu-btn bg-green shadow' @click="getOneVehicleTrack">确定</button>
			</view>
		</form>
		
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in vehicleList" :key="index">
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
				center: {lng: 109.45744048529967, lat: 36.49771311230842},
				zoom: 6,
				pointList:[],
				pointTrackList:[],
				vehicleList: [
					{name:'豫A1234',id:'10'},
					{name:'豫A3232',id:'3'},
					{name:'豫B23232',id:'5'},
					],
				modalName: null,
				radio: '',
				itemName: '',
				date: '',
				vehicleNo: '',
				vehicleId:''
			};
		},
		mounted() {
		},
		onLoad(option) {
			if(option.vehicleId){
				this.vehicleId = option.vehicleId;
				this.vehicleNo = option.vehicleNo;
			}
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
			this.getVehicles();
		},
		methods:{
			async handler ({BMap, map}) {
				var icon_start = new BMap.Icon("../../h5/static/img/map/map_start.png",new BMap.Size(32,32));
				var icon_end = new BMap.Icon("../../h5/static/img/map/map_end.png",new BMap.Size(32,32));
				await this.getvehiclelTrack();
				if(this.pointList == undefined || this.pointList.length <= 0){
					uni.showToast({
						title:'未查询到轨迹！'
					})
				}else{
					//查询出来List循环创建坐标点并存入pointTrackList中
					for (var p of this.pointList) {
					  var point = new BMap.Point(p.longitude, p.latitude);
					  this.pointTrackList.push(point);
					}
					if(this.pointTrackList.length > 0){
						var markerStart = new BMap.Marker(this.pointTrackList[0],{icon:icon_start}) // 创建标注
						map.addOverlay(markerStart) // 添加开始坐标
						var markerEnd = new BMap.Marker(this.pointTrackList[this.pointTrackList.length-1],{icon:icon_end}) // 创建标注
						map.addOverlay(markerEnd) // 添加结束坐标
						var polyline =  new BMap.Polyline(this.pointTrackList, {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
						map.addOverlay(polyline);
					}
					var point1 = new BMap.Point(this.pointList[0].longitude, this.pointList[0].latitude);
					map.centerAndZoom(point1, 16)
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
				this.vehicleNo = this.vehicleList[e.detail.value].name;
				this.vehicleId = this.vehicleList[e.detail.value].id;
				console.log(this.vehicleNo)
				console.log(this.vehicleId)
				
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			async getvehiclelTrack(){
				var [error, res] = await uni.request({
					url: '/api/getVehicleTrackData',
					method: 'POST',
					data: {
						vehicleId:this.vehicleId,
						date:this.date
					},
					header: {
						'Access-Control-Allow-Origin': '*', //跨域加上头
						'Content-Type': 'application/json'
					},
					/* success: res => {
						console.log(res.data)
						this.pointList = res.data.data;
						
					},
					fail: () => {},
					complete: () => {} */
				});
				this.pointList = res.data.data;
				console.log(this.pointList)
			},
			getVehicles(){
				const userInfo = uni.getStorageSync('userInfo');
				uni.request({
					url: '/api/getAllVehicles',
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
						this.vehicleList = res.data.data;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getOneVehicleTrack(){
				uni.navigateTo({
					url: '../../pages/map/vehicleTrack?vehicleId='+this.vehicleId+"&vehicleNo="+this.vehicleNo
				});
			}
		}
	}
</script>

<style lang="scss">
	
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