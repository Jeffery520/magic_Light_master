<template>
	<view class="view-container">
		<nav-bar @click-left="onClickLeft">{{ title }}</nav-bar>
		<view class="content_wrap">
			<van-toast ref="uToast"></van-toast>
			<view class="top_bg_img" :style="{ 'border-color': bgColor }">
				<image
					src="~@/static/images/top_bg.png"
					mode="widthFix"
					style="width: 100%; margin: 0; display: block"
				>
				</image>
			</view>
			<view class="shadow_box">
				<view class="shadow_box_list">
					<view
						:class="['list_item', modelId == '00' ? 'active' : '']"
						@click="modelChange('00')"
						>单色模式</view
					>
					<view
						:class="['list_item', modelId == '01' ? 'active' : '']"
						@click="modelChange('01')"
						>呼吸模式</view
					>
					<view
						:class="['list_item', modelId == '02' ? 'active' : '']"
						@click="modelChange('02')"
						>无极变色</view
					>
					<view
						:class="['list_item', modelId == '03' ? 'active' : '']"
						@click="modelChange('03')"
						>循环模式</view
					>
					<view
						:class="['list_item', modelId == '04' ? 'active' : '']"
						@click="modelChange('04')"
						>爆闪模式</view
					>
					<view
						:class="['list_item', modelId == '05' ? 'active' : '']"
						@click="modelChange('05')"
						>音乐律动</view
					>
				</view>
			</view>

			<!-- 单色模式 -->
			<view v-if="modelId == '00'" style="padding-bottom: 20rpx">
				<view class="parts_tabs_wrap">
					<van-tabs type="card" color="#07C160" animated @change="partChange">
						<van-tab
							v-for="(item, index) in partList"
							:key="index"
							:title="item"
							:name="index"
						></van-tab>
					</van-tabs>
				</view>
				<color-picker
					v-if="modelId == '00'"
					:currentColor="deviceData[modelId][partValue].currentColor"
					@change="colorsChange"
				>
				</color-picker>
			</view>

			<!-- 无极变色 -->
			<template v-else-if="modelId == '02'">
				<view class="model_colors_box">
					<van-radio-group
						v-model="deviceData['02'].type"
						placement="row"
						@change="model02colorsChange"
						activeColor="#07C160"
						inactiveColor="#464849"
					>
						<van-radio
							v-for="(item, index) in modelColors"
							:key="index"
							:name="index"
							activeColor="#07C160"
							inactiveColor="#464849"
							:class="index"
							>{{ item }}
						</van-radio>
					</van-radio-group>
				</view>

				<view class="brightness_control2">
					<view class="brightness_control_title">
						<text style="margin-left: 8px">变色节奏</text>
					</view>
					<view class="brightness_control_item">
						<view class="right_text"> 慢</view>
						<u-slider
							style="flex-grow: 1"
							v-model="deviceData[modelId].value"
							step="1"
							min="0"
							max="10"
							activeColor="#07C160"
							inactiveColor="#313234"
							@change="model02colorsRhythmChange"
						>
						</u-slider>
						<view class="right_text"> 快</view>
					</view>
				</view>
			</template>
			<!-- 呼吸模式 -->
			<template v-else>
				<view class="brightness_control2">
					<view class="brightness_control_title">
						<text v-if="modelId == '01'" style="margin-left: 8px"
							>呼吸节奏</text
						>
						<text v-if="modelId == '03'" style="margin-left: 8px"
							>循环节奏</text
						>
						<text v-if="modelId == '04'" style="margin-left: 8px"
							>爆闪节奏</text
						>
						<text v-if="modelId == '05'" style="margin-left: 8px">灵敏度</text>
					</view>
					<view class="brightness_control_item">
						<view class="right_text"> 慢</view>
						<u-slider
							style="flex-grow: 1"
							v-model="deviceData[modelId].value"
							step="1"
							min="0"
							max="10"
							activeColor="#07C160"
							inactiveColor="#313234"
							@change="breathingRhythmChange"
						>
						</u-slider>
						<view class="right_text"> 快</view>
					</view>
				</view>
			</template>

			<view class="brightness_control2">
				<view class="brightness_control_title">
					<text style="margin-left: 8px">亮度</text>
				</view>
				<u-radio-group
					v-model="brightness.brightnessType"
					activeColor="#07C160"
					inactiveColor="#464849"
				>
					<u-radio shape="circle" label="统一亮度" name="01"></u-radio>
					<u-radio shape="circle" label="分区一" name="02"></u-radio>
					<u-radio shape="circle" label="分区二" name="03"></u-radio>
				</u-radio-group>

				<view class="brightness_control_item">
					<view class="right_text"> 亮度</view>
					<u-slider
						style="flex-grow: 1"
						v-model="brightness[brightness.brightnessType].value"
						step="1"
						min="0"
						max="10"
						activeColor="#07C160"
						inactiveColor="#313234"
						@change="brightnessValueChange"
					>
					</u-slider>
					<view class="right_text">
						{{ brightness[brightness.brightnessType].value }}
					</view>
				</view>
			</view>
		</view>
		<TabBar current="/pages/service/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import TabBar from '@/components/TabBar/index.vue';
