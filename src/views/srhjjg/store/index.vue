<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="118px">
      <el-form-item label="" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="搜索店铺名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="营业执照名称" prop="licenseName">
        <el-input
          v-model="queryParams.licenseName"
          placeholder="请输入营业执照名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="营业执照注册号" prop="licenseNum">
        <el-input
          v-model="queryParams.licenseNum"
          placeholder="请输入营业执照注册号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="店主姓名" prop="storeKeeper">
        <el-input
          v-model="queryParams.storeKeeper"
          placeholder="请输入店主姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="storePhone">
        <el-input
          v-model="queryParams.storePhone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="店面地址" prop="storeAddress">
        <el-input
          v-model="queryParams.storeAddress"
          placeholder="请输入店面地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入纬度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="2.5D坐标" prop="coordinates">
        <el-input
          v-model="queryParams.coordinates"
          placeholder="请输入2.5D坐标"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['srhjjg:store:add']"
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
          v-hasPermi="['srhjjg:store:edit']"
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
          v-hasPermi="['srhjjg:store:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:store:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
<bl-table :listData="storeList" :queryParams="queryParams"  :loading="loading" @getList="getList" @handleSelectionChange="handleSelectionChange" >

     <template slot="col">

   
      <el-table-column label="店铺名称" align="center" prop="storeName" />
      <el-table-column label="负责人名称" align="center" prop="storeKeeper" />
      <el-table-column label="负责人电话" align="center" prop="storePhone" />
      <el-table-column label="经纬度" align="center" prop="longitude">
        <template slot-scope="scope">
          {{ scope.row.longitude + ',' +  scope.row.latitude}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:store:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:store:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
     </template>
</bl-table>

    <!-- 添加或修改商铺对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="店铺名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入店铺名称" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="营业执照名称" prop="licenseName">
          <el-input v-model="form.licenseName" placeholder="请输入营业执照名称" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="营业执照注册号" prop="licenseNum">
          <el-input v-model="form.licenseNum" placeholder="请输入营业执照注册号" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="店主姓名" prop="storeKeeper">
          <el-input v-model="form.storeKeeper" placeholder="请输入店主姓名" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="联系电话" prop="storePhone">
          <el-input v-model="form.storePhone" placeholder="请输入联系电话" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="店面地址" prop="storeAddress">
          <el-input v-model="form.storeAddress" placeholder="请输入店面地址" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="2.5D坐标" prop="coordinates">
          <el-input v-model="form.coordinates" placeholder="请输入2.5D坐标" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form.image"/>
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
import { listStore, getStore, delStore, addStore, updateStore } from "@/api/srhjjg/store";
import * as validateForm from "@/utils/validateForm"
import blTable from '@/components/blade/bl-table'
export default {
  name: "Store",
   components: { blTable},
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
      
      // 商铺表格数据
      storeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        storeName: null,
        licenseName: null,
        licenseNum: null,
        storeKeeper: null,
        storePhone: null,
        storeAddress: null,
        storeType: null,
        longitude: null,
        latitude: null,
        coordinates: null,
        status: null,
        image: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeName: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        licenseName: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        licenseNum: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        storeKeeper: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        storePhone: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        storeAddress: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        storeType: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        longitude: [
          { max: 50, message: '长度不得超过50', trigger: 'blur' },
        ],
        latitude: [
          { max: 50, message: '长度不得超过50', trigger: 'blur' },
        ],
        coordinates: [
          { max: 255, message: '长度不得超过255', trigger: 'blur' },
        ],
        status: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        image: [
          { max: 2000, message: '长度不得超过2000', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商铺列表 */
    getList() {
      this.loading = true;
      listStore(this.queryParams).then(response => {
        this.storeList = response.rows || [];
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
        storeName: null,
        licenseName: null,
        licenseNum: null,
        storeKeeper: null,
        storePhone: null,
        storeAddress: null,
        storeType: null,
        longitude: null,
        latitude: null,
        coordinates: null,
        status: null,
        image: null,
        remark: null,
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
      this.title = "添加商铺";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商铺";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStore(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStore(this.form).then(response => {
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
        return delStore(ids);
      }).then((res) => {
        this.getList();
        this.$modal.msgSuccess(res.msg);
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/store/export', {
        ...this.queryParams
      }, `商铺_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
