<template>
	<view class="device-container">
		<text class="title-rev">数据接收 : </text>
		<button class="bt-clear" type="primary" @tap="btClearTap">清空</button>
		<checkbox-group @change="checkScroll">
			<checkbox class="checkbox-scroll" checked="true">滚动</checkbox>
		</checkbox-group>
		<checkbox-group @change="checkRevHex">
			<checkbox class="checkbox-rev-hex">Hex</checkbox>
		</checkbox-group>
		<view class="scroll-view-container">
			<scroll-view
				class="scroll-view-rev"
				:scroll-y="true"
				:scroll-into-view="scrollIntoView"
			>
				<view class="view-rev">
					<text class="text-rev">{{ textRevData }}</text>
				</view>
				<view id="scroll-view-bottom"></view>
			</scroll-view>
		</view>
		<text class="title-send">数据发送 : </text>
		<checkbox-group @change="checkSendHex">
			<checkbox class="checkbox-send-hex">Hex</checkbox>
		</checkbox-group>
		<!-- <input class="input-send" @blur="inputSendData"></input> -->
		<view class="view-input-send">
			<textarea
				class="input-send"
				maxlength="244"
				@blur="inputSendData"
				@input="inputSendData"
			/>
		</view>
		<view class="view-bt-send">
			<button class="bt-send" type="primary" @click="btSendTap">发送</button>
		</view>
	</view>
</template>

<script>
import list from '@/pages/bluetooth/connect/config.js';
import ecBLE from '@/utils/ecBLE.js';
var isCheckScroll = true;
var isCheckRevHex = false;
var isCheckSendHex = false;
var sendData = '';
export default {
	data() {
		return {
			textRevData: '',
			scrollIntoView: 'scroll-view-bottom'
		};
	},

	mounted(options) {
		//on disconnect
		ecBLE.onBLEConnectionStateChange(() => {
			this.showModal('提示', '设备断开连接');
		});
		//receive data
		ecBLE.onBLECharacteristicValueChange((str, strHex) => {
			let data =
				this.textRevData +
				'[' +
				this.dateFormat('hh:mm:ss,S', new Date()) +
				']:' +
				(isCheckRevHex ? strHex : str) +
				'\r\n';
			this.textRevData = data;
			if (isCheckScroll) this.scrollIntoView = 'scroll-view-bottom';
		});
	},
	beforeDestroy() {
		ecBLE.onBLEConnectionStateChange(() => {});
		ecBLE.closeBLEConnection();
	},
	methods: {
		showModal(title, content) {
			wx.showModal({
				title: title,
				content: content,
				showCancel: false
			});
		},
		checkScroll(e) {
			if (e.detail.value.length) isCheckScroll = true;
			else isCheckScroll = false;
		},
		checkRevHex(e) {
			if (e.detail.value.length) isCheckRevHex = true;
			else isCheckRevHex = false;
		},
		checkSendHex(e) {
			if (e.detail.value.length) isCheckSendHex = true;
			else isCheckSendHex = false;
		},
		inputSendData(e) {
			sendData = e.detail.value;
		},
		btClearTap() {
			this.textRevData = '';
		},
		async btSendTap() {
			if (isCheckSendHex) {
				if (sendData.length % 2 != 0) {
					this.showModal('提示', '数据长度只能是双数');
					return;
				}
				if (!new RegExp('^[0-9a-fA-F]*$').test(sendData)) {
					this.showModal('提示', '数据格式错误，只能是0-9,a-f,A-F');
					return;
				}
			}
			await ecBLE.easySendData(sendData.replace(/\n/g, '\r\n'), isCheckSendHex);
		},
		dateFormat(fmt, date) {
			var o = {
				'M+': date.getMonth() + 1, //月份
				'd+': date.getDate(), //日
				'h+': date.getHours(), //小时
				'm+': date.getMinutes(), //分
				's+': date.getSeconds(), //秒
				'q+': Math.floor((date.getMonth() + 3) / 3), //季度
				S: date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(
					RegExp.$1,
					(date.getFullYear() + '').substr(4 - RegExp.$1.length)
				);
			for (var k in o)
				if (new RegExp('(' + k + ')').test(fmt)) {
					console.log(RegExp.$1.length);
					console.log(o[k]);
					fmt = fmt.replace(
						RegExp.$1,
						RegExp.$1.length == 1
							? (o[k] + '').padStart(3, '0')
							: ('00' + o[k]).substr(('' + o[k]).length)
					);
				}
			return fmt;
		}
	}
};
</script>

<style>
/* page {
		background-color: rgb(240, 242, 244);
	} */
</style>

<style lang="scss">
.u-cell-icon1 {
	width: 36rpx;
	height: 36rpx;
	margin-right: 8rpx;
}

.u-cell-group__title__text {
	font-weight: bold;
}
</style>
