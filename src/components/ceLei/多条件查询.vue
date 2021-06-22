<template>
  <!--多条件查询-->
  <el-form :inline="true" :model="chafrom" class="demo-form-inline" size="mini">
    <el-form-item label="菜单">
      <el-cascader  v-model="chafrom.value" :options="chafrom.options"  :props="{checkStrictly: true }" clearable></el-cascader>
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker
        v-model="chafrom.registerTime"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"
        value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="产品名称">
      <el-input
        placeholder="请输入查询内容"
        v-model="chafrom.tjname"
        clearable>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>


  <!--表格-->
  <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="productId"
      label="产品编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="productName"
      label="产品名称"
      width="140">
    </el-table-column>
    <el-table-column
      prop="productClass"
      label="档次"
      width="140">
    </el-table-column>
    <el-table-column
      prop="firstKindName"
      label="I级类名"
      width="140">
    </el-table-column>
    <el-table-column
      prop="secondKindName"
      label="II级类名"
      width="140">
    </el-table-column>
    <el-table-column
      prop="thirdKindName"
      label="III级类名"
      width="140">
    </el-table-column>
    <el-table-column
      prop="responsiblePerson"
      label="产品经理"
      width="140">
    </el-table-column>
    <el-table-column  label="操作">
      <template slot-scope="scope">
        <el-button type="warning" @click="openeditwin(scope.row.id)">制定设计单</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页-->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageno"
    :page-sizes="[5, 10, 15, 20]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>

</template>

<script>
    export default {
        name: "多条件查询",
        data(){
          return{
            chafrom:{
                value: '',//选中的菜单值
                tjname:"",//产品名称
                options:[],//三级联动菜单
                registerTime:""//时间
            },
            tableData:[],//表单数据
            pageno: 1,//页号
            pagesize: 5,//页大小
            total: 0,//总数据量
          }
        },
      methods: {
        handleSizeChange(val) {  //页size变更
          this.pagesize = val;
          this.pageno = 1;
          this.getdata();
        },
        handleCurrentChange(val) {  //页码变更
          this.pageno = val;
          this.getdata();
        },
        searchcartype() {   //条件查询
          this.getdata();
        },
        onSubmit() {//查询
          this.getdata();
        },
        getdata() {   //获取数据
          var _this = this;
          var params = new URLSearchParams();
          params.append("pageno", this.pageno);//页号
          params.append("pagesize", this.pagesize);//页大小
          params.append("tjname", this.chafrom.tjname);//产品名称
          params.append("firskindname", this.chafrom.value[0]);//I级菜单名称
          params.append("secondkindname", this.chafrom.value[1]);//II级菜单名称
          params.append("thirdkindname", this.chafrom.value[2]);//III级菜单名称

          if (this.chafrom.registerTime!=""){//时间
            params.append("starttime", this.chafrom.registerTime[0]);//开始时间()
            params.append("overtime", this.chafrom.registerTime[1]);//结束时间()
          }
          // 请求地址
          this.$axios.post("DesignProcedure/DesignSelectAllFile", params).then(function (response) {
            _this.tableData = response.data.records;
            _this.total = response.data.total;
          }).catch();
        },
      },
      //加载时
      created(){
        this.getdata();
      },

    }
</script>

<style scoped>

</style>
