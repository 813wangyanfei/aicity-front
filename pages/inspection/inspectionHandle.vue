<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<!-- <input placeholder="请输入标题" v-model="title" name="title"></input> -->
				<view class="title">{{title}}</view>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">内容</view>
				<view class="title">{{content}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">位置</view>
				<view class="title">{{position}}</view>
				<!-- <input placeholder="请输入位置"  name="position" v-model="position"></input>
				<text class='cuIcon-locationfill text-orange' @tap="myclick"></text> -->
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">上报人员</view>
				<view class="title">{{reportingPersonnelName}}</view>
				<!-- <picker @change="bindPickerChanges" range-key="name" :data-index="22" :data-id="objectArray[index].id" :value="index" :range="objectArray">
					<view class="picker">
						{{reportIndex>-1?objectArray[index].name:'请选择上报人员'}}
					</view>
					<input type="text" :value="objectArray[index].id" hidden/>
				</picker> -->
			</view>
			<view class="cu-form-group">
				<view class="title">上报日期</view>
				<view class="title">{{reportingDate}}</view>
				<!-- <picker mode="date" :value="date" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker> -->
			</view>
			<view class="cu-form-group">
				<view class="title">上报时间</view>
				<view class="title">{{createTime}}</view>
				<!-- <picker mode="time" :value="time" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker> -->
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					上报图片
				</view>
				<view class="padding" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					<view class="cu-avatar radius margin-left" style="background-image:url(http://localhost:8888/profile/upload/2020/05/14/d52dfad23db7b672e8551db774e4b0e4.png);"></view>
				</view>
				
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">交办人员</view>
				<picker @change="bindPickerChanges" range-key="name" :data-index="22" :data-id="handlePersonnelList[index].id" :value="index" :range="handlePersonnelList">
					<view class="picker">
						<!-- {{index>-1?objectArray[index].name:'请选择上报人员'}} -->
						{{reportIndex>-1?handlePersonnelList[index].name:'请选择交办人员'}}
					</view>
					<input type="text" :value="handlePersonnelList[index].id" hidden/>
				</picker>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap="submit">交办</button>
			</view>
		</form>
	</view>
</template>

<script>
	/* import Attachment from '../../components/jin-attachment/jin-attachment.vue'; */
	export default {
		/* components: {Attachment}, */
		data() {
			return {
				title: '',
				content: '',
				position: '',
				reportIndex: -1,
				index: 0,
				reportingPersonnelName:'',
				reportingDate:'',
				reportingTime:'',
				createTime:'',
				handlePersonnelList: [{
						id: 11,
						name: '张三'
					},
					{
						id: 12,
						name: '李四'
					},
					{
						id: 13,
						name: '王五'
					},
					{
						id: 14,
						name: '赵六'
					}
				],
				handlePersonnelId:'',
				handlePersonnelName:'',
				imgUrl:'',
				imgList:[]
			};
		},
		onLoad(e) {
			uni.request({
				url: '/api/businessInspection/getInspectionDetail',
				method: 'POST',
				data: {
					inspectionId:e.inspectionId
				},
				success: res => {
					console.log(res)
					this.title = res.data.data.title;
					this.content = res.data.data.content;
					this.position = res.data.data.position;
					this.reportingPersonnelName = res.data.data.reportingPersonnelName;
					this.reportingDate = res.data.data.reportingDate;
					this.reportingTime = res.data.data.reportingTime;
					this.createTime = res.data.data.createTime;
					this.imgUrl = res.data.data.imgUrl;
					this.imgList = res.data.data.attachments;
				},
				fail: () => {},
				complete: () => {}
			});
			this.getPersonnels();
		},
		methods: {
            bindPickerChanges: function(e) {
                this.index = e.detail.value
            	this.reportIndex = 1
                console.log('可以传data-xx:xx',e.currentTarget.dataset.index,'\n默认传过来的是下标：',e.detail.value,'\n也可以传普通json传过来的id等：',e.currentTarget.dataset.id);
            	this.handlePersonnelId = this.handlePersonnelList[e.detail.value].id,
            	this.handlePersonnelName = this.handlePersonnelList[e.detail.value].name
            	console.log("reportingPersonnelId:"+this.handlePersonnelId)
            	console.log("reportingPersonnelName:"+this.handlePersonnelName)
            },
			getPersonnels(){
				const userInfo = uni.getStorageSync('userInfo');
				uni.request({
					url: '/api/getPersonnels',
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
						this.handlePersonnelList = res.data.data;
					},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	};
</script>

<style>
</style>
