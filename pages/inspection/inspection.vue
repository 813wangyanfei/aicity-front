<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input placeholder="请输入标题" v-model="title" name="title"></input>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">内容</view>
				<textarea maxlength="-1" :disabled="modalName!=null" v-model="content" @input="textareaBInput" placeholder="请输入内容"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">位置</view>
				<input placeholder="请选择位置"  name="position" v-model="position"></input>
				<text class='cuIcon-locationfill text-orange'></text>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">上报人员</view>
				<picker @change="bindPickerChanges" range-key="name" :data-index="22" :data-id="objectArray[index].id" :value="index" :range="objectArray">
					<view class="picker">
						<!-- {{index>-1?objectArray[index].name:'请选择上报人员'}} -->
						{{reportIndex>-1?objectArray[index].name:'请选择上报人员'}}
					</view>
					<input type="text" :value="objectArray[index].id" hidden/>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
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
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap="submit">提交</button>
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
				objectArray: [{
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
				time: '21:22',
				date: '2018-12-25',
				imgList: [],
				modalName: null,
				textareaAValue: '',
				textareaBValue: '',
				uploadFileUrl: 'http://localhost:8888', //替换成你的后端接收文件地址
				header: {
					// 如果需要header，请上传
				},
				attachmentList: []
			};
		},
		onLoad(option) {
			var myDate = new Date(); //实例一个时间对象；
			var year = myDate.getFullYear();   //获取系统的年；
			var month = myDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
			var newMonth = month>9?month:"0"+month;  //月
			var date = myDate.getDate(); // 获取系统日，
			var newDate = date>9?date:"0"+date;  //月
			var hour = myDate.getHours(); //获取系统时，
			var newhour = hour>9?hour:"0"+hour;  //小时
			var minutes = myDate.getMinutes(); //分
			var newMinutes = minutes>9?minutes:"0"+minutes;  //分
			var seconds = myDate.getSeconds(); //秒
			var newSeconds = seconds>9?seconds:"0"+seconds;  //秒
			this.time = hour+':'+minutes;
			this.date = year+'-'+newMonth+'-'+newDate;
		},
		methods: {
            bindPickerChanges: function(e) {
                this.index = e.detail.value
				this.reportIndex = 1
                console.log('可以传data-xx:xx',e.currentTarget.dataset.index,'\n默认传过来的是下标：',e.detail.value,'\n也可以传普通json传过来的id等：',e.currentTarget.dataset.id);
            },
			TimeChange(e) {
				this.time = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			/* PickerChange(e) {
				this.index = e.detail.value
				console.log(e.detail)
			}, */
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log("res:"+res)
						console.log("图片路径："+res.tempFilePaths)
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
						const tempFilePaths = res.tempFilePaths;
						console.log("0000")
						//进行上传操作
						console.log("文件路径："+tempFilePaths)
						uni.uploadFile({
							url: '/api/uploadFile', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'Access-Control-Allow-Origin': '*' //跨域加上H头
							},
							formData: {
								'user': 'test'
							},
							success: result => {
								console.log("返回結果data："+result.data);
								var temporary=JSON.parse(result.data);
								this.attachmentList.push(temporary.data);
								console.log("temporary"+temporary)
								console.log("返回結果Code："+temporary.code);
								console.log("原始文件名："+temporary.data.originalFilename);
								console.log("文件路徑："+temporary.data.filePath);
								console.log("新文件名："+temporary.data.fileName);
								console.log("文件大小："+temporary.data.fileSize);
								console.log("attachmentList:"+this.attachmentList)
							}
						});
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除图片吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1),
							this.attachmentList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			textareaBInput(e) {
				this.textareaBValue = e.detail.value
			},
			/* uploadSuccess(result) {
				if(result.statusCode == 200) {
					//上传成功的回调处理
					uni.showToast({
						title: '上传成功',
						icon: 'none'
					});
				}else{
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					});
				}
			}, */
			submit(){
				uni.request({
					url: '/api/insertInspection',
					method: 'POST',
					data: {
						title:this.title,
						content:this.content,
						position:this.position,
						attachmentList:this.attachmentList
					},
					header: {
						'Access-Control-Allow-Origin': '*', //跨域加上头
						'Content-Type': 'application/json'
					},
					success: res => {
						console.log(res.data)
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	};
</script>

<style>
</style>
