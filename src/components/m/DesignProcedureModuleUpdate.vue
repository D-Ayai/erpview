<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-s-unfold"></el-step>
        <el-step title="产品生产工序设计" icon="el-icon-shopping-bag-1"></el-step>
        <el-step title="工序物料设计单变更" icon="el-icon-edit-outline"></el-step>
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
      style="width: 100%">
      <el-table-column
        prop="designId"
        label="设计编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="designer"
        label="设计人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="工时总成本">
      </el-table-column>
      <el-table-column
        prop="moduleCostPriceSum"
        label="物料总成本">
      </el-table-column>
      <el-table-column  label="变更">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit-outline"  @click="openeditwin(scope.row.id)" plain>变更</el-button>
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
        <el-form-item label="产品编号:" style="width:35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="产品名称:" style="width:35%"  >
          <span style="color: midnightblue">{{editform.productName}}</span>
        </el-form-item>
        <el-form-item label="物料总成本:" style="width:25%">
          <span style="color: midnightblue">{{editform.moduleCostPriceSum}}</span>
        </el-form-item>
        <br>
        <el-form-item label="设计单编号:" style="width:35%">
          <span style="color: midnightblue" >{{editform.designId}}</span>
        </el-form-item>
        <el-form-item label="设计人:" style="width:35%">
          <span style="color: midnightblue">{{editform.designer}}</span>
        </el-form-item>
        <el-form-item label="工时总成本:" style="width:25%">
          <span style="color: midnightblue">{{editform.costPriceSum}}</span>
        </el-form-item>

        <br>
        <!--表格-->
        <el-table  ref="multipleSelection" :data="editform.detailsList" stripe  border style="width: 100%">

          <el-table-column  prop="detailsNumber" label="工序序号" ></el-table-column>

          <el-table-column prop="procedureName"  label="工序名称"></el-table-column>

          <el-table-column prop="labourHourAmount" label="工时数"></el-table-column>

          <el-table-column prop="amountUnit" label="单位"></el-table-column>

          <el-table-column prop="costPrice" label="单位工时成本"></el-table-column>

          <el-table-column prop="subtotal" label="小计"></el-table-column>

          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.designModuleChangeTag==0" type="success"  icon="el-icon-edit" @click="openeSheJiwin(scope.row)" plain>更改设计</el-button>
              <el-button v-else="" type="warning"  icon="el-icon-edit-outline" @click="openeChongXinwin(scope.row)" plain>重新设计</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
        <el-button v-if="isupdate" type="success"   icon="el-icon-check"   @click="btnsave(editform.id)">提交</el-button>
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
        <el-table-column property="detailsNumber"   label="物料序号"></el-table-column>
        <el-table-column property="productName" label="物料名称" ></el-table-column>
        <el-table-column property="type" label="用途" >
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">商品</span>
            <span v-else="">物料</span>
          </template>
        </el-table-column>
        <el-table-column label="可用数量" >
          <template slot-scope="scope">
            {{scope.row | Keyong}}
          </template>
        </el-table-column>
        <el-table-column property="costPrice" label="单价" ></el-table-column>
        <el-table-column label="小计" width="130">
          <template slot-scope="scope">
            {{scope.row | XiaoJI}}
          </template>
        </el-table-column>
        <el-table-column  label="需要数量" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount"></el-input>
            </template>
        </el-table-column>

      </el-table>

      <div class="demo-drawer__footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="handleClose()">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
    export default {
      name: "DesignProcedureModuleUpdate.vue",
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
          editform:{},
          editwinshow: false,//添加的模态框
          table: false,//抽屉
          gridData: [],//所有物料集合
          shuju:[],
          GongXusetid:[],
          dakaiid: {},//打开抽屉id编号
          isupdate:false,
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
          this.$axios.post("DesignProcedure/GongXuWuLiaoUpdateShow", params).then(function (response) {
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

        openeditwin(id) {  //打开模态框页面
          var _this = this;
          var params = new URLSearchParams();
          params.append("id", id);
          this.$axios.post("DesignProcedure/SelectByGongXuId", params).then(function (response) {
            _this.editform = response.data;
          }).catch();
          this.editwinshow = true;
        },

        openeSheJiwin(row){ //打开抽屉

          this.dakaiid=row;
          row.designModuleChangeTag=1;
          var _this = this;
          var params = new URLSearchParams();
          params.append("id", row.id);
          this.$axios.post("DesignProcedureModule/SelectWLGXUpdateByidAll", params).then(function (response) {
            _this.gridData = response.data;
          }).catch();
          this.table = true;
        },

        handleClose(){//抽屉关闭时的操作
          for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].keyong<0){
              this.$message.error('失败'+this.gridData[i].productName+"可用数量不足,请重新添加");
              return false;
            }
            if(this.gridData[i].amount==undefined){
              this.gridData[i].amount=0;
            }
          }
          this.isupdate=true;
          this.table = false;
          var _this =this;
          this.$axios.post("DesignProcedureModule/update", JSON.stringify(this.gridData),
            {
              headers: {"Content-Type": "application/json"}
            }).then(function (response) {
            if (response.data == true) {
              _this.$message({
                message: '设计修改成功',
                type: 'success'
              });
            } else {
              _this.$message.error('错误设计');
            }
          }).catch();
        },

        cancelForm(){//抽屉取消按钮的操作
          this.dakaiid.designModuleChangeTag=0;
          this.table = false;
        },
        openeChongXinwin(row){ //重新设计按钮
          this.dakaiid=row;
          var _this = this;
          var params = new URLSearchParams();
          params.append("id",row.id);
          this.$axios.post("DesignProcedureModule/ChongxinUpdate", params).then(function (response) {
            _this.gridData = response.data;
          }).catch();
          this.table=true;
        },
        btnsave(id){//提交按钮
          for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].keyong>0){
              this.$message.error('失败'+this.gridData[i].productName+"可用数量还有未设计,请重新设计");
              return false;
            }
          }
          this.editwinshow =false;
          var _this =this;
          var params = new URLSearchParams();
          params.append("id", id);
          this.$axios.post("DesignProcedure/GXWLupdate", params).then(function (response) {
            _this.editform = response.data;
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '设计成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '设计失败',
                type: 'danger'
              });
            }
            _this.isupdate=false;
            _this.pageno = 1;
            //刷新表格数据
            _this.getdata();
          }).catch();
        },



      } ,
      filters: {   //过滤器
        XiaoJI(val){
          return val.subtotal*val.amount;
        },
        Keyong(val){
          return val.keyong=val.zuida-val.amount;
        }
      },
      created(){
        this.getcaidan();
        this.getdata();
      },
    }
</script>

<style scoped>

</style>
