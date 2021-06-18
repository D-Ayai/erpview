<template>
  <div>
    <h4>生产管理>产品生产工序设计>制定产品生产工序设计单</h4>
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


    <!--表格-->
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
        width="140">
      </el-table-column>
      <el-table-column
        prop="productClass"
        label="档次"
        width="140">
      </el-table-column>
      <el-table-column
        prop="firstKindName"
        label="I级类名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="secondKindName"
        label="II级类名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="thirdKindName"
        label="III级类名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="responsiblePerson"
        label="产品经理"
        width="140">
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="warning" @click="openeditwin(scope.row.id)">制定设计单</el-button>
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

    <!-- 制定设计单模态框-->
    <el-dialog title="类型编辑" :visible="editwinshow">

      <el-form label-width="80px" :modal="editform">
        <el-form-item label="产品编号" >
          <el-input clearable v-model="editform.productId"  disabled></el-input>
        </el-form-item>

        <el-form-item label="id" >
          <el-input clearable v-model="editform.id"  disabled></el-input>
        </el-form-item>

        <el-form-item label="名字">
          <el-input clearable v-model="editform.name"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input clearable v-model="editform.remark"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-input clearable v-model="editform.img"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
        <el-button type="primary" @click="btnsave">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
    export default {
      name: "DesignProcedureAdd",
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
            name: "",
            remark: "",
            editwinshow: false,
            editform: {},
            addwinshow:false,
            addform:{}

          };
        },
      methods: {
        deleteRow(index, rows) {
          rows.splice(index, 1);
        },
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
          this.$axios.post("DesignProcedure/DesignSelectAllFile", params).then(function (response) {
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
        searchcartype() {   //条件查询
          this.getdata();
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
          var _this =this;
          //将数据保存到db
          //this.editform
          var params = new URLSearchParams();
          //params.append("id",this.editform.id);   以前 手动一个一个appen追加

          //循环获取json对象中的key和value
          // Object.keys(this.editform)   获取当前json对象的key的数组
          //{id:1,name:"张三"}    ["id","name"]
          Object.keys(this.editform).forEach(function (item) {
            params.append(item,_this.editform[item]);
          })
          this.$axios.post("updateCartype.action",params).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              });
            } else {
              _this.$notify({
                title: '失败',
                message: '编辑失败',
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


      },
      created(){
        this.getcaidan();
        this.getdata();
      },
    }
</script>

<style scoped>

</style>
