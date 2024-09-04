import {
	checkSumAndXOR,
	hexWithFrameHeader,
	strToHexCharCode
} from '@/utils/format';

let TIMER = null;
let HEART_TIMER = null;
let heartInterval = 1000 * 5;
let heartWaitingTime = new Date().getTime();

let servicesUUID = '0000FFF0';

let ecServerUUID = '0000FFF0-0000-1000-8000-00805F9B34FB';
let ecServerShortUUID = 'FFF0';

let ecWriteCharacterUUID = '0000FFF2-0000-1000-8000-00805F9B34FB';
let ecWriteCharacterShortUUID = 'FFF2';

let ecReadCharacterUUID = '0000FFF1-0000-1000-8000-00805F9B34FB';
let ecReadCharacterShortUUID = 'FFF1';

let deviceList = [];
let connectedDeviceList = [];

let ecDeviceId = '';
let ecServerId = '';

let ecWriteCharacteristicId = '';
let ecReadCharacteristicId = '';
let receiveDataValue = '';
let ecUserPassword = '';
let ecUserPasswordPassed = '0'; // 0 密码校验不通过  1 密码校验通过

const setBleData = (bleData) => {
	if (!ecDeviceId && !ecServerId && bleData.ecDeviceId && bleData.ecServerId) {
		ecDeviceId = bleData?.ecDeviceId || '';
		ecServerId = bleData?.ecServerId || '';

		ecWriteCharacteristicId = bleData?.ecWriteCharacteristicId || '';
		ecReadCharacteristicId = bleData?.ecReadCharacteristicId || '';
		receiveDataValue = bleData?.receiveDataValue || '';
		deviceList = bleData?.deviceList || [];
		connectedDeviceList = bleData?.connectedDeviceList || [];
		ecUserPassword = bleData?.ecUserPassword || '';
		ecUserPasswordPassed = bleData?.ecUserPasswordPassed || '0';
	}
};

const getBleData = () => {
	return {
		ecDeviceId,
		ecServerId,

		ecWriteCharacteristicId,
		ecReadCharacteristicId,
		receiveDataValue,

		deviceList,
		connectedDeviceList,
		ecUserPassword,
		ecUserPasswordPassed
	};
};

