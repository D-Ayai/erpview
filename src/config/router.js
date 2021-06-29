import Vue from 'vue'
import Login from "../components/Login";
import app from '../App'

import VueRouter from 'vue-router'

//Vue组件使用Vue-router组件
Vue.use(VueRouter)

//路由数组
var routes=[{path: "/",component: Login},
  {path:"/app",component:app},
  ];


//路由管理器
export default new VueRouter({
  routes
});



