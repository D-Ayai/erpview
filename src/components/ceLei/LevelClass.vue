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
          var c = this.value[0];
          var b = this.value[1];
          var a = this.value[2];
          console.log(c+b+a);
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
