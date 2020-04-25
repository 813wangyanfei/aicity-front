<template>
	<view class="zai-box">
		<image src="../../static/img/login/login.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title">LOGO区域</view>
		<view class="zai-form">
			<input v-model="username" class="zai-input" placeholder="请输入用户名" />
			<input v-model="password" class="zai-input" password placeholder="请输入密码"/>
			<!-- <view class="zai-label">忘记密码？</view> -->
			<button class="zai-btn" @click="login">立即登录</button>
			<!-- <navigator url="../zaizai-register/index" hover-class="none" class="zai-label">还没有账号？点此注册.</navigator> -->
		</view>
	</view>
</template>

<script>
	import uniRequest from 'uni-request';
	export default {
		data() {
			return {
				username: '',
				password:''
			}
		},
		onLoad() {
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					if(res){
						uni.navigateTo({
							url: '../index/index'
						});
					}					
			    }
			});
		},
		methods: {
			login:function(){
				var username = this.username;
				var password = this.password;
				console.log(username)
				if(username == '' ){
					uni.showToast({
						title:'用户名不能为空！'
					})
				}else if(password == ''){
					uni.showToast({
						title:'密码不能为空！'
					})
				}
				if(username && password){
					
					uni.request({
						url: '/api/login',
						data: {
							username: username,
							password: password,
							rememberMe:false
						},
						method: 'POST',
						async: true,
						header: {
							'Access-Control-Allow-Origin': '*', //跨域加上头
							'Content-Type': 'application/json'
						},
						success: res => {
							var code = res.data.code;
							console.log(res.data)
							if(code == "0"){
								uni.setStorage({
									key: 'userInfo',
									data: res.data.data,
									success: function () {
										console.log('success');
									}
								})
								uni.navigateTo({
									url: '../index/index'
								});
							}else{
								uni.showToast({
									title: "密码错误"
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
					
				}
				
			}
		}
	}
</script>

<style>
	.zai-box{
		padding: 0 100upx;
		position: relative;
	}
	.zai-logo{
		width: 100%;
		width: 100%;
		height: 280upx;
	}
	.zai-title{
		position: absolute;
		top: 0;
		line-height: 300upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}
	.zai-form{
		margin-top: 220upx;
	}
	.zai-input{
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
		height: auto;
	}
	.input-placeholder, .zai-input{
		color: #94afce;
	}
	.zai-label{
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}
	.zai-btn{
		margin-top: 80upx;
		background: #007AFF;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}
	.zai-btn:after{
		border: 0;
	}
	/*按钮点击效果*/
	.zai-btn.button-hover{
		transform: translate(1upx, 1upx);
	}
</style>
