import Vue from 'vue'
import App from './App'
import VueJsonp from 'vue-jsonp'
import uniRequest from 'uni-request';
import BaiduMap from 'vue-baidu-map'


Vue.use(BaiduMap, {
  ak: 'omIE3XVgOWbo0jE7Ow9QfjHcYTwmvR9V'
})

Vue.use(VueJsonp);
Vue.config.productionTip = false
Vue.prototype.websiteUrl  = 'http://39.98.75.50:9080'

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()