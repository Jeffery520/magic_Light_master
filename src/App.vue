<template></template>
<script>
export default {
	globalData: {},
	onLaunch() {
		const zoneDataA = [
			{
				code: '01',
				name: '自定义分区名',
				mode: '00',
				mode2: '00',
				value1: '50', // 灯光数量
				value2: '10', // 亮度
				value3: '00', // 呼吸节奏
				value4: 'FF,FF,FF', // 颜色
				value5: 100, // 爆闪节奏
				weather: {
					name: '晴天',
					humidity: '--',
					temperature: '--'
				},
				// 信号关联设置
				signal: [
					{
						code: '00',
						name: '启动',
						value: '01',
						icon: 'sing_1.png',
						keys: ['01', '02']
					},
					// {
					// 	code: '01',
					// 	name: '行车',
					// 	value: '03',
					//  icon: 'sing_2.png',
					// 	keys: ['03', '04', '05', '06', '07']
					// },
					{
						code: '04',
						name: '转向',
						value: '04',
						icon: 'sing_3.png',
						keys: ['04', '05']
					},
					{
						code: '02',
						name: '刹车',
						value: '06',
						icon: 'sing_4.png',
						keys: ['06', '07', '08', '09']
					}
				]
			},
			{
				code: '02',
				name: '自定义分区名',
				mode: '00',
				mode2: '00',
				value1: '50', // 灯光数量
				value2: '10', // 亮度
				value3: '00', // 呼吸节奏
				value4: 'FF,FF,FF', // 颜色
				value5: 100, // 爆闪节奏
				weather: {
					name: '晴天',
					humidity: '--',
					temperature: '--'
				},
				// 信号关联设置
				signal: [
					{
						code: '00',
						name: '启动',
						value: '01',
						icon: 'sing_1.png',
						keys: ['01', '02']
					},
					// {
					// 	code: '01',
					// 	name: '行车',
					// 	value: '03',
					//  icon: 'sing_2.png',
					// 	keys: ['03', '04', '05', '06', '07']
					// },
					{
						code: '04',
						name: '转向',
						value: '04',
						icon: 'sing_3.png',
						keys: ['04', '05']
					},
					{
						code: '02',
						name: '刹车',
						value: '06',
						icon: 'sing_4.png',
						keys: ['06', '07', '08', '09']
					}
				]
			},
			{
				code: '03',
				name: '自定义分区名',
				mode: '00',
				mode2: '00',
				value1: '50', // 灯光数量
				value2: '10', // 亮度
				value3: '00', // 呼吸节奏
				value4: 'FF,FF,FF', // 颜色
				value5: 100, // 爆闪节奏
				weather: {
					name: '晴天',
					humidity: '--',
					temperature: '--'
				},
				// 信号关联设置
				signal: [
					{
						code: '00',
						name: '启动',
						value: '01',
						icon: 'sing_1.png',
						keys: ['01', '02']
					},
					// {
					// 	code: '01',
					// 	name: '行车',
					// 	value: '03',
					//  icon: 'sing_2.png',
					// 	keys: ['03', '04', '05', '06', '07']
					// },
					{
						code: '04',
						name: '转向',
						value: '04',
						icon: 'sing_3.png',
						keys: ['04', '05']
					},
					{
						code: '02',
						name: '刹车',
						value: '06',
						icon: 'sing_4.png',
						keys: ['06', '07', '08', '09']
					}
				]
			}
		];
		const zoneDataB = [
			{
				code: '00',
				name: '尾灯显模式 —— 分区1',
				children: [
					{
						code: '00',
						name: '启动',
						value: '01',
						keys: ['01', '02']
					},
					{
						code: '01',
						name: '行车',
						value: '03',
						keys: ['03', '04', '05', '06', '07']
					},
					{
						code: '04',
						name: '转向',
						value: '00',
						keys: ['00', '0A', '04', '05']
					},
					{
						code: '02',
						name: '刹车',
						value: '08',
						keys: ['08', '09', '0A', '0B']
					}
				]
			},
			{
				code: '02',
				name: '转向灯显模式 —— 分区2',
				children: [
					{
						code: '00',
						name: '启动',
						value: '01',
						keys: ['01', '02']
					},
					{
						code: '01',
						name: '行车',
						value: '00',
						keys: ['00', '03', '04', '05']
					},
					{
						code: '04',
						name: '转向',
						value: '00',
						keys: ['00', '0A']
					},
					{
						code: '02',
						name: '刹车',
						value: '08',
						keys: ['08', '09', '0A', '0B']
					}
				]
			},
			{
				code: '01',
				name: '飞机灯显模式 —— 分区3',
				children: [
					{
						code: '00',
						name: '启动',
						value: '01',
						keys: ['01', '02']
					},
					{
						code: '01',
						name: '行车',
						value: '03',
						keys: ['03', '04', '05', '06', '07']
					},
					{
						code: '04',
						name: '转向',
						value: '00',
						keys: ['00', '0A', '04', '05']
					},
					{
						code: '02',
						name: '刹车',
						value: '08',
						keys: ['08', '09', '0A', '0B']
					}
				]
			}
		];
		this.$store.dispatch('setZoneDataA', zoneDataA);
		this.$store.dispatch('setZoneDataB', zoneDataB);

		const turnLockMode = {
			code: '81',
			name: '刹车模式',
			value: '00',
			keys: [
				{ code: '00', name: '低刹' },
				{ code: '01', name: '高刹' }
			]
		};

		this.$store.dispatch('setTurnLockMode', turnLockMode);
		// const zoneDataB = [
		// 	{
		// 		code: '00',
		// 		name: '尾灯显模式 —— 分区1',
		// 		children: [
		// 			{
		// 				code: '00',
		// 				name: '启动',
		// 				value: '01',
		// 				keys: ['01', '02']
		// 			},
		// 			{
		// 				code: '01',
		// 				name: '行车',
		// 				value: '03',
		// 				keys: ['03', '04', '05', '06', '07']
		// 			},
		// 			{
		// 				code: '04',
		// 				name: '转向',
		// 				value: '00',
		// 				keys: ['00', '0A', '04', '05']
		// 			},
		// 			{
		// 				code: '02',
		// 				name: '刹车',
		// 				value: '08',
		// 				keys: ['08', '09', '0A', '0B']
		// 			}
		// 		]
		// 	},
		// 	{
		// 		code: '02',
		// 		name: '转向灯显模式 —— 分区2',
		// 		children: [
		// 			{
		// 				code: '00',
		// 				name: '启动',
		// 				value: '01',
		// 				keys: ['01', '02']
		// 			},
		// 			{
		// 				code: '01',
		// 				name: '行车',
		// 				value: '00',
		// 				keys: ['00', '03', '04', '05']
		// 			},
		// 			{
		// 				code: '04',
		// 				name: '转向',
		// 				value: '00',
		// 				keys: ['00', '0A']
		// 			},
		// 			{
		// 				code: '02',
		// 				name: '刹车',
		// 				value: '08',
		// 				keys: ['08', '09', '0A', '0B']
		// 			}
		// 		]
		// 	},
		// 	{
		// 		code: '01',
		// 		name: '飞机灯显模式 —— 分区3',
		// 		children: [
		// 			{
		// 				code: '00',
		// 				name: '启动',
		// 				value: '01',
		// 				keys: ['01', '02']
		// 			},
		// 			{
		// 				code: '01',
		// 				name: '行车',
		// 				value: '03',
		// 				keys: ['03', '04', '05', '06', '07']
		// 			},
		// 			{
		// 				code: '04',
		// 				name: '转向',
		// 				value: '00',
		// 				keys: ['00', '0A', '04', '05']
		// 			},
		// 			{
		// 				code: '02',
		// 				name: '刹车',
		// 				value: '08',
		// 				keys: ['08', '09', '0A', '0B']
		// 			}
		// 		]
		// 	}
		// ];
		// this.$store.dispatch('setZoneDataB', zoneDataB);
		//
		// const turnLockMode = {
		// 	code: '81',
		// 	name: '刹车模式',
		// 	value: '00',
		// 	keys: [
		// 		{ code: '00', name: '低刹' },
		// 		{ code: '01', name: '高刹' }
		// 	]
		// };
		//
		// this.$store.dispatch('setTurnLockMode', turnLockMode);

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
