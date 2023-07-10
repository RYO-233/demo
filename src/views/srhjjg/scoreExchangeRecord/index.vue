<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="兑换时间" prop="exchangeTime">
        <el-date-picker clearable
          v-model="queryParams.exchangeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择兑换时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="兑换类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择兑换类型" clearable>
          <el-option
            v-for="dict in dict.type.score_exchange_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="花费积分" prop="score">
        <el-input
          v-model="queryParams.score"
          placeholder="请输入花费积分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="兑换状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择兑换状态" clearable>
          <el-option
            v-for="dict in dict.type.score_exchange_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['srhjjg:scoreExchangeRecord:add']"
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
          v-hasPermi="['srhjjg:scoreExchangeRecord:edit']"
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
          v-hasPermi="['srhjjg:scoreExchangeRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:scoreExchangeRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scoreExchangeRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="兑换时间" align="center" prop="exchangeTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.exchangeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.score_exchange_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="花费积分" align="center" prop="score" />
      <el-table-column label="兑换状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.score_exchange_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:scoreExchangeRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:scoreExchangeRecord:remove']"
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

    <!-- 添加或修改用户积分兑换记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="兑换时间" prop="exchangeTime">
          <el-date-picker clearable
            v-model="form.exchangeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择兑换时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="兑换类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择兑换类型">
            <el-option
              v-for="dict in dict.type.score_exchange_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花费积分" prop="score">
          <el-input v-model="form.score" placeholder="请输入花费积分"  />
        </el-form-item>
        <el-form-item label="兑换状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.score_exchange_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listScoreExchangeRecord, getScoreExchangeRecord, delScoreExchangeRecord, addScoreExchangeRecord, updateScoreExchangeRecord } from "@/api/srhjjg/scoreExchangeRecord";
import * as validateForm from "@/utils/validateForm"

export default {
  name: "ScoreExchangeRecord",
  dicts: ['score_exchange_status', 'score_exchange_type'],
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
      // 用户积分兑换记录表格数据
      scoreExchangeRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        exchangeTime: null,
        type: null,
        score: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        exchangeTime: [
        ],
        type: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        score: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        status: [
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户积分兑换记录列表 */
    getList() {
      this.loading = true;
      listScoreExchangeRecord(this.queryParams).then(response => {
        this.scoreExchangeRecordList = response.rows || [];
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
        exchangeTime: null,
        type: null,
        score: null,
        status: null,
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
      this.title = "添加用户积分兑换记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getScoreExchangeRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户积分兑换记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateScoreExchangeRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScoreExchangeRecord(this.form).then(response => {
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
        return delScoreExchangeRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/scoreExchangeRecord/export', {
        ...this.queryParams
      }, `用户积分兑换记录_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
