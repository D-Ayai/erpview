import Vue from 'vue'
import App from './App.vue'
//导入elementui
import  'element-ui/lib/theme-chalk/index.css'
import  ElementUI from 'element-ui'
import Router from './config/router'
Vue.use(ElementUI)


//导入axios
import Axios from 'axios'

//设置baseurl   指定为后端的访问路径
Axios.defaults.baseURL="http://localhost:8888";

Vue.prototype.$axios = Axios;

new Vue({
  el: '#app',
  render: h => h(App),
  router:Router   //挂载路由
})
