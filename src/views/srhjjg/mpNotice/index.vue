<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handlePushMsg"
          v-hasPermi="['srhjjg:mpNotice:add']"
          >推送通知</el-button
        ></el-form-item
      >
      <el-form-item label="发布时间" prop="postTime">
        <el-date-picker
          clearable
          v-model="queryParams.params.postTimeArr"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
          placeholder="请选择发布时间"
        >
        </el-date-picker>
      </el-form-item>
        <el-form-item label="" label-width="0"> 
          <el-input v-model="queryParams.params.searchStr" placeholder="请输入..."></el-input>
        </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:mpNotice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['srhjjg:mpNotice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['srhjjg:mpNotice:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:mpNotice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <bl-table
      :listData="mpNoticeList"
      :queryParams="queryParams"
      :loading="loading"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
    >   <template slot="col">
      <el-table-column label="标题" align="left" prop="title" show-overflow-tooltip/>
      <el-table-column label="通知内容" align="left" prop="content"  show-overflow-tooltip/>
      <el-table-column label="发布人" align="left" prop="postUser.realName" />
      <el-table-column
        label="发布时间"
        align="center"
        prop="postTime"
        width="180"
      >
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.postTime, '{y}-{m}-{d}') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="推送结果" align="left" prop="pushNum" >
          <template slot-scope="scope">
            <span class="blue">共{{scope.row.pushNum}}人</span>
            <span class="green">成功{{scope.row.pushSuccessNum}}人</span>
            <span class="orange">失败{{scope.row.pushFailNum}}人</span>
          </template>

      </el-table-column>
    <!--   <el-table-column
        label="推送成功人数"
        align="center"
        prop="pushSuccessNum"
      />
      <el-table-column label="推送失败人数" align="center" prop="pushFailNum" /> -->
    <!--   <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:mpNotice:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:mpNotice:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
      </template>
    </bl-table>
  </div>
</template>

<script>
import {
  listMpNotice,
  getMpNotice,
  delMpNotice,
  addMpNotice,
  updateMpNotice,
} from "@/api/srhjjg/mpNotice";

import blTable from "@/components/blade/bl-table";
export default {
  name: "MpNotice",
  components: {
    blTable
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 小程序通知公告表格数据
      mpNoticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total:0,
        title: null,
        content: null,
        postUserId: null,
        postTime: null,
        params:{
          postTimeArr:[],
          searchStr:""
        }
      },
     
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询小程序通知公告列表 */
    getList() {
      this.loading = true;
      const postTimeArr=this.queryParams.params.postTimeArr;
      if(postTimeArr.length>0){
        postTimeArr[1]=postTimeArr[1].split(" ")[0]+" 59:59:59";
      }
      let obj={
         pageNum:this.queryParams.pageNum,
         pageSize:this.queryParams.pageSize,
         params:{
          postTimeArr:postTimeArr,
          searchStr:this.queryParams.params.searchStr
        }
      };
      listMpNotice(obj).then((response) => {
        this.mpNoticeList = response.rows || [];
        this.queryParams.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        content: null,
        postUserId: null,
        postTime: null,
        pushNum: null,
        pushSuccessNum: null,
        pushFailNum: null,
        
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams={
         pageNum: 1,
        pageSize: 10,
        total:0,
        title: null,
        content: null,
        postUserId: null,
        postTime: null,
        params:{
          postTimeArr:[],
          searchStr:""
        }
      }
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //推送通知
    handlePushMsg(){
      this.$router.push({name:'pushNotification'});
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加小程序通知公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMpNotice(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改小程序通知公告";
      });
    },
   
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return delMpNotice(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "srhjjg/mpNotice/export",
        {
          ...this.queryParams,
        },
        `小程序通知公告_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.blue{
  color: #2A8DFF;
}
.green{
  color: #15CC83;
  margin-left: 10px;
  margin-right: 10px;
}
.orange{
  color: #FF6B36;
}
</style>
