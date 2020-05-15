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
			
			<view class="cu-bar bg-white solid-bottom margin-top" v-if="ifOnePerson == false">
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
			<view class="cu-form-group" v-if="ifOnePerson == true && status == 0">
				<view class="title">处理方式</view>
				<radio-group class="block" @change="RadioChange">
					<view class="cu-form-group margin-top">
						<view class="title">办理</view>
						<radio :class="radio=='A'?'checked':''" :checked="radio=='A'?true:false" value="1"></radio>
					</view>
					<!-- #ifndef MP-ALIPAY -->
					<view class="cu-form-group">
						<view class="title">交办</view>
						<radio :class="radio=='B'?'checked':''" :checked="radio=='B'?true:false" value="0"></radio>
					</view>
					<!-- #endif -->
				</radio-group>
			</view>
			<view class="cu-form-group align-start" v-if="ifOnePerson == true && status == 0">
				<view class="title">处理意见</view>
				<textarea maxlength="-1" :disabled="modalName!=null" v-model="handleResult" @input="textareaBInput" placeholder="请输入处理意见"></textarea>
			</view>
			<view class="cu-form-group margin-top" v-if="ifOnePerson == true  && radio ==0 && status == 0">
				<view class="title">交办人员</view>
				<picker @change="bindPickerChanges" range-key="name" :data-index="22" :data-id="handlePersonnelList[index].id" :value="index" :range="handlePersonnelList">
					<view class="picker">
						<!-- {{index>-1?objectArray[index].name:'请选择上报人员'}} -->
						{{reportIndex>-1?handlePersonnelList[index].name:'请选择交办人员'}}
					</view>
					<input type="text" :value="handlePersonnelList[index].id" hidden/>
				</picker>
			</view>
			<view class="padding flex flex-direction" v-if="ifOnePerson == true && status == 0">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap="businessHandle">办理</button>
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
				inspectionId:'',
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
				imgList:[],
				modalName: null,
				radio: '1',
				handleResult:'',
				processList:[],
				processId:'',
				ifOnePerson:false,
				status:'',
				num: 0,
				numList: [],
				attachments:[]
			};
		},
		onLoad(e) {
			const userInfo = uni.getStorageSync('userInfo');
			uni.request({
				url: '/api/businessInspection/getInspectionDetail',
				method: 'POST',
				data: {
					inspectionId:e.inspectionId
				},
				success: res => {
					console.log(res.data.data)
					this.inspectionId = res.data.data.businessInspection.id;
					this.title = res.data.data.businessInspection.title;
					this.content = res.data.data.businessInspection.content;
					this.position = res.data.data.businessInspection.position;
					this.reportingPersonnelName = res.data.data.businessInspection.reportingPersonnelName;
					this.reportingDate = res.data.data.businessInspection.reportingDate;
					this.reportingTime = res.data.data.businessInspection.reportingTime;
					this.createTime = res.data.data.businessInspection.createTime;
					this.imgUrl = res.data.data.businessInspection.imgUrl;
					this.status = res.data.data.businessInspection.status;
					this.processList = res.data.data.processes;
					console.log(this.processList.length)
					console.log(this.processList[this.processList.length-1])
					this.processId = this.processList[this.processList.length-1].id;
					var userId = this.processList[this.processList.length-1].userId;
					this.attachments = res.data.data.businessInspection.attachments;
					this.processList.forEach((row, index) => {
						this.numList.push(this.processList[index].userName);
						console.log(this.numList)
					    })
					this.attachments.forEach((row, index) => {
						this.imgList.push(this.websiteUrl+this.attachments[index].fileNameReal);
						})
					if(userId == userInfo.userId ){   //查询出来最后一个流程处理人是当前处理人，显示办理
						this.ifOnePerson = true;
					}else{   //如果不是当前人需要隐藏处理的相关按钮，可以查看到流程信息
						this.ifOnePerson = false;
					}
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
					url: '/api/getDownDeptUsers',
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
			RadioChange(e) {
				this.radio = e.detail.value
				console.log("radio的值："+this.radio)
			},
			textareaBInput(e) {
				this.textareaBValue = e.detail.value
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			businessHandle(){
				
				if(this.handleResult == '' ){
					uni.showToast({
						title:'处理结果不能为空'
					})
				}else if(this.radio == 0 && this.handlePersonnelId == ''){  //当选择的是交办但是没有选择交办人员
					uni.showToast({
						title:'交办人员不能为空'
					})
				}else{
					const userInfo = uni.getStorageSync('userInfo');
					uni.request({
						url: '/api/businessInspection/handle',
						method: 'POST',
						data: {
							/* inspectionId:this.inspectionId,
							title:this.title,
							content:this.content,
							position:this.position, */
							userId:this.handlePersonnelId,     //下一步处理人
							userName:this.handlePersonnelName,    //下一步处理人姓名
							//reportingDate:this.date,
							//reportingTime:this.time,
							//userId:userInfo.userId,
							//userName:userInfo.userName,
							remark:this.handleResult,
							isHandle:this.radio,
							processId:this.processId
						},
						header: {
							'Access-Control-Allow-Origin': '*', //跨域加上头
							'Content-Type': 'application/json'
						},
						success: res => {
							console.log(res.data)
							if(res.data.code == 0){
								uni.showToast({
									title:'处理成功'
								})
								uni.navigateTo({
									url: '../../pages/index/index'
								});
							}else if(res.data.code == 500){
								uni.showToast({
									title:res.data.msg
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
				
			}
		}
	};
</script>

<style>
</style>
