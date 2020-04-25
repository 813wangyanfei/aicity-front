<template>
	<view class="server-place">
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">姓名</view>
				<input placeholder="输入姓名" name="personnelName" v-model="personnelName" @click="showModal" data-target="RadioModal"></input>
				<view class="title">日期</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
				<button class='cu-btn bg-green shadow' @click="getPersonnelTrack">确定</button>
			</view>
		</form>
		
		<!-- <view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
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
		</view> -->
		
		<view class="server-place">
			<baidu-map 
			:center="center" 
			:zoom="zoom" @ready="handler" 
			style="height:100%" 
			:scroll-wheel-zoom="true">
			</baidu-map>
			<!-- <map
				id='map'
				ref='map'
				v-bind:style="{height: mapH + 'px'}"
				style="width: 100%;" 
				:latitude="latitude" 
				:longitude="longitude"
				:scale="scale"
				:markers="markers">
			</map> -->
			
		</view>
		
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
				center: {lng: 109.45744048529967, lat: 36.49771311230842},
				zoom: 6,
				pointList:[
					{lng:'108.49926175379778',
					 lat:'36.60449676862417',
					 name:'张三',
					 uid:'1'
					},
					{lng:'107.59926175379778',
					 lat:'36.40449676862417',
					 name:'李四',
					 uid:'2'
					},
					{lng:'109.79926175379778',
					 lat:'36.50449676862417',
					 name:'王五',
					 uid:'3'
					},
					{lng:'109.63926175379778',
					 lat:'36.52449676862417',
					 name:'王五',
					 uid:'3'
					},
					{lng:'109.55926175379778',
					 lat:'36.53449676862417',
					 name:'王五',
					 uid:'3'
					},
					{lng:'109.74926175379778',
					 lat:'36.65449676862417',
					 name:'王五',
					 uid:'3'
					}
				],
				pointTrackList:[],
				personnelList: [
					{name:'张三',id:'1'},
					{name:'李四',id:'3'},
					{name:'王五',id:'5'},
					],
				modalName: null,
				radio: '',
				itemName: '',
				date: '',
				personnelName: '',
				personnelId:''
			};
		},
		mounted() {
		},
		onLoad() {
			var today = new Date();
			this.date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
			uni.setNavigationBarColor({
			    frontColor: '#000000',
			    backgroundColor: '#ffffff'
			})
			uni.setNavigationBarTitle({
			    title: '人员轨迹'
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
			handler ({BMap, map}) {
				
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
				
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			getPersonnelTrack(){
				uni.request({
					url: this.websiteUrl+'api/getPersonnelTrackData',
					method: 'POST',
					data: {
						personnelId:this.personnelId,
						date:this.date
					},
					header: {
						'Access-Control-Allow-Origin': '*',
					    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild', //自定义请求头信息
					},
					success: res => {
						console.log(res.data)
						this.pointList = res.data.data;
						var icon = new BMap.Icon("../../static/img/map/mark.png",new BMap.Size(32,32));
						//查询出来List循环创建坐标点并存入pointTrackList中
						for (var p of this.pointList) {
						  var point = new BMap.Point(p.lng, p.lat);
						  this.pointTrackList.push(point);
						}
						var markerStart = new BMap.Marker(this.pointTrackList[0],{icon:icon}) // 创建标注
						map.addOverlay(markerStart) // 添加开始坐标
						var markerEnd = new BMap.Marker(this.pointTrackList[this.pointTrackList.length-1],{icon:icon}) // 创建标注
						map.addOverlay(markerEnd) // 添加结束坐标
						var polyline =  new BMap.Polyline(this.pointTrackList, {strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5});
						map.addOverlay(polyline);
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="scss">
	
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