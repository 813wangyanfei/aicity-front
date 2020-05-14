<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<!-- <input placeholder="请输入标题" v-model="title" name="title"></input> -->
				<view class="title" v-model="title"></view>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">内容</view>
				<view class="title" v-model="content"></view>
			</view>
			<view class="cu-form-group">
				<view class="title">位置</view>
				<view class="title" v-model="position"></view>
				<!-- <input placeholder="请输入位置"  name="position" v-model="position"></input>
				<text class='cuIcon-locationfill text-orange' @tap="myclick"></text> -->
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">上报人员</view>
				<view class="title" v-model="reportingPersonnelName"></view>
				<!-- <picker @change="bindPickerChanges" range-key="name" :data-index="22" :data-id="objectArray[index].id" :value="index" :range="objectArray">
					<view class="picker">
						{{reportIndex>-1?objectArray[index].name:'请选择上报人员'}}
					</view>
					<input type="text" :value="objectArray[index].id" hidden/>
				</picker> -->
			</view>
			<view class="cu-form-group">
				<view class="title">上报日期</view>
				<view class="title" v-model="reportingDate"></view>
				<!-- <picker mode="date" :value="date" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker> -->
			</view>
			<view class="cu-form-group">
				<view class="title">上报时间</view>
				<view class="title" v-model="reportingTime"></view>
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
				<!-- <view style="padding: 30rpx;">
				        <Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :heaer="header" :showProcess="true" :attachmentList.sync="attachmentList" @uploadSuccess="uploadSuccess"></Attachment>
				    </view> -->
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<!-- <view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap="submit">提交</button>
			</view> -->
			
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
				reportingTime
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
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
            
		}
	};
</script>

<style>
</style>
