import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map'

Vue.config.productionTip = false

Vue.use(BaiduMap, {
  ak: '2k5OisLCPPfHTLjCuAv6SjaR6rbOs9Yv'
})


new Vue({
  render: h => h(App),
}).$mount('#app');