const openLocation = () => {
	return new Promise(function (resolve) {
		uni.getLocation({
			type: 'wgs84',
			success() {
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				if (res.errMsg.indexOf('uni.onLocationChange') >= 0) {
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else {
					resolve({
						ok: false,
						errCode: res.errCode,
						errMsg: res.errMsg
					});
				}
			}
		});
	});
};

const openBluetoothAdapter = () => {
	clearInterval(TIMER);
	return new Promise(function (resolve) {
		uni.openBluetoothAdapter({
			success() {
				setTimeout(() => {
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				}, 1000);
			},
			fail(res) {
				if (
					res.errMsg.indexOf('already opened') >= 0 ||
					res.errCode == 10001 ||
					res.errCode == -1
				) {
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else {
					resolve({
						ok: false,
						errCode: res.errCode,
						errMsg: res.errMsg
					});
				}
			}
		});
	});
};

const closeBluetoothAdapter = () => {
	clearInterval(TIMER);
	return new Promise(function (resolve) {
		uni.closeBluetoothAdapter({
			success() {
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const getBluetoothAdapterState = () => {
	return new Promise(function (resolve) {
		uni.getBluetoothAdapterState({
			success(res) {
				if (res.available) {
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else {
					//蓝牙适配器不可用，打印失败信息
					resolve({
						ok: false,
						errCode: 20000,
						errMsg: '蓝牙适配器关闭'
					});
				}
			},
			fail(res) {
				//打印失败信息
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const getBluetoothDevices = () => {
	return new Promise((resolve) => {
		uni.getBluetoothDevices({
			success(res) {
				resolve(res?.devices || []);
			},
			fail() {
				resolve([]);
			}
		});
	});
};

const getConnectedBluetoothDevices = () => {
	return new Promise((resolve) => {
		uni.getConnectedBluetoothDevices({
			services: [servicesUUID],
			success(res) {
				resolve(res?.devices || []);
			},
			fail() {
				resolve([]);
			}
		});
	});
};

const startBluetoothDevicesDiscovery = async (cb) => {
	deviceList = [];
	const formatFn = (res) => {
		let name = res.name ? res.name : res.localName;
		let deviceId = res.deviceId ? res.deviceId : '';
		name = name.replace(/[\r\n][a-zA-Z]+/g, '');
		name = name.replaceAll(' OK', '');
		if (
			!name ||
			name.indexOf('未知') >= 0 ||
			name.indexOf('不支持') >= 0 ||
			!deviceId
		) {
			return;
		}
		for (const item of deviceList) {
			if (item.deviceId === deviceId) {
				item.rssi = res.RSSI;
				// cb(name, item.rssi, deviceId)
				return;
			}
		}
		deviceList.push({
			name,
			rssi: res.RSSI,
			deviceId: deviceId
		});
		cb(name, res.RSSI, deviceId);
	};
	const isValid = (res) => {
		if (!res) return false;
		let name = res.name ? res.name : res.localName;
		let deviceId = res.deviceId ? res.deviceId : '';
		name = name.replace(/[\r\n][a-zA-Z]+/g, '');
		name = name.replaceAll(' OK', '');

		const target = deviceList.find((item) => {
			item.deviceId === deviceId && item.name === name;
		});

		if (
			!name ||
			name.indexOf('未知') >= 0 ||
			name.indexOf('不支持') >= 0 ||
			!deviceId ||
			target
		) {
			return false;
		}
		return true;
	};

	//开始搜索
	uni.startBluetoothDevicesDiscovery({
		services: [servicesUUID],
		allowDuplicatesKey: true,
		powerLevel: 'high',
		success() {
			setTimeout(async () => {
				let result = await getBluetoothDevices();
				if (result.ok && result.devices && result.devices.length) {
					result.devices = result.devices.filter((item) => {
						return isValid(item);
					});
					result.devices.forEach((item) => {
						formatFn(item);
					});
				}
			}, 1000);

			uni.onBluetoothDeviceFound(async (res) => {
				const device = res.devices[0];
				if (device && isValid(device)) {
					formatFn(device);
				}
			});
		},
		fail() {
			clearInterval(TIMER);
		}
	});
};

//结束搜索
const stopBluetoothDevicesDiscovery = () => {
	return new Promise(function (resolve) {
		clearInterval(TIMER);
		//停止扫描
		uni.stopBluetoothDevicesDiscovery({
			success() {
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

//和设备建立连接
const createBLEConnection = (item) => {
	return new Promise(function (resolve) {
		// 开始连接
		uni.createBLEConnection({
			deviceId: item.deviceId,
			success() {
				let currentDevice = item;
				ecDeviceId = item.deviceId;
				currentDevice.connected = true;
				connectedDeviceList = [currentDevice];
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				let errMsg = res.errMsg;
				switch (res.errCode) {
					case 10000:
					case 10001:
						errMsg = '蓝牙适配器未初始化完成';
						break;
					case 10003:
						errMsg = '连接失败，请重新连接再试';
						break;
					case 10002:
					case 10004:
					case 10013:
						errMsg = '没有找到这个蓝牙设备';
						break;
					case 10012:
						errMsg = '连接超时，请重启设备后再试';
						break;
					case 10007:
					case 10008:
						errMsg = '系统异常，请重启设备后再试';
				}
				//连接失败
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: errMsg
				});
			}
		});
	});
};

//关闭当前连接
const closeBLEConnection = (deviceId = '') => {
	return new Promise(function (resolve) {
		uni.closeBLEConnection({
			deviceId: deviceId || ecDeviceId,
			success() {
				connectedDeviceList = [];
				ecDeviceId = '';
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const onBLEConnectionStateChange = (cb) => {
	const listener = (res) => {
		if (!res.connected) {
			clearInterval(HEART_TIMER);
			connectedDeviceList = [];
			ecDeviceId = '';
		}

		cb(res);
	};

	uni.offBLEConnectionStateChange(listener);
	uni.onBLEConnectionStateChange(listener);
};

const getBLEDeviceServices = () => {
	return new Promise(function (resolve) {
		uni.getBLEDeviceServices({
			deviceId: ecDeviceId,
			success(res) {
				for (let i = 0; i < res.services.length; i++) {
					let uuid = '';

					uuid = res.services[i].uuid.toUpperCase();
					if (uuid === ecServerUUID) {
						ecServerId = ecServerUUID;
						return resolve({
							ok: true,
							errCode: 0,
							errMsg: ''
						});
					}
					if (uuid === ecServerShortUUID) {
						ecServerId = ecServerShortUUID;
						return resolve({
							ok: true,
							errCode: 0,
							errMsg: ''
						});
					}
				}
				resolve({
					ok: false,
					errCode: 20000,
					errMsg: '服务未找到'
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

//连接特性
const getBLEDeviceCharacteristics = () => {
	return new Promise(function (resolve) {
		uni.getBLEDeviceCharacteristics({
			deviceId: ecDeviceId,
			serviceId: ecServerId,
			success(res) {
				if (res.characteristics.length < 2) {
					resolve({
						ok: false,
						errCode: 20000,
						errMsg: '特征值出错'
					});
					return;
				}
				let uuid1 = '';
				let uuid2 = '';
				uuid1 = res.characteristics[0].uuid.toUpperCase();
				uuid2 = res.characteristics[1].uuid.toUpperCase();
				if (uuid1 === ecWriteCharacterUUID && uuid2 === ecReadCharacterUUID) {
					ecWriteCharacteristicId = ecWriteCharacterUUID;
					ecReadCharacteristicId = ecReadCharacterUUID;
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else if (
					uuid1 === ecReadCharacterUUID &&
					uuid2 === ecWriteCharacterUUID
				) {
					ecWriteCharacteristicId = ecWriteCharacterUUID;
					ecReadCharacteristicId = ecReadCharacterUUID;
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else if (
					uuid1 === ecWriteCharacterShortUUID &&
					uuid2 === ecReadCharacterShortUUID
				) {
					ecWriteCharacteristicId = ecWriteCharacterShortUUID;
					ecReadCharacteristicId = ecReadCharacterShortUUID;
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else if (
					uuid1 === ecReadCharacterShortUUID &&
					uuid2 === ecWriteCharacterShortUUID
				) {
					ecWriteCharacteristicId = ecWriteCharacterShortUUID;
					ecReadCharacteristicId = ecReadCharacterShortUUID;
					resolve({
						ok: true,
						errCode: 0,
						errMsg: ''
					});
				} else {
					resolve({
						ok: false,
						errCode: 20000,
						errMsg: '特征值出错'
					});
				}
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const onBLECharacteristicValueChange = (cb) => {
	uni.onBLECharacteristicValueChange((res) => {
		heartWaitingTime = new Date().getTime();

		let x = new Uint8Array(res.value);

		let strHex = '';
		let str = '';
		for (let i = 0; i < x.length; i++) {
			strHex = strHex + x[i].toString(16).padStart(2, '0');
			str = str + String.fromCharCode(x[i]);
		}

		cb(str, strHex);
	});
};

//订阅通知 接收key
const notifyBLECharacteristicValueChange = () => {
	return new Promise(function (resolve) {
		//开始订阅

		uni.notifyBLECharacteristicValueChange({
			state: true,
			deviceId: ecDeviceId,
			serviceId: ecServerId,
			characteristicId: ecReadCharacteristicId,
			success() {
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

// 设置蓝牙发送的MTU长度
const setBLEMTU = (mtu) => {
	return new Promise(function (resolve) {
		//开始订阅
		uni.setBLEMTU({
			deviceId: ecDeviceId,
			mtu,
			success(res) {
				console.log('=======设置蓝牙MTU长度======', res);
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const easyConnect = async (item, cb, message) => {
	receiveDataValue = '';
	await closeBLEConnection();
	await closeBluetoothAdapter();

	let res = await openBluetoothAdapter();

	if (!res.ok) {
		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: 10001
		};
		cb(res);
		return res;
	}
	res = await createBLEConnection(item);
	if (!res.ok) {
		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: 10001
		};
		cb(res);
		return res;
	}

	res = await getBLEDeviceServices();

	if (!res.ok) {
		closeBLEConnection();

		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: 10002
		};
		cb(res);
		return res;
	}
	res = await getBLEDeviceCharacteristics();
	if (!res.ok) {
		closeBLEConnection();

		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: 10003
		};
		cb(res);
		return res;
	}

	res = await notifyBLECharacteristicValueChange();

	if (!res.ok) {
		closeBLEConnection();

		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: 10004
		};
		cb(res);
		return res;
	}

	await setBLEMTU(250);

	res = {
		ok: true,
		errMsg: '',
		errCode: 0
	};

	console.log('=======蓝牙连接成功======', res);

	// 收到蓝牙消息
	await onBLECharacteristicValueChange((str, strHex) => {
		// console.log('=======收到蓝牙消息=======', strHex);
		receiveDataValue = receiveDataValue + str + '\r\n';
		// if (str.indexOf('AT+SYNC=18179366919') >= 0) {
		// 	uni.showToast({
		// 		title: '连接成功',
		// 		icon: 'success',
		// 		duration: 2000
		// 	});
		// }

		uni.$emit('receiveMsg', { strHex, receiveDataValue });
		message && message(strHex);
	});

	cb(res);
};

const writeBLECharacteristicValue = (data) => {
	return new Promise(function (resolve) {
		uni.writeBLECharacteristicValue({
			deviceId: ecDeviceId,
			serviceId: ecServerId,
			characteristicId: ecWriteCharacteristicId,
			value: data,
			success(res) {
				resolve({
					ok: true,
					errCode: 0,
					errMsg: ''
				});
			},
			fail(res) {
				resolve({
					ok: false,
					errCode: res.errCode,
					errMsg: res.errMsg
				});
			}
		});
	});
};

const easySendData = async (str, isHex = true) => {
	if (str.length === 0) return;

	// 增加2e前缀对齐，处理检验和
	let hexStr = isHex
		? hexWithFrameHeader(str.replaceAll(' ')) +
		  checkSumAndXOR(str.replaceAll(' '))
		: strToHexCharCode(str);

	const typedArray = new Uint8Array(
		hexStr.match(/[\da-f]{2}/gi).map(function (h) {
			return parseInt(h, 16);
		})
	);
	const buffer = typedArray.buffer;

	if (str !== '8402ffff') console.log('=======发送指令=======', str, hexStr);
	// 记录本次发送时间
	heartWaitingTime = new Date().getTime();
	return await writeBLECharacteristicValue(buffer);
};

const easySendHeart = (str, isHex = true) => {
	clearInterval(HEART_TIMER);

	if (!str) {
		return;
	}

	HEART_TIMER = setInterval(async () => {
		if (new Date().getTime() - heartWaitingTime > heartInterval) {
			await easySendData(str, isHex);
		}
	}, 100);
};

const checkBleConnected = async (cb) => {
	deviceList = await getBluetoothDevices();
	connectedDeviceList = await getConnectedBluetoothDevices();

	connectedDeviceList = connectedDeviceList
		.filter((item) => item.deviceId === ecDeviceId)
		.map((item) => {
			item.connected = true;
			return item;
		});

	deviceList = deviceList.map((item) => {
		item.connected = item.deviceId === ecDeviceId;
		return item;
	});

	return (
		cb &&
		cb({
			ecDeviceId: ecDeviceId,
			deviceList: deviceList,
			connectedDeviceList: connectedDeviceList,
			receiveDataValue: receiveDataValue,
			connected: connectedDeviceList?.length >= 0
		})
	);
};

// const getSetting = () => {
// 	return new Promise(function (resolve, reject) {
// 		uni.getSetting({
// 			success(res) {
// 				const authSetting = res.authSetting;
// 				resolve({
// 					ok: true,
// 					authSetting,
// 					errCode: 0,
// 					errMsg: ''
// 				});
// 			},
// 			fail(res) {
// 				resolve({
// 					ok: false,
// 					errCode: res.errCode,
// 					errMsg: res.errMsg
// 				});
// 			}
// 		});
// 	});
// };

const initAdapter = async (cb) => {
	clearInterval(HEART_TIMER);

	await closeBLEConnection();
	await closeBluetoothAdapter();
	await stopBluetoothDevicesDiscovery();
	let res = await openLocation();
	if (!res.ok) {
		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: ''
		};
		cb(res);
		return res;
	}
	res = await openBluetoothAdapter();
	if (!res.ok) {
		res = {
			ok: false,
			errMsg: res.errMsg,
			errCode: ''
		};
		cb(res);
		return res;
	}
	res = {
		ok: true,
		errMsg: '',
		errCode: 0
	};
	cb(res);
	return res;
};

module.exports = {
	initAdapter,
	setBleData,
	getBleData,
	openBluetoothAdapter,
	closeBluetoothAdapter,
	getBluetoothAdapterState,
	startBluetoothDevicesDiscovery,
	stopBluetoothDevicesDiscovery,
	closeBLEConnection,
	onBLEConnectionStateChange,
	onBLECharacteristicValueChange,
	easyConnect,
	easySendData,
	easySendHeart,
	checkBleConnected
};
