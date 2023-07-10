<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="案件" prop="caseId">
        <el-input
          v-model="queryParams.caseId"
          placeholder="请输入案件"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转办状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择转办状态" clearable>
          <el-option
            v-for="dict in dict.type.case_redirect_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转办原因" prop="redirectReason">
        <el-input
          v-model="queryParams.redirectReason"
          placeholder="请输入转办原因"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原责任单位" prop="originOrganizationId">
        <el-input
          v-model="queryParams.originOrganizationId"
          placeholder="请输入原责任单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标责任单位" prop="targetOrganizationId">
        <el-input
          v-model="queryParams.targetOrganizationId"
          placeholder="请输入目标责任单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转办人" prop="redirectUserId">
        <el-input
          v-model="queryParams.redirectUserId"
          placeholder="请输入转办人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转办发起时间" prop="promoteTime">
        <el-date-picker clearable
          v-model="queryParams.promoteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择转办发起时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="转办通过时间" prop="passTime">
        <el-date-picker clearable
          v-model="queryParams.passTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择转办通过时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="转办通过用户" prop="passUserId">
        <el-input
          v-model="queryParams.passUserId"
          placeholder="请选择转办通过用户"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:caseRedirectRecord:add']"
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
          v-hasPermi="['srhjjg:caseRedirectRecord:edit']"
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
          v-hasPermi="['srhjjg:caseRedirectRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:caseRedirectRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="caseRedirectRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="案件" align="center" prop="caseId" />
      <el-table-column label="转办状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.case_redirect_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="转办原因" align="center" prop="redirectReason" />
      <el-table-column label="原责任单位" align="center" prop="originOrganizationId" />
      <el-table-column label="目标责任单位" align="center" prop="targetOrganizationId" />
      <el-table-column label="转办人" align="center" prop="redirectUserId" />
      <el-table-column label="转办发起时间" align="center" prop="promoteTime" width="180">
      </el-table-column>
      <el-table-column label="转办通过时间" align="center" prop="passTime" width="180">
      </el-table-column>
      <el-table-column label="转办通过用户" align="center" prop="passUserId" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:caseRedirectRecord:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:caseRedirectRecord:remove']"
          >删除</el-button>
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

    <!-- 添加或修改案件转办记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="案件" prop="caseId">
          <el-input v-model="form.caseId" placeholder="请输入案件"  />
        </el-form-item>
        <el-form-item label="转办状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择转办状态">
            <el-option
              v-for="dict in dict.type.case_redirect_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转办原因" prop="redirectReason">
          <el-input v-model="form.redirectReason" placeholder="请输入转办原因"  />
        </el-form-item>
        <el-form-item label="原责任单位" prop="originOrganizationId">
          <el-input v-model="form.originOrganizationId" placeholder="请输入原责任单位"  />
        </el-form-item>
        <el-form-item label="目标责任单位" prop="targetOrganizationId">
          <el-input v-model="form.targetOrganizationId" placeholder="请输入目标责任单位"  />
        </el-form-item>
        <el-form-item label="转办人" prop="redirectUserId">
          <el-input v-model="form.redirectUserId" placeholder="请输入转办人"  />
        </el-form-item>
        <el-form-item label="转办发起时间" prop="promoteTime">
          <el-date-picker clearable
            v-model="form.promoteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择转办发起时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转办通过时间" prop="passTime">
          <el-date-picker clearable
            v-model="form.passTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择转办通过时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转办通过用户" prop="passUserId">
          <el-date-picker clearable
            v-model="form.passUserId"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择转办通过用户">
          </el-date-picker>
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
import { listCaseRedirectRecord, getCaseRedirectRecord, delCaseRedirectRecord, addCaseRedirectRecord, updateCaseRedirectRecord } from "@/api/srhjjg/caseRedirectRecord";
import * as validateForm from "@/utils/validateForm"

export default {
  name: "CaseRedirectRecord",
  dicts: ['case_redirect_status'],
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
      // 案件转办记录表格数据
      caseRedirectRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        caseId: null,
        status: null,
        redirectReason: null,
        originOrganizationId: null,
        targetOrganizationId: null,
        redirectUserId: null,
        promoteTime: null,
        passTime: null,
        passUserId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        caseId: [
          { required: true, message: "案件不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "转办状态不能为空", trigger: "change" },
        ],
        redirectReason: [
        ],
        originOrganizationId: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        targetOrganizationId: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        redirectUserId: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        promoteTime: [
        ],
        passTime: [
        ],
        passUserId: [
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询案件转办记录列表 */
    getList() {
      this.loading = true;
      listCaseRedirectRecord(this.queryParams).then(response => {
        this.caseRedirectRecordList = response.rows || [];
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
        caseId: null,
        status: null,
        redirectReason: null,
        originOrganizationId: null,
        targetOrganizationId: null,
        redirectUserId: null,
        promoteTime: null,
        passTime: null,
        passUserId: null,
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
      this.title = "添加案件转办记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCaseRedirectRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改案件转办记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCaseRedirectRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCaseRedirectRecord(this.form).then(response => {
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
        return delCaseRedirectRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/caseRedirectRecord/export', {
        ...this.queryParams
      }, `案件转办记录_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
