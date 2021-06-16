import Vue from 'vue'
import App from './App.vue'
import fileadd from './file/Fileadd.vue'
import leve from './components/LevelClass.vue'
import filepage from './file/Filepage.vue'
import filequery from './file/Filequery.vue'
import filechange from './file/Filechange.vue'
import DesignProcedureAdd from './components/m/DesignProcedureAdd.vue'
import filedeletion from './file/Filedeletion.vue'
import filerecovery from './file/Filerecovery.vue'
import filepermanentlydeleted from './file/Filepermanentlydeleted.vue'
import login from './components/Login.vue'
import Inven from './components/cell/Inventoryquery.vue'
//导入elementui
import  'element-ui/lib/theme-chalk/index.css'
import  ElementUI from 'element-ui'

Vue.use(ElementUI)

//导入axios
import Axios from 'axios'

//设置baseurl   指定为后端的访问路径
Axios.defaults.baseURL="http://localhost:8888";

Vue.prototype.$axios = Axios;

new Vue({
  el: '#app',
  render: h => h(App)
})
