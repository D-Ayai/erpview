<template>
  <div id="app">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
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
        <el-form-item label="名称">
          <el-input
            placeholder="请输入查询编号"
            v-model="formInline.input"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
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
      <el-table-column
        prop="type"
        width="180"
        label="用途类型">
        <template slot-scope="scope">
          {{scope.row.type | type}}
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" @click="openeditwin(scope.row.id)">配置</el-button>
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
    <!-- 添加模态框-->
    <el-dialog title="安全库存配置单" :visible="editwinshow"  @close="addDialogClosed">
      <el-form label-width="120px" :modal="editform">
        <!--<el-form-item>
          <el-input v-model="editform.storeId" type="hidden"></el-input>
        </el-form-item>-->
        <el-form-item label="id" >
          <el-input v-model="editform.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="登记人">
          <el-input v-model="editform.register" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input clearable v-model="editform.productName" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input clearable v-model="editform.productId" disabled></el-input>
        </el-form-item>
        <el-form-item label="库存报警下限数">
          <el-input clearable v-model="editform.minAmount"></el-input>
        </el-form-item>
        <el-form-item label="库存报警上限数">
          <el-input clearable v-model="editform.maxAmount"></el-input>
        </el-form-item>
        <el-form-item label="设计人">
          <el-input clearable v-model="editform.sheji"></el-input>
        </el-form-item>
        <hr/>
        <el-table
          :data="tableData2"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="uid"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="库房名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ddr"
            label="存储地址名称">
          </el-table-column>
          <el-table-column
            prop="menuca"
            label="储存地址名称">
          </el-table-column>
          <el-table-column label="最大存储量">
            <template slot-scope="scope">
              <el-input v-model="editform.maxCapacityAmount"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="存储单位">
            <template slot-scope="scope">
            <el-input v-model="editform.amountUnit"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <br/>
        配置要求:
        <el-input
          type="textarea"
          :rows="2"
          v-model="editform.config">
        </el-input>
        <br>
        <el-row :gutter="20">
          <el-col :span="10" :offset="12">
            <div class="grid-content bg-purple">
              <span v-model="editform.registerTime">系统当前时间:&nbsp&nbsp&nbsp{{currentTime}}</span>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow=false">取 消</el-button>
        <el-button type="primary" @click="btnadd">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        timer: "",//定义一个定时器的变量
        currentTime: new Date(), // 获取当前时间
        tableData:[],
        formInline:{
          value2: '',
          value3: '',
          options:[],
          input:"",
        },
        tableData2:[{uid:"1",name:"成品库",ddr:"120.110.1", menuca: ""}],
        pageno: 1,
        pagesize: 5,
        total: 0,
        name: "",
        delid: -1,
        editwinshow: false,
        temp:{
          id:"",
          designCellTag:""
        },
        editform: {
          storeId:0,
          productId:"",
          productName:"",
          minAmount:"",
          max_amount:"",
          maxCapacityAmount:"",
          sheji:"",
          register:"",
          amountUnit:"",
          registerTime:"",
          config:"",
          firstKindId: "",
          firstKindName: "",
          secondKindId: "",
          secondKindName: "",
          thirdKindId: "",
          thirdKindName: "",
           id: ""
        },
        addwinshow:false,
        addform:{
        },
        checkTag:"1",
        changeTime:"",
        deleteTag:"0",
        firstKindName:"",
        secondKindName:"",
        thirdKindName:"",
        checkTime:"",
        registerTime:"",
        productName:"",
        designCellTag:"0"
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        params.append("checkTag", this.checkTag);
        params.append("deleteTag",this.deleteTag);
        params.append("firstKindName",this.firstKindName);
        params.append("secondKindName",this.secondKindName);
        params.append("thirdKindName",this.thirdKindName);
        params.append("checkTime",this.checkTime)
        params.append("registerTime",this.registerTime)
        params.append("productName",this.productName)
        params.append("designCellTag",this.designCellTag);
        this.$axios.post("file/page.action", params).then(function (response) {
          _this.tableData = response.data.records;

          /*//修改图片地址  追加前缀
          _this.tableData.forEach((item)=>{
            item.img ="http://localhost:8888/"+item.img;
          })*/


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
      searchcartype() {   //条件查询
        this.getdata();
      },
      openeditwin(id) {  //打开编辑页面
        this.editwinshow = true;
        var params = new URLSearchParams();
        params.append("id", id);/*
        this.editform["registerTime"] = this.currentTime;*/
        this.$axios.post("file/byid.action", params).then((response) => {
          this.temp = response.data;
          this.editform["productName"] = this.temp.productName;
          this.editform["productId"] = this.temp.productId;
          this.editform["register"] = this.temp.register;
          this.editform["firstKindId"] = this.temp.firstKindId;
          this.editform["firstKindName"] = this.temp.firstKindName;
          this.editform["secondKindId"] = this.temp.secondKindId;
          this.editform["secondKindName"] = this.temp.secondKindName;
          this.editform["thirdKindId"] = this.temp.thirdKindId;
          this.editform["thirdKindName"] = this.temp.thirdKindName;
          this.editform["id"] = this.temp.id;
          this.tableData2[0].menuca = response.data.firstKindName + '/' + response.data.secondKindName + '/' + response.data.thirdKindName;
        }).catch();
      },
      addDialogClosed() {
        this.$nextTick(() => {
          this.editwinshow = false
        })
      },
      btnadd(){
        //添加按钮按下，保存到db
        var _this =this;

        var params = new FormData();
        Object.keys(_this.editform).forEach((item)=>{
          params.append(item,_this.editform[item]);
        })

        this.$axios({
          method: 'post',
          url: 'cell/add.action',
          data:params,
          headers: {
            'Content-Type':'multipart/form-data'
          }
        }).then(function (response) {
          if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '上传失败',
              type: 'danger'
            });
          }
          this.$axios({method: 'post'})
          _this.pageno = 1;
          //刷新表格数据

          _this.getdata();

          _this.editwinshow=false;

        }).catch();
        this.temp.designCellTag="1"
        //组装数据(普通数据+特殊文件)   formData  html5提供的类型
        var param = new FormData();
        Object.keys(_this.temp).forEach((item)=>{
          if(_this.temp[item]!=null){
            param.append(item,_this.temp[item]);
          }
        })
        this.$axios({
          method: 'post',
          url: 'file/update.action',
          data:param,
          headers: {
            'Content-Type':'multipart/form-data'
          }
        }).then(function (response) {
         /* if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '上传失败',
              type: 'danger'
            });
          }
          this.$axios({method: 'post'})*/
          _this.pageno = 1;
          //刷新表格数据

          _this.getdata();

          _this.editwinshow=false;

        }).catch()
      },

      getDa(){
        this.$axios.get("Config/queryAll").then((response)=>{
          this.formInline.options=response.data;
        }).catch();
      },
      onSubmit() {
        this.firstKindName = this.formInline.value2[0];
        this.secondKindName = this.formInline.value2[1];
        this.thirdKindName = this.formInline.value2[2];
        if (this.formInline.value3[1]!= undefined) {
          this.checkTime = this.formInline.value3[1];
        }
        if (this.formInline.value3[0]!= undefined) {
          this.registerTime = this.formInline.value3[0];
        }
        this.productName=this.formInline.input;
        this.getdata();
      },
      gette(){
        this.$axios.get("Config/queryAll").then((response)=>{
          this.ops=response.data;
        }).catch();
      },

    },
    created() {
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(function () {
        _this.currentTime = //修改数据date
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate() +
          " " +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ": " +
          new Date().getSeconds();
      }, 1000);

      this.getdata();
      this.gette();
      this.getDa();
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },
    filters: {
      type(val) {
        if (val == 1) {
          return "商品"
        } else if (val == 2) {
          return "物料"
        }
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
