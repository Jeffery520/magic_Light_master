<template>
	<view class="ble_status_wrap">
		<view class="ble_status_top" :class="{ is_connected: connected }">
			<view>
				<text v-if="connected && showState" class="ble_status_left"
					>运行状态：{{ !connected ? '未连接' : '良好' }}</text
				>
			</view>

			<view class="ble_status_right" @click="handleOpen">
				<image src="~@/static/images/ble_state.png" mode="aspectFit" />
				<text class="text-overflow1">{{
					connected || currentBle ? currentBle : '蓝牙连接'
				}}</text>
			</view>
		</view>
		<van-popup :show="showPopup" @close="handleClose">
			<view class="ble_list_popup">
				<view class="ble_list">
					<view
						v-for="(item, index) in deviceList"
						:key="item.name"
						class="list_item"
						@click="handleConnect(item, index, true)"
					>
						<view class="list_item_left">
							<image
								v-if="!item.connected"
								src="~@/static/images/ble.png"
								class="list_item-img"
							></image>
							<image
								v-else
								src="~@/static/images/ble_state.png"
								class="list_item-img"
							></image>
							<text class="list_item-name van-ellipsis">{{ item.name }}</text>
						</view>

						<view class="list_item_right">
							<text v-if="item.connected">已连接</text>
							<van-loading
								v-if="
									!item.connected && connectLoading && index === currentIndex
								"
								type="spinner"
								color="#8f98b7"
								size="16px"
							/>
						</view>
					</view>
					<view v-if="loading && !deviceList.length" class="search_loading">
						<van-loading type="spinner" color="#8f98b7" size="24px" />
						<text>搜索中</text>
					</view>

					<view v-if="!loading && deviceList.length == 0" class="ble_tips">
						蓝牙为空，请点击搜索
					</view>
				</view>
				<view v-if="!loading && deviceList.length" class="ble_list_tip"
					>请点击蓝牙进行连接</view
				>
				<view
					v-if="loading"
					class="contact_button"
					@click="handleStopDiscovery(true)"
				>
					<view class="contact_button_inner">
						停止搜索 <van-count-down :time="loadingTime" format="ss" /> s
					</view>
				</view>
				<view v-else class="contact_button" plain @click="handleDiscovery">
					<view class="contact_button_inner">
						{{ deviceList.length == 0 ? '搜索蓝牙' : '重新搜索' }}
					</view>
				</view>
			</view>
		</van-popup>
		<!--    密码输入弹窗-->
		<van-popup :show="showPwPopup" :close-on-click-overlay="false">
			<view class="password_popup">
				<view class="password_title">
					<text v-if="passwordType === '1'"
						>您的密码为初始密码，建议您修改</text
					>
					<text v-else>请输入蓝牙密码</text>
				</view>

				<van-field
					v-model="password"
					type="number"
					:maxlength="4"
					placeholder="请输入4位数字密码"
					placeholder-style="color:rgba(143, 152, 183, 0.3);font-size:14px;"
					class="password_input"
					@input="onPwChange"
				/>
				<view class="password_footer">
					<view
						class="contact_button contact_button_info"
						plain
						@click="handlePwClose"
					>
						{{ passwordType === '1' ? '取消修改' : '取消' }}
					</view>
					<view class="contact_button" plain @click="handleSendPw">
						<view class="contact_button_inner">
							{{ passwordType === '1' ? '确认修改' : '确认' }}
						</view>
					</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
import ecBLE from '@/utils/ecBLE';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';
import { debounce, throttle, uniqBy } from '@/utils/lodash.min';
import { hexStrToArr, hexToAscii, hexToNumber } from '@/utils/format';
import util from '@/components/ColorPicker/util.js';

let Timer = null;

