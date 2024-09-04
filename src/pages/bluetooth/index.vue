<template>
	<view class="view-container">
		<NavBar showBackBtn />
		<view class="content_wrap">
			<view class="shadow_box_item">
				<view class="left">
					<u-badge bgColor="#07c160" :isDot="true" type="success"></u-badge>
					<view class="text">我的蓝牙设备</view>
				</view>
				<view class="list_num">
					{{ myDeviceListData.length }}
				</view>
			</view>

			<view class="top_tips">
				<text class="text_l1"
					>点击蓝牙名称含
					<text class="hight_light_text">Light Life</text>的设备进行配对</text
				>
				<text class="text_l2">注：部分设备需要开启定位服务才能搜索到蓝牙</text>
			</view>

			<view style="min-height: 200rpx">
				<view
					v-for="(item, index) in myDeviceListData"
					:key="item.name"
					class="list-item"
					@click.stop="connecBluetooth(item, index, 1)"
				>
					<template>
						<image
							v-if="!item.isconnect || status != '1'"
							src="~@/static/images/ble.png"
							class="list-item-img"
						>
						</image>
						<image
							v-else
							src="~@/static/images/ble2.png"
							class="list-item-img"
						></image>
					</template>

					<text class="list-item-name">{{ item.name }}</text>
					<view v-if="status == '1' && item.isconnect" class="list-item-right">
						<template>
							<image
								v-if="item.rssi >= -41"
								src="~@/static/images/s5.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							>
							</image>
							<image
								v-else-if="item.rssi >= -55"
								src="~@/static/images/s4.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							>
							</image>
							<image
								v-else-if="item.rssi >= -65"
								src="~@/static/images/s3.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							>
							</image>
							<image
								v-else-if="item.rssi >= -75"
								src="~@/static/images/s2.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							>
							</image>
							<image
								v-else-if="item.rssi > -100"
								src="~@/static/images/s1.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							>
							</image>
							<image
								v-else
								src="~@/static/images/s0.png"
								mode="aspectFit"
								class="list-item-rssi-img"
							></image>
						</template>
						<text class="list-item-rssi">{{ item.rssi }}</text>
					</view>
					<view
						v-else-if="status == '-1' && item.isconnect"
						class="list-item-right"
						>配对失败</view
					>
					<view v-else class="list-item-right">已断开</view>
				</view>
				<view v-if="myDeviceListData.length == 0" class="emput_bluetooth">
					蓝牙设备为空
				</view>
			</view>

			<view class="shadow_box_item" style="margin-top: 60rpx">
				<view class="left">
					<u-badge :isDot="true" type="primary"></u-badge>
					<view class="text">搜索到的设备</view>
				</view>

				<view class="list_num">
					{{ showDeviceListData.length }}
				</view>
			</view>

			<view>
				<view
					v-for="(item, index) in showDeviceListData"
					:key="item.name"
					class="list-item"
					@click="connecBluetooth(item, index, 2)"
				>
					<image
						v-if="item.name.length === 11 && strFirst(item.name) === '@'"
						src="~@/static/images/ecble.png"
						class="list-item-img"
					></image>
					<image
						v-else
						src="~@/static/images/ble.png"
						class="list-item-img"
					></image>
					<text class="list-item-name">{{ item.name }}</text>
					<view class="list-item-right">
						<image
							v-if="item.rssi >= -41"
							src="~@/static/images/s5.png"
							mode="aspectFit"
							class="list-item-rssi-img"
						>
						</image>
						<image
							v-else-if="item.rssi >= -55"
							src="~@/static/images/s4.png"
							mode="aspectFit"
							class="list-item-rssi-img"
						>
						</image>
						<image
							v-else-if="item.rssi >= -65"
							src="~@/static/images/s3.png"
							mode="aspectFit"
							class="list-item-rssi-img"
						>
						</image>
						<image
							v-else-if="item.rssi >= -75"
							src="~@/static/images/s2.png"
							mode="aspectFit"
							class="list-item-rssi-img"
						>
						</image>
						<image
							v-else-if="item.rssi < -75"
							src="~@/static/images/s1.png"
							mode="aspectFit"
							class="list-item-rssi-img"
						>
						</image>
						<text class="list-item-rssi">{{ item.rssi }}</text>
					</view>
				</view>
				<view v-if="showDeviceListData.length == 0" class="emput_bluetooth">
					<view v-if="loading" style="display: flex; justify-content: center">
						<u-loading-icon mode="circle" textSize="4"></u-loading-icon>
						<view style="margin-left: 5px"> 蓝牙搜索中... </view>
					</view>
					<view v-else> 蓝牙设备为空 </view>
				</view>
				<u-button
					v-if="loading"
					color="#07c160"
					customStyle="width:400rpx;margin-top:30rpx;"
					type="success"
					text="停止搜索"
					@click="stopDiscoveryFn"
				>
					(<u-count-down :time="loadingTime" format="mm:ss"></u-count-down>)
					<text style="margin-left: 10rpx">停止搜索</text>
				</u-button>
				<u-button
					v-else
					color="#07c160"
					customStyle="width:400rpx;margin-top:30rpx;"
					type="success"
					:text="showDeviceListData.length == 0 ? '搜索蓝牙' : '重新搜索'"
					@click="startDiscoveryFn"
				>
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import ecBLE from '@/utils/ecBLE.js';
import { sortBy, uniqBy, debounce, throttle } from '@/utils/lodash.min.js';
let Timer = null;
export default {
	components: {
		NavBar
	},
	data() {
		return {
			loading: false,
			loadingTime: 1000 * 30,
			discoveryTime: new Date().getTime(),
			deviceListData: [],
			myDeviceListData: [],
			status: '1'
		};
	},
	computed: {
		showDeviceListData() {
			return this.deviceListData;
		}
	},
	onLoad() {
		let myDeviceListData = getApp().globalData.myDeviceListData;
		this.deviceListData = ecBLE.getDeviceList().deviceList;
		this.myDeviceListData = uniqBy(
			[...myDeviceListData, ...ecBLE.getDeviceList().connectedDeviceList],
			['deviceId']
		);

		ecBLE.onBLEConnectionStateChange((item) => {
			const findIndex = this.myDeviceListData.findIndex(
				(it) => it.deviceId === item.deviceId
			);
			if (findIndex >= 0) {
				this.myDeviceListData[findIndex].isconnect = item.connected;
				this.$set(
					this.myDeviceListData,
					findIndex,
					this.myDeviceListData[findIndex]
				);
				// this.showModal("提示", "设备已断开连接");
			}
		});
	},
	onShow() {
		ecBLE.stopBluetoothDevicesDiscovery();
		const isconnect = this.myDeviceListData.some((item) => item.isconnect);
		if (!isconnect) {
			this.myDeviceListData = this.myDeviceListData.map((item) => {
				item.rssi = -100;
				return item;
			});
			setTimeout(() => {
				this.startDiscoveryFn();
			}, 500);
		}
	},
	updated() {
		uni.setStorage({
			key: 'bluetoothPageData',
			data: {
				myDeviceListData: this.myDeviceListData
			}
		});
		this.status = ecBLE.getDeviceList().status;
	},
	onUnload() {
		uni.setStorage({
			key: 'bluetoothPageData',
			data: {
				myDeviceListData: this.myDeviceListData
			}
		});
		this.stopDiscoveryFn();
		ecBLE.closeBLEConnection();
		ecBLE.stopBluetoothDevicesDiscovery();
		ecBLE.closeBluetoothAdapter();
	},
	onHide() {
		this.stopDiscoveryFn();
	},
	methods: {
		startDiscoveryFn: debounce(function () {
			this.stopDiscoveryFn();
			let timers = 0;
			this.loading = true;
			this.discoveryTime = new Date().getTime();
			this.deviceListData = [];
			this.startDiscovery();

			Timer = setInterval(() => {
				timers++;
				if (new Date().getTime() - this.discoveryTime > this.loadingTime) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.loading = false;
					clearInterval(Timer);
				}
				if (timers == 10 && this.deviceListData.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.startDiscovery();
				}
				if (timers == 20 && this.deviceListData.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.startDiscovery();
				}
				if (timers == 30 && this.deviceListData.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.startDiscovery();
				}
				if (timers == 40 && this.deviceListData.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.startDiscovery();
				}
				if (timers == 50 && this.deviceListData.length == 0) {
					ecBLE.stopBluetoothDevicesDiscovery();
					this.startDiscovery();
				}
			}, 500);
		}),
		stopDiscoveryFn() {
			this.loading = false;
			clearInterval(Timer);
			ecBLE.stopBluetoothDevicesDiscovery();
		},
		strFirst(str) {
			return str.slice(0, 1);
		},
		connecBluetooth: throttle(async function (item, index, type) {
			this.stopDiscoveryFn();
			if (type == 1) {
				if (item.isconnect) {
					await ecBLE.closeBLEConnection();
					await ecBLE.closeBluetoothAdapter();
					ecBLE.stopBluetoothDevicesDiscovery();
					this.$set(this.myDeviceListData[index], 'isconnect', false);
					return;
				}
				this.createConnect(item, index);
			} else {
				let find = this.myDeviceListData.find(
					(it) => it.deviceId == item.deviceId && it.isconnect
				);
				if (find && this.status == '1') {
					uni.showToast({
						title: '蓝牙已连接',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.createConnect(item, index);
			}
		}),
		async createConnect(item, index) {
			const target = this.deviceListData.find(
				(it) => it.deviceId === item.deviceId
			);
			if (!target) {
				this.startDiscoveryFn();
				return;
			}

			await ecBLE.closeBluetoothAdapter(item.deviceId);
			const data = await this.connecFn(item, index);
			if (data && data.isconnect) {
				const findIndex = this.myDeviceListData.findIndex(
					(it) => it.deviceId === data.deviceId
				);
				const findIndex2 = this.deviceListData.findIndex(
					(it) => it.deviceId === data.deviceId
				);
				if (findIndex === -1) {
					this.myDeviceListData = this.myDeviceListData.concat([data]);
				} else {
					this.$set(this.myDeviceListData, findIndex, data);
				}
				if (findIndex2 >= 0) {
					this.deviceListData[findIndex2].isconnect = true;
					this.deviceListData = this.deviceListData;
				}
			}
		},
		connecFn: throttle(function (item, index) {
			if (!item.deviceId) return;
			return new Promise(async (resolve) => {
				this.showLoading();
				let res = await ecBLE.easyConnect(item, () => {});
				this.hideLoading();
				console.log(res);
				if (res.ok) {
					item.isconnect = true;
					this.stopDiscoveryFn();
					resolve(item);
				} else {
					resolve(item);
					this.showModal(
						'连接失败',
						res.errMsg.indexOf('not exist') >= 0
							? '未搜索到这个蓝牙设备'
							: res.errMsg,
						() => {
							setTimeout(() => {
								this.startDiscoveryFn();
							}, 500);
						}
					);
				}
			});
		}),
		showModal(title, content, cb) {
			uni.showModal({
				title: title,
				content: content,
				showCancel: false,
				complete(res) {
					cb(res);
				}
			});
		},
		showLoading() {
			uni.showToast({
				title: '设备连接中',
				icon: 'loading',
				duration: 3600000,
				mask: true
			});
		},
		hideLoading() {
			uni.hideToast();
		},
		gotoDevicePage() {
			ecBLE.stopBluetoothDevicesDiscovery();
			uni.navigateTo({
				url: './connect/connect'
			});
		},
		startDiscovery: debounce(async function () {
			this.loading = true;
			const ctx = this;
			if (this.myDeviceListData && this.myDeviceListData.length > 0) {
				this.myDeviceListData.map(async (item) => {
					await ecBLE.closeBLEConnection(item.deviceId);
				});
			} else {
				await ecBLE.closeBLEConnection();
			}
			const res = await ecBLE.getBluetoothAdapterState();
			if (res.ok) {
				this.startBluetoothDevicesDiscovery();
			} else {
				const res = await ecBLE.initDevice(() => {});
				if (res.ok) {
					this.startBluetoothDevicesDiscovery();
				} else {
					this.loading = false;
					this.showModal(
						'授权失败',
						'蓝牙或位置服务打开失败，您可以在小程序（右上角 - "..." - "设置"）中打开小程序的授权状态',
						(res) => {
							console.log(res);
						}
					);
				}
			}
		}),
		startBluetoothDevicesDiscovery() {
			console.log('start search');
			ecBLE.startBluetoothDevicesDiscovery(async (name, rssi, deviceId) => {
				console.log(name, deviceId);
				const findIndex = this.deviceListData.findIndex(
					(item) => item.deviceId === deviceId
				);
				const findIndex2 = this.myDeviceListData.findIndex(
					(item) => item.deviceId === deviceId
				);
				if (findIndex >= 0) {
					let item = {
						...this.deviceListData[findIndex],
						name,
						rssi,
						deviceId
					};
					item.deviceId = deviceId ? deviceId : item.deviceId;
					this.$set(this.deviceListData, findIndex, item);
				} else {
					this.deviceListData.push({
						name,
						rssi,
						deviceId
					});
					this.deviceListData = sortBy(this.deviceListData, 'rssi').reverse();
				}

				if (findIndex2 >= 0) {
					clearInterval(Timer);
					let myitem = this.myDeviceListData[findIndex2];
					if (!myitem.isconnect) {
						myitem.rssi = rssi;
						let data = await this.connecFn(myitem, findIndex2);
						if (data.isconnect) {
							this.$set(this.myDeviceListData, findIndex2, data);
							ecBLE.stopBluetoothDevicesDiscovery();
						}
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scope>
.content_wrap {
	padding: 0 30rpx 60rpx;
	box-sizing: border-box;

	.top_tips {
		padding: 20rpx 10rpx;
		line-height: 1em;
		font-size: 28rpx;
		border-bottom: 1px solid #313234;
		margin: 0 10rpx;

		.text_l1 {
			display: block;
			font-size: 28rpx;
			margin-bottom: 6rpx;

			.hight_light_text {
				color: #07c160;
				font-weight: bold;
				margin: 0 10rpx;
			}
		}

		.text_l2 {
			font-size: 24rpx;
			opacity: 0.6;
		}
	}

	.u-count-down__text {
		color: #fff !important;
	}

	.search_btn {
		width: 300rpx;
	}

	.list-item {
		height: 70rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		margin: 0 10rpx;
		border-bottom: 1px solid #313234;

		// background: #313234;
		// border-radius: 12rpx;
		&:active {
			opacity: 0.5;
		}

		.list-item-img {
			width: 44rpx;
			height: 44rpx;
			flex-shrink: 0;
		}

		.list-item-name {
			flex-grow: 1;
			font-size: 32rpx;
			margin: 0 30rpx;
		}

		.list-item-right {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			line-height: 1em;
			font-size: 24rpx;

			.list-item-rssi-img {
				width: 36rpx;
				height: 36rpx;
			}

			.list-item-rssi {
				font-size: 22rpx;
			}
		}
	}

	.emput_bluetooth {
		color: #c1c1bf;
		text-align: center;
		line-height: 200rpx;
	}
}
</style>
