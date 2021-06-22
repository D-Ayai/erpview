<template>
  <!--表格 -->
  <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="payId"
      label="出库单编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="reason"
      label="出库理由"
      width="180">
    </el-table-column>
    <el-table-column
      prop="reasonexact"
      label="出库详细理由">
    </el-table-column>
    <el-table-column
      prop="registerTime"
      label="登记时间">
    </el-table-column>
    <el-table-column
      prop="amountSum"
      label="总件数">
    </el-table-column>
    <el-table-column
      prop="costPriceSum"
      label="总金额">
    </el-table-column>
    <el-table-column label="出库调度">
      <template slot-scope="scope">
        <el-button type="warning" @click="openeditwin(scope.row.id)">出库调度</el-button>
        <!-- <el-popconfirm
           title="确定删除吗？"
           @confirm="delcartype"
         >
           <el-button type="danger" slot="reference" @click="delid=scope.row.id">删除</el-button>
         </el-popconfirm>-->
      </template>
    </el-table-column>

  </el-table>
</template>
<script>
    export default {
        name: "Outboundscheduling",
      data() {
        return {
          value: [],
          ops:[],
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
            changeTime:""
          },
          addwinshow:false,
          addform:{},
          checkTag:"1",
          changeTime:"",
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
          this.$axios.post("Pay/page.action", params).then(function (response) {
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
        delcartype() {  //根据id删除

          // alert("axios 进行删除")
          /*if( confirm("确认删除吗")){

          }*/

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


        },
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
        btnsave(){   //编辑模态框  保存按钮按下
          this.editwinshow = false;
          alert(this.changeTime)
          var _this =this;
          _this.editform.checkTag="0";
          _this.editform.changeTime=this.changeTime;
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
                message: '变更成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '变更失败',
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

          /*  this.$axios.post("addCartype.action",params,{headers: {
                'Content-Type':'multipart/form-data'
              }}).then().catch();*/

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



        },
        filechange(e){
          //每次添加页面 选择文件时，触发此方法
          //e.target.files[0];  获取文件控件中保存的第一个文件
          this.addform.img2=e.target.files[0];
        },
        getNowTime () {
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth() + 1) < 10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          var day = date.getDate()<10?'0'+date.getDate():date.getDate();
          var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          this.changeTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
          this.editform.changeTime=this.changeTime

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
        this.gette();
        this.getdata();
        this.getNowTime();
        this.getDa();
      }

    }
</script>

<style scoped>

</style>
