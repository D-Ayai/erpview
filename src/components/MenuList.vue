<template>
    <div>
      <el-form ref="form" :model="form" label-width="80px" >
        <h2>登入</h2>
        <el-form-item label="账号" prop="name">
          <el-input prefix-icon="el-icon-user"  placeholder="请输入账号" v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input prefix-icon="el-icon-key" placeholder="请输入密码" v-model="form.pwd"  show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" type="info">没有账号?注册一个</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%;height: 100%;" type="primary" @click="onSubmit" round>登入</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: "MenuList"
    }
</script>

<style scoped>

</style>
