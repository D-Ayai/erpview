<template>
  <div class="block">
    <span class="demonstration">hover 触发子菜单</span>
    <br>
    <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange"></el-cascader>
  </div>
</template>

<script>
    export default {
        name: "App3",

      methods:{
        getmenudata(){
          this.$axios.get("Config/queryAll").then((response)=>{
            this.menutable=response.data;
          }).catch();
        },
      }
    }
</script>
