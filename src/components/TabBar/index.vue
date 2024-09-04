<template>
	<div class="tab_bar_wrap">
		<van-tabbar
			:active="current"
			:fixed="false"
			:placeholder="false"
			:safe-area-inset-bottom="true"
			active-color="#19c9ce"
			inactive-color="#617491"
		>
			<van-tabbar-item
				v-for="(item, index) in tabList"
				:key="index"
				:name="item.pagePath"
				@click="handleTabClick(item.pagePath)"
				class="tab_item"
			>
				<image slot="icon" :src="item.iconPath"></image>
				<image slot="icon-active" :src="item.selectedIconPath"></image>
				<view class="tab_item_label">{{ item.text }}</view>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
const tabBarList = [
	{
		pagePath: '/pages/status/index',
		iconPath: require('static/appIcon/status.png'),
		selectedIconPath: require('static/appIcon/status_on.png'),
		text: '状态 State'
	},
	{
		pagePath: '/pages/settings/index',
		iconPath: require('static/appIcon/set.png'),
		selectedIconPath: require('static/appIcon/set_on.png'),
		text: '设置 Set'
	},
	{
		pagePath: '/pages/service/index',
		iconPath: require('static/appIcon/serve.png'),
		selectedIconPath: require('static/appIcon/serve_on.png'),
		text: '服务 Service'
	},
	{
		pagePath: '/pages/mine/index',
		iconPath: require('static/appIcon/my.png'),
		selectedIconPath: require('static/appIcon/my_on.png'),
		text: '我的 My'
	}
];

export default {
	options: {
		styleIsolation: 'shared'
	},
	props: {
		current: {
			type: String,
			default: '/pages/status/index'
		},
		badge: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			tabList: []
		};
	},
	beforeMount() {
		this.tabList = tabBarList;
	},
	methods: {
		handleTabClick(pagePath) {
			uni.vibrateShort({
				complete: () => {
					uni.switchTab({
						url: pagePath
					});
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.tab_bar_wrap {
	flex-shrink: 0;
	image {
		width: 22px;
		height: 22px;
		display: block;
	}
	.tab_item_label {
		font-size: 22rpx;
		margin-top: 4px;
	}
	::v-deep .van-tabbar {
		padding: 4px 0 5px;
		border-top: 1rpx solid #2e344c;
		background: $page-header-color;
		&.van-hairline--top-bottom:after {
			display: none;
		}
		.tab_item {
			.van-tabbar-item__icon {
				margin-bottom: 0 !important;
			}
		}
	}
}
</style>
