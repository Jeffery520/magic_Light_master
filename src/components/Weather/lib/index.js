import weatherIcon from '@/static/iconfont/iconfont.json';

const iconItems = [
	{
		name: '白天-多云',
		keyword: '多云, 少云, 阴, 晴间多云'
	},
	{
		name: '白天-大雨',
		keyword: '大雨, 暴雨, 大暴雨, 特大暴雨, 强阵雨, 阵雨'
	},
	{
		name: '白天-雷',
		keyword: '雷阵雨, 强雷阵雨, 雷阵雨并伴有冰雹'
	},
	{
		name: '白天-沙尘暴',
		keyword: '沙尘暴, 浮尘, 扬沙, 强沙尘暴'
	},
	{
		name: '白天-多云转晴',
		keyword: '晴间多云'
	},
	{
		name: '白天-雾霾',
		keyword: '霾, 中度霾, 重度霾, 严重霾'
	},
	{
		name: '白天-大雪',
		keyword: '大雪, 暴雪, 大雪-暴雪'
	},
	{
		name: '白天-小雪',
		keyword: '小雪, 小雪-中雪'
	},
	{
		name: '白天-中雪',
		keyword: '中雪, 中雪-大雪'
	},
	{
		name: '白天-小雨',
		keyword: '小雨, 毛毛雨/细雨, 小雨-中雨'
	},
	{
		name: '白天-中雨',
		keyword: '中雨, 中雨-大雨'
	},
	{
		name: '晚上-晴',
		keyword: '晴, 微风, 平静, 有风'
	},
	{
		name: '晚上-多云',
		keyword: '多云'
	},
	{
		name: '晚上-大雨',
		keyword: '大雨'
	},
	{
		name: '晚上-小雨',
		keyword: '小雨'
	},
	{
		name: '晚上-雷',
		keyword: '雷阵雨'
	},
	{
		name: '晚上-雪',
		keyword: '雪'
	},
	{
		name: '晚上-中雨',
		keyword: '中雨'
	},
	{
		name: '白天-晴',
		keyword: '晴, 少云, 晴间多云, 平静, 微风, 和风, 清风'
	},
	{
		name: '白天-冰雹',
		keyword: '冰雹'
	}
];

export const getWeatherIcon = (name = '') => {
	// 获取当前时间
	const now = new Date();

	// 获取当前小时
	const hour = now.getHours();

	// 判断是白天还是夜晚
	const timeOfDay = hour >= 6 && hour < 18 ? '白天' : '晚上';

	const { css_prefix_text, glyphs } = weatherIcon || {};

	const iconItem = iconItems.find((item) => {
		return (
			item.keyword.split(',').includes(name) && item.name.includes(timeOfDay)
		);
	});

	const iconName = iconItem?.name || `${timeOfDay}-晴`;

	const target = glyphs.find((item) => {
		return item.name.includes(iconName);
	});

	return `${css_prefix_text}${target?.font_class}`;
};
