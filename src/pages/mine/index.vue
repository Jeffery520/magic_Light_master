<template>
	<view class="view-container">
		<nav-bar>{{ title }}</nav-bar>
		<view class="content_wrap">
			<view class="my_ble_wrap">
				<BLEStatus v-if="showBle" />
			</view>

			<PageA />
		</view>

		<TabBar current="/pages/mine/index" />
	</view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue';
import BLEStatus from '@/components/BLEStatus/index.vue';
import TabBar from '@/components/TabBar/index.vue';
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
		bleMcuData() {
			return this.$store.getters.bleMcuData;
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

<style lang="scss" scope>
.content_wrap {
	position: relative;
}
</style>
