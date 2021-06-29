<template>
    <div >
      <el-container>
        <el-container>
          <el-main width="30%" >
            <el-form ref="form" :model="form" label-width="80px" >
                <h2>登入</h2>
              <el-form-item label="账号" prop="name">
                <el-input prefix-icon="el-icon-user"  placeholder="请输入账号" v-model="form.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pwd">
                <el-input prefix-icon="el-icon-key" placeholder="请输入密码" v-model="form.pwd"  show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%;height: 100%;" type="primary" @click="onSubmit" round>登陆</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
    export default {
        name: "Login",
      data() {
        return {
          form: {
            name:"",
            pwd:""
          }
        }
      },
      rules :{
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      methods: {
        onSubmit() {
          var _this = this;
          var params = new URLSearchParams();
          params.append("loginId", this.form.name);
          params.append("password",this.form.pwd);

          this.$axios.post("User/login.action",params).then((response)=>{
            if(response.data==true){
              _this.$router.push('/app')
            }else{
              alert("用户或密码错误！！")
              _this.$router.push('/')
            }
          }).catch();
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      }
    }
</script>

<style>

  .dengru {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-main{
    top:30%;
  }
  #biaoti{
    text-align: center;
  }
</style>
