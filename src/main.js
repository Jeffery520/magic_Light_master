import Vue from 'vue';
import App from './App';
import store from '@/store';

import global from './config/global.js';
import Notify from './wxcomponents/vant-weapp/notify/notify';
import '@/static/iconfont/iconfont.css';

Vue.config.productionTip = false;
Vue.config.$store = store;

Object.defineProperty(Vue.prototype, '$config', { value: global });
Object.defineProperty(Vue.prototype, '$notify', { value: Notify });

App.mpType = 'app';

const app = new Vue({
	...App,
	store
});

app.$mount();
