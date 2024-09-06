<template>
	<view class="view-container">
		<van-toast id="van-toast" />
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
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
					<button class="contact_button" open-type="contact" plain>
						<view class="contact_button_inner">联系客服</view>
					</button>
					<button class="contact_button" plain @click="handleClearCache">
						<view class="contact_button_inner">清理缓存</view>
					</button>
				</van-transition>
			</view>
		</view>
		<TabBar current="/pages/service/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import TabBar from '@/components/TabBar/index.vue';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';

export default {
	components: {
		NavBar,
		TabBar
	},
	data() {
		return {
			showLogo: false
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
	},
	methods: {
		handleClearCache() {
			uni.vibrateShort();
			this.$store.dispatch('clearState');
			uni.clearStorage();
			Toast.success('清理成功');
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
			width: 680rpx;
			height: 200rpx;
			margin: 120rpx 0;
		}
		.my_logo2 {
			width: 468rpx;
			height: 300rpx;
			margin-bottom: 80rpx;
		}
	}
	.contact_button {
		width: 420rpx;
		height: 70rpx;
		margin-top: 40rpx;
		&:first-child {
			margin-top: 0;
		}
	}
}
</style>
