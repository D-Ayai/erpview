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
          label="用途类型">
        </el-table-column>
        <el-table-column
          prop="firstKindName"
          label="I级分类">
        </el-table-column>
        <el-table-column
          prop="secondKindName"
          label="II级分类">
        </el-table-column>
        <el-table-column
          prop="thirdKindName"
          label="III级分类">
        </el-table-column>
        <el-table-column
          prop="responsiblePerson"
          label="产品经理">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="openeditwin(scope.row.id)">详细信息</el-button>
            <!-- <el-popconfirm
               title="确定删除吗？"
               @confirm="delcartype"
             >
               <el-button type="danger" slot="reference" @click="delid=scope.row.id">删除</el-button>
             </el-popconfirm>-->
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
      <!-- 编辑模态框-->
      <el-dialog title="类型编辑" :visible="editwinshow">

        <el-form label-width="80px" :modal="editform">

          <el-form-item>
            <el-col :span="11">
              <el-form-item label="id" >
                <el-input clearable v-model="editform.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称">
                <el-input clearable v-model="editform.productName"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="制造商" >
                <el-input clearable v-model="editform.factoryName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="I级分类" >
                <el-input clearable v-model="editform.firstKindName"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="II级分类">
                <el-input clearable v-model="editform.secondKindName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="III级分类" >
                <el-input clearable v-model="editform.thirdKindName"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="产品简介">
                <el-input clearable v-model="editform.productNick"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用途类型" >
                <el-input clearable v-model="editform.type"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="档次级别">
                <el-input clearable v-model="editform.productClass"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计量单位" >
                <el-input clearable v-model="editform.personalUnit"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="计量值">
                <el-input clearable v-model="editform.personalValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="市场单价" >
                <el-input clearable v-model="editform.listPrice"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <h3 style="color: darkgray">辅助信息:</h3>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="计划成本单价">
                <el-input clearable v-model="editform.costPrice"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保修期" >
                <el-input clearable v-model="editform.warranty"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="替代品名称">
                <el-input clearable v-model="editform.twinName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="替代品编号" >
                <el-input clearable v-model="editform.twinId"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="生命周期(年)">
                <el-input clearable v-model="editform.lifecycle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位" >
                <el-input clearable v-model="editform.amountUnit"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="产品经理">
                <el-input clearable v-model="editform.responsiblePerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商集合" >
                <el-input clearable v-model="editform.providerGroup"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="产品描述">
                <el-input clearable v-model="editform.productDescribe"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登记人" >
                <el-input clearable v-model="editform.register"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- <el-col :span="11">
               <el-form-item prop="checkTime" label="复核时间" >
                 <el-input clearable v-model="editform.checkTime"></el-input>
               </el-form-item>
             </el-col>-->
            <el-col :span="12">
              <el-form-item label="建档时间">
                <el-input clearable v-model="editform.registerTime"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editwinshow = false">返回</el-button>
        </div>

      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Filequery",
      data() {
        return {
          tableData: [],
          formInline:{
            value2: '',
            value3: '',
            options:[],
            input:"",
          },
          pageno: 1,
          pagesize: 5,
          total: 0,
          remark: "",
          delid: -1,
          editwinshow: false,
          editform: {
            checkTag:"",
            checkTime:""
          },
          addwinshow:false,
          addform:{},
          checkTag:"1",
          deleteTag:"0",
          firstKindName:"",
          secondKindName:"",
          thirdKindName:"",
          checkTime:"",
          registerTime:"",
          productName:""

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
        /*    searchcartype() {   //条件查询
              this.getdata();
            },*/
      /*  delcartype() {  //根据id删除

          // alert("axios 进行删除")
          /!*if( confirm("确认删除吗")){

          }*!/

          var _this = this;
          var params = new URLSearchParams();
          params.append("id", this.delid);

          this.$axios.post("delCartype.action", params).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'danger'
              });
            }
            _this.pageno = 1;
            _this.getdata();
          }).catch();


        },*/
        openeditwin(id) {  //打开编辑页面
          this.editwinshow = true;
          //根据id查询数据，显示在编辑页面
          var _this = this;
          var params = new URLSearchParams();
          params.append("id", id);

          this.$axios.post("file/byid.action", params).then(function (response) {
            _this.editform=response.data;
          }).catch();


        },
    /*    btnsave(){   //编辑模态框  保存按钮按下
          this.editwinshow = false;
          alert(this.checkTime)
          var _this =this;
          _this.editform.checkTag="1";
          //将数据保存到db
          //this.editform
          var params = new URLSearchParams();
          //params.append("id",this.editform.id);   以前 手动一个一个appen追加

          //循环获取json对象中的key和value
          // Object.keys(this.editform)   获取当前json对象的key的数组
          //{id:1,name:"张三"}    ["id","name"]
          Object.keys(this.editform).forEach(function (item) {
            if(_this.editform[item]!=null){
              params.append(item,_this.editform[item]);
            }

          })



          this.$axios.post("file/update.action",params).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '复核成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '复核失败',
                type: 'danger'
              });
            }
            _this.pageno = 1;
            //刷新表格数据

            _this.getdata();
          }).catch();




        },
        btnadd(){
          //添加按钮按下，保存到db
          var _this =this;
          //组装数据(普通数据+特殊文件)   formData  html5提供的类型
          var params = new FormData();
          Object.keys(this.addform).forEach((item)=>{
            params.append(item,this.addform[item]);
          })

          //异步请求    post   enctype

          /!*  this.$axios.post("addCartype.action",params,{headers: {
                'Content-Type':'multipart/form-data'
              }}).then().catch();*!/

          this.$axios({
            method: 'post',
            url: 'addCartype.action',
            data:params,
            headers: {
              'Content-Type':'multipart/form-data'
            }
          }).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '添加失败',
                type: 'danger'
              });
            }
            _this.pageno = 1;
            //刷新表格数据

            _this.getdata();

            _this.addwinshow=false;

          }).catch();



        },*/
        filechange(e){
          //每次添加页面 选择文件时，触发此方法
          //e.target.files[0];  获取文件控件中保存的第一个文件
          this.addform.img2=e.target.files[0];
        },
       /* getNowTime () {
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth() + 1) < 10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          var day = date.getDate()<10?'0'+date.getDate():date.getDate();
          var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          this.editform.checkTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        }*/

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
      },

      created() {
        this.getdata();
        this.getDa();
      }
    }
</script>

<style scoped>

</style>
