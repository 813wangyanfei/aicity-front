<template>
	<view class="main">
		<view class="cu-bar bg-black search">
			<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg);"></view>
			<view class="content">
				智慧城市
			</view>
			<view class="action">
				<image class="scanImage" src="../../static/img/scan.png"></image>
			</view>
		</view>
		<!-- 检索搜索框 -->
		<!-- <view class="cu-bar search bg-black">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索图片、文章、视频" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round">搜索</button>
			</view>
		</view> -->
		<!--轮播图-->
		<swiper class="card-swiper square-dot" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
		 indicator-active-color="#0081ff">
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper-item">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</view>
			</swiper-item>
		</swiper>
		<!--九宫格功能区域-->
		<view class="cate-section">
			<view class="cate-item" @click="navTo('../../pages/personnel/personnelList')" >
				<image src="../../static/img/index/c3.png"></image>
				<text>人员</text>
			</view>
			<view class="cate-item">
				<image src="../../static/img/index/c4.png"></image>
				<text>车辆</text>
			</view>
			<view class="cate-item">
				<image src="../../static/img/index/c5.png"></image>
				<text>设施</text>
			</view>
			<view class="cate-item">
				<image src="../../static/img/index/c6.png"></image>
				<text>垃圾</text>
			</view>
			<view class="cate-item">
				<image src="../../static/img/index/c7.png"></image>
				<text>公厕</text>
			</view>
		</view>
		
		<!--广告-->
		<view class="ad-1">
			<image src="../../static/img/index/ad1.jpg" mode="scaleToFill"></image>
		</view>
		<!--业务巡查-->
		<scroll-view class="main_box" scroll-y="true">
			<view class="cu-list menu-avatar">
				<!-- <view class="cu-item" v-for="(item,index) in userList" :key="index" @tap="getDetail" :data-userid="item.userId">
					<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
					<view class="content">
						<view class="text-grey">凯尔</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。
							</view> </view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cu-tag round bg-grey sm">5</view>
					</view>
				</view> -->
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-title text-orange "></text> 业务巡查
					</view>
					<view class="action" @click="navTo('../../pages/inspection/inspection')" >
						巡查
					</view>
				</view>
				
				<view class="cu-item" v-for="(item,index) in inspectionList" :key="index" @tap="getDetail(item.id)">
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
				</view>-->
			</view> 
		</scroll-view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				cardCur: 0,
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
				}, {
					id: 2,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
				}, {
					id: 3,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
				}, {
					id: 4,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
				}, {
					id: 5,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
				}, {
					id: 6,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
				}],
				inspectionList:[]
			}
		},
		onLoad() {
			this.TowerSwiper('swiperList');
			// 初始化towerSwiper 传已有的数组名即可
		},
		methods: {
			ontrueGetList(){
				/* uni.showToast({
					title:'第1个页面'
				}) */
				uni.setNavigationBarTitle({
				    title: '首页'
				});
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: '#333333'
				})
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						console.log("获取本地storage成功.......")
						console.log(res);
				    },
					fail: function(){
						console.log("获取本地storage失败.......")
						uni.navigateTo({
							url: '../../pages/login/login'
						});
					}
				});
				this.getInspectionList();
				/* uni.request({
					url: 'http://localhost:8888/test/user/list',
					method: 'GET',
					success: res => {
						console.log(res.data.data)
						this.userList = res.data.data
					},
					fail: () => {},
					complete: () => {}
				}); */
				console.log("加载了第一个页面，可以把网络请求放这里")
			},
			lower(){
				uni.showToast({
					title:'scroll-view的加载更多'
				})
				console.log("分页数据可以放这里~~~~~~嘿嘿")
			},
			DotStyle(e) {
				this.dotStyle = e.detail.value
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// towerSwiper
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			Gridchange(e) {
				this.gridCol = e.detail.value
			},
			Gridswitch(e) {
				this.gridBorder = e.detail.value
			},
			navTo(url){
				uni.navigateTo({
					url:url
				})
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
	// padding-bottom:120rpx;box-sizing: border-box;重要*************************保证页面底部内容不被隐藏也不会出现多余的滚动条
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