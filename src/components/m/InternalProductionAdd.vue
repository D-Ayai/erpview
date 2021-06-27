<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-edit"></el-step>
        <el-step title="内部生产管理" icon="el-icon-printer"></el-step>
        <el-step title="生产登记" icon="el-icon-notebook-2"></el-step>
      </el-steps>
    </h4>



  </div>
</template>

<script>
    export default {
        name: "InternalProductionAdd"
    }
</script>

<style scoped>

</style>
