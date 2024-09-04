import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'; // 引入数据持久化插件

Vue.use(Vuex);

/** -------------------氛围灯数据------------------- **/
/** 蓝牙设置数据 **/
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

/** 氛围灯模式 **/
// 参数设置 灯珠数量（0~50） 亮度（0~10）呼吸节奏（0~10）
const zoneModesA = [
	{
		name: '颜色自定义',
		code: '00',
		options: [] // 0~255,0~255,0~255
	},
	{
		name: '情景模式',
		code: '01',
		options: [
			{ name: '悠闲骑行', code: '00' },
			{ name: '极速赛道', code: '01' },
			{ name: '夜深放风', code: '02' },
			{ name: '旅行打卡', code: '03' },
			{ name: '疯狂跑单', code: '04' },
			{ name: '疯狂跑单', code: '05' }
		]
	},
	{
		name: '人群模式',
		code: '02',
		options: [
			{ name: '文艺青年', code: '00' },
			{ name: '鬼火少年', code: '01' },
			{ name: '夜店王子', code: '02' },
			{ name: '小镇青年', code: '03' },
			{ name: '恋爱脑', code: '04' },
			{ name: '白领一族', code: '05' }
		]
	},
	{
		name: '天气模式',
		code: '03',
		options: [] // 温度值（0~100）0对应 -50度 50对应 0度 100对应 50度  湿度值 0~100
	},
	{
		name: '心情模式',
		code: '04',
		options: [
			{ name: '怦然心动', code: '00' },
			{ name: 'emo了', code: '01' },
			{ name: '缓解焦虑', code: '02' },
			{ name: '喜悦发生', code: '03' },
			{ name: '满怀期待', code: '04' },
			{ name: '平心静气', code: '05' }
		]
	},
	{
		name: '爆闪模式',
		code: '05',
		options: [] // 0-10
	}
];

/** 信号关联模式 **/
const zoneKeysDataA = {
	'00': '无模式',
	'01': '流水动画渐亮',
	'02': '扫描动画渐亮',
	'03': '爆闪3次后高亮',
	'04': '流水动画',
	'05': '流星动画',
	'06': '爆闪3次后高亮',
	'07': '爆闪5次后高亮',
	'08': '连续爆闪',
	'09': '高亮',
	'0A': '爆闪1次渐灭',
	'0B': '爆闪3次渐灭'
};

/** -------------------尾灯数据------------------- **/
/** 蓝牙设置数据 **/
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
/** 信号关联模式 **/
const zoneKeysDataB = {
	'00': '无模式',
	'01': '爆闪1次渐亮',
	'02': '爆闪3次渐亮',
	'03': '呼吸',
	'04': '领航闪',
	'05': '啪啪闪',
	'06': '常亮',
	'07': '模式循环',
	'08': '爆闪3次后高亮',
	'09': '爆闪5次后高亮',
	'0A': '连续爆闪',
	'0B': '高亮',
	'0C': '爆闪1次渐灭',
	'0D': '爆闪3次渐灭'
};

const store = new Vuex.Store({
	state: {
		bleData: {},
		myBleList: [],
		zoneDataA: zoneDataA,
		zoneDataB: zoneDataB,
		zoneModesA: zoneModesA,
		zoneKeysDataA: zoneKeysDataA,
		zoneKeysDataB: zoneKeysDataB,
		turnLockMode: {
			code: '81',
			name: '刹车模式',
			value: '00',
			keys: [
				{ code: '00', name: '低刹' },
				{ code: '01', name: '高刹' }
			]
		},
		bleMcuData: {
			protocol: '',
			mcuVersion: ''
		}
	},
	mutations: {
		SET_MCU_DATA(state, data) {
			state.bleMcuData = data;
		},
		SET_BLE_DATA(state, data) {
			state.bleData = data;
		},
		SET_MY_BLE_LIST(state, data) {
			state.myBleList = data;
		},
		SET_ZONE_DATA_A(state, data) {
			state.zoneDataA = data;
		},
		SET_ZONE_DATA_B(state, data) {
			state.zoneDataB = data;
		},
		SET_LOCK_MODE(state, data) {
			state.turnLockMode = data;
		}
	},
	actions: {
		setMcuData({ commit }, data) {
			commit('SET_MCU_DATA', data);
		},
		setBleData({ commit }, data) {
			commit('SET_BLE_DATA', data);
		},
		setMyBleList({ commit }, data) {
			commit('SET_MY_BLE_LIST', data);
		},
		setZoneDataA({ commit }, data) {
			commit('SET_ZONE_DATA_A', data);
		},
		setZoneDataB({ commit }, data) {
			commit('SET_ZONE_DATA_B', data);
		},
		setTurnLockMode({ commit }, data) {
			commit('SET_LOCK_MODE', data);
		}
	},
	getters: {
		zoneModesA: () => {
			return zoneModesA;
		},
		zoneKeysDataA: () => {
			return zoneKeysDataA;
		},
		zoneKeysDataB: () => {
			return zoneKeysDataB;
		},
		bleData: (state) => {
			return state.bleData;
		},
		myBleList: (state) => {
			return state.myBleList;
		},
		zoneDataA: (state) => {
			return state.zoneDataA;
		},
		zoneDataB: (state) => {
			return state.zoneDataB;
		},
		turnLockMode: (state) => {
			return state.turnLockMode;
		},
		bleMcuData: (state) => {
			return state.bleMcuData;
		}
	},
	plugins: [
		createPersistedState({
			storage: {
				// 获取
				getItem: (key) => uni.getStorageSync(key),
				// 存储
				setItem: (key, value) => uni.setStorageSync(key, value),
				// 删除
				removeItem: (key) => uni.removeStorageSync(key)
			}
			// reducer(val) {
			// 	return {
			// 		bleData: val.bleData,
			// 		bleMcuData: val.bleMcuData,
			// 		myBleList: val.myBleList
			// 	};
			// }
		})
	]
});

export default store;
