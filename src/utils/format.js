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
 * 16进制数据转Ascii
 * hexStr：16进制数据
 */
const hexToAscii = (hexStr) => {
	let asciiString = '';

	for (let i = 0; i < hexStr.length; i += 2) {
		const hexCode = hexStr.substr(i, 2);
		const asciiChar = String.fromCharCode(parseInt(hexCode, 16));
		asciiString += asciiChar;
	}

	return asciiString.replaceAll('Û.', '').trim();
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

	return `${xorResult.toString(16).padStart(2, '0')}`;
};

console.log(checkSumAndXOR('8606010100852550'));

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
	var hexCharCode = [];
	hexCharCode.push('0x');
	for (var i = 0; i < str.length; i++) {
		hexCharCode.push(str.charCodeAt(i).toString(16));
	}
	return hexCharCode.join('');
};

const numberToHex = (num) => {
	// 将十进制数转换为十六进制数
	const hex = parseInt(num).toString(16).padStart(2, '0');
	// 确保十六进制数是两位数
	return hex;
};

console.log(numberToHex(100));

// 将十六进制字符串转为十进制数
const hexToNumber = (hex) => {
	// 判断是否为十六进制数
	if (!/^[0-9a-fA-F]+$/.test(hex)) {
		return hex;
	}
	return parseInt(hex, 16);
};

module.exports = {
	formatTime,
	formatNumber,
	numberToHex,
	hexToNumber,
	hexToAscii,
	hexStrToArr,
	checkSumAndXOR,
	hexWithFrameHeader,
	strToHexCharCode
};
