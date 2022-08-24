import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import VueKinesis from 'vue-kinesis'
import VueFirework from 'vue-firework'
import VueTypedJs from 'vue-typed-js'



Vue.use(VueTypedJs)


Vue.use(VueFirework)

Vue.use(VueKinesis)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

