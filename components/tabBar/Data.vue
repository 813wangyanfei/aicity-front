<template>
	<view class="main">
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 统计报表
			</view>
			<!-- <view class="action">
				<button class="cu-btn bg-green shadow" @tap="showModal" data-target="gridModal">设置</button>
			</view> -->
		</view>
		 <view class="cu-list grid" :class="['col-' + gridCol,gridCol,gridBorder?'':'border']">
		 	<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*4">
		 		<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]" @tap="getStatistics(item.url)">
		 		</view>
		 		<text>{{item.name}}</text>
		 	</view>
		 </view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				cuIconList: [{
					cuIcon: 'cardboardfill',
					color: 'red',
					badge: 120,
					name: '车辆Acc报表',
					url: '../../pages/statistics/personnelStatistics'
				}, {
					cuIcon: 'recordfill',
					color: 'orange',
					badge: 1,
					name: '车辆日报表'
				}, {
					cuIcon: 'picfill',
					color: 'yellow',
					badge: 0,
					name: '车辆月报表'
				}, {
					cuIcon: 'noticefill',
					color: 'olive',
					badge: 22,
					name: '油耗报表'
				}, {
					cuIcon: 'upstagefill',
					color: 'cyan',
					badge: 0,
					name: '机扫车报表'
				}, {
					cuIcon: 'clothesfill',
					color: 'blue',
					badge: 0,
					name: '车辆报警'
				}, {
					cuIcon: 'discoverfill',
					color: 'purple',
					badge: 0,
					name: '油耗曲线图'
				}, {
					cuIcon: 'questionfill',
					color: 'mauve',
					badge: 0,
					name: '人员考勤统计'
				}, {
					cuIcon: 'commandfill',
					color: 'purple',
					badge: 0,
					name: '人员考勤月统计'
				}, {
					cuIcon: 'brandfill',
					color: 'mauve',
					badge: 0,
					name: '人员报警统计'
				}],
				modalName: null,
				gridCol: 3,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null
			}
		},
		
		methods: {
			ontrueGetList(){
				uni.showToast({
					title:'第3个页面'
				});
				uni.setNavigationBarTitle({
				    title: '统计报表'
				});
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#ffffff'
				})
				console.log("加载了第三个页面，可以把网络请求放这里")
			},
			lower(){
				uni.showToast({
					title:'scroll-view的加载更多'
				})
				console.log("分页数据可以放这里~~~~~~嘿嘿")
			},
			getStatistics(url){
				console.log(url)
				uni.navigateTo({
					url: url
				});
		}
		}
	}
</script>

<style lang="scss">
	.main{background-image: linear-gradient(45deg, #f43f3b, #ec008c);}
	// padding-bottom:120rpx;box-sizing: border-box;重要*************************保证页面底部内容不被隐藏也不会出现多余的滚动条
	.main_box{width:100vw;height: 100vh;padding-bottom:120rpx;box-sizing: border-box;}
	.main_centent{width: 100%;height: 100vh;color: #fff;letter-spacing: 4rpx;display: flex;align-items: center;justify-content: center;}
	image{width:750rpx;height: 750rpx;}
</style>
