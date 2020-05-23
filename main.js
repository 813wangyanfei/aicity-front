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
Vue.prototype.getUser = function(backpage) {
    var USER = uni.getStorageSync('userInfo'); //本地持久化存储
    if (USER == '') {
        uni.reLaunch({ url: '/pages/login/login?backpage=' + backpage });
        return false;
    }
   // var user = JSON.parse(USER)
    return USER;
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
