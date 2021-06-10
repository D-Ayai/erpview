<template>
  <div class="block">
    <span class="demonstration">产品级别分类</span>
    <el-cascader
      v-model="value"
      :options="ops"
      @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
    export default {
        data(){
            return{
              value: [],
              ops:[],
            };
        },
      methods: {
        handleChange(value) {
          console.log(value);
        },
        getDate(){
          this.$axios.get("Config/queryAll").then((response)=>{
            this.ops=response.data;
          }).catch();
        }
      },
      created(){
        this.getDate();
      },
    };
</script>

<style scoped>

</style>
