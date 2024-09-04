<template>
	<view class="view-container">
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
			<view class="my_ble_wrap">
				<BLEStatus v-if="showBle" />
			</view>

			<PageA v-if="bleType === 'A'" />
			<PageB v-else />
		</view>

		<TabBar current="/pages/mine/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import BLEStatus from '@/components/BLEStatus/index.vue';
import TabBar from '@/components/TabBar/index.vue';
import PageA from './components/pageA.vue';
import PageB from './components/pageB.vue';

export default {
	components: {
		NavBar,
		TabBar,
		BLEStatus,
		PageA,
		PageB
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
		bleMcuData() {
			return this.$store.getters.bleMcuData;
		},
		getBleData() {
			return this.$store.getters.bleData;
		},
		bleType() {
			const bleName = this.getBleData.connectedDeviceList?.[0]?.name || '';
			return bleName.indexOf('GMasterLamp') >= 0 ? 'B' : 'A';
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

<style lang="scss" scope>
.content_wrap {
	position: relative;
}
</style>
