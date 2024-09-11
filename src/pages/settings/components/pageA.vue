<template>
	<view v-if="setZoneData" class="page_module_wrap">
		<view class="parts_tabs_wrap">
			<view
				v-for="(item, index) in zoneDataA"
				:key="index"
				class="tab_item"
				:class="{ is_active: zoneIndex === index }"
				@click="zoneIndexChange(index)"
			>
				<text>分区{{ index + 1 }}</text>
				<text>ZONE{{ index + 1 }}</text>
			</view>
		</view>

		<view class="modes_list">
			<view
				v-for="(item, index) in zoneModesA"
				:key="index"
				:class="['list_item', currentModel == item.code ? 'active' : '']"
				@click="modelChange(item.code)"
				>{{ item.name }}</view
			>
		</view>

		<view v-if="currentModel == '00' && setZoneData" class="mode_color_wrap">
			<color-picker
				:modelValue="_getColorRgb(setZoneData.value4)"
				@change="colorChange"
			/>
		</view>

		<!-- 天气模式-->
		<view v-if="['03'].includes(currentModel)" class="mode_color_wrap">
			<WeatherTool :weather="setZoneData.weather" @change="weatherChange" />
		</view>

		<!-- 爆闪模式-->
		<view v-if="['05'].includes(currentModel)" class="mode_color_wrap">
			<view class="form_item">
				<text class="form_item_label">爆照节奏</text>
				<view class="form_item_content">
					<text class="slider_left">慢</text>

					<van-slider-custom
						v-model="setZoneData.value5"
						:max="100"
						:step="10"
						use-button-slot
						bar-height="22px"
						active-color="#722cb2"
						custom-class="custom_slider"
						@drag="onSliderDrag($event, 'value5')"
						@change="flashRhythmChange($event, 'value5')"
					>
						<view
							class="custom_slider_button"
							:class="{
								is_start: setZoneData.value5 <= 10,
								is_end: setZoneData.value5 >= 90
							}"
							slot="button"
							:style="{
								background: '#19c5c9'
							}"
						>
							<view
								class="custom_slider_button_inner"
								:style="{
									transform: `translate(-${setZoneData.value5}%,-50%)`
								}"
							>
								<view class="slider_value">
									{{ setZoneData.value5 }} <text>%</text>
								</view>
							</view>
						</view>
					</van-slider-custom>
					<text class="slider_right">快</text>
				</view>
			</view>
		</view>

		<!-- 其他模式 -->
		<view
			v-if="['01', '02', '04'].includes(currentModel)"
			class="mode_list_wrap"
		>
			<van-radio-group
				v-model="setZoneData.mode2"
				placement="row"
				@change="model2Change"
				activeColor="#07C160"
				inactiveColor="#464849"
			>
				<van-radio
					v-for="(item, index) in zoneMode.options"
					:key="index"
					:name="index"
					use-icon-slot
				>
					<image
						slot="icon"
						mode="aspectFit"
						:src="setZoneData.mode2 === item.code ? radioIcon2 : radioIcon1"
					/>
					<view class="radio_label">{{ item.name }}</view>
				</van-radio>
			</van-radio-group>
		</view>

		<view class="mode_form_wrap">
			<view class="form_item">
				<text class="form_item_label">灯珠个数</text>
				<view class="form_item_content">
					<text class="slider_left">0</text>
					<van-slider
						:value="setZoneData.value1"
						:max="100"
						use-button-slot
						bar-height="8px"
						active-color="#19c5c9"
						inactive-color="rgba(0, 0, 0, 0.2)"
						custom-class="custom_slider"
						@drag="onSliderDrag($event, 'value1')"
						@change="lightNumChange"
					>
						<view
							class="custom_slider_button"
							slot="button"
							:style="{
								background: '#19c5c9'
							}"
						></view>
					</van-slider>
					<text class="slider_right">{{ setZoneData.value1 }}</text>
				</view>
			</view>
			<view class="form_item">
				<text class="form_item_label">亮度</text>
				<view class="form_item_content">
					<text class="slider_left">0</text>
					<van-slider
						:value="setZoneData.value2"
						:max="10"
						use-button-slot
						bar-height="8px"
						active-color="#19c5c9"
						inactive-color="rgba(0, 0, 0, 0.2)"
						custom-class="custom_slider"
						@drag="onSliderDrag($event, 'value2')"
						@change="lightChange"
					>
						<view
							class="custom_slider_button"
							slot="button"
							:style="{
								background: '#19c5c9'
							}"
						></view>
					</van-slider>
					<text class="slider_right">{{ setZoneData.value2 }}</text>
				</view>
			</view>
			<view class="form_item">
				<text class="form_item_label">呼吸节奏</text>
				<view class="form_item_content">
					<text class="slider_left">慢</text>
					<van-slider
						:value="setZoneData.value3"
						:max="10"
						use-button-slot
						bar-height="8px"
						active-color="#19c5c9"
						inactive-color="rgba(0, 0, 0, 0.2)"
						custom-class="custom_slider"
						@drag="onSliderDrag($event, 'value3')"
						@change="rhythmChange"
					>
						<view
							class="custom_slider_button"
							slot="button"
							:style="{
								background: '#19c5c9'
							}"
						></view>
					</van-slider>
					<text class="slider_right">快</text>
				</view>
			</view>
			<view class="form_item form_item_signal">
				<text class="form_item_label">信号关联</text>
				<view class="form_item_content">
					<view
						v-for="(mode, index2) in setZoneData.signal"
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
							@change="onSignalChange($event, index2)"
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
	</view>
