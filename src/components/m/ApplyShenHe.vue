<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-s-unfold"></el-step>
        <el-step title="生产计划管理" icon="el-icon-set-up"></el-step>
        <el-step title="生产计划查询" icon="el-icon-magic-stick"></el-step>
      </el-steps>
    </h4>

    <!-- 查询条件 -->
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
      <el-form-item label="字段">
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

    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      :header-cell-style="{background:'#E4E7ED', color:'#606266'}"
      style="width: 100%">
      <el-table-column
        prop="applyId"
        label="生产计划编号">
      </el-table-column>
      <el-table-column
        prop="register"
        label="登记人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column  label="审核">
        <template slot-scope="scope">
          <el-button type="warning"  icon="el-icon-edit-outline"  @click="openeditwin(scope.row)" plain>审核</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageno"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 查询模态框 -->
    <el-dialog  title="生产工序设计单" width="60%"  :visible.sync="editwinshow">

      <el-form :inline="true"  :modal="editform">
        <el-form-item label="生产计划编号:" style="width:35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="生产计划总数量:" style="width:35%" >
          <span style="color: midnightblue">{{sum}}</span>
        </el-form-item>
        <br>
        <el-form-item label="登记人:" style="width:35%">
          <span style="color: midnightblue" >{{editform.register}}</span>
        </el-form-item>
        <el-form-item label="登记时间:" style="width:35%">
          <span style="color: midnightblue">{{editform.registerTime}}</span>
        </el-form-item>
        <br>
        <el-form-item label="审核人" style="width:35%">
          <el-input clearable placeholder='请手动输入设计人' v-model="editform.checker"></el-input>
        </el-form-item>
        <el-form-item label="审核意见" >
          <el-input style="width: 300px" type="textarea" :rows="2" placeholder="请输入内容" v-model="editform.checkSuggestion"></el-input>
        </el-form-item>

        <br>
        <!--表格-->
        <el-table  ref="multipleSelection" :data="detailsList" stripe  border style="width: 100%">

          <el-table-column  prop="productId" label="产品编号"  ></el-table-column>

          <el-table-column prop="productName"  label="产品名称" ></el-table-column>

          <el-table-column prop="type" label="用途类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">商品</span>
              <span v-else="">物料</span>
            </template>
          </el-table-column>

          <el-table-column prop="amount" label="数量" ></el-table-column>

        </el-table>
        <br>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
        <el-button type="success"  icon="el-icon-check"  @click="ShengHeYes()" >审核通过</el-button>
        <el-button type="danger"  icon="el-icon-close"  @click="ShengHeNo()" >审核未通过</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "ApplyShenHe",
      data(){
        return {
          chafrom:{//查询表单
            value: '',//选中的菜单值
            tjname:"",//产品名称
            options:[],//三级联动菜单
            registerTime:"",//时间
          },
          tableData: [],//表格数据
          pageno: 1,//页号
          pagesize: 5,//页大小
          total: 0,//总数据量
          editform:{
            checker:"abc",
          },//工序数据
          editwinshow: false,//添加的模态框
          detailsList:[]//模态框的表格数据
        };
      },
      methods: {
        onSubmit() {//查询
          this.getdata();
        },

        getcaidan() {//查询菜单
          this.$axios.get("Config/queryAll").then((response) => {
            this.chafrom.options = response.data;
          }).catch();
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

          if (this.chafrom.registerTime != "") {//时间
            params.append("starttime", this.chafrom.registerTime[0]);//开始时间()
            params.append("overtime", this.chafrom.registerTime[1]);//结束时间()
          }
          // 请求地址
          this.$axios.post("Apply/GroupApplyIdShenheAll", params).then(function (response) {
            _this.tableData = response.data.records;
            _this.total = response.data.total;
          }).catch();
        },

        handleSizeChange(val) {  //页size变更
          this.pagesize = val;
          this.pageno = 1;
          this.getdata();
        },

        handleCurrentChange(val) {  //页码变更
          this.pageno = val;
          this.getdata();
        },

        openeditwin(row) {  //打开编辑页面
          this.editform=row
          this.editwinshow = true;
          var _this = this;
          var params = new URLSearchParams();
          params.append("applyId", row.applyId);
          this.$axios.post("Apply/selectByApplyId", params).then(function (response) {
            _this.detailsList = response.data;
          }).catch();
        },



        ShengHeYes(){
          this.xiugai(true);
        },
        ShengHeNo(){
          this.xiugai(false);
        },
        xiugai(type){
          this.editwinshow = true;
          var _this = this;
          var params = new URLSearchParams();
          params.append("applyId",this.editform.applyId);
          params.append("checker",this.editform.checker);
          params.append("checkSuggestion",this.editform.checkSuggestion);
          params.append("type",type);
          this.$axios.post("Apply/Shengheupdate", params).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '操作失败',
                type: 'danger'
              });
            }
            _this.pageno = 1;
            //刷新表格数据
            _this.getdata();
          }).catch();
          this.editwinshow=false;
        }
      },
      created(){
        this.getcaidan();
        this.getdata();
      },
      computed:{
        sum () {
          var  sum=0;
          for(var i=0;i<this.detailsList.length;i++){
            sum += this.detailsList[i].amount;
          }
          return sum;
        }
      }
    }
</script>

<style scoped>

</style>
