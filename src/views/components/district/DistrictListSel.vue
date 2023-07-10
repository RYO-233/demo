<template>
  <div>
    <el-input v-model="inputValInner" :placeholder="'请选择' + moduleName" clearable @click.native="openSelect"
      @keyup.enter.native="handleEnter">
    </el-input>
    <el-dialog :title="'选择' + moduleName" :visible.sync="open" width="65%" append-to-body :close-on-click-modal=false
      :show-close=false >
      <el-form :model="queryParams" ref="searchForm" :inline=true v-show="showSearch" 
        @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="片区属性" prop="prop">
          <el-select v-model="queryParams.prop" placeholder="请选择片区属性" clearable>
            <el-option v-for="dict in dict.type.district_prop" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div  class="sketch_content" >
      <el-table v-loading="loading" ref="table" :data="tableList" highlight-current-row @current-change="currentChange"
        @row-click="handleRowClick">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="片区属性" align="center" prop="prop">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.district_prop" :value="scope.row.prop"/>
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
import { listDistrict } from "@/api/srhjjg/district";

export default {
  name: "DistrictListSel",
  dicts: ['district_prop'],
  components: {},
  data() {
    return {
      moduleName: '片区',
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
      listDistrict(this.queryParams).then(res => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    currentChange(currentRow, oldRow) {
      this.selectedRow = currentRow;
      if (!this.multiSel) {
        this.$refs.table.toggleRowSelection(oldRow);
      }
    },
    handleRowClick(row, column, event) {
      this.$refs.table.toggleRowSelection(row);
    },
    confirm() {
      if (this.selectedRow) {
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
      if (this.forSearch) {
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