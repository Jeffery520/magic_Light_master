<template>
	<view class="color-picker_wrap">
		<view class="color-picker_tab">
			<van-tabs
				:active="currentMode"
				color="#19c9ce"
				line-height="2px"
				line-width="60px"
				@change="changeColorMode"
			>
				<van-tab title="色环选择" :name="0"></van-tab>
				<van-tab title="自定义RGB" :name="1"></van-tab>
			</van-tabs>
		</view>
		<view v-if="currentMode === 0" class="color_picker_box">
			<view class="color-picker-view">
				<image
					v-if="!loading"
					class="logo_icon"
					src="~@/static/images/logo_icon.png"
				></image>
				<canvas
					type="2d"
					:style="{ width: canvasWidth + 'rpx', height: canvasWidth + 'rpx' }"
					canvas-id="colorPicker"
					id="colorPicker"
					class="color-picker"
				/>
				<canvas
					type="2d"
					:style="{ width: canvasWidth + 'rpx', height: canvasWidth + 'rpx' }"
					id="colorPickerSlider"
					class="color-picker-slider"
					@touchstart="onSlide"
					@touchmove="onSlide"
					@touchend="onSlide"
				/>
			</view>
			<view class="color_picker_tips"> 可通过下方滑块选择颜色并预览 </view>
		</view>
		<view v-else class="custom_color_box">
			<view
				class="result_color__box"
				:style="{
					background: currentBg,
					width: canvasWidth * 0.75 + 'rpx',
					height: canvasWidth * 0.75 + 'rpx'
				}"
			>
				<image class="logo_icon" src="~@/static/images/logo_icon.png"></image>
			</view>

			<view class="color_picker_tips">
				请输入RGB色值，单色值范围为（ 0～255 ）
			</view>

			<view class="custom_color_form">
				<view class="color_item">
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
						:value="coustomColor.red"
						@input="onInputColor($event, 'red')"
						@blur="blurFn(1)"
					>
					</van-field>
					<text>R</text>
					<cover-view class="fixed_bg_li" @click="focus1fn"> </cover-view>
				</view>
				<view class="color_item">
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
						:value="coustomColor.green"
						@input="onInputColor($event, 'green')"
						@blur="blurFn(2)"
					>
					</van-field>
					<text>G</text>
					<cover-view class="fixed_bg_li" @click="focus2fn"> </cover-view>
				</view>
				<view class="color_item">
					<van-field
						:focus="focus3"
						:selectionStart="selectionStart"
						:selectionEnd="selectionEnd"
						maxlength="3"
						inputAlign="center"
						placeholder="请输入"
						type="number"
						border="surround"
						fontSize="16"
						:value="coustomColor.blue"
						@input="onInputColor($event, 'blue')"
						@blur="blurFn(3)"
					>
					</van-field>
					<text>B</text>
					<cover-view class="fixed_bg_li" @click="focus3fn"> </cover-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import util from '@/components/ColorPicker/util.js';
import { throttle } from '@/utils/lodash.min.js';
let colorPickerCtx = {};
let sliderCtx = {};

