<template>
	<view class="warp">
		<view class="box">
			<view class="title">默认效果</view>
			<t-table @change="change">
				<t-tr>
					<t-th :class="tdwidth">车牌号</t-th>
					<t-th :class="tdwidth">设备号</t-th>
					<t-th :class="tdwidth">总里程</t-th>
					<t-th :class="tdwidth">总油耗</t-th>
					<t-th :class="tdwidth">加油量</t-th>
					<t-th :class="tdwidth">百公里平均油耗</t-th>
				</t-tr>
				<t-tr v-for="item in tableList" :key="item.id">
					<t-td :class="tdwidth">{{ item.plateNo }}</t-td>
					<t-td :class="tdwidth">{{ item.deviceId }}</t-td>
					<t-td :class="tdwidth">{{ item.mileage }}</t-td>
					<t-td :class="tdwidth">{{ item.oil }}</t-td>
					<t-td :class="tdwidth">{{ item.refuel }}</t-td>
					<t-td :class="tdwidth">{{ item.afcHundred }}</t-td>
				</t-tr>
			</t-table>
		</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				tableList: []
			};
		},
		onLoad() {
			this.user = this.getUser("../statistics/dailyReportStatistics");
			console.log(this.user);
			if (!this.user) {
				return false;
			}
			this.getData()
		},
		methods: {
			getData() {
				uni.showLoading({
					title:'加载中...'
				});
				uni.request({
					url: `${this.websiteUrl}/api/vehicle/daily_report`, //仅为示例，并非真实接口地址。
					data: "pageSize=10&pageNum=1",
					method: "POST",
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: res => {
						uni.hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							var rows = res.data.rows;
							this.tableList = rows;
						} else {
							uni.showToast({
								icon: "none",
								title: "加载数据失败:"+res.code
							});
						}
						this.text = "request success";
					},
					fail: () => {
						uni.hideLoading()
						uni.showToast({
							icon: "none",
							title: "网络异常"
						});
					}
				})
			},
			change(e) {
				console.log(e.detail);
			},
			edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
		}
	};
</script>

<style>
	.tdwidth {
		width:16.6%!important;
	}
</style>
