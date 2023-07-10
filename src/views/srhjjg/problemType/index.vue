<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="con lefcon">
          <el-row class="top">
            <el-col :span="6" class="left">
              <div class="content" @click="handleAddType">
                <!-- <i class="el-icon-edit-outline"></i>添加类别 -->
                <el-button size="mini" type="primary" icon="el-icon-plus" >添加</el-button>
              </div>
            </el-col>
            <el-col :span="18" class="right">
              <el-input v-model="treeQueryParams.params.level1Name" 
               prefix-icon="el-icon-search"
                placeholder="搜索小类名称" size="mini" 
                clearable
                @keyup.enter.native="getTreeList" />
            <!--   <el-button @click="getTreeList" type="primary" icon="el-icon-search" size="mini">搜索</el-button> -->
            </el-col>
          </el-row>
          <blScrollContent>
          <el-row v-loading="treeLoading" class="tree" v-for="(dict, index) in dictRootCatalog" :key="dict.dictValue">
            <span> {{ dict.dictLabel }}</span>
            <div class="eltree">
              <el-tree :data="treeListParent[dict.dictValue]" :props="defaultProps" node-key="id"
                draggable
                :allow-drop="allowDrop"
                @node-drop="nodeDrop" >
                <span class="custom-tree-node" slot-scope="{ node, data }" @click="nodeClick(data)">
                  <el-tooltip :content="node.label" placement="tpo-start" >
                    <span >{{ node.label|ellipsis(15) }}</span>
                  </el-tooltip>
                  <span>
                    <i class="el-icon-plus" @click.stop="handleTreeAdd(data)" v-show="data.parentId === '0'"></i>
                    <i class="el-icon-edit" @click.stop="handleTreeEdit(data)"></i>
                    <i class="el-icon-delete" @click.stop="handleTreeDel(data)" v-show="!data.children || data.children.length === 0"></i>
                  </span>
                </span>
              </el-tree>
              
            </div>
          </el-row>
          </blScrollContent>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="con rightcon">
          <div class="head">
            <span>立案条件设置</span>
          </div>
          <div v-show="!rightConShow">点击左侧问题小类显示立案条件设置</div>
          <div class="body" v-show="rightConShow">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="text" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd('添加立案条件')"
                  v-hasPermi="['srhjjg:problemType:add']">添加</el-button>
              </el-col>
              <!-- <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate"
                  v-hasPermi="['srhjjg:problemType:edit']">修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini"
                  @click="handleDelete" v-hasPermi="['srhjjg:problemType:remove']">删除</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini"
                  v-hasPermi="['srhjjg:problemType:export']">导出</el-button>
              </el-col> -->
             <!--  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            </el-row>
             <bl-table border :listData="problemTypeList" :queryParams="queryParams"  :loading="loading" @getList="getList"  >

              <template slot="col">
              <el-table-column label="立案条件" align="center" prop="startCaseCondition" />
              <el-table-column label="结案条件" align="center" prop="endCaseCondition" />
              <el-table-column label="核心处置时限" align="center">
                <template slot-scope="scope">
                  {{ scope.row.coreAreaTimeLimit }}({{ scope.row.coreAreaTimeLimitUnit | unitFilter }})
                </template>
              </el-table-column>
              <el-table-column label="一般区处置时限" align="center" prop="commonAreaTimeLimit">
                <template slot-scope="scope">
                  {{ scope.row.commonAreaTimeLimit }}({{ scope.row.commonAreaTimeLimitUnit | unitFilter }})
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text"  @click="handleUpdate(scope.row)"
                    v-hasPermi="['srhjjg:problemType:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(scope.row)"
                    v-hasPermi="['srhjjg:problemType:remove']">删除</el-button>
                </template>
              </el-table-column>
              </template>
             </bl-table>

           
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 添加或修改监控点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" label-position="top">
       <!--  <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序号"  />
        </el-form-item> -->
        <el-form-item label="立案条件" prop="startCaseCondition"  >
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.startCaseCondition" placeholder="请输入立案条件" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="结案条件" prop="endCaseCondition"  >
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.endCaseCondition" placeholder="请输入结案条件" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="核心区处置时限" prop="coreAreaTimeLimit" class="input-with-select">
          <el-input v-model.number="form.coreAreaTimeLimit" placeholder="请输入核心区处置时限">
            <el-select style="width: 130px;" v-model="form.coreAreaTimeLimitUnit" slot="append" placeholder="请选择">
              <el-option v-for="dict in dict.type.time_limit_unit" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="一般区处置时限" prop="commonAreaTimeLimit">
          <el-input v-model.number="form.commonAreaTimeLimit" placeholder="请输入一般区处置时限" class="input-with-select">
            <el-select style="width: 130px;" v-model="form.commonAreaTimeLimitUnit" slot="append" placeholder="请选择">
              <el-option v-for="dict in dict.type.time_limit_unit" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="addTypeTitle" :visible.sync="addTypeOpen" width="400px" :close-on-click-modal=false append-to-body>
      <el-form ref="addTypeForm" :model="addTypeForm" :rules="addTypeFormRules" label-position="top" label-width="110px">
        <el-form-item label="类别" prop="rootCatalog">
          <el-radio-group :disabled="!addTypeForm.isRoot" v-model="addTypeForm.rootCatalog" @change="handelRootCatalogChange">
            <el-radio :label="item.value" v-for="item in dict.type.problem_type_root_catalog" :key="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="addTypeForm.orderNum" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="addTypeForm.name" placeholder="请输入类别名称" maxlength="30" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTypeForm">确 定</el-button>
        <el-button @click="cancelTypeForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeListProblemType, listProblemType, getProblemType, delProblemType, addProblemType, updateProblemType } from "@/api/srhjjg/problemType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as validateForm from "@/utils/validateForm"
