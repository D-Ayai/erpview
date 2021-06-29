<template>
  <div>
    <!-- 显示头 -->
    <h5>
      <el-steps :active="2" simple>
        <el-step title="生产管理" icon="el-icon-s-unfold"></el-step>
        <el-step title="生产计划管理" icon="el-icon-set-up"></el-step>
        <el-step title="新发生生产计划登记" icon="el-icon-notebook-2"></el-step>
      </el-steps>
    </h5>


    <el-form :inline="true"  :modal="editform">
      <el-form-item label="生产理由:"   style="width: 30%">
        <el-input  v-model="editform.xuyao"></el-input>
      </el-form-item>
      <el-form-item label="供货时间:" style="width: 30%" >
        <div class="block">
          <el-date-picker
            v-model="editform.designer"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item style="width: 30%">
        <el-button type="success"  icon="el-icon-edit"  @click="opengongxuct" plain>添加产品</el-button>
      </el-form-item>
      <el-form-item label="登记人:" style="width: 30%" >
        <el-input   v-model="editform.register"></el-input>
      </el-form-item>
      <el-form-item label="登记时间:" style="width: 30%">
        <div class="block">
          <el-date-picker
            v-model="editform.registerTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item style="width: 30%">
        <el-button type="warning"  icon="el-icon-delete"  @click="toggleSelection" plain>删除产品</el-button>
      </el-form-item>

      <!--表格-->

      <el-table
        ref="multipleSelection"
        :data="manufa"
        stripe
        border
        :header-cell-style="{background:'#E4E7ED', color:'#606266'}"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="productId" label="产品编号"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="productDescribe" label="描述"></el-table-column>
      <el-table-column  label="数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amount" :min="1" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="amountUnit" label="单位"></el-table-column>
      <el-table-column prop="costPrice" label="单价(元)"></el-table-column>
        <el-table-column label="小计" >
          <template slot-scope="scope">
            <span  v-if="isNaN(scope.row.amount*scope.row.costPrice)">0</span>
            <span  v-else="">{{scope.row.amount*scope.row.costPrice}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="要求:">
        <el-input style="width: 700px" type="textarea" :rows="2" placeholder="请输入内容" v-model="editform.procedureDescribe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-s-promotion"  @click="addlist">提交</el-button>
      </el-form-item>
    </el-form>

    <!-- 产品列表模态框-->
    <el-dialog  title="产品列表"  width="60%" :visible.sync="editwinshow">

      <!-- 查询条件 -->
      <el-form :inline="true" :model="chafrom" class="demo-form-inline" size="mini">
        <el-form-item label="菜单">
          <el-cascader  v-model="chafrom.value" :options="chafrom.options"  :props="{checkStrictly: true }" clearable></el-cascader>
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
        border
        style="width: 100%">
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称" ></el-table-column>
        <el-table-column prop="productClass" label="档次" ></el-table-column>
        <el-table-column label="用途类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">商品</span>
            <span v-else="">物料</span>
          </template>
        </el-table-column>
        <el-table-column prop="costPrice" label="成本单价" ></el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="addGongXuRow(scope.$index, scope.row)">添加</el-button>
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

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-delete" @click="deleteggadd" circle ></el-button>
        <el-button type="success" icon="el-icon-check"  @click="editwinshow = false" circle></el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "ApplyAdd.vue",
      data(){
        return {
          chafrom:{//查询表单
            value: '',//选中的菜单值
            tjname:"",//产品名称
            options:[],//三级联动菜单
          },
          tableData: [],//表格数据
          pageno: 1,//页号
          pagesize: 5,//页大小
          total: 0,//总数据量
          editwinshow: false,//添加的模态框

          table: false,//抽屉
          editform:{
            register:"abc",
          },
          multipleSelection: [],
          manufa:[],//添加的数据
          ggtianjia:'',
          manufactureform:{},
        };
      },
      methods:{
        onSubmit(){
          this.getdata();
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

          // 请求地址
          this.$axios.post("file/selectAllSC", params).then(function (response) {
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

        getcaidan(){//查询菜单
          this.$axios.get("Config/queryAll").then((response)=>{
            this.chafrom.options=response.data;
          }).catch();
        },


        opengongxuct() {//查询
         this.ggtianjia= this.manufa.length
          this.editwinshow=true;
          this.getdata();
          this.getcaidan();
        },

        toggleSelection(){
          if(this.manufa==""){
            this.$message.error('你没有要删除的选项');
            return false;
          }

          var pd= true;
          for (let i = this.multipleSelection.length - 1; i >= 0; i--) {
            for(let j=this.manufa.length-1; j >= 0;j--){
              if (this.manufa[j].id === this.multipleSelection[i].id) {
                this.manufa.splice(j, 1);
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

        handleSelectionChange(val) { //把选择的值添加进去
          this.multipleSelection = val;
        },

        addGongXuRow(index, row) { //添加工序列表
          var tempobj = this.manufa.find((item)=>{return item.id==row.id});
          if (tempobj==undefined){
            this.manufa.push(row);
            this.$message({
              message: '成功添加了'+row.productName,
              type: 'success'
            });
          }else {
            this.$message.error('你已经添加了'+row.productName);
          }
        },

        deleteggadd(){//删除刚刚添加的
          this.editwinshow = false;
          this.manufa=this.manufa.splice(0,this.ggtianjia);
        },

        addlist(){
          if(this.manufa==""){
            this.$message.error('请先添加物料');
            return false
          }
          if (this.manufa.length<0){
            this.$message.error('请先添加物料');
            return false
          }
          for (var i=0;i<this.manufa.length;i++){
            if(this.manufa[i].amount==undefined){
              this.$message.error(this.manufa[i].productName+'的数量不能为空,请输入有效数字');
              return false
            }
            if(this.manufa[i].amount<=0){
              this.$message.error(this.manufa[i].productName+'的数量不正确,请输入有效数字');
              return false
            }
            this.manufa[i].register=this.editform.register;
            this.manufa[i].remark=this.editform.procedureDescribe;
            this.manufa[i].designer=this.editform.designer;
            this.manufa[i].registerTime=null;
            this.manufa[i].checkTime=null;
          }
          this.$confirm('是否确认提交?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var _this =this;
            this.$axios.post("Apply/Add", JSON.stringify(this.manufa),
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
              _this.manufa =[];
            }).catch();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      filters: {   //过滤器
        xiaoji(val){
          var a=0;
          console.log(val.amount)
          if(val.amount!=undefined){
            a=val.amount;
          }
          return a*val.costPrice;
        },
      },
    }
</script>

<style scoped>

</style>
