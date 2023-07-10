<template>
  <div>
    <el-input v-model="inputValInner" placeholder="请选择商铺" clearable @click.native="openSelect"
      @keyup.enter.native="handleEnter" >
    </el-input>
    <el-dialog title="选择商铺" :visible.sync="open" width="60%" append-to-body :close-on-click-modal=false
      :show-close=false>
      <el-form :model="queryParams" ref="searchForm" :inline=true v-show="showSearch" @submit.native.prevent>
        <el-form-item label="店铺名称" prop="storeName">
          <el-input v-model="queryParams.storeName" placeholder="请输入店铺名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="店主姓名" prop="storeKeeper">
          <el-input v-model="queryParams.storeKeeper" placeholder="请输入店主姓名" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="联系电话" prop="storePhone">
          <el-input v-model="queryParams.storePhone" placeholder="请输入联系电话" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
     <div class="sketch_content" >
      <el-table v-loading="loading" ref="table" :data="tableList" highlight-current-row @current-change="currentChange"
        @row-click="handleRowClick"  @selection-change="handleRowSelect">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="店铺名称" align="left" prop="storeName" />
       <!--  <el-table-column label="营业执照名称" align="center" prop="licenseName" />
        <el-table-column label="营业执照注册号" align="center" prop="licenseNum" />
        <el-table-column label="店主姓名" align="center" prop="storeKeeper" />
        <el-table-column label="联系电话" align="center" prop="storePhone" /> -->
        <el-table-column label="店面地址" align="left" prop="storeAddress" />
        <el-table-column label="图片" align="center" prop="image" >
          <template slot-scope="scope">
            <image-preview :src="scope.row.image" :width="50" :height="50" />
          </template>
        </el-table-column>
      </el-table>
</div>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStore } from "@/api/srhjjg/store";

export default {
  name: "StoreListSel",
  components: {},
  data() {
    return {
      open: false,
      loading: false,
      total: 0,
      showSearch: true,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        storeName: null,
        storeKeeper: null,
        storePhone: null,
      },
      tableList: [],
      inputValInner: null,
      selectedRow: null,
    }
  },
  props: {
    inputVal: String,
    pdata: Object,
    forSearch: {
      type: Boolean,
      default: false
    },
    multiSel: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    inputVal(val) {
      this.inputValInner = val;
    }
  },
  created() {
    this.inputValInner = this.inputVal;
  },
  methods: {
    openSelect(e) {
      if (e.target.tagName === "I") {
        this.$emit('clearCB');
      } else {
        if (this.pdata) {
          this.$emit('beforeDialogOpen', this.pdata);
        }
        this.open = true;
        this.getList();
      }
    },
    getList() {
      this.loading = true;
      listStore(this.queryParams).then(res => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    currentChange(currentRow, oldRow) {
      this.selectedRow = currentRow;
      if(!this.multiSel) {
        this.$refs.table.toggleRowSelection(oldRow);
      }
    },
    handleRowClick(row, column, event) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleRowSelect(selection){
      if(!this.multiSel) {
        
        if (selection.length > 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(
            selection[selection.length - 1]
          )
        }
         this.selectedRow = selection[selection.length - 1]
      }
      
    },
    confirm() {
      if (this.selectedRow) {
        console.log(this.selectedRow);
        this.inputValInner = this.selectedRow.storeName;
        this.$emit('confirmCB', this.selectedRow);
      }
      this.open = false;
    },
    cancle() {
      this.open = false;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("searchForm");
      this.getList();
    },
    handleEnter() {
      if(this.forSearch) {
        this.$emit('onEnter');
      } else {
        this.handleQuery();
      }
    }
  },
  filters: {

  }
}
</script>

<style scoped></style>