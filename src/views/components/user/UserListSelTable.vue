<template>
  <el-dialog :title="'选择' + label" :visible.sync="open" width="70%" append-to-body :close-on-click-modal=false
    :show-close=false >
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入用户姓名" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
   <div  class="sketch_content">
    <el-table v-loading="loading" ref="table" :data="list" highlight-current-row 
      @current-change="currentChange"
      @selection-change="selectionChange"
      @row-click="handleRowClick">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="姓名" align="center" prop="realName" />
      <el-table-column label="责任单位" align="center" prop="dept.deptName" />
      <el-table-column label="手机号" align="center" prop="phonenumber" />
    </el-table>
</div>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="cancle">取 消</el-button>
    </div>
    
  </el-dialog>
</template>

<script>
import { listUserPost } from "@/api/system/user";

export default {
  name: 'UserListSelTable',
  data() {
    return {
      open: false,
      loading: false,
      total: 0,
      list: [],
      selectedUserRow: null,
      selection: []
    }
  },
  props: {
    queryParams: {
      type: Object,
      default:()=>({
        pageNum: 1,
        pageSize: 20,
        realName: null,
        phonenumber: null,
        params:{},
      }) 
    },
    label: {
      type:String,
      default:"用户"
    },
    multiSel: {
      type: Boolean,
      default: false
    },
    parentId:{
      type:String,
      default:null
    }
  },
  watch: {
    parentId(val){
     
    }
  },
  created() {
  },
  methods: {
    show(roleKeys=null) {
      this.open = true;
      this.roleKeys=roleKeys;
      this.getList();
    },
    currentChange(currentRow, oldRow) {
      this.selectedUserRow = currentRow;
      if (!this.multiSel) {
        this.$refs.table.toggleRowSelection(oldRow);
      }
    },
    selectionChange(selection) {
       if(!this.multiSel) {
        
        if (selection.length > 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(
            selection[selection.length - 1]
          )
        }
         this.selectedUserRow = selection[selection.length - 1]
      }else{
        this.selection = selection;
      }
      
    },
    handleRowClick(row, column, event) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.list = [];
      this.queryParams.deptId=this.parentId;
      if(this.roleKeys){
          this.queryParams.params.roleKeys=this.roleKeys;
      }else{
         this.queryParams.params={}
      }
      listUserPost(this.queryParams).then(res => {
        this.list = res.rows;
        this.loading = false;
      });
    },
    confirm() {
      this.resetForm("queryForm");
      if (this.selectedUserRow) {
        if (this.multiSel) {
          this.$emit('confirmCB', this.selection);
        } else {
          this.$emit('confirmCB', this.selectedUserRow);
        }
      }
      this.open = false;
    },
    cancle() {
      this.resetForm("queryForm");
      this.open = false;
      this.$emit("updateUserListSelTableVisible",false);
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.getList();

    }
  }
}
</script>

<style></style>