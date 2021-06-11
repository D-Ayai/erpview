<template>
  <div class="homeWrap">
    <el-container style="height:100%">

      <!--头部-->
      <el-header   height="75px">
          <!--头部导航-->
          <!--黑色背景设置   background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" -->
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#333" active-text-color="#049b78" >
            <el-menu-item >
              <template>
                <span>欢迎使用后端系统</span>
              </template>
            </el-menu-item>
            <!-- 头部的导航菜单-->
            <el-submenu :index="toumenu.id+''" v-for="toumenu in menutable">
              <template slot="title">
                <i :class="toumenu.linkUrl"></i>
                <span>{{toumenu.name}}</span>
              </template>
            </el-submenu>

            <el-menu-item style="margin-left: 50%" >
              <template slot="title">
                <el-dropdown size="mini" @command="handleCommand"  type="primary">
                  <el-avatar :size="50"  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a"><el-link type="primary">{{user.name}}的信息</el-link></el-dropdown-item>
                    <el-dropdown-item command="e" divided><el-link type="danger">退出登入</el-link></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-menu-item>



          </el-menu>

      </el-header>


      <el-container >
        <!--左部-->
        <el-aside style="width:250px;">
          <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <!--一级菜单-->
            <el-submenu :index="parentmenu.id+''" v-for="parentmenu in menutable">
              <template slot="title">
                <i :class="parentmenu.linkUrl"></i>
                <span style="font-weight:bold">{{parentmenu.name}}</span>
              </template>
              <!--二级菜单-->
              <el-submenu :index="childmenu.id+''" v-for="childmenu in parentmenu.childMenu">
                <template slot="title">
                  <i :class="childmenu.iconUrl"></i>
                  <span>{{childmenu.name}}</span>
                </template>
                <!--三级菜单-->
                <el-menu-item v-if="cd.childMenu.length === 0" @click="addTab(cd.name,cd.linkUrl)" :index="cd.id+''" v-for="cd in childmenu.childMenu">
                  <i :class="cd.iconUrl"></i>
                  <span>{{cd.name}}</span>
                </el-menu-item>

                <el-submenu v-if="cd.childMenu.length !== 0" :index="cd.id+''" v-for="cd in childmenu.childMenu">
                  <template slot="title">
                    <i :class="cd.iconUrl"></i>
                    <span>{{cd.name}}</span>
                  </template>
                  <!--三级菜单-->
                  <el-menu-item  @click="addTab(cdd.name,cdd.linkUrl)" :index="cdd.id+''" v-for="cdd in cd.childMenu">
                    <i :class="cdd.iconUrl"></i>
                    <span>{{cdd.name}}</span>
                  </el-menu-item>
                </el-submenu>
              </el-submenu>

            </el-submenu>

          </el-menu>

        </el-aside>

        <!--右部-->
        <el-main>


          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
              v-for="(item,index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <component :is="item.content"></component>
            </el-tab-pane>
          </el-tabs>


        </el-main>
      </el-container>


    </el-container>
  </div>
</template>

<script>

  //导入组件

  import UserList from "./components/UserList";
  import RoleList from "./components/RoleList";
  import MenuList from "./components/MenuList";
  import PerList from "./components/PerList";
  import Welcome from "./components/Welcome";
  import DesignProcedureAdd from "./components/m/DesignProcedureAdd";

  export default {
    name: "App",
    data(){
      return {
        user:{id:"1",name:"abc"},//登入用户的账户
        activeIndex: '1',//一级菜单选择的值
        menutable:[],//菜单
        editableTabsValue: '1',  // 设置选中的
        editableTabs: [{   //tab选项卡显示的数据内容
          title: '首页',
          name: '1',
          content: 'Welcome'
        }],
        tabIndex: 1   // 设置到name属性的值
      };
    },
    methods: {
      handleSelect(key, keyPath) {


      },
      handleCommand(command) {
        this.$message('click on item ' + command);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getmenudata(){
        this.$axios.get("Menus/queryallmenus").then((response)=>{
          this.menutable=response.data;
        }).catch();
      },
      //添加标题
      addTab(titlename,linkurl) {

        //判断当前页面是否存在
        var tempobj = this.editableTabs.find((item)=>{return item.title==titlename});
        //存在  active
        if(tempobj!=undefined){
          this.editableTabsValue =tempobj.name ;
        }else {
          //不存在 添加
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: titlename,
            name: newTabName,
            content: linkurl
          });
          this.editableTabsValue = newTabName;
        }

      },
      //移除标题
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }


    },
    created(){
      this.getmenudata();
    },
    components:{
      UserList,RoleList,MenuList,PerList,DesignProcedureAdd
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    color: #333;
    line-height: 60px;

  }

  .el-aside {
    color: #333;
    margin-left: 1%;
  }

  .el-main {
    color: #333;
    text-align: center;

  }


  .homeWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