import ColorPicker from '@/components/ColorPicker/index.vue';
import util from '@/components/ColorPicker/util.js';
import ecBLE from '@/utils/ecBLE.js';
import { debounce } from '@/utils/lodash.min.js';

export default {
	components: {
		NavBar,
		TabBar,
		ColorPicker
	},
	data() {
		return {
			modelId: '00',
			partList: ['统一分区', '分区一', '分区二'],
			partValue: 1,
			modelColors: [
				'绯红之夜',
				'大漠晚霞',
				'晴空破晓',
				'旭日初升',
				'竹海绿',
				'冰川蓝',
				'绿草茵茵',
				'多彩极光'
			],
			brightness: {
				brightnessType: '01',
				'01': {
					value: 10
				},
				'02': {
					value: 10
				},
				'03': {
					value: 10
				}
			},
			deviceData: {
				'00': [
					{
						brightnessValue: 10,
						currentColor: {
							red: 255,
							green: 0,
							blue: 0
						}
					},
					{
						brightnessValue: 10,
						currentColor: {
							red: 255,
							green: 0,
							blue: 0
						}
					},
					{
						brightnessValue: 10,
						currentColor: {
							red: 255,
							green: 0,
							blue: 0
						}
					}
				],
				'01': {
					value: 5
				},
				'02': {
					type: 0, // 变色模式1-8
					value: 5
				},
				'03': {
					value: 5
				},
				'04': {
					value: 5
				},
				'05': {
					value: 5
				}
			}
		};
	},
	computed: {
		title() {
			return this.$config.title;
		},
		bgColor() {
			if (this.modelId == '00') {
				const rgbColor = this.deviceData[this.modelId][this.partValue];
				return `rgba(${rgbColor.red},${rgbColor.green},${rgbColor.blue},0.5)`;
			}
			return `rgba(255,255,255,0.5)`;
		}
	},
	created() {
		wx.getStorage({
			key: 'indexPageData',
			success: (res) => {
				if (res.data) {
					let deviceData = {};
					let brightness = {};
					try {
						deviceData = JSON.parse(res.data.deviceData);
						brightness = JSON.parse(res.data.brightness);
					} catch (e) {}

					if (
						deviceData &&
						deviceData[this.modelId] &&
						deviceData[this.modelId].length > 0
					) {
						this.deviceData = deviceData;
					}
					if (brightness && brightness.brightnessType) {
						this.brightness = brightness;
					}
					this.modelId = res.data.modelId;
					this.partValue = res.data.partValue;
				}
			}
		});
	},
	onHide() {
		wx.setStorage({
			key: 'indexPageData',
			data: {
				deviceData: JSON.stringify(this.deviceData),
				brightness: JSON.stringify(this.brightness),
				modelId: this.modelId,
				partValue: this.partValue
			}
		});
	},
	onUnload() {
		wx.setStorage({
			key: 'indexPageData',
			data: {
				deviceData: JSON.stringify(this.deviceData),
				brightness: JSON.stringify(this.brightness),
				modelId: this.modelId,
				partValue: this.partValue
			}
		});
		ecBLE.closeBLEConnection();
		ecBLE.stopBluetoothDevicesDiscovery();
		ecBLE.closeBluetoothAdapter();
	},
	updated() {
		wx.setStorage({
			key: 'indexPageData',
			data: {
				deviceData: JSON.stringify(this.deviceData),
				brightness: JSON.stringify(this.brightness),
				modelId: this.modelId,
				partValue: this.partValue
			}
		});
	},
	onTabItemTap() {},
	methods: {
		onClickLeft() {
			wx.showToast({ title: '点击返回', icon: 'none' });
		},
		sendColorDataFn: debounce(function () {
			if (ecBLE.getDeviceList().status == '1') {
				let senData = '';
				if (this.partValue == 0) {
					const rgbColor =
						this.deviceData[this.modelId][this.partValue].currentColor;
					senData =
						'AT+LCOLOR=' +
						util.colorRGB2Hex(rgbColor.red, rgbColor.green, rgbColor.blue) +
						util.colorRGB2Hex(rgbColor.red, rgbColor.green, rgbColor.blue);
				} else {
					const rgbColor1 = this.deviceData[this.modelId][1].currentColor;
					const rgbColor2 = this.deviceData[this.modelId][2].currentColor;
					senData =
						'AT+LCOLOR=' +
						util.colorRGB2Hex(rgbColor1.red, rgbColor1.green, rgbColor1.blue) +
						util.colorRGB2Hex(rgbColor2.red, rgbColor2.green, rgbColor2.blue);
				}
				senData = senData + '\r\n';
				ecBLE.easySendData(senData, false);
			} else if (ecBLE.getDeviceList().status == '-1') {
				this.showModal();
			} else {
				this.showToast({
					message: '请连接蓝牙设备',
					mask: true
				});
			}
		}, 80),
		/** 设置亮度 **/
		sendBrightnessDataFn: debounce(function (value) {
			if (ecBLE.getDeviceList().status == '1') {
				let senData = '';

				if (this.brightness.brightnessType == '01') {
					let value = this.brightness['01'].value;
					if (value >= 10) {
						value = '0A';
					} else {
						value = '0' + value;
					}
					senData = 'AT+LBRIGHT=' + value + value;
				} else {
					let brightnessValue1 = this.brightness['02'].value;
					let brightnessValue2 = this.brightness['03'].value;
					if (brightnessValue1 >= 10) {
						brightnessValue1 = '0A';
					} else {
						brightnessValue1 = '0' + brightnessValue1;
					}

					if (brightnessValue2 >= 10) {
						brightnessValue2 = '0A';
					} else {
						brightnessValue2 = '0' + brightnessValue2;
					}
					senData = 'AT+LBRIGHT=' + brightnessValue1 + brightnessValue2;
				}
				senData = senData + '\r\n';
				ecBLE.easySendData(senData, false);
			} else if (ecBLE.getDeviceList().status == '-1') {
				this.showModal();
			} else {
				this.showToast({
					message: '请连接蓝牙设备',
					mask: true
				});
			}
		}, 80),
		/** 呼吸模式，循环模式，爆闪模式，音乐律动 **/
		sendLMODEDataFn: debounce(function () {
			console.log(this.modelId + this.deviceData[this.modelId].value);
			if (ecBLE.getDeviceList().status == '1') {
				let senData = '';
				let value = this.deviceData[this.modelId].value;
				if (value >= 10) {
					value = '0A';
				} else {
					value = '0' + value;
				}
				senData = 'AT+LMODE=' + this.modelId + value;
				senData = senData + '\r\n';
				ecBLE.easySendData(senData, false);
			} else if (ecBLE.getDeviceList().status == '-1') {
				this.showModal();
			} else {
				this.showToast({
					message: '请连接蓝牙设备',
					mask: true
				});
			}
		}, 50),
		/** 无极变色 **/
		sendModel02colorsDataFn: debounce(function () {
			let type = parseInt(this.deviceData[this.modelId].type) + 1;
			let value = this.deviceData[this.modelId].value;
			console.log(this.modelId + type + value);
			if (ecBLE.getDeviceList().status == '1') {
				let senData = '';

				if (value >= 10) {
					value = 'A';
				} else {
					value = '0' + value;
				}
				senData = 'AT+LMODE=' + this.modelId + type + value;
				senData = senData + '\r\n';
				ecBLE.easySendData(senData, false);
			} else if (ecBLE.getDeviceList().status == '-1') {
				this.showModal();
			} else {
				this.showToast({
					message: '请连接蓝牙设备',
					mask: true
				});
			}
		}, 80),
		modelChange(id) {
			this.modelId = id;
			if (id == '00') {
				this.sendColorDataFn();
				this.sendBrightnessDataFn();
			} else if (id == '02') {
				this.sendModel02colorsDataFn();
			} else {
				this.sendLMODEDataFn();
			}
		},
		partChange(event) {
			this.partValue = event.detail.index;
		},
		colorsChange(data) {
			console.log(this.deviceData);
			this.deviceData[this.modelId][this.partValue].currentColor = data;
			this.sendColorDataFn(data);
		},
		brightnessValueChange(value) {
			this.brightness[this.brightness.brightnessType].value = value;
			this.sendBrightnessDataFn(value);
		},
		breathingRhythmChange(value) {
			this.deviceData[this.modelId].value = value;
			this.sendLMODEDataFn(value);
		},
		model02colorsChange(value) {
			this.deviceData[this.modelId].type = value;
			this.sendModel02colorsDataFn();
		},
		model02colorsRhythmChange(value) {
			this.deviceData[this.modelId].value = value;
			this.sendModel02colorsDataFn();
		},
		showModal() {
			uni.showModal({
				title: '配对失败',
				content: '未收到蓝牙响应信息，请尝试重新连接蓝牙',
				showCancel: false,
				complete(res) {
					uni.switchTab({
						url: '/pages/bluetooth/index'
					});
				}
			});
		},
		showToast(params) {
			this.$refs.uToast.show({
				...params,
				complete() {
					uni.switchTab({
						url: '/pages/bluetooth/index'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scope>
.top_bg_img {
	height: 280rpx;
	box-sizing: border-box;
	margin: 0 40rpx;
	border-radius: 16rpx;
	overflow: hidden;
	border: 2px solid #fff;
}

.shadow_box {
	margin: 20rpx 40rpx 0;
	box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.1);
	background: #313234;
	border-radius: 12rpx;
	line-height: 1em;
	overflow: hidden;
	padding: 10rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;

	.shadow_box_list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		overflow: hidden;
		margin: 0 auto;

		.list_item {
			border-left: 2rpx solid #464849;
			border-bottom: 2rpx solid #464849;
		}

		.list_item:nth-child(1),
		.list_item:nth-child(4) {
			border-left: 2rpx solid rgba(0, 0, 0, 0);
		}

		.list_item:nth-child(4),
		.list_item:nth-child(5),
		.list_item:nth-child(6) {
			border-bottom: 2rpx solid rgba(0, 0, 0, 0);
			padding-bottom: 25rpx;
		}

		.list_item:nth-child(1),
		.list_item:nth-child(2),
		.list_item:nth-child(3) {
			padding-top: 25rpx;
		}

		.list_item {
			width: 32%;
			background: #313234;
			text-align: center;
			padding: 30rpx 0;
			flex-grow: 1;
			transition: all 0.3s;

			&.active {
				color: #07c160;
				font-weight: bold;
			}
		}
	}
}

.parts_tabs_wrap {
	display: flex;
	justify-content: center;
	box-sizing: border-box;
	margin-top: 40rpx;
	padding: 0 40rpx;
	::v-deep van-tabs {
		width: 100%;
		.van-tabs__scroll--card {
			width: 100%;
			border: none !important;
			background-color: #313234;
			padding: 0 !important;
			margin: 0 !important;
			.van-tab {
				color: #fff !important;
				border: none !important;
				border-radius: 8rpx;
			}
		}
	}
}

.brightness_control {
	padding: 40rpx 0;

	.brightness_control_title {
		display: flex;
		align-items: center;
	}

	.brightness_control_item {
		display: flex;
		align-items: center;

		.u-slider {
			flex-grow: 1;
		}
	}
}

.brightness_control2 {
	padding: 30rpx 40rpx;
	background: #313234;
	border-radius: 12rpx;
	margin: 40rpx 40rpx 0;

	.brightness_control_title {
		margin-bottom: 40rpx;
		font-size: 30rpx;
		font-weight: bold;
		border-left: 3px solid #07c160;
		line-height: 1em;
	}

	.brightness_control_item {
		display: flex;
		align-items: center;

		.u-slider {
			flex-grow: 1;
		}
	}

	.u-radio-group {
		padding-top: 20rpx;
		margin-bottom: 50rpx;
		display: flex;

		.u-radio {
			margin-right: 50rpx;

			.u-radio__text {
				font-size: 30rpx !important;
				color: #fff !important;
			}
		}
	}
}

.model_colors_box {
	padding: 40rpx 40rpx 0;

	.u-radio-group {
		justify-content: center;
		flex-wrap: wrap;
		border-radius: 12rpx;
		overflow: hidden;
		background: #313234;
		padding: 10rpx;

		.u-radio {
			width: 49%;
			flex-grow: 1;
			box-sizing: border-box;
			background: #313234;
			border-right: 2rpx solid #464849;

			border-bottom: 2rpx solid #464849;

			::v-deep .u-radio__icon-wrap {
				width: 30rpx !important;
				height: 30rpx !important;
				border: none !important;
				margin-left: 40rpx;
				overflow: hidden;

				.uicon-checkbox-mark {
					width: 14rpx !important;
					height: 14rpx !important;
					background: #fff !important;
					border-radius: 100%;
					overflow: hidden;
				}
			}

			.u-radio__text {
				font-size: 30rpx !important;
				color: #fff !important;
				display: inline-block;
				width: 100%;
				padding: 25rpx 30rpx 25rpx 15rpx;
			}
		}

		.u-radio:nth-child(1) {
			.u-radio__text {
				color: #ff0045 !important;
			}
		}

		.u-radio:nth-child(2) {
			border-right: none;

			.u-radio__text {
				color: #ff6100 !important;
			}
		}

		.u-radio:nth-child(3) {
			.u-radio__text {
				color: #009aff !important;
			}
		}

		.u-radio:nth-child(4) {
			border-right: none;

			.u-radio__text {
				color: #ffc300 !important;
			}
		}

		.u-radio:nth-child(5) {
			.u-radio__text {
				color: #62ffbd !important;
			}
		}

		.u-radio:nth-child(6) {
			border-right: none;

			.u-radio__text {
				color: #5ee1ff !important;
			}
		}

		.u-radio:nth-child(7) {
			border-bottom: none;

			.u-radio__text {
				color: #00da68 !important;
			}
		}

		.u-radio:nth-child(8) {
			border-right: none;
			border-bottom: none;

			.u-radio__text {
				color: #ff00b7 !important;
			}
		}
	}
}

.uicon-checkbox-mark {
	width: 18rpx !important;
	height: 18rpx !important;
	background: #fff !important;
	border-radius: 100%;
	overflow: hidden;
}
</style>
