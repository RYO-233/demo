<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="回复情况" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable>
          <el-option
            label="未处理"
            value="todo"
          />
          <el-option
            label="已回复"
            value="done"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="params.feedbackDateArr">
        <el-date-picker clearable
          v-model="queryParams.params.feedbackDateArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="params.searchStr">
        <el-input
          v-model="queryParams.params.searchStr"
          placeholder="请输入反馈的异常、姓名、手机号"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 240px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mpFeedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column type="index" label="序号" align="center" /> -->
         <el-table-column key="c1"  label="序号" type="index" width="70" align="center" >
        <template slot-scope="scope">
          <span>{{
                  queryParams.pageSize *
                    (queryParams.pageNum - 1) +
                  scope.$index +
                  1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈的异常" align="center" prop="title" show-overflow-tooltip/>
      <el-table-column label="反馈人姓名" align="center" prop="user.realName" />
      <el-table-column label="反馈人手机号" align="center" prop="user.phonenumber" />
      <el-table-column label="反馈时间" align="center" prop="feedbackDate" />
      <el-table-column label="回复状态" align="center" prop="status">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 'todo'">
            未处理
          </template>
          <template v-if="scope.row.status === 'done'">
            已回复
          </template>
        </template>
      </el-table-column>
      <el-table-column label="反馈详情" align="center" prop="description" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.status === 'done'"
            v-show="!(scope.row.status === 'cancle')"
            v-hasPermi="['srhjjg:mpFeedback:edit']"
          >处理</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleView(scope.row)"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:mpFeedback:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改小程序用户反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" label-position="top">
        <el-form-item label="反馈的异常">
          {{ form.title }}
        </el-form-item>
        <el-form-item label="反馈人姓名">
          {{ form.user?form.user.realName:'' }}
        </el-form-item>
        <el-form-item label="反馈人手机号">
          {{ form.user.phonenumber }}
        </el-form-item>
        <el-form-item label="回复内容" prop="result">
          <el-input v-model="form.result" type="textarea" placeholder="请输入内容" 
            :autosize="{ minRows: 4}"
            maxlength="300" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { pickerOptions } from "@/utils/constant";
import { listMpFeedback, getMpFeedback, delMpFeedback, addMpFeedback, updateMpFeedback } from "@/api/srhjjg/mpFeedback";
import * as validateForm from "@/utils/validateForm"

export default {
  name: "MpFeedback",
  dicts: ['mp_feedback_status'],
  components: {
  },
  data() {
    return {
      pickerOptions,
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
      // 小程序用户反馈表格数据
      mpFeedbackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        params: {
          feedbackDateArr: [],
          searchStr: null
        }
      },
      // 表单参数
      form: {
        user: {
          realName: null,
          phonenumber: null
        }
      },
      // 表单校验
      rules: {
        result: [
          { required: true, message: "回复内容不能为空", trigger: "blur" },
          { max: 300, message: '长度不得超过300', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  activated() {
    const activated = this.$route.query?.activated || false;
    if(activated) {
      this.getList();
    }
  },
  methods: {
    /** 查询小程序用户反馈列表 */
    getList() {
      this.loading = true;
      listMpFeedback(this.queryParams).then(response => {
        this.mpFeedbackList = response.rows || [];
        this.total = response.total;
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
        description: null,
        img: null,
        userId: null,
        user: {
          realName: null,
          phonenumber: null
        },
        status: null,
        feedbackDate: null,
        result: null,
        resultImg: null,
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
      // this.params.feedbackDateArr = [];
      // this.params.searchStr= null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加小程序用户反馈";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMpFeedback(id).then(response => {
        this.form = response.data;
        if(!this.form.user) {
          this.form.user = {};
        }
        this.open = true;
        this.title = "回复";
      });
    },
    handleView(row) {
      this.$router.push({
        path: "/mpFeedback/detail",
        query: { id: row.id },
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = 'done';
            updateMpFeedback(this.form).then(response => {
              this.$modal.msgSuccess("回复成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMpFeedback(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delMpFeedback(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/mpFeedback/export', {
        ...this.queryParams
      }, `小程序用户反馈_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
