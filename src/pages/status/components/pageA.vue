<template>
	<view class="zone_wrap">
		<view v-for="(item, index) in zoneDataA" :key="index" class="zone_status">
			<view class="zone_title">
				<text>{{ item.name }} —— 分区{{ index + 1 }}</text>
				<image src="@/static/images/title_end.png" mode="aspectFit" />
			</view>
			<view class="zone_state_wrap">
				<view class="state_item">
					<view class="state_item1">当前自定义颜色</view>
					<view class="state_item2 color_item">
						<view
							v-if="item.mode === '00'"
							class="color_circle"
							:style="{ background: `rgb(${item.value4})` }"
						></view>
						<text v-else>--</text>
					</view>
					<view class="state_item3">
						<view class="color_rgb_box">
							<ColorInput
								v-if="item.mode === '00'"
								:customColor="_getColorRgb(item.value4)"
							/>
							<text v-else>--</text>
						</view>
					</view>
				</view>
				<view class="state_item">
					<view class="state_item1">当前模式</view>
					<view class="state_item2 mode_item">
						<text>{{
							item.mode === '00' ? '--' : _getModeName(item.mode)
						}}</text>
					</view>
					<view class="state_item3">{{
						item.mode === '00' ? '--' : _getModeName(item.mode)
					}}</view>
				</view>
				<view class="state_item">
					<view class="state_item1">当前亮度</view>
					<view class="state_item2 brightness_item">
						<text>{{ item.value2 }}</text>
					</view>
					<view class="state_item3">{{ item.value2 }}</view>
				</view>
				<view class="state_item">
					<view class="state_item1">当前呼吸频率</view>
					<view class="state_item2 breathRate_item">
						<text>{{ item.value3 }}</text>
					</view>
					<view class="state_item3">{{ item.value3 }}</view>
				</view>
				<view class="state_item">
					<view class="state_item1">当前信号关联</view>
					<view class="state_item2 signalData_item">
						<view v-for="(item2, index2) in item.signal" :key="index2">
							<image :src="`/static/images/${item2.icon}`" mode="aspectFit" />
							{{ item2.name }}
						</view>
					</view>
					<view class="state_item3">
						<view v-for="(item2, index2) in item.signal" :key="index2">{{
							_getSignalName(item2.value)
						}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ColorInput from '@/components/ColorInput/index.vue';

export default {
	name: 'ZoneStatus',
	components: {
		ColorInput
	},
	props: {},
	computed: {
		connected() {
			return this.getBleData.connected;
		},
		getBleData() {
			return this.$store.getters.bleData;
		},
		zoneDataA() {
			return this.$store.getters.zoneDataA;
		},
		keysData() {
			return this.$store.getters.zoneKeysDataA;
		},
		zoneModesA() {
			return this.$store.getters.zoneModesA;
		}
	},
	methods: {
		_getModeName(mode) {
			const target = this.zoneModesA.find((item) => item?.code === mode);
			return target?.name || '';
		},
		_getSignalName(signal) {
			return this.keysData?.[signal] || '';
		},
		_getColorRgb(color) {
			const colorArr = color.split(',');
			return {
				red: colorArr[0],
				green: colorArr[1],
				blue: colorArr[2]
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.zone_wrap {
	margin-top: -30rpx;
}
.zone_status {
	padding-bottom: 20rpx;
	.zone_title {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		padding: 10rpx 40rpx;
		display: flex;
		align-items: center;
		image {
			width: 35rpx;
			height: 17rpx;
			display: block;
			object-fit: contain;
			margin-left: 10rpx;
		}
	}

	.zone_state_wrap {
		padding: 0 40rpx;
		background: rgba(144, 62, 255, 0.15);
		border: 1px solid rgba(#9f57ff, 0.2);
		border-radius: 60rpx;

		.state_item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-lm;
			line-height: 54rpx;
			&:first-child > view {
				padding-top: 10rpx;
			}
			&:last-child > view {
				padding-bottom: 10rpx;
			}

			& + .state_item {
				border-top: 1rpx solid rgba(0, 0, 0, 0.3);
			}
			.state_item1 {
				width: 200rpx;
			}

			.state_item2 {
				width: 160rpx;
				background: rgba(0, 0, 0, 0.2);
				> view + view {
					border-top: 1rpx solid rgba(0, 0, 0, 0.3);
				}

				&.color_item {
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.color_circle {
						width: 28rpx;
						height: 28rpx;
						display: inline-block;
						border-radius: 100%;
					}
				}
			}
			.mode_item,
			.breathRate_item,
			.brightness_item {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.signalData_item {
				> view {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 6rpx;
				}
			}

			.state_item3 {
				flex-grow: 1;
				text-align: center;

				> view + view {
					border-top: 1rpx solid rgba(0, 0, 0, 0.3);
				}
			}
		}
	}
}
</style>
