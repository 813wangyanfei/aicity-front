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
				<view class="action">
					{{imgList.length}}/4
				</view>
				<!-- <view class="padding" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					<view class="cu-avatar radius margin-left" style="background-image:url(http://localhost:8888/profile/upload/2020/05/14/d52dfad23db7b672e8551db774e4b0e4.png);"></view>
				</view> -->
				
			</view>
			
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view> -->
					</view>
					<!-- <view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view> -->
				</view>
			</view>
			
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange"></text> 处理流程
				</view>
			</view>
			<view class="bg-white padding">
				<view class="cu-steps">
					<view class="cu-item text-blue" v-for="(item,index) in numList" :key="index">
						<text class="num" :class="index==2?'err':''" :data-index="index + 1"></text> {{item}}
					</view>
				</view>
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
				reportingPersonnelName:'',
				reportingDate:'',
				reportingTime:'',
				createTime:'',
				imgUrl:'',
				imgList:[],
				numList: [],
				processList:[],
				attachments:[]
			};
		},
		onLoad(e) {
			console.log(e)
			uni.request({
				url: '/api/businessInspection/getInspectionDetail',
				method: 'POST',
				data: {
					inspectionId:e.inspectionId
				},
				success: res => {
					this.title = res.data.data.businessInspection.title;
					this.content = res.data.data.businessInspection.content;
					this.position = res.data.data.businessInspection.position;
					this.reportingPersonnelName = res.data.data.businessInspection.reportingPersonnelName;
					this.reportingDate = res.data.data.businessInspection.reportingDate;
					this.reportingTime = res.data.data.businessInspection.reportingTime;
					this.createTime = res.data.data.businessInspection.createTime;
					this.imgUrl = res.data.data.businessInspection.imgUrl;
					this.attachments = res.data.data.businessInspection.attachments;
					this.processList = res.data.data.processes;
					this.processList.forEach((row, index) => {
						this.numList.push(this.processList[index].userName);
						console.log(this.numList)
					    })
					this.attachments.forEach((row, index) => {
						this.imgList.push(this.websiteUrl+this.attachments[index].fileNameReal);
						console.log(this.numList)
					    })
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
            ViewImage(e) {
            	uni.previewImage({
            		urls: this.imgList,
            		current: e.currentTarget.dataset.url
            	});
            }
		}
	};
</script>

<style>
</style>
