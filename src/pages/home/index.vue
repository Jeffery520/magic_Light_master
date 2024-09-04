<template>
	<view class="view-container">
		<van-toast id="van-toast" />
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
			<BLEStatus :mustConnect="false" @statusChange="onStatusChange" />
			<view class="logo_wrap">
				<van-transition
					:show="showLogo"
					name="fade"
					:duration="{ enter: 500, leave: 500 }"
				>
					<img
						class="my_logo1"
						src="~@/static/images/home_icon_1.png"
						mode="aspectFit"
					/>
				</van-transition>
				<van-transition
					:show="showLogo"
					name="fade-up"
					:duration="{ enter: 500, leave: 500 }"
				>
					<img
						class="my_logo2"
						src="~@/static/images/home_icon_2.png"
						mode="aspectFit"
					/>
				</van-transition>
			</view>
		</view>
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';
import BLEStatus from '@/components/BLEStatus/index.vue';

export default {
	components: {
		NavBar,
		BLEStatus
	},

	data() {
		return {
			showLogo: false,
			connected: false,
			toastType: 'text'
		};
	},
	computed: {
		title() {
			return this.$config.title;
		}
	},
	onLoad() {
		setTimeout(() => {
			this.showLogo = true;
		}, 300);

		setTimeout(() => {
			this.showLogo = false;
			uni.switchTab({
				url: '/pages/status/index'
			});
		}, 2000);
	},
	methods: {
		onStatusChange(val) {
			this.connected = val;
			if (val) {
				uni.switchTab({
					url: '/pages/status/index'
				});
			} else {
				Toast('请连接蓝牙设备');
			}
		}
	}
};
</script>

<style lang="scss" scope>
.content_wrap {
	position: relative;
	.logo_wrap {
		width: 100%;
		top: 30rpx;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		.my_logo1 {
			width: 668rpx;
			height: 195rpx;
			margin: 120rpx 0 180rpx;
		}
		.my_logo2 {
			width: 468rpx;
			height: 300rpx;
		}
	}
}
</style>
