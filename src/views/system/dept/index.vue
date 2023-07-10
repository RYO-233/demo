<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd()"
          v-hasPermi="['system:dept:add']"
        >添加</el-button>
      </el-form-item> -->
      <el-form-item label="" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入责任单位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="责任单位" min-width="260"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="(scope.row.ancestors.split(',').length === 2)"
            size="mini"
            type="text"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >添加责任单位</el-button>
          <el-button
            v-show="(scope.row.ancestors.split(',').length === 3)"
            size="mini"
            type="text"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >添加处理部门</el-button>
          <el-button
            size="mini"
            type="text"
            v-show="(scope.row.ancestors.split(',').length === 3 || scope.row.ancestors.split(',').length === 4)"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            v-show="(scope.row.ancestors.split(',').length === 3 || scope.row.ancestors.split(',').length === 4)"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 添加或修改责任单位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="责任单位名称" prop="deptName" v-if="type=='accountability'"> 
          <el-input v-model="form.deptName" placeholder="请输入责任单位名称" />
        </el-form-item>
          <el-form-item label="处理部门名称" prop="deptName" v-else> 
          <el-input v-model="form.deptName" placeholder="请输入处理部门名称" />
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
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DistrictListSel from "@/views/components/district/DistrictListSel";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  components: { Treeselect, DistrictListSel },
  data() {
    return {
      type:"accountability",
      rootId:null,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 责任单位树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
        params: {
          ancestorsLikeAndSelf: null
        },
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级责任单位不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      orgUserDeptId: null,
    };
  },
  created() {
    this.getConfigKey("org_user_dept_id").then((response) => {
      this.orgUserDeptId = response.msg;
      this.queryParams.params.ancestorsLikeAndSelf = response.msg;
      this.getList();
    });
  },
  methods: {
    /** 查询责任单位列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
        this.rootId=this.deptList[0].deptId
      });
    },
    /** 转换责任单位数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        districtId: undefined,
        districtLabel: undefined,
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: 1,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.form.parentId = row.deptId;
      if(row.ancestors.split(',').length === 2) {
        this.title = "添加责任单位";
      } else if(row.ancestors.split(',').length === 3) {
        this.title = "添加处理部门";
      }
      this.open = true;
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        if(row.ancestors.split(',').length === 2) {
          this.title = "修改责任单位";
        } else if(row.ancestors.split(',').length === 3 || row.ancestors.split(',').length === 4) {
          this.title = "修改处理部门";
        }
        listDeptExcludeChild(row.deptId).then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function() {
        return delDept(row.deptId);
      }).then((res) => {
        this.getList();
        this.$modal.msgSuccess(res.msg);
      }).catch(() => {});
    },
    districtConfirm(data) {
      if(data) {
        this.form.districtId = data.id;
        this.form.districtName = data.name;
      }
    },
    districtCancle() {
      this.form.districtId = null;
        this.form.districtName = null;
    },
  },
};
</script>