export default {
	props: {
		currentColor: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	options: {
		styleIsolation: 'shared'
	},
	data() {
		return {
			loading: true,
			focus1: false,
			focus2: false,
			focus3: false,
			selectionStart: 0,
			selectionEnd: 3,
			dpr: 1,
			pickColor: null,
			canvasWidth: 360, //这里最大为750rpx铺满屏幕
			valueWidthOrHerght: 0,
			currentMode: 0,
			coustomColor: {
				red: 255,
				green: 0,
				blue: 0
			},
			currentBg: 'red',
			colorModelList: [
				{
					name: '色环选择'
				},
				{
					name: '自定义RGB'
				}
			]
		};
	},
	watch: {
		currentColor: {
			handler() {
				const { red, green, blue } = this.currentColor;
				this.currentBg = `rgb(${red},${green},${blue})`;
				this.pickColor = JSON.stringify(this.currentColor);

				this.$nextTick(() => {
					if (this.currentMode == 0) {
						this.init();
					}
				});
			},
			immediate: true,
			deep: true
		}
	},
	created() {
		this.loading = true;
	},
	onShow() {
		this.selectionStart = -1;
		this.selectionEnd = -1;
		this.focus1 = false;
		this.focus2 = false;
		this.focus3 = false;
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
		});
	},
	methods: {
		blurFn(index) {
			console.log(this.$refs.focus1);
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
		},
		changeColorMode(event) {
			console.log(event);
			this.currentMode = event.detail.name;
			if (this.currentMode == 0) {
				this.$nextTick(() => {
					this.init();
				});
			}
		},
		async init() {
			const Query = uni.createSelectorQuery().in(this);
			const rect = await this.getCancvasWidth(Query);
			this.dpr = uni.getSystemInfoSync().pixelRatio;

			Query.select('#colorPickerSlider')
				.node((res) => {
					const canvas = res.node;
					canvas.width = rect.width * this.dpr;
					canvas.height = rect.height * this.dpr;
					sliderCtx = canvas.getContext('2d');
					// 设置默认位置
					let h = this.currentColor
						? util.rgb2hsl(
								this.currentColor.red,
								this.currentColor.green,
								this.currentColor.blue
						  )
						: util.rgb2hsl(255, 0, 0);

					util.drawSlider(
						sliderCtx,
						this.valueWidthOrHerght * this.dpr,
						this.valueWidthOrHerght * this.dpr,
						h[0],
						this.dpr
					);
				})
				.exec();
			Query.select('#colorPicker')
				.node((res) => {
					const canvas = res.node;
					canvas.width = rect.width * this.dpr;
					canvas.height = rect.height * this.dpr;
					colorPickerCtx = canvas.getContext('2d');
					util.drawRing(
						colorPickerCtx,
						this.valueWidthOrHerght * this.dpr,
						this.valueWidthOrHerght * this.dpr,
						this.dpr
					);
				})
				.exec();
			this.$nextTick(() => {
				setTimeout(() => {
					this.loading = false;
				}, 300);
			});
		},
		getCancvasWidth(Query) {
			return new Promise((resolve) => {
				Query.select('#colorPicker')
					.boundingClientRect((rect) => {
						this.valueWidthOrHerght = rect.width;
						this.coustomColor = {
							red: 255,
							green: 0,
							blue: 0
						};
						this.pickColor = JSON.stringify({
							red: 255,
							green: 0,
							blue: 0
						});
						resolve(rect);
					})
					.exec();
			});
		},
		onInputColor: throttle(function (event, key = 'red') {
			if (!key) return;
			this.coustomColor[key] = event?.detail || 0;
			if (this.coustomColor.red > 255) this.coustomColor.red = 255;
			if (this.coustomColor.green > 255) this.coustomColor.green = 255;
			if (this.coustomColor.blue > 255) this.coustomColor.blue = 255;
			if (
				this.coustomColor.red !== '' &&
				this.coustomColor.green !== '' &&
				this.coustomColor.blue !== ''
			) {
				this.$emit('change', this.coustomColor);
			}
		}, 500),
		onFocus(e) {
			console.log(this.$refs.onFocus1);
			console.log((this.$refs.onFocus1.selectionStart = 0));
			console.log((this.$refs.onFocus1.selectionEnd = 10));
			this.$refs.onFocus1.select();
			console.log(e);
			console.log(3423);
		},
		onSlide: throttle(function (e) {
			uni.vibrateShort();
			if (e.touches) {
				let x = e.changedTouches[0].x * this.dpr;
				let y = e.changedTouches[0].y * this.dpr;
				if (e.type !== 'touchend') {
					x = e.touches[0].x * this.dpr;
					y = e.touches[0].y * this.dpr;
				}
				//复制画布上指定矩形的像素数据
				const result = colorPickerCtx.getImageData(x, y, 1, 1);
				// 转换成hsl格式，获取旋转角度
				let h = util.rgb2hsl(result.data[0], result.data[1], result.data[2]);
				// 判断是否在圈内
				if (h[1] == 1) {
					this.pickColor = JSON.stringify({
						red: result.data[0],
						green: result.data[1],
						blue: result.data[2]
					});
					this.coustomColor = {
						red: result.data[0],
						green: result.data[1],
						blue: result.data[2]
					};
					this.$emit('change', {
						red: result.data[0],
						green: result.data[1],
						blue: result.data[2]
					});
					util.drawSlider(
						sliderCtx,
						this.valueWidthOrHerght * this.dpr,
						this.valueWidthOrHerght * this.dpr,
						h[0],
						this.dpr
					);
				}
			}
		}, 100)
	}
};
</script>

