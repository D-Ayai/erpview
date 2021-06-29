<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-edit"></el-step>
        <el-step title="生产调度管理" icon="el-icon-pie-chart"></el-step>
        <el-step title="制定生产派工单" icon="el-icon-notebook-2"></el-step>
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
          :default-time="['12:00:00','08:00:00']"
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
        <el-button  type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-button  type="primary" icon="el-icon-s-promotion" @click="CheckedTijiao" round>选中提交</el-button>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="applyId"
        label="计划单编号">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品编号">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="productDescribe"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="出库单编号集合">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="审核时间">
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

    <!--模态框嵌套 -->
    <el-dialog title="确认产品" :visible.sync="outerVisible">
      <el-form :inline="true"  :modal="editform">
        <el-form-item label="产品编号:" style="width:35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="产品名称:" style="width:35%"  >
          <span style="color: midnightblue">{{editform.productName}}</span>
        </el-form-item>
        <br>
        <el-form-item label="登记人" >
          <el-input clearable placeholder='请手动输入设计人' v-model="editform.checker"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" >
          <span style="color: midnightblue">{{editform.registerTime}}</span>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input clearable placeholder='请手动输入设计人' v-model="editform.remark"></el-input>
        </el-form-item>
        <el-form-item label="数量:" style="width:25%">
          <span style="color: midnightblue">{{editform.amount}}</span>
        </el-form-item>
      </el-form>


      <!-- 查询模态框 -->
      <el-dialog  title="制定生产派工单" width="60%" append-to-body  :visible.sync="innerVisible">
        <el-form :inline="true"  :modal="editform">
          <el-form-item label="产品编号:" style="width:35%" >
            <span style="color: midnightblue">{{innerVisibleform.productId}}</span>
          </el-form-item>
          <el-form-item label="产品名称:" style="width:35%"  >
            <span style="color: midnightblue">{{innerVisibleform.productName}}</span>
          </el-form-item>
          <el-form-item label="数量:" style="width:25%">
            <span style="color: midnightblue">{{editform.amount}}</span>
          </el-form-item>
          <br>

          <el-form-item label="设计人:"  style="width:35%">
            <el-input clearable v-model="editform.designer"></el-input>
          </el-form-item>
          <el-form-item label="登记人:" style="width:35%">
            <el-input clearable v-model="editform.checker"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="备注:">
            <el-input style="width: 500px" type="textarea" :rows="3" placeholder="请输入内容" v-model="editform.remark"></el-input>
          </el-form-item>

          <!--表格-->
          <el-table  ref="multipleSelection" :data="innerVisibleform.detailsList" stripe  border style="width: 100%">

            <el-table-column  prop="detailsNumber" label="工序序号"></el-table-column>

            <el-table-column prop="procedureName"  label="工序名称"></el-table-column>

            <el-table-column prop="labourHourAmount" label="工时数" ></el-table-column>

            <el-table-column prop="amountUnit" label="单位" ></el-table-column>

            <el-table-column prop="costPrice" label="单位工时成本" ></el-table-column>

            <el-table-column prop="subtotal" label="小计" ></el-table-column>

            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button type="info"  icon="el-icon-view" @click="openChouti(scope.row.id)" plain>查看物料</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" icon="el-icon-finished"  @click="tijiao">确认</el-button>
        </div>

      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="openeZiditwin">确认</el-button>
      </div>
    </el-dialog>

    <!--查询所以工序的抽屉-->
    <el-drawer
      title="物料工序!"
      :visible.sync="table"
      direction="ttb"
      custom-class="demo-drawer"
      size="50%">
      <el-table style="margin:auto;width: 911px"  border :data="gridData">
        <el-table-column property="detailsNumber"   label="物料序号" ></el-table-column>
        <el-table-column property="productName" label="物料名称" ></el-table-column>
        <el-table-column property="type" label="用途" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type===1">商品</span>
            <span v-else="">物料</span>
          </template>
        </el-table-column>
        <el-table-column property="amount" label="本工序数量"></el-table-column>
        <el-table-column property="costPrice" label="单价"></el-table-column>
        <el-table-column property="subtotal" label="小计" ></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
    export default {
        name: "ProductionDispatchAdd",
        data() {
          return {
            chafrom: {//查询表单
              value: '',//选中的菜单值
              tjname: "",//产品名称
              options: [],//三级联动菜单
              registerTime: "",//时间
            },
            tableData: [],//表格数据
            pageno: 1,//页号
            pagesize: 5,//页大小
            total: 0,//总数据量
            editform: {
              productId:"",//产品编号
              productName:"",//产品名称
              amount:'',//数量
              ids:[],//id
              designer:"",//设计人
              register:"",//登记人
              remark:"",//备注
            },
            multipleSelection: [],//模态框中被选中的工序;

            outerVisible: false,//父级模态框

            innerVisible:false,//子级模态框
            innerVisibleform:{},

            table: false,//抽屉
            gridData: [],//所有物料集合

            cftable:[],//重复的数据

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
          this.$axios.post("Apply/ShenheChengGongAll", params).then(function (response) {
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

        handleSelectionChange(val) { //把选择的值添加进去
          this.multipleSelection = val;
        },

        tableRowClassName({row, rowIndex}) { //修改表的眼色
          /*console.log(row.productId);
          for (let i =   0;i <this.cftable.length ; i--) {
            if (this.cftable[i].productId===row.productId){
              return row.background;
            }
          }
          var a="";
          if (rowIndex === 1) {
            a= 'orange-row';
          } else if (rowIndex === 2) {
            a= 'green-row';
          }else if (rowIndex === 3){
            a= 'black-row';
          }else if (rowIndex === 4){
            a= 'red-row';
          }else {
            a= 'yellow-row';
          }
          row.background=a;
          this.cftable.push(row);
          return a;*/
        },

        CheckedTijiao() {

          //打卡父级按钮 并处理选中的值
          if (this.multipleSelection.length === 0) {
            this.$message.error('你没有选择要删除的选项');
          }
          var sum = 0;
          var id = this.multipleSelection[0];

          for (let i = 0; i < this.multipleSelection.length; i++) {
            sum += this.multipleSelection[i].amount;
            if (id.productId !== this.multipleSelection[i].productId) {
              this.$message.error('请选择同一个产品');
              return false;
            } else {
              this.editform.ids.push(this.multipleSelection[i].id);
            }
          }
          this.editform.productId = id.productId;
          this.editform.productName = id.productName;
          this.editform.amount = sum;
          this.outerVisible = true;
        },

        openeZiditwin() {  //打开子模态框页面
          this.innerVisible = true;
          var qian = this.editform;
          var _this = this;
          var params = new URLSearchParams();
          params.append("id", this.editform.productId);
          this.$axios.post("DesignProcedure/SelectByChanpingId", params).then(function (response) {
            _this.innerVisibleform = response.data;
          }).catch();
        },

        openChouti(id) { //打开抽屉
          this.table = true;
          var _this = this;
          var params = new URLSearchParams();
          params.append("id", id);
          this.$axios.post("DesignProcedureModule/selectWuLiaoByid", params).then(function (response) {
            _this.gridData = response.data;
          }).catch();
        },
        tijiao() {
          var _this = this;
          this.$axios.post("Manufacture/Add", JSON.stringify(this.editform),
            {
              headers: {"Content-Type": "application/json"}
            }).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '成功制定生产派工单',
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '错误',
                message: '服务器繁忙,请稍后再试试'
              });
            }
            _this.innerVisible = false;
            _this.outerVisible = false;
            _this.pageno=1;
            _this.getdata();
          }).catch();
        },
      },
      created(){
        this.getcaidan();
        this.getdata();
      },
    }
</script>

<style scoped>
  .el-table .orange-row {
    background: #f3ad3b;
  }
  .el-table .green-row {
    background: #c1fd9f;
  }
  .el-table .black-row {
    background: #9fdffd;
  }
  .el-table .red-row {
    background: #fdbbc0;
  }
  .el-table .yellow-row {
    background: #fcebb1;
  }
</style>
