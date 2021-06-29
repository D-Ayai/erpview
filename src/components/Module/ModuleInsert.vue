<template>
  <div id="app">

    <!--  条件查询-->
    <el-form :inline="true">
      <el-form-item label="菜单">
        <el-cascader  v-model="formInline.value2" :options="formInline.options"  :props="{checkStrictly: true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.value3"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '24:00:00']"
          value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input placeholder="请输入名称" clearable v-model="name"></el-input>
      </el-form-item>
      <el-button type="success" @click="ck">查询</el-button>
    </el-form>
    <!--表格 -->
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
        width="180">
      </el-table-column>
      <el-table-column label="用途类型" width="95px">
        <template slot-scope="scope">
          {{scope.row.type | newTitle}}
        </template>
      </el-table-column>
      <el-table-column
        prop="firstKindName"
        label="Ⅰ级分类">
      </el-table-column>
      <el-table-column
        prop="secondKindName"
        label="Ⅱ级分类">
      </el-table-column>
      <el-table-column
        prop="thirdKindName"
        label="Ⅲ级分类">
      </el-table-column>
      <el-table-column label="建档时间">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          {{ scope.row.registerTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" @click="showAddDialog(scope.row.id)">制定设计单</el-button>
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

    <!-- 添加设计单 -->
    <el-dialog title="物料组成设计单" :visible.sync="addDialogVisible" width="90%" @close="addDialogClosed">
      <el-row :gutter="20">
        <el-col :span="16" :offset="11">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="AddModuleDetailLists">添加物料</el-button>
                <el-button icon="el-icon-remove-outline" type="danger" @click="getSelected">删除物料</el-button>
                <el-button icon="el-icon-check" type="success" @click="addModuleDetails">提  交</el-button>
                <el-button  type="info" @click="addDialogClosed">取消</el-button>
                </span>
          </div>
        </el-col>
      </el-row>
      <br>
      <!-- 内容主体 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <div><strong>产品编号: </strong> {{addModuleForm.productId}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>产品名称: </strong> {{addModuleForm.productName}}</div>
        </el-col>
        <el-col :span="3">
          <div><strong>登记人: </strong> {{addModuleForm.register}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>建档时间: </strong> {{addModuleForm.registerTime}}</div>
        </el-col>
      </el-row>
      <br/>
      <el-form
        :model="addModuleForm"
        ref="addModuleForm"
        label-width="100px"
        :rules="addModuleFormRules">
        <!-- 产品物料组成 -->
        <el-table :data="moduleList"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="productId" label="物料编号"></el-table-column>
          <el-table-column prop="productName" label="物料名称"></el-table-column>
          <el-table-column label="用途类型" width="120px" prop="type">
            <template slot-scope="scope">
              {{scope.row.type | newTitle}}
            </template>
          </el-table-column>
          <el-table-column prop="productDescribe" label="描述"></el-table-column>

          <el-table-column prop="amount" label="数量" width="180">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.amount" maxlength="8" oninput = "value=value.replace(/[^\d]/g,'')"/>
            </template>
          </el-table-column>

          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>
        </el-table>
        <br/>
        <el-form-item label="设计人" prop="designer">
          <el-input clearable v-model="addModuleForm.designer"></el-input>
        </el-form-item>
        <el-form-item label="设计要求" prop="moduleDescribe">
          <el-input v-model="addModuleForm.moduleDescribe" type="textarea" class="xxx"/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加物料"
      :visible.sync="moduleDialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="AddModuleDetailLists"
                        v-model="queryModule.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="AddModuleDetailLists">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="moduleDetailsList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="productDescribe" label="物料描述"></el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="设计成本单价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addModule(scope.row)"
            >添加
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!--<el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageno"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>-->

      <span slot="footer" class="dialog-footer">
    <el-button @click="moduleDialogVisible = false">返 回</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ModuleInsert',
    data() {
      return {
        addModuleFormRules: {
          amount: [
            {required: true, message: '请输入数量', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ]
        },
        moduleDialogVisible: false,
        addDialogVisible: false,
        addModuleForm: {},
        moduleList: [],
        moduleDetailsList: [],
        tableData: [],
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag: 1,
          deleteTag: 0,
          type: 1,
          designModuleTag: 0
        },
        formInline:{
          value2: '',
          value3: '',
          options:[],
          input:"",
        },
        queryModule: {
          checkTag: 1,
          deleteTag: 0,
          type: 2
        },
        fileList:[],
        pageno: 1,
        pagesize: 5,
        total: 0,
        name: "",
        delid: -1,
        moduleTotal: 0,
        multipleSelection: [],
        designModuleTag:"0",
        type:"",
        changeTime:"",
        deleteTag:"0",
        firstKindId:"",
        secondKindId:"",
        thirdKindId:"",
        checkTime:"",
        registerTime:"",
        productName:""
      }
    },
    methods: {
      addModuleDetails() {
        if (this.moduleList.length == 0) {
          this.$message.error("请至少添加一个物料");
          return;
        }

        this.moduleList.forEach((item) => {
          item.goodsId = this.addModuleForm.productId;
          item.designer = this.addModuleForm.designer;
          item.moduleDescribe = this.addModuleForm.moduleDescribe;
          item.register = window.sessionStorage.getItem('loginId');
        })
        this.$axios.post("Module/addModuleDetails", JSON.stringify(this.moduleList), {headers: {"Content-Type": "application/json"}})
          .then((response) => {
            if (response.data.result == true) {
              this.$message.success('操作成功!');
              this.getFileList();
              this.addDialogVisible = false;
            }
          }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
      },
      // 添加索引
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.moduleList.length == 0) {
          this.$message.error("请先添加物料");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个物料删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.moduleList.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.moduleList.splice(i, 1)
            }
          })
        })
        this.$message.success("删除物料成功");
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击添加物料
      addModule(row) {
        var bool = true;
        this.moduleList.forEach((item) => {
          if (item.productId == row.productId) {
            this.$message.error("请勿重复添加物料")
            bool = false;
          }
        })
        if (bool == true)
          this.moduleList.push(row);
      },
      //查询所有物料
      AddModuleDetailLists() {
        this.moduleDialogVisible = true;
        this.type="2";
        var params = new URLSearchParams();
        params.append("designModuleTag",this.designModuleTag)
        params.append("type",this.type);
      /*  Object.keys(this.queryModule).forEach((key) => {
          params.append(key, this.queryModule[key])
        });*/

        this.$axios.post("file/page.action", params).then((resp) => {
          this.moduleTotal = resp.data.total;
          this.moduleDetailsList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      //添加物料打开模态框
      showAddDialog(id) {
        this.addDialogVisible = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("file/byid.action",params).then((resp) => {
          this.addModuleForm = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.$refs.addModuleForm.resetFields();
          this.moduleList = [];
          this.addDialogVisible = false
        })
      },
      //获取产品列表
      getFileList() {
        var _this = this;
        this.type="1"
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        params.append("productName", this.name);
        params.append("designModuleTag",this.designModuleTag)
        params.append("type",this.type);
        params.append("firstKindId",this.firstKindId);
        params.append("secondKindId",this.secondKindId);
        params.append("thirdKindId",this.thirdKindId);
        params.append("checkTime",this.checkTime)
        params.append("registerTime",this.registerTime)
        /*params.append("productName",this.productName)*/
        this.$axios.post("file/page.action", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      handleSizeChange(val) {  //页size变更
        this.pagesize = val;
        this.pageno = 1;
        this.getFileList();
      },
      handleCurrentChange(val) {  //页码变更

        this.pageno = val;
        this.getFileList();
      },
      ck(val) {  //页码变更
        this.firstKindId = this.formInline.value2[0];
        this.secondKindId = this.formInline.value2[1];
        this.thirdKindId = this.formInline.value2[2];
        if (this.formInline.value3[1]!= undefined) {
          this.checkTime = this.formInline.value3[1];
        }
        if (this.formInline.value3[0]!= undefined) {
          this.registerTime = this.formInline.value3[0];
        }
        this.productName=this.formInline.input;
        this.getFileList();
      },
      gette(){
        this.$axios.get("Config/queryAll").then((response)=>{
          this.ops=response.data;
        }).catch();
      },
      getDa(){
        this.$axios.get("Config/queryAll").then((response)=>{
          this.formInline.options=response.data;
        }).catch();
      },
    },
    created() {
      this.gette();
      this.getDa();
      this.getFileList()
    },
    filters: {   //过滤器
      newTitle(val) {
        if (val == 1)
          return "商品";
        else if (val == 2)
          return "物料";
        else
          return "";
      }
    }
  }
</script>

<!--<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>-->
