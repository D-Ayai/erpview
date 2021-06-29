<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-edit"></el-step>
        <el-step title="生产调度管理" icon="el-icon-pie-chart"></el-step>
        <el-step title="生产派工单查询" icon="el-icon-search"></el-step>
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
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="manufactureId" label="派工单编号" width="200px"></el-table-column>
      <el-table-column prop="productId" label="产品编号" width="200px"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="amount" label="投产数量"></el-table-column>
      <el-table-column prop="testedAmount" label="合格数量"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag==0" style="color:orange">待审核</span>
          <span v-else-if="scope.row.checkTag==1" style="color:green">已审核</span>
          <span v-else="" style="color:red">未设计</span>
        </template>
      </el-table-column>
      <el-table-column prop="manufactureProcedureTag" label="生产状态">
        <template slot-scope="scope">
          <span v-if="scope.row.manufactureProcedureTag==0" style="color:red">待登记</span>
          <span v-else-if="scope.row.manufactureProcedureTag==1" style="color:orange">未审核</span>
          <span v-else="" style="color:green">已完工</span>
        </template>
      </el-table-column>
      <el-table-column  label="审核">
        <template slot-scope="scope">
          <el-button type="info" icon="el-icon-view" @click="openeditwin(scope.row.id)" plain>详细</el-button>
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
    <el-dialog  title="生产工序设计单" width="60%"  :visible="editwinshow">

      <el-form :inline="true"  :modal="editform">

        <el-form-item label="设计单编号:" style="width:35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="产品名称:" style="width:35%"  >
          <span style="color: midnightblue">{{editform.productName}}</span>
        </el-form-item>
        <el-form-item label="数量:" style="width:25%">
          <span style="color: midnightblue">{{editform.amount}}</span>
        </el-form-item>
        <br>
        <el-form-item label=" 派工单编号: " style="width:35%">
          <span style="color: midnightblue" >{{editform.manufactureId}}</span>
        </el-form-item>
        <el-form-item label="登记人:" style="width:35%">
          <span style="color: midnightblue">{{editform.register}}</span>
        </el-form-item>
        <el-form-item label="合格数量:" style="width:25%">
          <span style="color: midnightblue">{{editform.testedAmount}}</span>
        </el-form-item>
        <br>
        <el-form-item label=" 设计物料总成本:">
          <span style="color: midnightblue" >{{editform.moduleCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="实际物料总成本:">
          <span style="color: midnightblue">{{editform.realModuleCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="设计工时总成本:">
          <span style="color: midnightblue">{{editform.labourCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="实际工时总成本:" >
          <span style="color: midnightblue">{{editform.realLabourCostPriceSum}}</span>
        </el-form-item>
        <br>
        <!--表格-->
        <el-table  ref="multipleSelection" :data="editform.procedureList" stripe  border style="width: 100%">

          <el-table-column  prop="detailsNumber" label="工序序号" ></el-table-column>

          <el-table-column prop="procedureName"  label="工序名称" ></el-table-column>

          <el-table-column prop="labourHourAmount" label="工时数" ></el-table-column>

          <el-table-column prop="subtotal" label="设计工时成本(元)" ></el-table-column>

          <el-table-column prop="realSubtotal" label="实际工时成本" ></el-table-column>

          <el-table-column prop="moduleSubtotal" label="设计物料成本(元)" ></el-table-column>

          <el-table-column prop="realModuleSubtotal" label="实际物料成本"></el-table-column>


          <el-table-column  label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="info"  icon="el-icon-view" @click="openChouti(scope.row.id)" plain>详细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-form-item label="审核人" style="width:35%">
          <el-input clearable placeholder='请手动输入设计人' v-model="editform.checker"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" style="width:35%">
          <span style="color: midnightblue">{{editform.registerTime}}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
      </div>

    </el-dialog>

    <!--查询所以工序的抽屉-->
    <el-drawer
      title="物料工序!"
      :before-close="handleClose"
      :visible.sync="table"
      direction="ttb"
      custom-class="demo-drawer"
      size="50%">
      <el-table style="margin:auto;width: 911px"  border :data="gridData">
        <el-table-column property="detailsNumber"   label="物料序号" ></el-table-column>
        <el-table-column property="productName" label="物料名称"></el-table-column>
        <el-table-column property="type" label="用途">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">商品</span>
            <span v-else="">物料</span>
          </template>
        </el-table-column>
        <el-table-column property="amount" label="本工序数量" ></el-table-column>
        <el-table-column property="costPrice" label="单价" ></el-table-column>
        <el-table-column property="subtotal" label="小计" ></el-table-column>
      </el-table>
    </el-drawer>

  </div>
</template>

<script>
  export default {
    name: "ProductionDispatchShenhe.vue",
    data(){
      return  {
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
        editform:{},//工序数据
        editwinshow: false,//添加的模态框
        table: false,//抽屉
        gridData: [],//所有物料集合
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
        this.$axios.post("Manufacture/selectAll", params).then(function (response) {
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

      openeditwin(id) {  //打开编辑页面
        this.editwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("Manufacture/SelectId", params).then(function (response) {
          _this.editform = response.data;
        }).catch();
      },

      openChouti(id){ //打开抽屉
        this.table = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("ProcedureModule/SelectByParentId", params).then(function (response) {
          _this.gridData = response.data;
        }).catch();
      },
      handleClose(){
        this.table=false;

      },
    },
    created(){
      this.getcaidan();
      this.getdata();
    },
  }
</script>

<style scoped>

</style>
