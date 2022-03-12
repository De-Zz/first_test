import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入全局css
import './assets/css/global.css'
import store from './store'
// 引用element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);
//引用axios
import axios from 'axios'
import VueAxios from 'vue-axios'
//配置axios根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截qi
axios.interceptors.request.use(config =>{
  //在请求头headers中挂载字段Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})
Vue.prototype.$http = axios
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
