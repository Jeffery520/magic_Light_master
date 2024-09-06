<template>
	<view class="custom_color_form">
		<text>R</text>
		<van-field
			:focus="focus1"
			:selectionStart="selectionStart"
			:selectionEnd="selectionEnd"
			maxlength="3"
			inputAlign="center"
			placeholder="请输入"
			type="number"
			border="surround"
			fontSize="16"
			:value="customColor.red"
			@input="onInputColor"
			@blur="blurFn(1)"
		>
		</van-field>
		<text>G</text>
		<van-field
			:focus="focus2"
			:selectionStart="selectionStart"
			:selectionEnd="selectionEnd"
			maxlength="3"
			inputAlign="center"
			placeholder="请输入"
			type="number"
			border="surround"
			fontSize="16"
			:value="customColor.green"
			@input="onInputColor"
			@blur="blurFn(2)"
		>
		</van-field>
		<text>B</text>
		<van-field
			:focus="focus3"
			:selectionStart="selectionStart"
			:selectionEnd="selectionEnd"
			maxlength="3"
			inputAlign="center"
			placeholder=""
			type="number"
			border="surround"
			fontSize="16"
			disabled
			:value="customColor.blue"
			@input="onInputColor"
			@blur="blurFn(3)"
		>
		</van-field>
		<view class="fixed_bg">
			<cover-view class="fixed_bg_li" @click="focus1fn"> </cover-view>
			<cover-view class="fixed_bg_li" @click="focus2fn"> </cover-view>
			<cover-view class="fixed_bg_li" @click="focus3fn"> </cover-view>
		</view>
	</view>
</template>

<script>
import { throttle } from '@/utils/lodash.min';
import util from '@/components/ColorPicker/util';

export default {
	options: {
		styleIsolation: 'shared'
	},
	props: {
		customColor: {
			type: Object,
			default: () => ({
				red: 255,
				green: 0,
				blue: 0
			})
		}
	},
	data() {
		return {
			focus1: false,
			focus2: false,
			focus3: false,
			selectionStart: 0,
			selectionEnd: 3
		};
	},
	methods: {
		onInputColor: throttle(function () {
			// if (this.coustomColor.red == "") this.coustomColor.red = 0;
			// if (this.coustomColor.green == "") this.coustomColor.green = 0;
			// if (this.coustomColor.blue == "") this.coustomColor.blue = 0;

			if (this.coustomColor.red > 255) this.coustomColor.red = 255;
			if (this.coustomColor.green > 255) this.coustomColor.green = 255;
			if (this.coustomColor.blue > 255) this.coustomColor.blue = 255;
			if (
				this.coustomColor.red !== '' &&
				this.coustomColor.green !== '' &&
				this.coustomColor.blue !== ''
			) {
				let h = util.rgb2hsl(
					parseInt(this.coustomColor.red),
					parseInt(this.coustomColor.green),
					parseInt(this.coustomColor.blue)
				);
				this.$emit('change', this.coustomColor);
			}
		}, 500),
		blurFn(index) {
			this.selectionStart = -1;
			this.selectionEnd = -1;
			if (index == 1) this.focus1 = false;
			if (index == 2) this.focus2 = false;
			if (index == 3) this.focus3 = false;
		},
		focus1fn() {
			this.focus1 = false;
			wx.pageScrollTo({
				scrollTop: 1000, //滚动到页面节点的上边界坐标
				duration: 100 // 滚动动画的时长
			});
			setTimeout(() => {
				this.selectionStart = 0;
				this.selectionEnd = 3;

				this.focus1 = true;
			}, 200);
		},
		focus2fn() {
			this.focus2 = false;

			wx.pageScrollTo({
				scrollTop: 1000, //滚动到页面节点的上边界坐标
				duration: 100 // 滚动动画的时长
			});

			setTimeout(() => {
				this.selectionStart = 0;
				this.selectionEnd = 3;

				this.focus2 = true;
			}, 200);
		},
		focus3fn() {
			this.focus3 = false;

			wx.pageScrollTo({
				scrollTop: 1000, //滚动到页面节点的上边界坐标
				duration: 100 // 滚动动画的时长
			});

			setTimeout(() => {
				this.selectionStart = 0;
				this.selectionEnd = 3;

				this.focus3 = true;
			}, 200);
		}
	}
};
</script>

<style lang="scss" scoped>
.custom_color_form {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	position: relative;
	line-height: 1em;
	font-size: $uni-font-size-sm;

	.fixed_bg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 9999;

		.fixed_bg_li {
			width: 33.3%;
			height: 100%;
			flex-grow: 1;
		}
	}

	::v-deep van-field {
		padding: 0 5rpx !important;
		border-radius: 3rpx;
		overflow: hidden;
		.van-cell {
			padding: 0 !important;
			background: none !important;
			&:after {
				display: none;
			}
		}

		&:nth-of-type(1) {
			border-color: rgba(255, 0, 0, 1) !important;
			background: rgba(255, 0, 0, 0.8) !important;
		}

		&:nth-of-type(2) {
			border-color: rgba(0, 255, 0, 1) !important;
			background: rgba(0, 255, 0, 0.8) !important;
		}

		&:nth-of-type(3) {
			border-color: rgba(0, 0, 255, 1) !important;
			background: rgba(0, 0, 255, 0.8) !important;
		}

		&.u-border {
			border-width: 1px !important;
		}

		.input-placeholder {
			font-size: $uni-font-size-sm;
			font-weight: normal;
			text-shadow: 0px 0 1px rgba(0, 0, 0, 1);
			color: rgba(255, 255, 255, 0.5) !important;
		}

		.van-field__body {
			.van-field__control {
				width: 46rpx !important;
				min-height: 1em !important;
				height: 1.3em !important;
				line-height: 1.3em !important;
				font-size: 22rpx;
				text-shadow: 0 0 1px rgba(0, 0, 0, 1);
				color: rgba(255, 255, 255, 0.9) !important;
			}
		}
	}

	text {
		margin-left: 10rpx;
		margin-right: 5rpx;
		&:first-child {
			margin-left: 0;
		}
	}
}
</style>
