<template>
	<view class="zone_wrap">
		<view class="zone_ble_status">
			<view class="zone_ble_item">
				<image src="@/static/images/run_state_icon_11.png" mode="aspectFit" />
				<text>运行状态：{{ !connected ? '未连接' : '良好' }}</text>
			</view>
			<view class="zone_ble_item">
				<image src="@/static/images/sing_icon_4.png" mode="aspectFit" />
				<text>刹车触发：{{ turnLockValue }}</text>
			</view>
		</view>
		<view
			v-for="(item, index) in zoneDataA"
			:key="index"
			class="zone_status"
			@click="handleClick(item)"
		>
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
						<text>{{ _getModeName(item).name }}</text>
					</view>
					<view class="state_item3">{{ _getModeName(item).subName }}</view>
				</view>
				<view class="state_item">
					<view class="state_item1">灯条模式</view>
					<view class="state_item2 brightness_item">
						<text>{{ _getColorMode(item.value6).label }}</text>
					</view>
					<view class="state_item3">{{ _getColorMode(item.value6).name }}</view>
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
							{{ item2.name
							}}{{ item2.code === '02' ? `(${turnLockValue})` : '' }}
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
	data() {
		return {
			// 灯条模式 00 RGB 01 RBG 02 GRB 03 GBR 04 BRG 05 BGR
			colorMode: [
				{ label: 'RGB', value: '00', name: '红绿蓝' },
				{ label: 'RBG', value: '01', name: '红蓝绿' },
				{ label: 'GRB', value: '02', name: '绿红蓝' },
				{ label: 'GBR', value: '03', name: '绿蓝红' },
				{ label: 'BRG', value: '04', name: '蓝红绿' },
				{ label: 'BGR', value: '05', name: '蓝绿红' }
			]
		};
	},
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
		},
		turnLockMode() {
			return this.$store.getters.turnLockMode;
		},
		turnLockValue() {
			const target = this.turnLockMode.keys.find(
				(item) => item.code === this.turnLockMode?.value
			);
			return target?.name || '高刹';
		}
	},
	methods: {
		handleClick(item) {
			console.log(item);
		},
		_getColorMode(value) {
			return (
				this.colorMode.find((item) => item.value === value) || this.colorMode[0]
			);
		},
		_getModeName(mode) {
			const target = this.zoneModesA.find((item) => item?.code === mode.mode);
			const subTarget = target?.options.find(
				(item) => item?.code === mode._mode01
			);
			const subName =
				mode.mode === '05' ? mode.value5 : subTarget?.name || '--';
			return { name: target?.name || '--', subName: subName };
		},
		_getSignalName(signal) {
			const code = signal.toString().padStart(2, '0');
			return this.keysData?.[code] || '';
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
				width: 180rpx;
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