import blTable from '@/components/blade/bl-table';
import blScrollContent from '@/components/blade/bl-scroll-content.vue';
export default {
  name: "ProblemType",
  dicts: ['problem_type_root_catalog','time_limit_unit'],
  components: {
    Treeselect,
    blTable,
    blScrollContent
  },
  data() {
    return {
     
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 问题类别表格数据
      problemTypeList: [],
      // 问题类别树选项
      problemTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageSize:10,
        pageNum:1,
        orderNum: null,
        name: null,
        parentId: null,
         total: 0,
      },
      // 表单参数
      form: {
        orderNum: 1,
      },
      // 表单校验
      rules: {
        orderNum: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        parentId: [
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        startCaseCondition: [
          { required: true, message: "立案条件不能为空", trigger: "blur" },
        ],
        endCaseCondition: [
          { required: true, message: "结案条件不能为空", trigger: "blur" },
        ],
        coreAreaTimeLimit: [
          { required: true, message: "核心区处置时限不能为空", trigger: "blur" },
          { required: true, message: "核心区处置时限不能为空", trigger: "change" },
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
          { validator: validateForm.lteqValidator,
            max: 9999,
            message: '不得超过9999',
            trigger: 'blur' 
          },
          { validator: validateForm.gt0Validator, message: "时限必须大于0", trigger: "blur" },
        ],
        commonAreaTimeLimit: [
          { required: true, message: "一般区处置时限不能为空", trigger: "blur" },
           { required: true, message: "一般区处置时限不能为空", trigger: "change" },
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
          { validator: validateForm.lteqValidator,
            max: 9999,
            message: '不得超过9999',
            trigger: 'blur' 
          },
          { validator: validateForm.gt0Validator, message: "时限必须大于0", trigger: "blur" },
        ]
      },

      viewHideParentForm: false,

      treeLoading: false,
      treeListParent: {
        event: null,
        parts: null
      },
      treeQueryParams: {
        rootCatalog: null,
        params: {
          level1Name: null
        }
      },
      defaultProps: {
        label: 'name',
        children: 'children',
      },

      dictRootCatalog: null,

      addTypeTitle: '',
      addTypeOpen: false,
      addTypeForm: {
        isRoot: true,
        rootCatalog: null,
        orderNum: 10
      },
      addTypeFormRules: {
        rootCatalog: [
          { required: true, message: "类别不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
          { validator: validateForm.validateIsNumber, trigger: 'blur' },
        ],
        name: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ]
      },
      rightConShow: false,
    };
  },
  created() {
    this.getDicts("problem_type_root_catalog").then(response => {
      this.dictRootCatalog = response.data;
      this.getTreeList();
    });
    //this.getList();
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if(row.parentId > 0) {
        return 'subRowBackgroundColor';
      }
    },
    getTreeList() {
      this.treeLoading = true;
      if(this.dictRootCatalog && this.dictRootCatalog.length > 0) {
        const vthis = this;
        let i = 0;
        this.dictRootCatalog.forEach(ele => {
          this.treeQueryParams.rootCatalog = ele.dictValue;
          treeListProblemType(this.treeQueryParams).then(response => {
            const treeData = vthis.handleTree(response.data, "id", "parentId");
            vthis.treeListParent[ele.dictValue] = treeData;
            i++;
            if(i === this.dictRootCatalog.length) {
              this.treeLoading = false;
            }
          });
        });
      }
    },
    /** 查询问题类别列表 */
    getList() {
      this.loading = true;
      listProblemType(this.queryParams).then(response => {
        console.log(response);
        this.problemTypeList = this.handleTree(response.data, "id", "parentId");
         this.queryParams.total =  this.queryParams.pageSize * (this.queryParams.pageNum - 1) +this.problemTypeList.length;
        this.loading = false;
      });
    },
    /** 转换问题类别数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
	/** 查询问题类别下拉树结构 */
    getTreeselect() {
      listProblemType(this.treeQueryParams).then(response => {
        this.problemTypeOptions = [];
        const data = { id: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.problemTypeOptions.push(data);
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
        orderNum: 1,
        name: null,
        level: 3,
        parentId: this.queryParams.parentId,
        rootCatalog: this.queryParams.rootCatalog,
        code: null,
        startCaseCondition: null,
        endCaseCondition: null,
        coreAreaTimeLimit: null,
        coreAreaTimeLimitUnit: this.dict.type.time_limit_unit[0].value,
        commonAreaTimeLimit: null,
        commonAreaTimeLimitUnit: this.dict.type.time_limit_unit[0].value,
      };
      this.viewHideParentForm = false;
      this.resetForm("form");
    },
    resetTypeForm() {
      this.addTypeForm = {
        id: null,
        isRoot: true,
        name: null,
        rootCatalog: this.dict.type.problem_type_root_catalog[0].value,
        orderNum: 10
      };
      this.resetForm("addTypeForm");
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
    handleAdd(title) {
      this.reset();
      if(this.problemTypeList && this.problemTypeList.length > 0) {
        this.form.orderNum = this.problemTypeList[this.problemTypeList.length-1].orderNum + 10;  
      }
      this.open = true;
      if(title) {
        this.title = title;
      } else {
        this.title = "添加问题类别";
      }
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
      if(row.parentId > 0) {
        this.viewHideParentForm = true;
      }
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getProblemType(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改立案条件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProblemType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProblemType(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除？').then(function() {
        return delProblemType(row.id);
      }).then((res) => {
        this.getList();
        this.$modal.msgSuccess(res.msg);
      }).catch(() => {});
    },
    nodeClick(data) {
      if(data.level === 1) {
        this.queryParams.parentId = data.id;
        this.queryParams.rootCatalog = data.rootCatalog;
        this.getList();
        this.rightConShow = true;
      }
    },
    handleTreeAdd(data) {
      this.resetTypeForm();
      this.addTypeForm.id = null;
      this.addTypeForm.isRoot = false;
      this.addTypeForm.rootCatalog = data.rootCatalog;
      if(data.children && data.children.length > 0) {
        this.addTypeForm.orderNum = data.children[data.children.length-1].orderNum + 10;
      } else {
        this.addTypeForm.orderNum = 10;
      }
      this.addTypeForm.parentId = data.id;

      this.addTypeOpen = true;
      this.addTypeTitle = '添加问题类别';
    },
    handleTreeEdit(data) {
      this.resetTypeForm();
      this.addTypeForm.id = data.id;
      this.addTypeForm.isRoot = false;
      this.addTypeForm.rootCatalog = data.rootCatalog;
      this.addTypeForm.orderNum = data.orderNum;
      this.addTypeForm.parentId = data.parentId;
      this.addTypeForm.name = data.name;

      this.addTypeOpen = true;
      this.addTypeTitle = '修改问题类别';
    },
    handleTreeDel(row) {
      this.$modal.confirm('是否确认删除？').then(function() {
        return delProblemType(row.id);
      }).then(() => {
        this.getTreeList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleAddType() {
      this.resetTypeForm();
      this.handelRootCatalogChange(this.addTypeForm.rootCatalog);
      this.addTypeOpen = true;
      this.addTypeTitle = '添加问题类型';
    },
    handelRootCatalogChange(val) {
      if(this.treeListParent[val]) {
        const checkedTreeData = this.treeListParent[val];
        if(checkedTreeData && checkedTreeData.length > 0)   {
          const nextOrderNum = checkedTreeData[checkedTreeData.length-1].orderNum + 10;
          this.addTypeForm.orderNum = nextOrderNum;
        }
      }
    },
    submitTypeForm() {
      this.$refs["addTypeForm"].validate(valid => {
        if (valid) {
          if (this.addTypeForm.id != null) {
            updateProblemType(this.addTypeForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.addTypeOpen = false;
              this.getTreeList();
            });
          } else {
            addProblemType(this.addTypeForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.addTypeOpen = false;
              this.getTreeList();
            });
          }
        }
      });
    },
    cancelTypeForm() {
      this.addTypeOpen = false;
      this.resetTypeForm();
    },
    allowDrop(draggingNode, targetNode, posi) {
      // 仅允许同级间调整顺序
      if (posi === "inner") {
        // 不能拖拽到节点里面
        return false;
      } else {
        if(targetNode.data.level !== draggingNode.data.level) {
          return false;
        }
      }
      return true;
    },
    nodeDrop(draggingNode, targetNode, posi, event) {
      const updateObj1 = {};
      updateObj1.id = draggingNode.data.id;
      updateObj1.orderNum = targetNode.data.orderNum;
      const updateObj2 = {};
      updateObj2.id = targetNode.data.id;
      updateObj2.orderNum = draggingNode.data.orderNum;

      updateProblemType(updateObj1).then(response => {
        updateProblemType(updateObj2).then(response => {
          this.$modal.msgSuccess("调整顺序成功");
        });
      });
    }
  },
  filters: {
    unitFilter(unit) {
      switch (unit) {
        case 'work_day':
          return '工作日';
        case 'work_hour':
          return '工作时';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.con {
  padding: 10px;
  box-shadow: var(--box-shadow);
  border: var(--border);
  border-radius: 4px;
  min-height: 85.4vh;
}

.lefcon {
  .top {
    display: flex;
    height: 31px;
    align-items: center;

    .left {
      display: flex;
      min-height: inherit;
      justify-content: left;
      align-items: center;
      font-size: 12px;
      color: var(--color-primary);

      i {
        font-weight: 900;
        margin-right: 3px;
      }

      .content {
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      justify-self: right;
      justify-content: right;

      .el-input {
        margin-right: 5px;
      }
    }
  }

  .tree {
    >span:first-of-type {
      font-size: 15px;
      font-weight: 900;
    }

    .eltree {
      margin: 5px;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        i {
          color: var(--color-primary);
          font-weight: 900;
          margin-right: 5px;
        }

        i:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}

.rightcon {
  .head {
    >span:first-of-type {
      font-size: 15px;
      font-weight: 700;
    }
    margin: 10px 0;
  }
}

</style>
<style scoped>
::v-deep .input-with-select .el-input-group__append {
  width: 130px;
  background-color: #fff;
  color: black;
}

::v-deep .el-select .el-select--default {
  width: 130px !important;
}

::v-deep .el-input__suffix {
  display: flex;
  text-align: center;
  align-items: center;
}

</style>