</template>

<script>
import WeatherTool from '@/components/Weather/index.vue';
import ColorPicker from '@/components/ColorPicker/index.vue';
import util from '@/components/ColorPicker/util.js';
import ecBLE from '@/utils/ecBLE.js';
import radioIcon1 from '@/static/images/radio_icon_1.png';
import radioIcon2 from '@/static/images/radio_icon_2.png';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';

import { debounce } from '@/utils/lodash.min.js';
import { numberToHex } from '@/utils/format';

export default {
	options: {
		styleIsolation: 'shared'
	},
	components: {
		WeatherTool,
		ColorPicker
	},
	data() {
		return {
			radioIcon1,
			radioIcon2,
			zoneDataA: [],
			zoneIndex: 0,
			setZoneData: {},
			currentModel: '00'
		};
	},
	computed: {
		connected() {
			return this.getBleData.connected;
		},
		getBleData() {
			return this.$store.getters.bleData;
		},
		zoneModesA() {
			return this.$store.getters.zoneModesA;
		},
		zoneKeysDataA() {
			return this.$store.getters.zoneKeysDataA;
		},
		zoneMode() {
			const target = this.zoneModesA.find(
				(item) => item.code == this.currentModel
			);
			return { ...target, options: target?.options || [] };
		}
	},
	mounted() {
		this.zoneDataA = this.$store.getters.zoneDataA;
		this.setZoneData = this.zoneDataA[this.zoneIndex];
	},
	methods: {
		// 分区切换
		zoneIndexChange(index) {
			uni.vibrateShort();
			this.zoneIndex = index;
			this.currentModel = this.zoneDataA[index].mode;
			this.setZoneData = this.zoneDataA[index];
		},
		// 模式切换
		modelChange(code) {
			uni.vibrateShort();
			const code1 = code;

			this.currentModel = code1;
			this.setZoneData.mode = code1;
			if (['01', '02', '04'].includes(code1)) {
				this.setZoneData.mode2 = '00';
			}

			this._sendModelMode();
		},
		onSignalChange(event, index) {
			uni.vibrateShort();

			// 发送设置
			const data2 = event.detail;
			const data0 = this.setZoneData.code;
			const data1 = this.setZoneData.signal[index].code;

			const signal = this.setZoneData.signal;
			signal[index].value = data2;

			this.setZoneData = {
				...this.setZoneData,
				signal: signal
			};

			const msg = ['87', '03', data0, data1, data2]
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');

			this._checkBleState(() => {
				this._easySendData(msg, true, {
					data0,
					data1,
					data2
				});
			});
		},
		onSliderDrag(event, code) {
			uni.vibrateShort();
			const value = event.detail.value;

			this.setZoneData = {
				...this.setZoneData,
				[code]: value
			};
		},
		// 模式设置
		model2Change(event) {
			uni.vibrateShort();
			this.setZoneData.mode2 = event.detail;
			this._sendModelMode();
		},
		// 单色模式
		colorChange(data) {
			uni.vibrateShort();
			const { red, green, blue } = data;
			this.setZoneData.value4 = `${red},${green},${blue}`;
			this._sendModelColor();
		},
		// 天气模式
		weatherChange(data) {
			uni.vibrateShort();
			this.setZoneData.weather = data;
			this._sendModelWeather();
		},
		// 爆闪模式
		flashRhythmChange(event, code) {
			uni.vibrateShort();
			const value = event.detail;

			this.setZoneData = {
				...this.setZoneData,
				[code]: value
			};

			this._sendModelRhythm();
		},
		// 灯珠个数
		lightNumChange(event) {
			uni.vibrateShort();
			this.setZoneData.value1 = event.detail;
			this._sendModelParams();
		},
		// 亮度
		lightChange(event) {
			uni.vibrateShort();
			this.setZoneData.value2 = event.detail;
			this._sendModelParams();
		},
		// 呼吸节奏
		rhythmChange(event) {
			uni.vibrateShort();
			this.setZoneData.value3 = event.detail;
			this._sendModelParams();
		},
		// 发送颜色设置
		_sendModelColor() {
			const data1 = '01'; // 0x00：参数设置 0x01：模式设置
			const { code: data0, mode: data2, value4 } = this.setZoneData;

			const [red, green, blue] = value4.split(',');

			const data3 = numberToHex(red);
			const data4 = numberToHex(green);
			const data5 = numberToHex(blue);

			const msg = ['86', '06', data0, data1, data2, data3, data4, data5]
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');

			this._checkBleState(() => {
				this._easySendData(msg, true, {
					data0,
					data1,
					data2,
					data3,
					data4,
					data5
				});
			});
		},
		// 发送模式设置
		_sendModelParams() {
			const data1 = '00'; // 0x00：参数设置 0x01：模式设置
			const { code: data0, value1, value2, value3 } = this.setZoneData;

			const data2 = numberToHex(value1);
			const data3 = numberToHex(value2);
			const data4 = numberToHex(value3);

			const msg = ['86', '06', data0, data1, data2, data3, data4, 'ff']
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');

			this._checkBleState(() => {
				this._easySendData(msg, true, { data0, data1, data2, data3, data4 });
			});
		},
		// 发送模式设置
		_sendModelMode() {
			const data1 = '01'; // 0x00：参数设置 0x01：模式设置
			const { code: data0, mode: data2, mode2: data3 } = this.setZoneData;

			const msg = ['86', '06', data0, data1, data2, data3, 'ff', 'ff']
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');
			this._checkBleState(() => {
				this._easySendData(msg, true, { data0, data1, data2, data3 });
			});
		},
		// 发送爆闪模式设置
		_sendModelRhythm() {
			const data1 = '01'; // 0x00：参数设置 0x01：模式设置
			const { code: data0, mode: data2, value5 } = this.setZoneData;

			const data3 = numberToHex(value5);

			const msg = ['86', '06', data0, data1, data2, data3, 'ff', 'ff']
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');
			this._checkBleState(() => {
				this._easySendData(msg, true, { data0, data1, data2, data3 });
			});
		},
		// 发送天气模式设置
		_sendModelWeather() {
			const data1 = '01'; // 0x00：参数设置 0x01：模式设置
			const { code: data0, mode: data2, weather } = this.setZoneData;

			const data3 = numberToHex(weather.humidity);
			const data4 = numberToHex(weather.temperature);

			const msg = ['86', '06', data0, data1, data2, data3, data4, 'ff']
				.map((item) => `${item}`.padStart(2, '0'))
				.join('');
			this._checkBleState(() => {
				this._easySendData(msg, true, { data0, data1, data2, data3, data4 });
			});
		},
		// 统一发送设置命令
		_easySendData(msg, isHex = true, extraData) {
			console.log('发送设置命令========', msg);

			ecBLE.easySendData(msg, isHex, extraData);

			uni.$on('setCallback', (res) => {
				// 监听设置回调
				console.log('setCallback======', res);
			});
		},
		_checkBleState: debounce(function (cb, fail) {
			// 发送设置
			const { connected, receiveDataValue, ecUserPasswordPassed } =
				this.getBleData;

			if (!connected) {
				fail && typeof fail === 'function' && fail();
				return Toast('蓝牙未连接');
			}
			if (!receiveDataValue) {
				fail && typeof fail === 'function' && fail();
				return Toast('蓝牙未响应');
			}

			if (ecUserPasswordPassed !== '1') {
				fail && typeof fail === 'function' && fail();
				return uni.$emit('checkPassword');
			}

			cb && typeof cb === 'function' && cb();
		}, 300),
		_getColorRgb(color) {
			const colorArr = (color || '').split(',');
			return {
				red: colorArr?.[0] || 255,
				green: colorArr?.[1] || 0,
				blue: colorArr?.[2] || 0
			};
		},
		_getKeysList(keys) {
			const list = [];
			Object.keys(this.zoneKeysDataA).forEach((key) => {
				if ((keys || []).includes(key)) {
					list.push({ label: this.zoneKeysDataA[key], value: key });
				}
			});

			return list;
		}
	}
};
</script>

