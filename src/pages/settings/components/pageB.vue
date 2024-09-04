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

			<!--			<view class="zone_ble_item">-->
			<!--				<text class="zone_ble_title">刹车触发模式</text>-->
			<!--				<van-radio-group-->
			<!--					direction="horizontal"-->
			<!--					:value="turnLockMode.value"-->
			<!--					@change="onLockChange($event, turnLockMode)"-->
			<!--				>-->
			<!--					<van-radio-->
			<!--						v-for="(item, index) in turnLockMode.keys"-->
			<!--						:key="index"-->
			<!--						:name="item.code"-->
			<!--						use-icon-slot-->
			<!--					>-->
			<!--						<image-->
			<!--							slot="icon"-->
			<!--							mode="aspectFit"-->
			<!--							:src="-->
			<!--								turnLockMode.value === item.code ? checkboxIcon2 : checkboxIcon1-->
			<!--							"-->
			<!--						/>-->
			<!--						<text>{{ item.name }}</text>-->
			<!--					</van-radio>-->
			<!--				</van-radio-group>-->
			<!--				<view class="top_tips"-->
			<!--					><image-->
			<!--						src="@/static/images/tips_icon.png"-->
			<!--						mode="aspectFit"-->
			<!--					/>请查看控制器说明，刹车信号是高电平或低电平触发</view-->
			<!--				>-->
			<!--			</view>-->
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
					<view class="state_item_label">
						<image
							:src="`/static/images/sing_icon_${index2 + 1}.png`"
							mode="aspectFit"
						/>
						{{ mode.name }}
					</view>
					<van-radio-group
						direction="horizontal"
						:value="mode.value"
						@change="onValueChange($event, index, index2)"
					>
						<van-radio
							v-for="radio in _getKeysList(mode.keys)"
							:key="radio.value"
							use-icon-slot
							:name="radio.value"
						>
							<image
								slot="icon"
								mode="aspectFit"
								:src="mode.value === radio.value ? radioIcon2 : radioIcon1"
							/>
							<view
								class="radio_label"
								:class="[
									`radio_length_${
										_getKeysList(mode.keys).length >= 4 ? 'limit' : 'auto'
									}`,
									`more_length_${
										radio.label.length >= 5 ? 5 : radio.label.length
									}`,
									`more_length_${
										radio.label.length === 4 ? 4 : radio.label.length
									}`
								]"
								>{{ radio.label }}</view
							>
						</van-radio>
					</van-radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ecBLE from '@/utils/ecBLE.js';