export default {
	options: {
		styleIsolation: 'shared'
	},
	props: {
		mustConnect: {
			type: Boolean,
			default: true
		},
		showState: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			loading: false,
			showPopup: false,
			showPwPopup: false,
			showPwPopup2: false,
			connectLoading: false,
			isSendPassword: false,
			loadingTime: 1000 * 30,
			bleNames: ['GM'],
			discoveryTime: new Date().getTime(),
			currentIndex: -1,
			passwordType: '0',
			password: '',
			setBleData: {},
			deviceList: [],
			myDeviceList: []
		};
	},
	computed: {
		getBleData() {
			return this.$store.getters.bleData;
		},
		connected() {
			return this.$store.getters.bleData?.connected;
		},
		needChangePw() {
			return this.setBleData.ecUserPassword === '0000';
		},
		currentBle() {
			const target = (this.$store.getters.bleData?.deviceList || []).find(
				(item) => item?.connected
			);
			return target?.name || '蓝牙连接';
		}
	},
	watch: {
		connected(val) {
			if (!val) {
				clearInterval(Timer);
				this.showPwPopup = false;
				Toast.fail('蓝牙已断开');
			}
		},
		'getBleData.deviceList': {
			handler(val) {
				this.deviceList = val;
			},
			deep: true
		},
		myDeviceList: {
			handler(val) {
				this.$store.dispatch(
					'setMyBleList',
					val.filter((a) => a?.deviceId)
				);
			},
			deep: true
		},
		setBleData: {
			handler(val) {
				this.deviceList = val.deviceList;
				this.$store.dispatch('setBleData', val);
			},
			deep: true
		},
		bleData: {
			handler(val) {
				if (val.ecUserPasswordPassed === '1') {
					this.showPwPopup = false;
				}
			},
			deep: true
		}
	},
	mounted() {
		Toast.setDefaultOptions({
			duration: 1800
		});

		if (!this.mustConnect) {
			return;
		}

		this.iniBle();

		uni.$on('onShow', () => {
			this.iniBle();
		});

		uni.$on('checkPassword', () => {
			if (!this.getBleData.connected) {
				Toast('请连接蓝牙');
				return;
			}

			if (!this.getBleData?.ecUserPassword) {
				this._checkPassword();
			}

			if (this.getBleData?.ecUserPasswordPassed !== '1') {
				this.showPopup = false;
				this.showPwPopup = true;
				return;
			}
		});

		uni.$on('onSendMsgFail', ({ str, hexArr }) => {
			this._checkMessageFail(str, hexArr);
		});

		uni.$on('receiveMsg', ({ aHexStr, qHexArr, receiveDataValue }) => {
			this.setBleData.receiveDataValue = receiveDataValue;
			this._checkMessage(aHexStr, qHexArr);
		});
	},
	beforeDestroy() {
		uni.$off('onShow');
		uni.$off('checkPassword');
		uni.$off('onSendMsgFail');
		uni.$off('receiveMsg');
		uni.$off('msgCallback');
		uni.$off('statusChange');
		this.handleStopDiscovery();
	},
	methods: {
		iniBle() {
			this.setBleData = this.getBleData;
			this.setBleData.deviceList = uniqBy(
				this.setBleData.deviceList,
				'deviceId'
			);

			this.myDeviceList = this.$store.getters.myBleList.map((item) => {
				item.connected = false;
				return item;
			});

			ecBLE.setBleData(this.setBleData);

			this._keepBleHear(this.setBleData.connected);

			setTimeout(() => {
				ecBLE.checkBleConnected((res) => {
					const { deviceList, connectedDeviceList } = res;
					const connected = connectedDeviceList?.length > 0;

					this.setBleData.deviceList = uniqBy(deviceList || [], 'deviceId');
					this.setBleData.connected = connected;

					if (!connected) {
						this.handleDiscovery();
					}
				});

				// 蓝牙事件监听初始化
				ecBLE.onBLEConnectionStateChange((res) => {
					this._onConnectStateChange(res);
				});
			}, 60);
		},
		handleOpen() {
			uni.vibrateShort();
			this.showPopup = true;
		},
		handleClose() {
			uni.vibrateShort();
			this.showPopup = false;
			this.handleStopDiscovery();
		},
		onPwChange(event) {
			this.password = event.detail ? event.detail.trim().substring(0, 4) : '';
		},
		handlePwClose() {
			uni.vibrateShort();
			if (this.passwordType === '1') {
				this.passwordType = '0';
				this.setBleData.ecUserPasswordPassed = '1';
			}
			this.password = '';
			this.showPwPopup = false;
		},
		handleSendPw() {
			uni.vibrateShort();

			if (this.password?.length < 4) {
				return Toast('密码最少为4位数');
			}

			if (!this.getBleData.connected) {
				this.showPwPopup = false;
				return Toast('蓝牙已断开');
			}

			if (this.passwordType === '0') {
				this.setBleData.ecUserPasswordPassed =
					this.password.trim() === this.setBleData.ecUserPassword ? '1' : '0';
				if (this.setBleData.ecUserPasswordPassed === '1') {
					if (this.needChangePw) {
						this.passwordType = '1';
					} else {
						this.showPwPopup = false;
					}
					Toast.success('密码校验成功');
				} else {
					Toast.fail('密码错误');
				}
			} else {
				this._changePassword(this.password.trim());
			}
		},
		handleDiscovery: debounce(function (click = false) {
			if (click) {
				uni.vibrateShort();
			}
			this.handleStopDiscovery();
			let timers = 0;
			this.loading = true;
			this.discoveryTime = new Date().getTime();
			this._startBleDiscovery();

			Timer = setInterval(() => {
				timers++;
				if (new Date().getTime() - this.discoveryTime > this.loadingTime) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.loading = false;
					clearInterval(Timer);
				}
				if (timers == 10 && this.getBleData.deviceList.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this._startBleDiscovery();
				}
				if (timers == 20 && this.getBleData.deviceList.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this._startBleDiscovery();
				}
				if (timers == 30 && this.getBleData.deviceList.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this._startBleDiscovery();
				}
				if (timers == 40 && this.getBleData.deviceList.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this._startBleDiscovery();
				}
				if (timers == 50 && this.getBleData.deviceList.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this._startBleDiscovery();
				}
			}, 500);
		}),

		handleStopDiscovery(click = false) {
			if (click) {
				uni.vibrateShort();
			}
			this.loading = false;
			clearInterval(Timer);
			ecBLE.stopBluetoothDevicesDiscovery();
		},

		handleConnect: throttle(async function (item, index, click = false) {
			if (click) {
				uni.vibrateShort();
			}
			this.handleStopDiscovery();

			if (item.connected) {
				await ecBLE.closeBLEConnection();
				return;
			}

			if (!item.connected) {
				this._createConnect(item, index);
			}
			this.currentIndex = index;
		}),

		_changePassword(password) {
			this.isSendPassword = true;

			const data0 = '01';
			const [data1, data2, data3, data4] = password
				.split('')
				.map((s) => '0' + s);

			const pwStr = `8305${data0}${data1}${data2}${data3}${data4}`;

			setTimeout(() => {
				ecBLE.easySendData(pwStr, true);
			}, 100);

			setTimeout(() => {
				ecBLE.easySendData(pwStr, true);
			}, 1000);
		},

		_onConnectStateChange: debounce(function (res) {
			console.log('=========蓝牙状态改变=======', res);

			const { deviceId, connected } = res;

			// 存储蓝牙数据
			this.setBleData = {
				...ecBLE.getBleData(), // 蓝牙连接数据
				...this.getBleData // 全局存储数据
			};
			this.setBleData.connected = connected;
			this.setBleData.deviceList = this.setBleData.deviceList.map((item) => {
				if (item?.deviceId === deviceId) {
					item.connected = connected;
				}
				return item;
			});

			if (this.connectLoading) {
				// 处理连接状态
				this.connectLoading = false;

				if (!connected) {
					Toast.fail('蓝牙连接失败');
				} else {
					Toast.success('蓝牙连接成功');
				}
			}

			if (connected) {
				this.showPopup = false;
				this.setBleData.receiveDataValue = '';
				this.myDeviceList = uniqBy([res, ...this.myDeviceList], 'deviceId');
			}

			this._keepBleHear(connected);
			this._checkPassword(connected);

			this.$emit('statusChange', !!connected);
		}, 100),

		_keepBleHear: debounce(function (connect = false) {
			if (!connect) {
				return ecBLE.easySendHeart('', true);
			}

			const [data0, data1] = ['FF', 'FF'];

			ecBLE.easySendHeart(`8402${data0}${data1}`, true);
		}, 100),

		_checkPassword(connect = false) {
			if (!connect) {
				return;
			}

			_checkFn();

			setTimeout(() => {
				_checkFn();
			}, 1000);

			function _checkFn() {
				const [data0, data1, data2, data3, data4] = [
					'02',
					'FF',
					'FF',
					'FF',
					'FF'
				];

				ecBLE.easySendData(
					`8305${data0}${data1}${data2}${data3}${data4}`,
					true
				);
			}
		},

		async _createConnect(item, index) {
			let res = await this._connectFn(item, index);
			if (!res?.connected) {
				res = await this._connectFn(item, index);
			}
			console.log('=======连接反馈========', res);
		},
		_connectFn: throttle(function (item) {
			if (!item.deviceId) return;
			return new Promise((resolve) => {
				this.connectLoading = true;
				ecBLE.easyConnect(item, () => {
					resolve(item);
				});
			});
		}),
		_checkMessageFail(aHexStr, aHexArr) {
			console.log('发送超时 >>>>>>>>>>:', aHexArr.join(' '));

			const setCodes = ['2E16', '2E17', '2E13']; // 氛围灯设置、关联设置、密码设置
			const isSetting = setCodes.some((code) => aHexStr.indexOf(code) === 0);

			if (isSetting) {
				uni.$emit('msgCallback', { status: 0, aHexArr });
			}
		},
		_checkSetState(aHexStr, aHexArr, qHexArr) {
			console.log('>>>>>>>>>> 收到消息:', aHexArr.join(' '));

			const setCodes = ['2E16', '2E17', '2E13']; // 氛围灯设置、关联设置、密码设置
			const isSetting = setCodes.some((code) => aHexStr.indexOf(code) === 0);
			const isSuccess = aHexArr.join('') === (qHexArr || []).join('');

			if (isSetting && isSuccess) {
				uni.$emit('msgCallback', { status: 1, aHexArr });
			}
		},
		_checkMessage(aHexStr, qHexArr) {
			const aHexArr = hexStrToArr(aHexStr).map((s) => s.toUpperCase());

			const hexArr = aHexArr.slice(3, -1);

			const [data0, data1, data2, data3, data4, data5] = hexArr;

			this._checkSetState(aHexStr, aHexArr, qHexArr);

			const zoneDataA = this.$store.getters.zoneDataA;

			/** 1606 氛围灯信息 **/
			if (aHexStr.indexOf('2E1606') >= 0) {
				const newZoneDataA = zoneDataA.map((item) => {
					if (item.code === data0) {
						// 模式设置数据
						if (data1 === '01') {
							item.mode = data2;

							// 情景模式、人群模式、心情模式
							if (['01', '02', '04'].includes(data2)) {
								item[`_mode${data2}`] = data3;
							}

							// 单色模式
							if (data2 === '00') {
								item.value4 = [
									hexToNumber(data3),
									hexToNumber(data4),
									hexToNumber(data5)
								].join(',');

								console.log('颜色值====', data3, data4, data5);
							}

							// 天气模式
							if (data2 === '03') {
								item.weather = {
									name: '晴天',
									temperature: hexToNumber(data3),
									humidity: hexToNumber(data4)
								};
							}

							// 爆闪模式
							if (data2 === '05') {
								item.value5 = hexToNumber(data3);
							}
						}

						// 参数设置数据
						if (data1 === '00') {
							item.value1 = hexToNumber(data2); // 灯光数量
							item.value2 = hexToNumber(data3); // 亮度
							item.value3 = hexToNumber(data4); // 呼吸节奏
							item.value6 = data5; // 灯条模式
						}
					}
					return item;
				});

				this.$store.dispatch('setZoneDataA', newZoneDataA);

				console.log(
					'1606 氛围灯信息',
					data0,
					data1,
					data2,
					data3,
					data4,
					data5
				);

				return;
			}

			/** 1703 氛围灯关联信息 **/
			if (aHexStr.indexOf('2E1703') >= 0) {
				const [data0, data1, data2] = hexArr;

				const newZoneDataA = zoneDataA.map((item) => {
					if (item.code === data0) {
						item.signal = item.signal.map((signal) => {
							if (signal.code === data1) {
								signal.value = data2;
							}
							return signal;
						});
					}
					return item;
				});

				this.$store.dispatch('setZoneDataA', newZoneDataA);

				console.log('1703 氛围灯关联信息', data0, data1, data2);
				return;
			}

			/** 1202 灯控协议 **/
			if (aHexStr.indexOf('2E1202') >= 0) {
				const [data0] = hexArr;
				const bleMcuData = this.$store.getters.bleMcuData;
				this.$store.dispatch('setMcuData', {
					...bleMcuData,
					protocol: data0 === '01' ? '有协议' : '无协议'
				});
				console.log('1202 灯控协议', data0 === '01' ? '有协议' : '无协议');
				return;
			}

			/** 15MCU 版本信息 **/
			if (aHexStr.indexOf('2E15') >= 0) {
				const bleMcuData = this.$store.getters.bleMcuData;

				this.$store.dispatch('setMcuData', {
					...bleMcuData,
					mcuVersion: hexToAscii(hexArr.join('')).trim()
				});
				console.log('15MCU版本信息', hexToAscii(hexArr.join('')));
				return;
			}

			/** 1305 密码反馈信息 **/
			if (aHexStr.indexOf('2E1305') >= 0) {
				// 密码弹窗打开 && 正在修改密码
				const passwordPassed = data1 === '01' ? '1' : '0'; // 0 初始密码未修改 1 密码校验通过

				// 修改密码
				if (data0 === '01' && this.isSendPassword) {
					if (passwordPassed === '0') {
						Toast.fail('密码修改失败');
					} else {
						this.showPwPopup = false;
						Toast.success('密码修改成功');
					}
					console.log('修改密码', data1, data2, data3, data4);
				}

				// 查询密码
				if (data0 === '02') {
					const password = [data1, data2, data3, data4]
						.map((str) => str.substring(1))
						.join('');
					if (password?.length === 4) {
						this.setBleData.ecUserPassword = password;
					}
					console.log('查询密码', data1, data2, data3, data4);
				}

				return;
			}
		},
		_startBleDiscovery: debounce(async function () {
			this.loading = true;

			const res = await ecBLE.getBluetoothAdapterState();

			if (res?.ok) {
				this._discoveryFn();
			} else {
				const res = await ecBLE.initAdapter(() => {});
				if (res.ok) {
					this._discoveryFn();
				} else {
					this.loading = false;
					this._showModal(
						'授权失败',
						'蓝牙或位置服务打开失败，您可以在小程序（右上角 - "..." - "设置"）中打开小程序的授权状态',
						(res) => {
							console.log(res);
						}
					);
				}
			}
		}),
		_discoveryFn() {
			ecBLE.startBluetoothDevicesDiscovery(
				this.bleNames,
				async (name, rssi, deviceId) => {
					console.log('搜索到蓝牙', name, deviceId);
					this.deviceList = uniqBy(
						[...this.deviceList, { name, deviceId }],
						'deviceId'
					);

					this.setBleData.deviceList = uniqBy(
						[...this.deviceList, { name, deviceId }],
						'deviceId'
					);

					this.myDeviceList = this.$store.getters.myBleList.map((item) => {
						item.connected = false;
						return item;
					});

					this.myDeviceList.forEach((item) => {
						if (item?.deviceId === deviceId && !this.getBleData.connected) {
							this.handleStopDiscovery();
							this._connectFn(item);
						}
					});

					this.deviceList.forEach((item) => {
						if (!this.getBleData.connected) {
							this.handleStopDiscovery();
							this._connectFn(item);
						}
					});
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.ble_status_wrap {
	padding: 10rpx 0 20rpx;
	z-index: 99;
	.ble_status_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5rpx 0;

		&.is_connected {
			opacity: 1;
			color: $uni-text-active-color1;
		}

		.ble_status_left {
			display: flex;
			align-items: center;
			font-size: $uni-font-size-base;
			z-index: 99;
			image {
				flex-shrink: 0;
				width: 40rpx;
				height: 40rpx;
				display: block;
				object-fit: contain;
			}
		}
		.ble_status_right {
			max-width: 35%;
			display: flex;
			align-items: center;
			z-index: 9999999999;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
	}

	::v-deep .van-popup {
		width: 90%;
		padding: 30rpx 20rpx;
		background: #14182a;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
		border-radius: 30rpx;
	}
	.ble_list_popup {
		width: 100%;
		height: 660rpx;
		padding: 0 0 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		.ble_list {
			width: 100%;
			padding: 0 20rpx;
			flex-grow: 1;
			overflow-x: hidden;
			overflow-y: auto;
			.list_item {
				height: 70rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 0;
				margin: 0 10rpx;
				position: relative;
				&:active {
					opacity: 0.5;
				}
				.list_item_left {
					display: flex;
					align-items: center;
					.list_item-img {
						width: 36rpx;
						height: 36rpx;
						flex-shrink: 0;
					}

					.list_item-name {
						flex-grow: 1;
						font-size: 32rpx;
						margin: 0 20rpx;
					}
				}

				.list_item_right {
				}
			}
			.search_loading {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 90%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				pointer-events: none;
				text {
					margin-top: 15rpx;
				}
			}
			.ble_tips {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 90%;
				display: flex;
				align-items: center;
				justify-content: center;
				pointer-events: none;
			}
		}
		.ble_list_tip {
			margin-top: 20rpx;
			font-size: 12px;
		}
		.contact_button {
			width: 50%;
			margin-top: 20px;
			.contact_button_inner {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			::v-deep .van-count-down {
				color: #eff3ff;
				margin-left: 10rpx;
			}
		}
	}

	.password_popup {
		padding: 20rpx;
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.password_title {
			color: $uni-text-color;
			font-size: 30rpx;
			text-align: center;
		}
		.password_input {
			width: 80%;
			margin: 30px 0;

			::v-deep .van-cell {
				background: rgba(0, 0, 0, 0);
				&:after {
					border-color: rgba($uni-text-color, 0.7);
				}
			}
			::v-deep .van-field__control {
				font-size: 40rpx;
				text-align: center;
				color: $uni-text-color;
				.van-field__placeholder {
					color: $uni-text-color;
					font-size: 40rpx;
					opacity: 0.5;
				}
			}
		}
		.password_footer {
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.contact_button {
				width: 40%;
				flex-grow: 1;
				& + .contact_button {
					margin-left: 20rpx;
				}
			}
		}
	}
}
</style>
