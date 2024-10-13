<template>
	<view class="head-bar">
		<view class="system-head" :style="{ height: `${statusBarHeight}px` }">
		</view>
		<view class="head-content">
			<view
				class="head-pill"
				:style="{
					height: headContentHeight + 'px',
					marginTop: headContentMarginTop + 'px'
				}"
			>
				<view
					:style="{
						width: headContentWidth + 'px',
						paddingLeft: `${headContentMarginRight}px`
					}"
				>
					<view class="left_tools">
						<view v-if="showBackBtn" class="button_item" @tap="goBack">
							<van-icon
								v-if="showBackBtn"
								name="arrow-left"
								color="#000"
								size="20"
							></van-icon>
						</view>
						<view v-if="showHomeBtn" class="button_item" @tap="goHome">
							<van-icon
								v-if="showHomeBtn"
								name="wap-home-o"
								color="#000"
								size="24"
							></van-icon>
						</view>
					</view>
					<slot name="head-left"></slot>
				</view>
				<view class="head-warp">
					<slot />
				</view>
				<view class="placeholder" :style="{ width: headContentWidth + 'px' }" />
			</view>
		</view>
	</view>
</template>
<script>
export default {
	options: {
		styleIsolation: 'shared'
	},
	props: {
		showBackBtn: {
			type: Boolean,
			default: false
		},
		showHomeBtn: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusBarHeight: null, // 手机状态栏高度
			headContentWidth: null, // 胶囊宽度
			headContentHeight: null, // 胶囊高度
			headContentMarginRight: null, // 胶囊margin
			headContentMarginTop: null,
			screenWidth: null // 手机屏幕宽度
		};
	},
	created() {
		this.getSystemInfo();
		this.getMenuButtonBounding();
	},
	methods: {
		getSystemInfo() {
			// 获取系统信息
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight || 20;
					this.screenWidth = res.screenWidth || 20;
					// console.log('getSystemInfo', res);
				},
				fail: () => {
					console.log('获取系统信息失败');
				}
			});
		},
		getMenuButtonBounding() {
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			const width = menuButtonInfo && menuButtonInfo.width;
			const right = menuButtonInfo && menuButtonInfo.right;
			const height = menuButtonInfo && menuButtonInfo.height;
			const top = menuButtonInfo && menuButtonInfo.top;
			const marginRight = this.screenWidth - right;
			this.headContentWidth = width + (this.screenWidth - right);
			this.headContentHeight = height;
			this.headContentMarginRight = marginRight;
			this.headContentMarginTop = top - this.statusBarHeight;
		},
		goBack() {
			console.log('goBack');
			uni.vibrateShort({
				complete: () => {
					uni.navigateBack();
				}
			});
		},
		goHome() {
			uni.vibrateShort({
				complete: () => {
					this.$emit('goHome');
					uni.removeStorageSync('question_close_type'); // 清楚整改闭合跳转传参
					uni.switchTab({
						url: '/pages/project/index'
					});
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.head-bar {
	flex-shrink: 0;
	::v-deep .head-content {
		width: 100%;
		height: 75rpx;
		color: $uni-text-active-color1;
		background-color: $page-header-color;
		border-bottom: 1rpx solid #2d334c;
		.flex-c-c.flex-1 {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-grow: 1;
		}
		serve .van-icon {
			color: #fff !important;
		}
		.head-pill {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}

		.left_tools {
			text-align: center;
			font-size: 34rpx;
			display: flex;
			align-items: center;
		}
		.button_item {
			min-width: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.head-warp {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 34rpx;
			text-align: center;
		}

		.placeholder {
			height: 100%;
		}
	}
}
</style>
