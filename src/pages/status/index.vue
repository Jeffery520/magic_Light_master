<template>
	<view class="view-container">
		<van-toast id="van-toast" />
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
			<view class="my_ble_wrap">
				<BLEStatus v-if="showBle" :showState="false" />
			</view>
			<PageA />
		</view>
		<TabBar current="/pages/status/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import TabBar from '@/components/TabBar/index.vue';
import BLEStatus from '@/components/BLEStatus/index.vue';
import PageA from './components/pageA.vue';

export default {
	components: {
		NavBar,
		TabBar,
		BLEStatus,
		PageA
	},

	data() {
		return {
			showBle: false
		};
	},
	computed: {
		title() {
			return this.$config.title;
		},
		getBleData() {
			return this.$store.getters.bleData;
		}
	},
	onShow() {
		this.showBle = true;
	},
	onHide() {
		this.showBle = false;
	}
};
</script>

<style lang="scss" scope></style>
