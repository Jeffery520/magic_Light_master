<template>
	<view class="view-container">
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
						联系客服
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
	.contact_button {
		width: 420rpx;
		height: 70rpx;
		line-height: 70rpx;
		margin-top: 10vh;
		color: #fff;
		font-size: 14px;
		background: url('/static/images/sing_btn.png') no-repeat;
		background-size: 100% 100%;
		border: none;
	}
}
</style>