import checkboxIcon1 from '@/static/images/checkbox_icon_1.png';
import checkboxIcon2 from '@/static/images/checkbox_icon_2.png';
import radioIcon1 from '@/static/images/radio_icon_1.png';
import radioIcon2 from '@/static/images/radio_icon_2.png';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';
export default {
	options: {
		styleIsolation: 'shared'
	},
	data() {
		return {
			radioIcon1,
			radioIcon2,
			checkboxIcon1,
			checkboxIcon2,
			turnLockMode: {},
			zoneDataB: []
		};
	},
	computed: {
		connected() {
			return this.getBleData.connected;
		},
		getZoneDataB() {
			return this.$store.getters.zoneDataB;
		},
		getTurnLockMode() {
			return this.$store.getters.turnLockMode;
		},
		keysData() {
			return this.$store.getters.zoneKeysDataB;
		},
		getBleData() {
			return this.$store.getters.bleData;
		},
		turnLockValue() {
			const target = this.turnLockMode.keys.find(
				(item) => item.code === this.turnLockMode?.value
			);

			return target?.name || '';
		}
	},
	watch: {
		getZoneDataB: {
			handler(val) {
				this.zoneDataB = val;
			},
			deep: true
		},
		getTurnLockMode: {
			handler(val) {
				this.turnLockMode = val;
			},
			deep: true
		}
	},
	mounted() {
		this.turnLockMode = this.$store.getters.turnLockMode;
		this.zoneDataB = this.$store.getters.zoneDataB;
	},
	methods: {
		onLockChange(event) {
			uni.vibrateShort();
			// 发送设置

			const value = event.detail;

			this._sendSettings(`8102${value}ff`, () => {
				this.turnLockMode.value = value;
			});
			this.$store.dispatch('setTurnLockMode', this.turnLockMode);
		},
		onValueChange(event, index1, index2) {
			uni.vibrateShort();

			console.log('=========蓝牙数据=======', this.getBleData);

			// 发送设置
			const value = event.detail;
			const code1 = this.zoneDataB[index1].code;
			const code2 = this.zoneDataB[index1].children[index2].code;

			this._sendSettings(`8003${code1}${code2}${value}`, () => {
				this.$set(this.zoneDataB[index1].children[index2], 'value', value);
			});
			this.$store.dispatch('setZoneDataB', this.zoneDataB);
		},
		_sendSettings(msg, cb) {
			// 发送设置
			const { connected, receiveDataValue, ecUserPasswordPassed } =
				this.getBleData;

			if (!connected) {
				return Toast('蓝牙未连接');
			}
			if (!receiveDataValue) {
				return Toast('蓝牙未响应');
			}

			if (ecUserPasswordPassed !== '1') {
				return uni.$emit('checkPassword');
			}

			ecBLE.easySendData(msg);

			cb && cb();
		},
		_getKeysList(keys) {
			const list = [];
			Object.keys(this.keysData).forEach((key) => {
				if (keys.includes(key)) {
					list.push({ label: this.keysData[key], value: key });
				}
			});

			return list;
		}
	}
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

	//.zone_ble_item {
	//	width: 45%;
	//	font-size: $uni-font-size-sm;
	//	flex-grow: 1;
	//	padding: 25rpx;
	//	display: flex;
	//	align-items: center;
	//	justify-content: center;
	//	border-radius: 36rpx;
	//	border: 4rpx solid rgba(#18cace, 0.4);
	//	position: relative;
	//	.zone_ble_title {
	//		color: #d3ae07;
	//		font-size: $uni-font-size-lm;
	//	}
	//	::v-deep van-radio {
	//		display: flex;
	//		align-items: center;
	//		margin-left: 100rpx;
	//		.van-radio {
	//			margin-right: 0;
	//		}
	//		.van-radio__icon-wrap {
	//			display: flex;
	//			align-items: center;
	//		}
	//		image {
	//			width: 30rpx;
	//			height: 30rpx;
	//		}
	//		text {
	//			color: $uni-text-color;
	//		}
	//	}
	//
	//	.top_tips {
	//		width: 495rpx;
	//		text-align: center;
	//		display: flex;
	//		align-items: center;
	//		justify-content: center;
	//		position: absolute;
	//		right: 10rpx;
	//		top: 0;
	//		font-size: $uni-font-size-mm;
	//		transform: translateY(-50%);
	//		background: #0b0d15;
	//		image {
	//			width: 20rpx;
	//			height: 20rpx;
	//			margin-right: 10rpx;
	//		}
	//	}
	//}
}
.zone_status {
	padding-bottom: 20rpx;
	.zone_title {
		font-size: $uni-font-size-base;
		padding: 10rpx 40rpx;
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
			line-height: 70rpx;
			& + .state_item {
				border-top: 1rpx solid rgba(0, 0, 0, 0.3);
			}
			.state_item_label {
				flex-shrink: 0;
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

			::v-deep .van-radio-group--horizontal {
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			::v-deep van-radio {
				margin-left: 15rpx;
				transform: scale(1.01);
				.van-radio {
					margin-right: 0;
					line-height: 1.5em;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.van-radio__label {
					padding-left: 0;
					line-height: 1em;
				}
				.van-radio__icon-wrap {
					display: flex;
					align-items: center;
				}
				image {
					width: 28rpx;
					height: 28rpx;
					margin-left: 0;
				}
				.radio_label {
					font-size: 20rpx;
					color: $uni-text-color;
					text-align: center;
				}
				.radio_length_limit {
					&.more_length_4 {
						max-width: 50rpx;
					}
					&.more_length_5 {
						max-width: 80rpx;
					}
				}
			}
		}
	}
}
</style>
