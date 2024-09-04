<template>
	<view class="zone_wrap">
		<view class="zone_ble_status">
			<view class="zone_ble_item">
				<image src="@/static/images/run_state_icon_11.png" mode="aspectFit" />
				<text>运行状态：{{ !connected ? '未连接' : '良好' }}</text>
			</view>
			<view class="zone_ble_item">
				<image src="@/static/images/sing_icon_4.png" mode="aspectFit" />
				<text>刹车触发：{{ turnLockValue || '高刹' }}</text>
			</view>
		</view>
		<view v-for="(zone, index) in zoneDataB" :key="index" class="zone_status">
			<view class="zone_title">
				<text>{{ zone.name }}</text>
				<image src="@/static/images/title_end.png" mode="aspectFit" />
			</view>
			<view class="zone_state_wrap">
				<view
					v-for="(mode, index2) in zone.children"
					:key="index2"
					class="state_item"
				>
					<view>
						<image
							:src="`/static/images/sing_icon_${index2 + 1}.png`"
							mode="aspectFit"
						/>
						{{ mode.name }}
					</view>
					<view> {{ keysData[mode.value] }} </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		connected() {
			return this.bluetoothData.connected;
		},
		bluetoothData() {
			return this.$store.getters.bleData;
		},
		zoneDataB() {
			return this.$store.getters.zoneDataB;
		},
		keysData() {
			return this.$store.getters.zoneKeysDataB;
		},
		turnLockMode() {
			return this.$store.getters.turnLockMode;
		},
		turnLockValue() {
			const target = this.turnLockMode.keys.find(
				(item) => item.code === this.turnLockMode?.value
			);
			return target?.name || '';
		}
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.zone_ble_status {
	display: flex;
	align-items: center;
	padding-bottom: 30rpx;
	.zone_ble_item {
		width: 45%;
		font-size: $uni-font-size-lm;
		flex-grow: 1;
		padding: 25rpx 30rpx;
		display: flex;
		align-items: center;
		border-radius: 36rpx;
		border: 4rpx solid rgba(#18cace, 0.4);
		& + .zone_ble_item {
			margin-left: 20rpx;
		}

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 10rpx;
		}
	}
}
.zone_status {
	padding-bottom: 20rpx;
	.zone_title {
		font-size: $uni-font-size-base;
		padding: 10rpx 30rpx;
		display: flex;
		align-items: center;
		image {
			width: 35rpx;
			height: 17rpx;
			margin-left: 15rpx;
			display: block;
			object-fit: contain;
		}
	}

	.zone_state_wrap {
		padding: 10rpx 35rpx;
		background: rgba(144, 62, 255, 0.15);
		border-radius: 60rpx;
		border: 1px solid rgba(#9f57ff, 0.2);

		.state_item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-sm;
			line-height: 60rpx;
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
				margin-right: 6rpx;
			}
		}
	}
}
</style>
