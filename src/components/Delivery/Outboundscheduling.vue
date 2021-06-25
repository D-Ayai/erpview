<template>
  <div id="app">
   <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
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
-->
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
    <el-dialog :visible.sync="editwinshow" title="出库调度单" width="1000px">
      <!-- 添加态框-->
      <el-dialog title="类型添加" append-to-body :visible.sync="addwinshow">

        <el-form label-width="80px" :modal="detailed">

          <el-form-item>
            <el-col :span="11">
              <el-form-item label-width="93px" label="出库单编号:" >
                <el-input  v-model="detailed.payid" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="100px" label="产品编号:" >
                <el-input  v-model="detailed.productid" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!--  <el-col :span="11">
                <el-form-item style="width: 200px;" label="出库理由:" >
                  <span v-if="detailed.reason === '1'">生产领料</span>
                  <span v-else-if="detailed.reason === '2'">赠送</span>
                  <span v-else-if="detailed.reason === '3'">内部借领</span>
                  <span v-else-if="detailed.reason === '4'">其他借领</span>
                </el-form-item>
              </el-col>-->
            <el-col :span="10">
              <el-form-item label-width="94px" label="产品名称:" >
                <el-input  v-model="detailed.productname" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="94px" label="成本单价:" >
                <el-input   v-model="detailed.costprice" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <!-- 表格-->
          <el-table
            :data="detailedbiao"
            stripe
            border
            style="width: 100%">
            <el-table-column label="序号"
                             width="180">
              <template slot-scope="scope">
                <span>1</span>
              </template>
            </el-table-column>
            <!--<el-table-column
              prop="productName"
              label="产品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productId"
              label="产品编号">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="剩余数量">
            </el-table-column>-->
            <el-table-column
              prop="amount"
              label="当前库存">
            </el-table-column>
            <el-table-column
              label="当前库存">
              <template slot-scope="scope">
                <el-form-item label-width="110px" label="本次出库数量:" >
                  <el-input type="text"  v-model="detailed.chuk" ></el-input>
                </el-form-item>
              </template>

            </el-table-column>
            <!--<el-table-column
              prop=this.aa
              label="以出库件数">
            </el-table-column>-->
            <!--<el-table-column label="出库调度">
              <template slot-scope="scope">
                <el-button type="warning" @click="seleid(scope.row.id)">出库调度</el-button>
                 <el-popconfirm
                   title="确定删除吗？"
                   @confirm="delcartype"
                 >
                   <el-button type="danger" slot="reference" @click="delid=scope.row.id">删除</el-button>
                 </el-popconfirm>
              </template>
            </el-table-column>-->
          </el-table>

          <el-form-item>
            <el-col :span="11">
              <el-form-item label-width="110px" label="应出库数:" >
                <el-input   v-model="detailed.paidamount" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="100px" label="已出库数:" >
                <el-input  v-model="detailed.aa" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label-width="110px" label="登记人:" >
                <el-input   v-model="detailed.register" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="100px" label="登记时间:" >
                <el-input  v-model="detailed.registertime" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <!--表格 -->


        <div slot="footer" class="dialog-footer">
          <el-button @click="addwinshow=false">取 消</el-button>
          <el-button type="primary" @click="btnadd">确 定</el-button>
        </div>

      </el-dialog>

      <el-form label-width="80px" :modal="byidfrom">

        <el-form-item>
          <el-col :span="11">
            <el-form-item label-width="93px" label="出库单编号:" >
              <el-input  v-model="byidfrom.payId" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
          <el-form-item>
            <el-col :span="11">
            <el-form-item style="width: 200px;" label="出库理由:" >
             <span v-if="byidfrom.reason === '1'">生产领料</span>
             <span v-else-if="byidfrom.reason === '2'">赠送</span>
             <span v-else-if="byidfrom.reason === '3'">内部借领</span>
             <span v-else-if="byidfrom.reason === '4'">其他借领</span>
            </el-form-item>
            </el-col>
            <el-col :span="11">
            <el-form-item label-width="100px" label="出库详细理由:" >
              <el-input  v-model="byidfrom.reasonexact" readonly></el-input>
            </el-form-item>
            </el-col>
          </el-form-item>


        <!--表格-->
        <el-table
          :data="editform"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productId"
            label="产品编号">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="剩余数量">
          </el-table-column>
          <el-table-column
            prop="paidAmount"
            label="应出库件数">
          </el-table-column>
          <el-table-column
            prop=this.aa
            label="以出库件数">
          </el-table-column>
          <el-table-column label="出库调度">
            <template slot-scope="scope">
              <a v-if="scope.row.payTag === '1'" style="color: red" @click="seleid(scope.row.id)">出库调度</a>
              <a v-else-if="scope.row.payTag === '2'" style="color: green" @click="">已调度</a>

              <!-- <el-popconfirm
                 title="确定删除吗？"
                 @confirm="delcartype"
               >
                 <el-button type="danger" slot="reference" @click="delid=scope.row.id">删除</el-button>
               </el-popconfirm>-->
            </template>
          </el-table-column>
        </el-table>
        <!---->

        <el-form-item>
          <el-col :span="11">
            <el-form-item label-width="110px" label="应出库总件数:" >
              <el-input   v-model="byidfrom.paidAmountSum" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label-width="100px" label="以出库总件数:" >
              <el-input  v-model="byidfrom.aa" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <!--表格 -->


      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">返回</el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "Outboundscheduling",
    data() {
      return {
        value: [],
        ops:[],
        tableData: [],
        detailed:{
          payid:"",
          reasonexact:"",
          reason:"",
          paytag:"",
          chuk:""
        },
        detailedbiao:[],
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
        editform:[],
        addwinshow:false,
        addform:{},
        byidfrom:{
         /* payId:"",
          reasonexact:"",
          paidAmountSum:"",
          aa:"0"*/
        },
      /*  checkTag:"1",
        changeTime:"",
        deleteTag:"0",
        firstKindName:"",
        secondKindName:"",
        thirdKindName:"",
        checkTime:"",
        registerTime:"",
        productName:"",
        aa:"0"*/
        /*payId:"",
        reasonexact:"",
        paidAmountSum:"",
        aa:"0"*/
        sid:"",
        paytig:"1",
        shul:{
          sl:""
        },
        attemperTime:""
      }
    },
    methods: {
      //查询
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        params.append("payTag",this.paytig)
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
      //调度1
      openeditwin(id) {  //打开编辑页面
        this.editwinshow = true;
        //根据id查询数据，显示在编辑页面
        this.sid=id;
        var _this = this;
        var params = new URLSearchParams();
        params.append("parenId", id);

        this.$axios.post("Pay/seleid.action", params).then(function (response) {
          _this.editform=response.data;
        }).catch();
        //根据id查询数据，显示在编辑页面
        var param = new URLSearchParams();
        param.append("id", id);

        this.$axios.post("Pay/byid.action", param).then(function (response) {
          _this.byidfrom=response.data;
        }).catch();
       /* for (const key in _this.byidfrom) {
          console.log(key)
        }*/
      },
     /* btnsave(){   //编辑模态框  保存按钮按下
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




      },*/
      /*修改调度*/
      btnadd(){
        var _this =this;
        var y = this.detailed.amount
        _this.detailed.paytag="2";
        _this.detailed.amount= parseInt(y)-parseInt(this.detailed.chuk);
        /*alert(_this.detailed.amount)
        _this.sid=parseInt(_this.sid)-1;*/
        //将数据保存到db
        //this.editform
        var params = new URLSearchParams();
        //params.append("id",this.editform.id);   以前 手动一个一个appen追加

        //循环获取json对象中的key和value
        // Object.keys(this.editform)   获取当前json对象的key的数组
        //{id:1,name:"张三"}    ["id","name"]
        Object.keys(this.detailed).forEach(function (item) {
          if(_this.detailed[item]!=null){
            params.append(item,_this.detailed[item]);
          }

        })



        this.$axios.post("Pay/updateid.action",params).then(function (response) {
          if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '调度成功',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '调度失败',
              type: 'danger'
            });
          }
          _this.pageno = 1;
          //刷新表格数据
          _this.detailed.chuk=null;
          _this.conutid();
        }).catch();


      },
      filechange(e){
        //每次添加页面 选择文件时，触发此方法
        //e.target.files[0];  获取文件控件中保存的第一个文件
        this.addform.img2=e.target.files[0];
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
      /*调度2*/
      seleid(id){
        this.addwinshow=true;
        this.detailedbiao=[]
        //根据id查询数据，显示在编辑页面
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("Pay/idselect.action", params).then(function (response) {
          _this.detailed=response.data;
          _this.detailedbiao.push(_this.detailed);
        }).catch();
      },
      update(){
       /* //根据id查询数据，显示在编辑页面
        var _this = this;
        var param = new URLSearchParams();
        param.append("parenId", this.tableData.id);

        this.$axios.post("Pay/seleid.action", param).then(function (response) {
          _this.editform=response.data;
        }).catch();*/

          var _this = this;
          var para = new URLSearchParams();
          para.append("id", this.sid);
          para.append("payTag",2)
          para.append("attemperTime",_this.attemperTime)

            this.$axios.post("Pay/update.action", para).then(function (response) {
              /*_this.editform=response.data;*/

              _this.addwinshow=false;
              _this.editwinshow=false;
              _this.getdata();
           }).catch();
      },
      conutid(){
        var _this = this;
        var para = new URLSearchParams();
        para.append("paytag",_this.paytig)
        this.$axios.post("Pay/conutid.action", para).then(function (response) {
          _this.shul=response.data;
          if (response.data.sl=="0"){
            _this.update()
          }else {
            _this.addwinshow=false;
            _this.openeditwin(_this.sid);
          }
        }).catch();
      },
      getNowTime () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
        var day = date.getDate()<10?'0'+date.getDate():date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        this.attemperTime=year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;


      }
    },

    filters:{
      xuhao(val){
        var a=1;
        if (val!=undefined){
          a=val;
        }
        return a;
      }
    },
    created() {
    /*  this.timer = setInterval(function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
        var day = date.getDate()<10?'0'+date.getDate():date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        this.attemperTime=year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      }, 1000);*/
      this.gette();
      this.getdata();
      this.getNowTime();
      this.getDa();
    }
  }
</script>
<style>
  .el-input__inner{
    border: none;
  }
</style>
