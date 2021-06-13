<template>
  <div>
    <h4>生产管理>产品生产工序设计>制定产品生产工序设计单</h4>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="菜单">
        <el-cascader  v-model="formInline.value2" :options="formInline.options"  :props="{checkStrictly: true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.value2"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="字段">
        <el-input
          placeholder="请输入查询内容"
          v-model="formInline.input"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="150">
      </el-table-column>
      <el-table-column label="配送信息">
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column label="地址">
          <el-table-column
            prop="province"
            label="省份"
            width="120">
          </el-table-column>
          <el-table-column
            prop="city"
            label="市区"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            width="300">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="邮编"
            width="120">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
      name: "DesignProcedureAdd",
      data(){
          return {
            formInline:{
              value2: '',
              options:[],
              input:"",
            },
            tableData: []
          };
        },
      methods: {
        deleteRow(index, rows) {
          rows.splice(index, 1);
        },
        onSubmit() {
          console.log('submit!');
        },
        getDate(){
          this.$axios.get("Config/queryAll").then((response)=>{
            this.formInline.options=response.data;
          }).catch();
        }
      },
      created(){
        this.getDate();
      },
    }
</script>

<style scoped>

</style>
