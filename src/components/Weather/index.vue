<template>
	<view class="weather_container">
		<view class="weather_wrap">
			<view class="weather_left">
				<text class="iconfont" :class="weatherData.icon"></text>
				<view>
					<text>{{ weatherData.name }}</text>
					<text class="item_label">湿度</text>
					<text>{{ weatherData.humidity }}</text>
				</view>
			</view>

			<view class="weather_center">
				<text class="item_value">{{ weatherData.temperature }}</text>
				<text class="item_superscript">°C</text>
			</view>

			<view class="weather_right"
				><text class="iconfont icon-wifi"></text>
				一键获取您当前的天气状况，由后台Ai根据色彩理念算法疯狂计算组合匹配当前天气的氛围灯效</view
			>
		</view>

		<button
			class="contact_button"
			plain
			:disabled="loading"
			@click="getWeather"
		>
			<view>
				<van-loading v-if="loading" type="spinner" size="16px" />
				同步天气模式</view
			>
		</button>
	</view>
</template>

<script>
import { debounce } from '@/utils/lodash.min.js';
import { weatherIcon } from './lib/index';
import Toast from '@/wxcomponents/vant-weapp/toast/toast';

export default {
	options: {
		styleIsolation: 'shared'
	},
	props: {
		weather: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			loading: false,
			aMap: {
				key: '67ae356fee97b034a6b2723ed1afe430',
				api_geocode: 'https://restapi.amap.com/v3/geocode/regeo',
				api_weather: 'https://restapi.amap.com/v3/weather/weatherInfo'
			},
			weatherData: {
				name: '未知',
				icon: 'icon-554-weizhi',
				humidity: '--',
				temperature: '--'
			}
		};
	},
	watch: {
		weather: {
			handler(val) {
				if (val) {
					const { humidity, temperature, weather } = val || {};
					this.weatherData.name = weather;
					this.weatherData.icon = weatherIcon?.[weather];
					this.weatherData.humidity = humidity || '--';
					this.weatherData.temperature = temperature || '--';
				}
			},
			deep: true
		}
	},
	mounted() {
		this.getWeather();
	},
	methods: {
		getWeather: debounce(function () {
			this.loading = true;
			this._checkSetting(async () => {
				this.loading = true;
				const res1 = await this._getCity();
				if (res1.code === 'fail') {
					Toast(res1.message);
					return;
				}

				const res2 = await this._getAdCode(res1.longitude, res1.latitude);

				if (res2.code === 'fail') {
					Toast(res1.message);
					return;
				}

				const res3 = await this._getWeather(res2);

				if (res3.code === 'fail') {
					Toast(res1.message);
					return;
				}

				const { humidity, temperature, weather } = res3 || {};
				this.weatherData.name = weather;
				this.weatherData.icon = weatherIcon[weather];
				this.weatherData.humidity = humidity || '--';
				this.weatherData.temperature = temperature || '--';

				this.$emit('change', this.weatherData);

				setTimeout(() => {
					this.loading = false;
				}, 300);
			});

			setTimeout(() => {
				this.loading = false;
			}, 10000);
		}, 500),
		_checkSetting(cb) {
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.userLocation']) {
						uni.authorize({
							scope: 'scope.userLocation'
						});
					} else {
						//调用wx.getLocation
						return cb && cb();
					}
				}
			});
		},
		_getCity() {
			return new Promise((resolve) => {
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						console.log(res);
						const { latitude, longitude } = res || {};
						resolve({ latitude, longitude });
					},
					fail(error) {
						resolve({
							code: 'fail',
							message: error?.errMsg || '获取定位失败'
						});
					}
				});
			});
		},
		_getAdCode(longitude, latitude) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: this.aMap.api_geocode,
					data: {
						key: this.aMap.key,
						location: `${longitude},${latitude}`
					},
					method: 'GET',
					success(res) {
						const { status, info, regeocode } = res.data || {};
						if (status === '1' && info === 'OK') {
							const { addressComponent } = regeocode || {};
							const { adcode } = addressComponent || {};
							resolve(adcode);
						} else {
							reject(info);
						}
					},
					fail(error) {
						resolve({
							code: 'fail',
							message: `${error?.errno || '00'}：${
								error?.errMsg || '获取地址失败'
							}`
						});
					}
				});
			});
		},
		_getWeather(adcode) {
			return new Promise((resolve) => {
				uni.request({
					url: this.aMap.api_weather,
					data: {
						key: this.aMap.key,
						city: adcode,
						extensions: 'base',
						output: 'json'
					},
					method: 'GET',
					success(res) {
						const { lives } = res.data || {};
						resolve(lives?.[0] || { weather: '未知' });
					},
					fail(error) {
						resolve({
							code: 'fail',
							message: `${error?.errno || '00'}：${
								error?.errMsg || '获取天气失败'
							}`
						});
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.weather_container {
	.weather_wrap {
		color: #fc7a7a;
		font-size: 24rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		overflow: hidden;
		margin-top: -5px;

		.weather_left {
			width: 30%;
			.iconfont {
				font-size: 54px;
				line-height: 60px;
				height: 56px;
			}
			> view {
				display: flex;
				align-items: center;
				line-height: 1em;
				.item_label {
					margin-left: 10rpx;
					margin-right: 6rpx;
				}
			}
		}
		.weather_center {
			flex-shrink: 0;
			position: relative;
			padding-right: 15px;
			margin: 0 auto;
			transform: translateY(8%);
			.item_value {
				font-size: 90px;
				line-height: 1em;
			}
			.item_superscript {
				position: absolute;
				top: 12px;
				right: 0;
				line-height: 1em;
			}
		}

		.weather_right {
			width: 220rpx;
			font-size: 20rpx;
			padding-left: 15px;
			.iconfont {
				display: block;
				text-align: right;
				font-size: 18px;
			}
		}
	}
	.contact_button {
		width: 360rpx;
		height: 70rpx;
		line-height: 70rpx;
		border: none;
		padding: 0;
		margin-top: 25px;
		background: linear-gradient(to right, #8257f8, #29b7d5);
		border-radius: 70px;
		transition: all 0.2s;
		&:active,
		&:focus,
		&:hover {
			opacity: 0.5;
		}
		> view {
			height: 58rpx;
			line-height: 58rpx;
			background: #1f2a44;
			color: #fff;
			font-size: 14px;
			margin: 6rpx;
			border-radius: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			::v-deep .van-loading {
				margin-right: 15rpx;
			}
		}
	}
}
</style>
