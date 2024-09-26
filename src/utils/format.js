import utf8 from './utf8';

const formatTime = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return `${[year, month, day].map(formatNumber).join('/')} ${[
		hour,
		minute,
		second
	]
		.map(formatNumber)
		.join(':')}`;
};

const formatNumber = (n) => {
	n = n.toString();
	return n[1] ? n : `0${n}`;
};

/**
 * Ascii转16进制
 * asciiStr：Ascii字符串
 */
const asciiToHex = (asciiStr) => {
	let hexString = '';

	for (let i = 0; i < asciiStr.length; i++) {
		const asciiCode = asciiStr.charCodeAt(i);
		const hexCode = asciiCode.toString(16);
		hexString += hexCode;
	}

	return hexString;
};

/**
 * 16进制数据转Ascii
 * hexStr：16进制数据
 */
const hexToAscii = (hexStr) => {
	let str = '';
	for (let i = 0; i < hexStr.length; i += 2) {
		let code = parseInt(hexStr.substr(i, 2), 16);
		str += String.fromCharCode(code);
	}

	let result = str;

	try {
		result = utf8.decode(str);
	} catch (e) {
		console.log(e);
	}

	return result;
};

/**
 * 16进制数据转数组
 * hexStr：16进制数据
 */
const hexStrToArr = (hexStr) => {
	if (!hexStr) return [];
	let arr = [];

	for (let i = 0; i < hexStr.length; i += 2) {
		let str = hexStr.substr(i, 2);
		arr.push(str);
	}

	return arr;
};

/**
 * 求校验和并与0xFF做异或运算
 * hexStr：16进制数据
 */
const checkSumAndXOR = (hexStr) => {
	if (!hexStr) return '';
	let total = 0;

	for (let i = 0; i < hexStr.length; i += 2) {
		let str = hexStr.substr(i, 2);
		total += parseInt(str, 16);
	}

	let sum = total % 256;
	let xorResult = sum ^ 0xff;

	return xorResult.toString(16).padStart(2, '0');
};

/**
 * 将一串16进制转换成以"2e"开头，并添加帧对齐的起始头格式
 * hexStr：16进制数据
 */
const hexWithFrameHeader = (hexStr) => {
	if (!hexStr) return '';
	let formattedHex = '2e';

	for (let i = 0; i < hexStr.length; i += 2) {
		let str = hexStr.substr(i, 2);
		formattedHex += str;
	}

	return formattedHex;
};

const strToHexCharCode = (str) => {
	if (str === '') return '';
	const hexCharCode = [];
	hexCharCode.push('0x');
	for (const i = 0; i < str.length; i++) {
		hexCharCode.push(str.charCodeAt(i).toString(16));
	}
	return hexCharCode.join('');
};

const numberToHex = (num, length = 2) => {
	// 将十进制数转换为十六进制数
	let hex = parseInt(num).toString(16);
	// 确保十六进制数是两位数, 若是奇数位数则在前面补0
	if (hex.length % 2) {
		hex = '0' + hex;
	}

	return `${hex.padStart(length, '0')}`;
};

// 将十六进制字符串转为十进制数
const hexToNumber = (hex) => {
	// 判断是否为十六进制数
	if (!/^[0-9a-fA-F]+$/.test(hex)) {
		return hex;
	}
	return parseInt(hex, 16);
};

// 将十六进制数值转换为两位数的十六进制字符串，并在需要时补充前导零
const toHexString = (value) => {
	const hexString = value.toString(16).toUpperCase();
	return hexString.length % 2 ? '0' + hexString : hexString;
};

// 交换高低位
const swapBytes = (num) => {
	// 获取低位字节
	const lowByte = num & 0xff;
	// 获取高位字节
	const highByte = (num >> 8) & 0xff;
	// 组合高低位字节并返回
	return toHexString((lowByte << 8) | highByte);
};

// 计算 CRC16 校验码的函数
const calculateCRC16 = (str) => {
	const buffer = hexStrToArr(str).map((item) => '0x' + item);
	let crc = 0xffff;
	for (let i = 0; i < buffer.length; i++) {
		crc ^= buffer[i];
		for (let j = 0; j < 8; j++) {
			if (crc & 0x0001) {
				crc >>= 1;
				crc ^= 0xa001;
			} else {
				crc >>= 1;
			}
		}
	}
	// 返回 CRC16 校验码
	return swapBytes(crc).padStart(4, '0');
};

function numToFixed(num = 0, n = 2, needFixed = true) {
	// 判断 num 是否为空
	if (!num || isNaN(num)) {
		return 0;
	}

	// 对数字进行四舍五入处理
	const factor = Math.pow(10, n);
	const number = (Math.round(num * factor) / factor).toFixed(n);

	return needFixed ? number : parseFloat(number);
}

module.exports = {
	formatTime,
	formatNumber,
	numberToHex,
	hexToNumber,
	asciiToHex,
	hexToAscii,
	hexStrToArr,
	checkSumAndXOR,
	hexWithFrameHeader,
	strToHexCharCode,
	calculateCRC16,
	numToFixed
};
