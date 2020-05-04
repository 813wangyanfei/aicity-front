<template>
	<view class="warp">
		<view class="box">
			<view class="title">默认效果</view>
			<t-table @change="change">
				<t-tr>
					<t-th>车牌号</t-th>
					<t-th>报警类型</t-th>
					<t-th>速度(km/h)</t-th>
					<t-th>设备号</t-th>
					<t-th>报警是否处理</t-th>
					<t-th>报警处理时间</t-th>
					<t-th>报警状态</t-th>
					<t-th>报警时间间隔</t-th>
					<t-th>开始地点</t-th>
					<t-th>创建时间</t-th>
				</t-tr>
				<t-tr v-for="item in tableList" :key="item.id">
					<t-td>{{ item.id + 1 }}</t-td>
					<t-td>{{ item.name }}</t-td>
					<t-td>{{ item.age }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
					<t-td>{{ item.hobby }}</t-td>
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
	                tableList: [{
	                        id: 0,
	                        name: '张三',
	                        age: '19',
	                        hobby: '游泳'
	                    },
	                    {
	                        id: 1,
	                        name: '李四',
	                        age: '21',
	                        hobby: '绘画'
	                    },
	                    {
	                        id: 2,
	                        name: '王二',
	                        age: '29',
	                        hobby: '滑板'
	                    },
	                    {
	                        id: 3,
	                        name: '码字',
	                        age: '20',
	                        hobby: '蹦极'
	                    }
	                ]
	            };
	        },
	        methods: {
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
</style>
