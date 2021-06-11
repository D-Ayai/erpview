<template>
    <div id="file" style="width: 1200px">
          <h5>您正在做的业务是：产品设计-产品档案管理-产品档案登记</h5>
        <el-form :model="fileForm" :rules="rules" ref="fileForm" label-width="100px" class="demo-fileForm">
        <el-form-item>
          <el-col :span="12">
            <div>.</div>
          </el-col>
          <el-col :span="17"></el-col>
          <el-form-item id="bt1">
            <el-button type="primary" @click="btnadd">立即创建</el-button>
            <el-button @click="resetForm('fileForm')">重置</el-button>
          </el-form-item>
        </el-form-item>
          <h3 style="color: darkgray">主信息:</h3>
          <el-form-item>
          <el-col :span="12">
            <el-form-item style="width:400px" label="产品名称" prop="productName">
          <el-input v-model="fileForm.productName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 400px" label="制造商" prop="factoryName">
              <el-input v-model="fileForm.factoryName"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
          <!--<el-form-item>

            <el-col :span="12">
        <el-form-item label="II级分类" prop="secondKindName">
          <el-select v-model="fileForm.secondKindName" placeholder="II级分类">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
            </el-col>
          </el-form-item>-->
          <el-form-item>
           <!-- <el-col :span="12">
        <el-form-item label="III级分类" prop="thirdKindName">
          <el-select v-model="fileForm.thirdKindName" placeholder="III级分类">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
            </el-col>-->
            <el-col :span="12">
              <el-form-item label="级分类" prop="firstKindName">
                <el-cascader
                  v-model="value"
                  :options="ops"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item style="width: 400px" prop="productNick" label="产品简介">
              <el-input v-model="fileForm.productNick"></el-input>
            </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <el-form-item label="用途类型" prop="type">
                <el-select v-model="fileForm.type" placeholder="用途类型">
                  <el-option label="商品" value="商品"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item label="档次级别" prop="productClass">
          <el-select v-model="fileForm.productClass" placeholder="档次级别">
            <el-option label="抵挡" value="抵挡"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <el-form-item style="width: 400px" prop="personalUnit" label="计量单位">
                <el-input v-model="fileForm.personalUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="personalValue" label="计量值">
          <el-input v-model="fileForm.personalValue"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <el-form-item style="width: 400px" prop="listPrice" label="市场单价">
                <el-input v-model="fileForm.listPrice"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item style="width: 400px" prop="costPrice" label="计划成本单价">
          <el-input v-model="fileForm.costPrice"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
        <h3 style="color: darkgray">辅助信息:</h3>
          <el-form-item>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="warranty" label="保修期">
          <el-input v-model="fileForm.warranty"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="twinName" label="替代品名称">
          <el-input v-model="fileForm.twinName"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="twinId" label="替代品编号">
          <el-input v-model="fileForm.twinId"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="lifecycle" label="生命周期(年)">
          <el-input v-model="fileForm.lifecycle"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="amountUnit" label="单位">
          <el-input v-model="fileForm.amountUnit"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item label="产品经理" prop="responsiblePerson">
          <el-select v-model="fileForm.responsiblePerson" placeholder="产品经理">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="providerGroup" label="供应商集合">
          <el-input type="textarea" v-model="fileForm.providerGroup"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="productDescribe" label="产品描述">
          <el-input type="textarea" v-model="fileForm.productDescribe"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="register" label="登记人">
          <el-input v-model="fileForm.register"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item style="width: 400px" prop="registerTime" label="建档时间">
          <el-input v-model="fileForm.registerTime"></el-input>
        </el-form-item>
            </el-col>
          </el-form-item>
      </el-form>
    </div>
</template>
<style>
  template{text-align:center}
  #file{
    margin:0 auto
  }
</style>
<script>
    export default {
     name: "Fileadd",
      data() {
        return {
          value: [],
          ops:[],
          fileForm: {
            productId:"",
            productName:"",
            factoryName:"",
            firstKindName:"",
            secondKindName:"",
            thirdKindName:"",
            productNick:"",
            type: "",
            productClass:"",
            personalUnit:"",
            personalValue:"",
            listPrice:"",
            costPrice:"",
            warranty:"",
            twinName:"",
            twinId:"",
            lifecycle:"",
            amountUnit:"",
            responsiblePerson:"",
            providerGroup:"",
            productDescribe:"",
            register:"",
            registerTime:"",
            checkTag:"0",
            deleteTag:"0",
            designModuleTag:"0",
            designProcedureTag:"0",
            designCellTag:"0",
            changeTag:"0",
            priceChangeTag:"0"
          },
          rules: {
            productName: [
              { required: true, message: '请输入产品名称', trigger: 'blur' }
            ],
            factoryName: [
              { required: true, message: '请输入制造商', trigger: 'blur' }
            ],
          /*  firstKindName: [
              { required: true, message: '请选择一级分类', trigger: 'change' }
            ]*/
          }
        };
      },
      methods: {
        handleChange(value) {
          this.fileForm.firstKindName= this.value[0];
          this.fileForm.secondKindName = this.value[1];
          this.fileForm.thirdKindName = this.value[2];
          console.log(this.fileForm.firstKindName+this.fileForm.secondKindName+this.fileForm.thirdKindName);
        },
        getDate(){
          this.$axios.get("Config/queryAll").then((response)=>{
            this.ops=response.data;
          }).catch();
        },
        btnadd(){
          //添加按钮按下，保存到db
          var _this =this;
          //组装数据(普通数据+特殊文件)   formData  html5提供的类型
          var params = new FormData();
          Object.keys(this.fileForm).forEach((item)=>{
            params.append(item,this.fileForm[item]);
          })

          //异步请求    post   enctype

          /*  this.$axios.post("addCartype.action",params,{headers: {
                'Content-Type':'multipart/form-data'
              }}).then().catch();*/

          this.$axios({
            method: 'post',
            url: 'file/addr.action',
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
            _this.resetForm ('fileForm')
            _this.getNowTime ()
          }).catch();



        },
        getmenudata(){
          this.$axios.get("queryallmenus.action").then((response)=>{
            this.menutable=response.data;
          }).catch();
        },
        submitForm(formName) {
          alert(this.fileForm)
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('ss')
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          alert(formName)
          this.$refs[formName].resetFields();
        },
        getNowTime () {
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth() + 1) < 10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          var day = date.getDate()<10?'0'+date.getDate():date.getDate();
          var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          this.fileForm.registerTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
          this.fileForm.productId=year+month+ day+ hour+ minute+ second;

        }
      },
      created(){
       this.getNowTime ();
        this.getDate();
     }
    }
</script>

<style scoped>

</style>
