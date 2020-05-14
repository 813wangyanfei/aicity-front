<template>
	<view class="main">
		 <scroll-view class="main_box" scroll-y="true">
		 	<view class="cu-list menu-avatar">
		 		<view class="cu-bar bg-white solid-bottom">
		 			<view class="action">
		 				<text class="cuIcon-title text-orange "></text> 待审核列表
		 			</view>
					<view @tap="businessHandle">查看详情</view>
		 		</view>
		 		<view class="cu-item" v-for="(item,index) in inspectionList" :key="index" @tap="businessHandle(item.id)">
		 			<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);">
		 			</view>
		 			<view class="content">
		 				<view class="text-grey">
		 					<view class="text-cut">{{item.title}}</view>
		 				</view>
		 				<view class="text-gray text-sm flex">
		 					<view class="text-cut">
		 						{{item.content}}
		 					</view>
		 				</view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">{{item.createTime}}</view>
		 				<!-- <view class="cuIcon-notice_forbid_fill text-gray"></view> -->
		 			</view>
		 		</view>
		 		<!-- <view class="cu-item" v-for="(item,index) in inspectionList" :key="index" @tap="getDetail" :data-inspectionId="item.id">
		 			<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);">
		 			</view>
		 			<view class="content">
		 				<view class="text-grey">
		 					<view class="text-cut">{{item.title}}</view>
		 				</view>
		 				<view class="text-gray text-sm flex">
		 					<view class="text-cut">
		 						{{item.content}}
		 					</view>
		 				</view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">{{item.createTime}}</view>
		 			</view>
		 		</view> -->
		 		
		 		<!-- <view class="cu-item">
		 			<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);">
		 			</view>
		 			<view class="content">
		 				<view class="text-grey">
		 					<view class="text-cut">中原区大学路发现垃圾</view>
		 				</view>
		 				<view class="text-gray text-sm flex">
		 					<view class="text-cut">
		 						中原区大学路发现垃圾，测试巡查内容，测试巡查内容，测试巡查内容，测试巡查内容，测试巡查内容，测试巡查内容。
		 					</view>
		 				</view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">03-28 10:20</view>
		 			</view>
		 		</view>
		 		<view class="cu-item ">
		 			<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
		 			<view class="content">
		 				<view class="text-pink"><view class="text-cut">金水区三全路发现垃圾桶破损</view></view>
		 				<view class="text-gray text-sm flex"> <view class="text-cut">金水区三全路发现垃圾桶破损！金水区三全路发现垃圾桶破损！金水区三全路发现垃圾桶破损！金水区三全路发现垃圾桶破损！</view></view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">03-29 22:20</view>
		 			</view>
		 		</view>
		 		<view class="cu-item grayscale">
		 			<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81007.jpg);"></view>
		 			<view class="content">
		 				<view><view class="text-cut">高新区科学大道发现垃圾桶破损</view>
		 				</view>
		 				<view class="text-gray text-sm flex"> <view class="text-cut"> 高新区科学大道发现垃圾桶破损！高新区科学大道发现垃圾桶破损高新区科学大道发现垃圾桶破损高新区科学大道发现垃圾桶破损</view></view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">03-29 22:20</view>
		 			</view>
		 		</view>
		 		<view class="cu-item cur">
		 			<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg);">
		 				<view class="cu-tag badge"></view>
		 			</view>
		 			<view class="content">
		 				<view>
		 					<view class="text-cut">高新区科学大道发现垃圾桶破损</view>
		 				</view>
		 				<view class="text-gray text-sm flex">
		 					<view class="text-cut"> 高新区科学大道发现垃圾桶破损！高新区科学大道发现垃圾桶破损高新区科学大道发现垃圾桶破损高新区科学大道发现垃圾桶破损</view></view>
		 			</view>
		 			<view class="action">
		 				<view class="text-grey text-xs">04-01 22:20</view>
		 			</view>
		 		</view> -->
		 	</view> 
		 </scroll-view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				inspectionList:[]
			}
		},
		methods: {
			ontrueGetList(){
				uni.setNavigationBarTitle({
				    title: '管理'
				});
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#ffffff'
				})
				this.getInspectionList();
			},
			lower(){
				uni.showToast({
					title:'scroll-view的加载更多'
				})
				console.log("分页数据可以放这里~~~~~~嘿嘿")
			},
			getInspectionList(){
				const userInfo = uni.getStorageSync('userInfo');
				uni.request({
					url: '/api/businessInspection/getInspectionList',
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
						this.inspectionList = res.data.data;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			businessHandle(id){
				uni.navigateTo({
					url: '../../pages/inspection/inspectionHandle?inspectionId='+id
				});
			}
		}
	}
</script>

<style lang="scss">
	.cu-list.menu-avatar>.cu-item .action {
		width: 76px;
	}
</style>