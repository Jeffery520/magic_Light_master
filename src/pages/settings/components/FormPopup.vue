<template>
	<van-popup :show="show" :close-on-click-overlay="false">
		<view class="password_popup">
			<view class="password_title">
				<text>{{ formData.title }}设置</text>
			</view>

			<view class="popup_content">
				<van-radio-group direction="horizontal" v-model="formData.value">
					<van-radio
						v-for="item in colorMode"
						:key="item.value"
						use-icon-slot
						:name="item.value"
						@click.native="onRadioClick(item.value)"
					>
						<image
							slot="icon"
							mode="aspectFit"
							:src="formData.value === item.value ? radioIcon2 : radioIcon1"
						/>
						<view class="radio_label">{{ item.label }} {{ item.name }}</view>
					</van-radio>
				</van-radio-group>
			</view>

			<view class="password_footer">
				<view
					class="contact_button contact_button_info"
					plain
					@click="handleCancel"
					>取消</view
				>
				<view class="contact_button" plain @click="handleConfirm">
					<view class="contact_button_inner"> 确认 </view>
				</view>
			</view>
		</view>
	</van-popup>
</template>

<script>
import radioIcon1 from '@/static/images/radio_icon_1.png';
import radioIcon2 from '@/static/images/radio_icon_2.png';

export default {
	options: {
		styleIsolation: 'shared'
	},
	data() {
		return {
			radioIcon1,
			radioIcon2,
			show: false,
			formData: {
				title: '灯条模式',
				code: 'data5',
				value: '00'
			},
			// 灯条模式 00 RGB 01 RBG 02 GRB 03 GBR 04 BRG 05 BGR
			colorMode: [
				{ label: 'RGB', value: '00', name: '红绿蓝' },
				{ label: 'RBG', value: '01', name: '红蓝绿' },
				{ label: 'GRB', value: '02', name: '绿红蓝' },
				{ label: 'GBR', value: '03', name: '绿蓝红' },
				{ label: 'BRG', value: '04', name: '蓝红绿' },
				{ label: 'BGR', value: '05', name: '蓝绿红' }
			]
		};
	},
	watch: {
		show(val) {
			if (!val) {
				setTimeout(() => {
					this.formData = {
						title: '灯条模式',
						code: 'data5',
						value: '00'
					};
				}, 300);
			}
		}
	},
	methods: {
		onRadioClick(value) {
			uni.vibrateShort();
			this.formData.value = value;
		},
		handleCancel() {
			uni.vibrateShort();
			this.show = false;
			this.formData = {
				title: '灯条模式',
				code: 'data5',
				value: '00'
			};
		},
		handleConfirm() {
			uni.vibrateShort();
			this.$emit('confirm', this.formData);
		}
	}
};
</script>

<style lang="scss" scoped>
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

	.popup_content {
		padding: 30rpx 0;
		::v-deep .van-radio-group {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			.van-radio {
				flex-grow: 1;
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 16rpx;

				image {
					width: 34rpx;
					height: 34rpx;
				}

				.van-radio__label {
					font-size: $uni-font-size-base;
					color: $uni-text-color;
					padding-left: 10rpx;
				}

				.van-radio__icon-wrap {
					display: flex;
					align-items: center;
				}
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
			margin-top: 0;
			& + .contact_button {
				margin-left: 20rpx;
			}
		}
	}
}
</style>
