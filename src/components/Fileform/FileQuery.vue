<template>
  <div>
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
      <el-table-column
        prop="checkTag"
        label="状态">
        <template  slot-scope="scope">
          <span v-if="scope.row.checkTag==1" style="color:green">审核通过</span>
          <span v-else-if="scope.row.checkTag==2" style="color:red">审核不通过</span>
          <span v-else="" style="color:orange">待审核</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" @click=editshow(scope.row.id)>配置详情</el-button>
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
    <el-dialog title="安全库存配置单" :visible="editwinshow" @close="addDialogClosed">
      <el-form label-width="120px" :modal="editform">
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
          <el-input clearable v-model="editform.minAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="库存报警上限数">
          <el-input clearable v-model="editform.maxAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="设计人">
          <el-input clearable v-model="editform.sheji" disabled></el-input>
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
              <el-input v-model="editform.maxCapacityAmount" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="存储单位">
            <template slot-scope="scope">
              <el-input v-model="editform.amountUnit" disabled></el-input>
            </template>
          </el-table-column>
        </el-table>
        <br/>
        配置要求:
        <el-input
          type="textarea"
          :rows="2"
          v-model="editform.config" disabled>
        </el-input>
        <br>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
       <!-- <el-button type="primary" @click="btnadd">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "FileQuery",
    data(){
      return{
        currentTime: new Date(), // 获取当前时间
        tableData:[],
        tableData2:[{uid:"1",name:"成品库",ddr:"120.110.1", menuca:""}],
        pageno: 1,
        pagesize: 5,
        total: 0,
        editwinshow: false,
        editform:{},
        value1:'',
        checkTag:""
      }
    },
    methods:{
      editshow(id){
        this.editwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);

        this.$axios.post("cell/byid.action", params).then(function (response) {
          _this.editform=response.data;
          _this.tableData2[0].menuca = response.data.firstKindName + '/' + response.data.secondKindName + '/' + response.data.thirdKindName;
        }).catch()
        this.editform=true
      },
      addDialogClosed() {
        this.$nextTick(() => {
          this.editwinshow = false
        })
      },
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        params.append("checkTag", this.checkTag);
        this.$axios.post("cell/page.action", params).then(function (response) {
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
      btnadd(){

        this.editwinshow=false
      },
    },
    created(){
      this.getdata()
    },
    filters: {   //过滤器

    }
  }
</script>

<!--<style scoped>

</style>-->
