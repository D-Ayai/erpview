<template>
  <div>
    <!-- 显示头 -->
    <h4>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-edit"></el-step>
        <el-step title="产品生产工序设计" icon="el-icon-upload"></el-step>
        <el-step title="产品生产工序设计单变更" icon="el-icon-picture"></el-step>
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
        <el-button type="primary" icon="el-icon-search"  @click="onSubmit">查询</el-button>
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
        label="产品名称"
        width="140">
      </el-table-column>
      <el-table-column
        prop="designer"
        label="设计人"
        width="140">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间"
        width="240">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="工时总成本"
        width="140">
      </el-table-column>
      <el-table-column  label="变更">
        <template slot-scope="scope">
          <el-button type="warning" @click="openeditwin(scope.row.id)">变更</el-button>
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

        <el-form-item label="设计单编号:" style="width:35%">
          <span style="color: midnightblue" >{{editform.designId}}</span>
        </el-form-item>
        <el-form-item label="产品编号:" style="width: 35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="产品名称:" style="width:20%"  >
          <span style="color: midnightblue">{{editform.productName}}</span>
        </el-form-item>
        <br>
        <el-form-item label="设计人:" style="width:35%">
          <span style="color: midnightblue">{{editform.designer}}</span>
        </el-form-item>
        <el-form-item label="登记时间:" style="width:35%">
          <span style="color: midnightblue">{{editform.registerTime}}</span>
        </el-form-item>
        <el-form-item label="工时总成本:" style="width:25%">
          <span style="color: midnightblue">{{editform.costPriceSum}}</span>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary"  icon="el-icon-edit"  @click="opengongxuct">添加工序</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning"  icon="el-icon-delete"  @click="toggleSelection">删除选中</el-button>
        </el-form-item>
        <br>

        <!--表格-->
        <el-table  ref="multipleSelection" :data="editform.detailsList"  stripe  border  @selection-change="handleSelectionChange"  style="width: 100%">

          <el-table-column type="selection"  width="55"></el-table-column>
          <el-table-column  prop="procedureId" label="工序编号"  width="100"></el-table-column>

          <el-table-column prop="procedureName"  label="工序名称"  width="120"></el-table-column>

          <el-table-column label="工时数" width="130">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.labourHourAmount"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="单位" width="130">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.amountUnit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="单位工时成本" width="130">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.costPrice"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="小计" width="130">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.subtotal"></el-input>
            </template>
          </el-table-column>


        </el-table>
        <br>
        <el-form-item label="变更人">
          <el-input clearable placeholder='请手动输入设计人' v-model="editform.changer"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
        <el-button type="success"   icon="el-icon-edit"   @click="btnsave">修改</el-button>
      </div>

    </el-dialog>

    <!--查询所以工序的抽屉-->
    <el-drawer
      title="所有工序!"
      :visible.sync="table"
      direction="ttb"
      size="50%">
      <el-table style="margin:auto;width: 651px"  border :data="gridData">
        <el-table-column property="id"   label="工序编号" width="150"></el-table-column>
        <el-table-column property="typeName" label="工序名称" width="150"></el-table-column>
        <el-table-column property="register" label="工序描述" width="200"></el-table-column>
        <el-table-column  label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="warning" @click="addGongXuRow(scope.$index, scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
    export default {
        name: "DesignProcedureUpdate",
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

          editform:{},//工序数据
          editwinshow: false,//添加的模态框
          gridData: [],//所有工序集合
          multipleSelection: [],//模态框中被选中的工序;
          table: false,//抽屉
        };
      },
      methods:{
        onSubmit() {//查询
          this.getdata();
        },
        getcaidan(){//查询菜单
          this.$axios.get("Config/queryAll").then((response)=>{
            this.chafrom.options=response.data;
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

          if (this.chafrom.registerTime!=""){//时间
            params.append("starttime", this.chafrom.registerTime[0]);//开始时间()
            params.append("overtime", this.chafrom.registerTime[1]);//结束时间()
          }
          // 请求地址
          this.$axios.post("DesignProcedure/queryGongXuShenHeCG", params).then(function (response) {
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
          this.$axios.post("DesignProcedure/SelectByGongXuId", params).then(function (response) {
            _this.editform=response.data;
          }).catch();
        },
        opengongxuct() {  //打开添加工序页面
          this.table = true;
          var _this = this;
          //查询全部工序
          this.$axios.post("ManufactureConfig/queryall").then(function (response) {
            _this.gridData=response.data;
          }).catch();
        },

        toggleSelection() { //删除选中的工序
          var pd= true;
          for (let i = this.multipleSelection.length - 1; i >= 0; i--) {
            for(let j=this.editform.detailsList.length-1; j >= 0;j--){
              if (this.editform.detailsList[j].procedureId === this.multipleSelection[i].procedureId) {
                this.editform.detailsList.splice(j, 1);
                /*this.$message({
                  message: '删除成功',
                  type: 'success'
                });*/
                pd= false;
              }
            }
          }
          if(pd){
            this.$message.error('你没有选择要删除的选项');
          }
        },

        addGongXuRow(index, row) { //添加工序列表
        console.log(row)
          console.log(this.editform.detailsList)
          var tempobj = this.editform.detailsList.find((item)=>{return item.procedureId==row.id});
          if (tempobj==undefined){
            var jihe ={procedureId:row.id,procedureName:row.typeName}
            this.editform.detailsList.push(jihe);
            this.$message({
              message: '成功添加了'+row.typeName,
              type: 'success'
            });
          }else {
            this.$message.error('你已经添加了');
          }
        },

        handleSelectionChange(val) { //把选择的值添加进去
          this.multipleSelection = val;
        },

        btnsave(){   //编辑模态框  保存按钮按下

          if (this.editform.detailsList.length==0){
            this.$message.error('请添加工序后');
            return false;
          }
          this.editform.detailsList[0].parentId=this.editform.id;
          this.editform.detailsList[0].register=this.editform.changer;
          this.editwinshow = false;
          var _this =this;
          var params = new URLSearchParams();
          this.$axios.post("DesignProcedure/DesignUpdate", JSON.stringify(this.editform.detailsList),
            {
              headers: {"Content-Type": "application/json"}
            }).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '添加工序成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '添加工序失败',
                type: 'danger'
              });
            }
            _this.pageno = 1;
            //刷新表格数据
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

</style>
