<template>
	<view class="mine_pageB">
		<view class="logo_wrap">
			<van-transition
				:show="showLogo"
				name="fade"
				:duration="{ enter: 500, leave: 500 }"
			>
				<img
					class="my_logo1"
					src="~@/static/images/home_icon_1.png"
					mode="aspectFit"
				/>
			</van-transition>
			<van-transition
				:show="showLogo"
				name="fade-up"
				:duration="{ enter: 500, leave: 500 }"
			>
				<img
					class="my_logo2"
					src="~@/static/images/home_icon_2.png"
					mode="aspectFit"
				/>
			</van-transition>
		</view>
		<view class="mine_content">
			<view class="zone_ble_status">
				<view class="zone_ble_item">
					<text class="zone_ble_title">分区名称</text>
					<view class="zone_item"
						>分区一
						<text>尾灯</text>
					</view>
					<view class="zone_item"
						>分区二
						<text>转向灯</text>
					</view>
					<view class="zone_item"
						>分区三
						<text>飞机灯</text>
					</view>
					<view class="top_tips"
						><image
							src="@/static/images/tips_icon.png"
							mode="aspectFit"
						/>灯控模块分三个区域端口独立控制，具体定义如下</view
					>
				</view>
			</view>
			<view class="zone_state_wrap">
				<view class="state_item">
					<view>
						<image src="@/static/images/my_icon4.png" mode="aspectFit" />
						灯控系统类型
					</view>
					<view>幽灵大师尾灯RGB灯控</view>
				</view>
				<view class="state_item">
					<view>
						<image src="@/static/images/my_icon2.png" mode="aspectFit" />
						灯控协议
					</view>
					<view> {{ bleMcuData.mcuVersion || '--' }} </view>
				</view>
				<view class="state_item">
					<view>
						<image src="@/static/images/my_icon1.png" mode="aspectFit" />
						APP版本
					</view>
					<view> V1.0 </view>
				</view>
				<view class="state_item">
					<view>
						<image src="@/static/images/my_icon3.png" mode="aspectFit" />
						硬件版本
					</view>
					<view> V1.0 </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showLogo: true
		};
	},
	mounted() {
		setTimeout(() => {
			this.showLogo = true;
		}, 100);
	}
};
</script>

<style lang="scss" scoped>
.logo_wrap {
	width: 100%;
	top: 10rpx;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	.my_logo1 {
		width: 668rpx;
		height: 195rpx;
		margin: 60rpx 0 60rpx;
	}
	.my_logo2 {
		width: 468rpx;
		height: 300rpx;
	}
}
.mine_content {
	padding: 60rpx 30rpx;
	width: 100%;
	position: absolute;
	bottom: 0;
	left: 0;
	.zone_ble_status {
		display: flex;
		align-items: center;
		padding: 40rpx 0;
		.zone_ble_item {
			width: 45%;
			font-size: $uni-font-size-sm;
			flex-grow: 1;
			padding: 25rpx 40rpx;
			display: flex;
			align-items: center;
			border-radius: 36rpx;
			border: 4rpx solid rgba(#18cace, 0.4);
			position: relative;
			.zone_ble_title {
				color: #d3ae07;
				font-size: $uni-font-size-lm;
				margin-right: 100rpx;
			}
			.zone_item {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				font-size: $uni-font-size-mm;
				text {
					color: #d3ae07;
					font-size: $uni-font-size-sm;
					margin-top: 5rpx;
				}
			}

			.top_tips {
				width: 480rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 30rpx;
				top: 0;
				font-size: $uni-font-size-mm;
				transform: translateY(-50%);
				background: #0b0d15;
				image {
					width: 20rpx;
					height: 20rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.zone_state_wrap {
		padding: 20rpx 50rpx;
		background: rgba(144, 62, 255, 0.15);
		border-radius: 100rpx;
		border: 1px solid rgba(#9f57ff, 0.2);

		.state_item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-sm;
			line-height: 80rpx;
			& + .state_item {
				border-top: 1rpx solid rgba(0, 0, 0, 0.3);
			}

			> view {
				display: flex;
				align-items: center;
			}
			image {
				width: 50rpx;
				height: 50rpx;
				margin-left: 15rpx;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
