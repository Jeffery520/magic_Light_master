<template>
	<view class="view-container">
		<van-toast id="van-toast" />
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
			<view class="my_ble_wrap">
				<BLEStatus v-if="showBle" :showState="false" />
			</view>
			<PageA v-if="bleType === 'A'" />
			<PageB v-else />
		</view>

		<TabBar current="/pages/settings/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import TabBar from '@/components/TabBar/index.vue';
import BLEStatus from '@/components/BLEStatus/index.vue';
import PageA from './components/pageA.vue';
import PageB from './components/pageB.vue';

export default {
	options: {
		styleIsolation: 'apply-shared'
	},
	components: {
		NavBar,
		TabBar,
		BLEStatus,
		PageA,
		PageB
	},
	data() {
		return {
			loaded: false,
			showBle: false
		};
	},
	computed: {
		title() {
			return this.$config.title;
		},
		getBleData() {
			return this.$store.getters.bleData;
		},
		bleType() {
			const bleName = this.getBleData.connectedDeviceList?.[0]?.name || '';
			return bleName.indexOf('GMasterLamp') >= 0 ? 'B' : 'A';
		}
	},
	onLoad() {
		setTimeout(() => {
			this.loaded = true;
			uni.$emit('checkPassword');
		}, 1000);
	},
	onShow() {
		this.showBle = true;
		this.loaded && uni.$emit('checkPassword');
	},
	onHide() {
		this.showBle = false;
	}
};
</script>

<style lang="scss" scope></style>
