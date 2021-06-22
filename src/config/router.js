import Vue from 'vue'
import Login from "../components/Login";
import Welcome from "../components/Welcome";
import DesignProcedureAdd from "../components/m/DesignProcedureAdd";
import DesignProcedureShengHe from "../components/m/DesignProcedureShengHe";
import DesignProcedureShow from "../components/m/DesignProcedureShow";
import DesignProcedureUpdate from "../components/m/DesignProcedureUpdate";

import VueRouter from 'vue-router'

//Vue组件使用Vue-router组件
Vue.use(VueRouter)

//路由数组
var routes=[
  {path:"/Login",component:Login},
  {path: "/Welcome",component: Welcome},
  {path: "/m/DesignProcedureAdd",component: DesignProcedureAdd},
  {path: "/m/DesignProcedureShengHe",component: DesignProcedureShengHe},
  {path: "/m/DesignProcedureShow",component: DesignProcedureShow},
  {path: "/m/DesignProcedureUpdate",component: DesignProcedureUpdate},
  ];


//路由管理器
export default new VueRouter({
  routes
});



