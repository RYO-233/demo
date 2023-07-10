<template>
  <div>
    <el-input v-model.trim="inputValInner" placeholder="请选择监控点" clearable @click.native="openSelect"
      @keyup.enter.native="handleEnter"  >
    </el-input>
    <el-dialog title="选择监控点" :visible.sync="open" width="60%" append-to-body :close-on-click-modal=false
      :show-close=false>
      <el-form :model="queryParams" ref="searchForm" :inline="true" v-show="showSearch"  @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div class="sketch_content">
      <el-table   v-loading="loading" ref="table" :data="tableList" highlight-current-row 
        @row-click="handleRowClick" @selection-change="handleRowSelect"  @current-change="currentChange"> 
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="名称" align="left" prop="name" />
        <el-table-column label="设备id" align="center" prop="deviceId" />
        <!-- <el-table-column label="坐标" align="center" prop="coordinates" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="纬度" align="center" prop="latitude" /> -->
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
import { listMonitorPoint } from "@/api/srhjjg/monitorPoint";

export default {
  name: "MonitorPointListSel",
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
        name: null,
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
      listMonitorPoint(this.queryParams).then(res => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    currentChange(currentRow, oldRow) {
      console.log("currentChange");
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
        this.inputValInner = this.selectedRow.name;
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