<style lang="scss" scope>
.color-picker_wrap {
	height: 260px;
	.color-picker_tab {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;
		::v-deep .van-tabs {
			width: 180px;
			margin-top: -2px;
			.van-tabs__wrap {
				height: 26px;
			}
			.van-tabs__scroll {
				background: none;
				.van-tab {
					font-size: $uni-font-size-lm;
					line-height: 26px;
					color: $uni-text-color;
					&.van-tab--active {
						color: #fff;
					}
				}
			}
		}
	}

	.color_picker_box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.color-picker-view {
			position: relative;
			flex-shrink: 0;
			margin-bottom: 30rpx;
			.logo_icon {
				width: 90rpx;
				height: 90rpx;
				position: absolute;
				left: 50%;
				top: 52%;
				transform: translateX(-50%) translateY(-55%);
				z-index: 11;
			}

			.color-picker {
				background: rgba(0, 0, 0, 0);
				flex-shrink: 0;
			}

			.color-picker-slider {
				background: rgba(0, 0, 0, 0);
				flex-shrink: 0;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 10;
			}
		}

		.color_picker_tips {
			color: $uni-text-color;
			font-size: $uni-font-size-mm;
		}
	}

	.custom_color_box {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
		padding: 0 30rpx;

		.result_color__box {
			flex-shrink: 0;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;

			.logo_icon {
				width: 90rpx;
				height: 90rpx;
				transform: translateY(-10%);
			}
		}

		.color_picker_tips {
			color: $uni-text-color;
			font-size: $uni-font-size-mm;
			margin-bottom: 20rpx;
		}

		.custom_color_form {
			display: flex;
			justify-content: center;
			align-items: center;

			.color_item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				& + .color_item {
					margin-left: 20rpx;
				}

				.fixed_bg_li {
					width: 100%;
					height: 60%;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 9999;
				}

				::v-deep van-field {
					padding: 0 !important;
					.van-cell {
						padding: 0 !important;
						background: none !important;
						border: 1rpx solid rgba(255, 255, 255, 0.05);
						&:after {
							display: none;
						}
					}

					.input-placeholder {
						font-size: $uni-font-size-lm;
						font-weight: normal;
						text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
						color: rgba(255, 255, 255, 0.5) !important;
					}

					.van-field__body {
						.van-field__control {
							width: 130rpx !important;
							min-height: 50rpx !important;
							height: 50rpx !important;
							line-height: 50rpx !important;
							font-size: 32rpx;
							text-shadow: 0px 1rpx 5rpx rgba(0, 0, 0, 0.5);
							color: rgba(255, 255, 255, 1) !important;
						}
					}
				}

				&:nth-of-type(1) {
					van-field {
						border-color: rgba(255, 0, 0, 1) !important;
						background: rgba(255, 0, 0, 1) !important;
					}
				}

				&:nth-of-type(2) {
					van-field {
						border-color: rgba(0, 255, 0, 1) !important;
						background: rgba(0, 255, 0, 1) !important;
					}
				}

				&:nth-of-type(3) {
					van-field {
						border-color: rgba(0, 40, 255, 1) !important;
						background: rgba(0, 40, 255, 1) !important;
					}
				}

				text {
					font-size: 32rpx;
					margin-top: 2px;
				}
			}
		}
	}
}
</style>
