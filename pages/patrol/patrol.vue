<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input placeholder="请输入标题" name="input"></input>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">内容</view>
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaBInput" placeholder="请输入内容"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">位置</view>
				<input placeholder="请选择位置" name="input"></input>
				<text class='cuIcon-locationfill text-orange'></text>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">上报人员</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">
						{{index>-1?picker[index]:'请选择上报人员'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" start="09:01" end="21:01" @change="TimeChange">
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
			
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
				picker: ['张三', '李四', '王五'],
				time: '12:01',
				date: '2018-12-25',
				imgList: [],
				modalName: null,
				textareaAValue: '',
				textareaBValue: ''
			};
		},
		methods: {
			TimeChange(e) {
				this.time = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
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
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			textareaBInput(e) {
				this.textareaBValue = e.detail.value
			}
		}
	};
</script>

<style>
</style>
