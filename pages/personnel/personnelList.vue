<template>
	<view class="main">
		<scroll-view class="main_box" scroll-y="true">
			<view class="cu-list menu-avatar">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-title text-orange "></text> 人员列表
					</view>
				</view>
				
				<view class="cu-item" v-for="(item,index) in personnelList" :key="index" @tap="getDetail(item.id)">
					<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);">
					</view>
					<view class="content">
						<view class="text-grey">
							<view class="text-cut">{{item.personnelName}}</view>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{item.personnelPhone}}
							</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.createTime}}</view>
					</view>
				</view>
			</view> 
		</scroll-view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				personnelList:[]
			}
		},
		onLoad() {
			this.getPersonnelList()
		},
		methods: {
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			getPersonnelList(){
				const userInfo = uni.getStorageSync('userInfo');
				uni.request({
					url: '/api/personnel/getPersonnelList',
					method: 'POST',
					data: {
						userId:userInfo.userId,
						pageNo:1
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
			getDetail(id){
				uni.navigateTo({
					url: '../../pages/inspection/inspectionDetail?inspectionId='+id
				});
			}
			
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/index.css";
	.main_box{width:100vw;padding-bottom:120rpx;box-sizing: border-box;}
	.main_centent{width: 100%;height: 100vh;color: #fff;letter-spacing: 4rpx;display: flex;align-items: center;justify-content: center;}
	image{width:750rpx;height: 750rpx;}
	.scanImage{width: 22px;height: 22px;}
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26upx;
			color: #303133;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;
		image{
			width:100%;
			height: 100%; 
		}
		}
	.cu-list.menu-avatar>.cu-item .action {
		width: 76px;
	}
</style>