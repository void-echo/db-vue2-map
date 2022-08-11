import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map'
import './plugins/element.js'
import router from './router'

Vue.config.productionTip = false

Vue.use(BaiduMap, {
  ak: '2k5OisLCPPfHTLjCuAv6SjaR6rbOs9Yv'
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

