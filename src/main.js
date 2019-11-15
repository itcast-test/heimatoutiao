import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'

// 设置 axios的常态地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

// 将axios共享给所有的实例使用
Vue.prototype.$axios = axios

// 注册整个的所有的elementUI组件
// Vue.use 调用了elementUI里面的一个方法 install => 调用时 传入了 Vue对象
Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
