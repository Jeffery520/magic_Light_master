<template></template>
<script>
export default {
	globalData: {},
	onLaunch() {
		const bleData = this.$store.getters.bleData;
		this.$store.dispatch('setBleData', {
			...bleData,
			ecUserPassword: '',
			ecUserPasswordPassed: '0'
		});
		setTimeout(() => {
			uni.$emit('onShow');
		}, 2500);
	},
	onShow() {
		uni.$emit('onShow');
	},
	methods: {}
};
</script>

<style lang="scss">
@import '@/styles/index.scss';
@import '@/styles/page.scss';
@import '@/wxcomponents/vant-weapp/common/index.css';
page {
	// Component Colors
	--text-color: #8f98b7;
	--toast-background-color: rgba(35, 41, 72, 0.95);
}
</style>
