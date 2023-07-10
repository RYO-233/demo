<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="搜索监控点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="设备id" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="displayLevel" prop="displayLevel">
        <el-input
          v-model="queryParams.displayLevel"
          placeholder="请输入displayLevel"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:monitorPoint:add']"
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
          v-hasPermi="['srhjjg:monitorPoint:edit']"
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
          v-hasPermi="['srhjjg:monitorPoint:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:monitorPoint:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <bl-table :listData="monitorPointList" :queryParams="queryParams"  :loading="loading" @getList="getList" @handleSelectionChange="handleSelectionChange" >

     <template slot="col">
      <el-table-column label="监控点名称" align="left" prop="name" min-width="400"/>
     <!--  <el-table-column width="1100" /> -->
      <!-- <el-table-column label="设备id" align="center" prop="deviceId" />
      <el-table-column label="坐标" align="center" prop="coordinates" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:monitorPoint:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:monitorPoint:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
      </template>
    </bl-table>

    <!-- 添加或修改监控点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" maxlength="256" show-word-limit />
        </el-form-item>
        <el-form-item label="设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备id" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="坐标" prop="coordinates">
          <el-input v-model="form.coordinates" placeholder="请输入坐标" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="displayLevel" prop="displayLevel">
          <el-input v-model="form.displayLevel" placeholder="请输入displayLevel" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" maxlength="255" show-word-limit />
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
import { listMonitorPoint, getMonitorPoint, delMonitorPoint, addMonitorPoint, updateMonitorPoint } from "@/api/srhjjg/monitorPoint";
import blTable from '@/components/blade/bl-table'
export default {
  name: "MonitorPoint",
   components: {
    blTable,
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
      // 监控点表格数据
      monitorPointList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total:0,
        name: null,
        deviceId: null,
        coordinates: null,
        displayLevel: null,
        longitude: null,
        latitude: null,
        mtype: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 256, message: '长度不得超过256', trigger: 'blur' },
        ],
        deviceId: [
          { max: 100, message: '长度不得超过100', trigger: 'blur' },
        ],
        coordinates: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        displayLevel: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        longitude: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        latitude: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询监控点列表 */
    getList() {
      this.loading = true;
      listMonitorPoint(this.queryParams).then(response => {
        this.monitorPointList = response.rows || [];
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
        name: null,
        deviceId: null,
        coordinates: null,
        displayLevel: null,
        longitude: null,
        latitude: null,
        mtype: null,
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
      this.title = "添加监控点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMonitorPoint(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改监控点";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMonitorPoint(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMonitorPoint(this.form).then(response => {
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
        return delMonitorPoint(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/monitorPoint/export', {
        ...this.queryParams
      }, `监控点_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
