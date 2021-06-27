<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-edit"></el-step>
        <el-step title="内部生产管理" icon="el-icon-printer"></el-step>
        <el-step title="生产查询" icon="el-icon-search"></el-step>
      </el-steps>
    </h4>



  </div>
</template>

<script>
    export default {
        name: "InternalProductionShow"
    }
</script>

<style scoped>

</style>