<style lang="scss" scope>
.page_module_wrap {
	color: #fff;
	font-size: $uni-font-size-lm;
	> view + view {
		margin-top: 15rpx;
	}
}
.parts_tabs_wrap {
	display: flex;
	justify-content: center;
	align-items: center;
	.tab_item {
		width: 30%;
		padding: 15rpx 0;
		flex-grow: 1;
		background: #220f37;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 200px;
		border: 1px solid #722cb2;
		&:active,
		&.is_active {
			background: #490d6f;
		}

		text:first-child {
			color: #fff;
			font-size: $uni-font-size-lm;
			font-weight: bold;
		}
		text:last-child {
			color: #7c0eac;
			font-size: $uni-font-size-mm;
		}
	}
}

.modes_list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;

	.list_item {
		width: 30%;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15rpx 0;
		margin: 5rpx;
		color: #fff;
		background: #220f37;
		border-radius: 200px;
		border: 1px solid #722cb2;
		&.active {
			background: #490d6f;
		}
	}
}

.mode_color_wrap {
	background: rgba(#1e2741, 0.5);
	border-radius: 24rpx;
	padding: 30rpx 30rpx;
	margin: 0 5rpx;

	.form_item {
		.form_item_label {
			font-size: $uni-font-size-base;
		}
		.form_item_content {
			flex-grow: 1;
			padding: 40rpx 0 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-sm;

			::v-deep van-slider-custom {
				flex-grow: 1;
				.van-slider {
					border-radius: 10rpx;
					background: linear-gradient(to left, #8257f8, #29b7d5);
					position: relative;
					.slider_interval {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 0;
						font-size: 20rpx;
						display: flex;
						align-items: center;
						justify-content: space-around;
						text {
							width: 10%;
							flex-grow: 1;
							text-align: center;
						}
					}
				}
				.van-slider__bar {
					//border-radius: 8rpx 0 0 8rpx;
					//background: linear-gradient(to left, #8257f8, #29b7d5);
					background: rgba(#fff, 0) !important;
				}
			}
			.slider_left {
				margin-right: 10rpx;
			}
			.slider_right {
				margin-left: 10rpx;
			}
			.custom_slider_button {
				width: 0 !important;
				height: 0 !important;
				position: relative;
				.custom_slider_button_inner {
					position: absolute;
					top: -1px;
					left: 50%;
					z-index: 3;
					width: 35px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					line-height: 25px;
					text-align: center;
					color: #333333;
					font-size: 20rpx;
					font-weight: 700;
					background: #fff !important;
					border-radius: 8rpx;
					box-sizing: border-box;
					box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
					border-bottom: 2px solid #fff;
					overflow: hidden;
					.slider_value {
						padding-left: 8rpx;
						text {
							font-size: 16rpx;
						}
					}

					&:before {
						content: '';
						width: 100%;
						height: 7px;
						background: linear-gradient(#8257f8, #29b7d5);
					}

					&:after {
						content: '|||||';
						width: 100%;
						height: 5px;
						line-height: 6px;
						letter-spacing: 0;
						color: #bbb;
						font-size: 22rpx;
						background: #fff;
						overflow: hidden;
						box-sizing: border-box;
					}
				}
			}
		}
	}
}

.mode_list_wrap {
	width: 100%;
	border-radius: 24rpx;
	::v-deep van-radio-group {
		width: 100%;
		van-radio {
			width: 50%;
		}
	}
	::v-deep .van-radio-group {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.van-radio {
			flex-grow: 1;
			width: 98%;
			padding: 15rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(#220f37, 0.5);
			border: 1px solid rgba(#722cb2, 0.5);
			border-radius: 16rpx;
			margin: 5rpx;

			image {
				width: 30rpx;
				height: 30rpx;
			}

			.van-radio__label {
				width: 5em;
				line-height: 1em;
				font-size: $uni-font-size-lm;
				color: $uni-text-color;
				padding-left: 15rpx;
			}

			.van-radio__icon-wrap {
				display: flex;
				align-items: center;
			}
		}
	}
}

.mode_form_wrap {
	padding: 20rpx;
	background: rgba(#722cb2, 0.1);
	border-radius: 24rpx;
	.form_item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		.form_item_label {
			width: 56px;
		}
		.form_item_content {
			flex-grow: 1;
			background: rgba(#fff, 0.05);
			border-radius: 12rpx;
			padding: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-sm;
			::v-deep van-slider {
				flex-grow: 1;

				.van-slider {
					background: rgba(#29b7d5, 0.4);
				}
				.van-slider__bar {
					background: linear-gradient(to right, #8257f8, #29b7d5);
				}
			}
			.slider_left {
				width: 1em;
				margin-right: 15px;
			}
			.slider_right {
				width: 1.8em;
				margin-left: 15px;
				margin-right: -5rpx;
			}
			.custom_slider_button {
				width: 40rpx;
				height: 40rpx;
				background: #29b7d5 !important;
				border-radius: 100%;
				border: 10rpx solid #fff;
				box-shadow: inset 0 0 5rpx rgba(#000, 0.5);
			}
		}
	}
}

.form_item_signal {
	align-items: flex-start !important;
	.form_item_label {
		flex-shrink: 0;
	}
	.form_item_content {
		flex-direction: column;
		.state_item {
			width: 100%;
			font-size: $uni-font-size-sm;

			& + .state_item {
				border-top: 1rpx solid rgba(0, 0, 0, 0.3);
				margin-top: 10px;
				padding-top: 6px;
			}
			.state_item_label {
				flex-shrink: 0;
			}
			> view {
				display: flex;
				align-items: center;
			}
			image {
				width: 42rpx;
				height: 42rpx;
				object-fit: contain;
				margin-right: 5rpx;
			}

			::v-deep .van-radio-group--horizontal {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding-left: 90rpx;
				margin-right: -10px;
			}
			::v-deep van-radio {
				width: 50%;
				margin-top: 10px;
				transform: scale(1.05);
				.van-radio {
					margin-right: 0;
					display: flex;
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
					object-fit: contain;
					margin-left: 0;
				}
				.radio_label {
					font-size: 22rpx;
					color: $uni-text-color;
					text-align: center;
					margin-left: 5px;
				}
			}
		}
	}
}
</style>
