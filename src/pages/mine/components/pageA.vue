<template>
	<view class="mine_pageA">
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
		</view>
		<view class="mine_content">
			<view class="zone_ble_status">
				<view class="zone_ble_item">
					<text class="zone_ble_title">分区名称自定义</text>
					<view class="zone_ble_title2"
						><text class="iconfont icon-wifi"></text>
						<text
							>灯控分三个端口独立控制灯效区域，您可自定义分区名称</text
						></view
					>

					<view class="zone_item_wrap">
						<view class="zone_item"
							>分区一
							<van-field
								:value="zoneDataA[0].name"
								placeholder="请输入"
								@change="onNameChange($event, 0)"
							/>
						</view>
						<view class="zone_item"
							>分区二
							<van-field
								:value="zoneDataA[1].name"
								placeholder="请输入"
								@change="onNameChange($event, 1)"
							/>
						</view>
						<view class="zone_item"
							>分区三
							<van-field
								:value="zoneDataA[2].name"
								placeholder="请输入"
								@change="onNameChange($event, 2)"
							/>
						</view>
					</view>
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
	options: {
		styleIsolation: 'shared'
	},
	data() {
		return {
			showLogo: true,
			zoneDataA: []
		};
	},
	computed: {
		bleMcuData() {
			return this.$store.getters.bleMcuData;
		}
	},
	mounted() {
		this.zoneDataA = this.$store.getters.zoneDataA;
		setTimeout(() => {
			this.showLogo = true;
		}, 100);
	},
	methods: {
		onNameChange(event, index) {
			this.zoneDataA = this.$store.getters.zoneDataA;
			this.zoneDataA[index].name = event.detail;
			this.$store.dispatch('setZoneDataA', this.zoneDataA);
		}
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
		padding: 40rpx 5rpx 100rpx;
		.zone_ble_item {
			width: 100%;
			font-size: $uni-font-size-sm;
			flex-grow: 1;
			padding: 20rpx 20rpx 30rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-radius: 36rpx;
			border: 2rpx dashed rgba(#1ad0d4, 0.4);
			position: relative;
			.zone_ble_title {
				color: #1ad0d4;
				font-size: $uni-font-size-lg;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.zone_ble_title2 {
				font-size: $uni-font-size-mm;
				margin-bottom: 30rpx;
				display: flex;
				align-items: flex-end;
				line-height: 1em;
				.iconfont {
					font-size: $uni-font-size-lg;
				}
			}
			.zone_item_wrap {
				width: 100%;
				display: flex;
				justify-content: center;
				.zone_item {
					flex-grow: 1;
					display: flex;
					align-items: flex-start;
					justify-content: center;
					flex-direction: column;
					font-size: $uni-font-size-sm;
					margin: 0 6rpx;
				}
			}
			::v-deep van-field {
				margin-top: 10rpx;
				padding: 0 !important;
				.van-cell {
					padding: 0 !important;
					background: none !important;
					&:after {
						display: none;
					}
				}
				.input-placeholder {
					font-weight: normal;
					font-size: $uni-font-size-sm;
					color: rgba(#1ad0d4, 0.4) !important;
				}
				.van-field__body {
					.van-field__control {
						height: 60rpx !important;
						padding: 0 10rpx;
						color: #1ad0d4 !important;
						font-size: $uni-font-size-sm;
						background: #3f4556;
						border-radius: 6rpx;
						border: 1rpx solid rgba(#1ad0d4, 0.4);
					}
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
