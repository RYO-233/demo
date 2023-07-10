<template>
  <div class="app-container">
    <el-form
      class="filter"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:srcase:add']"
          >添加</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleImport"
          v-hasPermi="['srhjjg:srcase:export']"
          >导入</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:srcase:export']"
          >导出</el-button
        >
      </el-form-item>
      <el-form-item label="上报时间" prop="fbTimeArr">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.fbTimeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleQuery"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件类型" prop="caseType" v-if="tabModel != 1">
        <el-select
          v-model="queryParams.caseType"
          placeholder="请选择案件类别"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.case_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在片区" v-if="tabModel != 0 && tabModel != 1">
        <el-select
          clearable
          v-model="queryParams.districtId"
          @change="handleQuery"
          placeholder="请选择所在片区"
          ><!-- dict.type.district -->
          <el-option
            v-for="dict in districtList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否超时" v-if="tabModel != 0 && tabModel != 1">
        <el-select
          clearable
          @change="handleQuery"
          v-model="queryParams.isTimeout"
          placeholder="请选择"
        >
          <el-option
            v-for="dict in dict.type.yyt_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="caseNum">
        <!-- label="事件编号" -->
        <el-input
          v-model="queryParams.caseNumAndProblemNameLike"
          placeholder="请输入案件编号、类别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="问题类别(小类)" prop="problemParentId">
        <treeselect
          v-model="queryParams.problemParentId"
          :normalizer="normalizer"
          :options="problemTypeOptions"
          :show-count="true"
          :disable-branch-nodes="true"
          style="width: 205px"
          placeholder="请选择问题类别(小类)"
        />
      </el-form-item>
      <el-form-item label="监控点" prop="monitorId">
        <MonitorPointListSel
          :inputVal="queryParams.monitorName"
          @confirmCB="monitorConfirm"
          @clearCB="monitorCancle"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          size="small"
          @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!--   <el-row :gutter="10" class="mb8">

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-tabs
      class="tabs"
      v-model="tabModel"
      type="card"
      @tab-click="handleTabClick"
    >
    
      <el-tab-pane
        :label="item.label"
        :name="item.value"
        v-for="item in dict.type.case_status"
        :key="item.value"
      >
       <el-badge v-if="caseNumObj[item.label]>0&&(item.value==0||item.value==3)" slot="label" :value="caseNumObj[item.label]" class="item"  >
        <span>{{item.label}}</span>
          </el-badge>
      </el-tab-pane>
    
      <el-tab-pane label="返工案件" name="isRedirect"> </el-tab-pane>
      <el-tab-pane label="疑难案件" name="isDifficult"> </el-tab-pane>
      <el-tab-pane label="特殊案件" name="isSpecial"> </el-tab-pane>
    </el-tabs>

    <!-- <el-tabs v-model="messageTabModel" type="card" v-show="showMessageTab" @tab-click="handleMessageTabClick">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="未发短信" name="unsent" />
      <el-tab-pane label="已发短信" name="sent" />
    </el-tabs> -->
    <bl-table
      :listData="srcaseList"
      :queryParams="queryParams"
      :loading="loading"
      @getList="getList"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="col">
        <el-table-column
          key="c2"
          label="案件编号"
          align="left"
          prop="caseNum"
          min-width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column key="c3" label="案件来源" align="left">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.case_type"
              :value="scope.row.caseType"
            />
          </template>
        </el-table-column>
        <el-table-column
          key="c4"
          label="上报时间"
          align="left"
          prop="fbTime"
          min-width="160"
        />
        <el-table-column
          key="c5"
          label="问题类型/类别"
          align="left"
          width="240"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{
              scope.row.problemRoot && scope.row.problemRoot.name
                ? scope.row.problemRoot.name
                : ""
            }}
            <span
              v-if="
                scope.row.problemRoot &&
                scope.row.problemRoot.name &&
                scope.row.problemParent &&
                scope.row.problemParent.name
              "
              >/</span
            >
            {{
              scope.row.problemParent && scope.row.problemParent.name
                ? scope.row.problemParent.name
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          key="c6"
          label="问题描述"
          align="left"
          width="220"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row.caseDetail }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          key="c7"
          label="问题图片"
          align="left"
          prop="caseImages"
        >
          <template slot-scope="scope">
            <image-preview
              v-show="scope.row.caseImages"
              :src="scope.row.caseImages"
              :width="50"
              :height="50"
              :imgType="scope.row.caseType === 'grid' ? 'grid' : ''"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          key="c8"
          label="所在片区"
          align="left"
          prop="district.name"
        />
        <el-table-column
          key="c9"
          v-if="queryParams.caseStatus == 4"
          label="问题地址"
          align="left"
          prop="address"
          width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          key="c10"
          v-if="tabModel == 1"
          label="不立案原因"
          align="left"
          prop="unhandleReason"
          width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          key="11"
          v-if="tabModel == 2 || tabModel == 3 || tabModel == 4"
          label="剩余时间"
          align="left"
          min-width="120"
        >
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.restTime
              "
              :class="[Number(scope.row.restTime) >= 0 ? 'green' : 'orange']"
            >
              {{ changeTime(scope.row.restTime) }}
            </span>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column
          key="c12"
          v-if="
            queryParams.caseStatus != 0 &&
            queryParams.caseStatus != 1 &&
            queryParams.caseStatus != 2
          "
          label="处理人"
          align="left"
          prop="currentHandleDetail.handleUser.realName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          min-width="120"
          key="c14"
          label="操作"
          :align="tabModel == 2 ? 'left' : 'center'"
          fixed="right"
          class-name="small-padding fix-right"
        >
          <!--  -->
          <template slot-scope="scope">
            <el-button
              class="orange"
              v-if="tabModel == 2 && scope.row.inRedirect"
              size="mini"
              type="text"
              @click="transferPending(scope.row)"
              >转办待处理</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleView(scope.row)"
              v-if="tabModel != 0"
              >详情</el-button
            >
            <el-button
              v-if="tabModel == 0"
              size="mini"
              type="text"
              @click="handleView(scope.row)"
              >审核</el-button
            >
            <el-button
              v-if="tabModel==0||tabModel==3||(tabModel=='isRedirect'&&scope.row.caseStatus!=1&&scope.row.caseStatus!=4)"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['srhjjg:srcase:edit']"
              >修改</el-button
            >
            <el-dropdown v-if="tabModel == 2">
              <span class="el-dropdown-link blue">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="padding:0;text-align:center;min-width:60px;">
                  <div
                   
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['srhjjg:srcase:edit']"
                  >
                    修改
                  </div>
                </el-dropdown-item>
                <el-dropdown-item v-if="!scope.row.isDifficult" style="padding:0;text-align:center">
                  <div @click="handleDifficult(scope.row)">疑难案件</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button
              v-if="tabModel == 1"
              size="mini"
              type="text"
              @click="handleGoBack(scope.row)"
              >回退</el-button
            >
            <!--           <el-button
           v-if="scope.row.caseStatus!=1&&scope.row.caseStatus!=0"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:srcase:remove']"
            >删除</el-button
          > -->
          </template>
        </el-table-column>
      </template>
    </bl-table>
    <!--  转办待处理 -->
    <el-dialog
      title="转办待处理"
      :close-on-click-modal="false"
      :visible.sync="dialogtransfer"
      v-if="dialogtransfer"
      width="480px"
    >
      <el-form :model="transferForm"  label-position="top" class="transferForm">
        <el-form-item label="转办原因">
          <div class="desc-box">{{ transferForm.redirectReason }}</div>
        </el-form-item>
        <el-form-item label="" v-if="transferForm.redirectReasonImg">
          <blImageList :imgType="transferForm.caseType==='grid'?'grid':''"  :imgList="transferForm.redirectReasonImg" />
        </el-form-item>
        <el-form-item label="责任单位" prop="organizationId" required>
           <responsibility-unit  class="myinput" :form="transferForm" @changeOrganization="handleChangeOrganization">
            <template #opt>
              <el-option label="其他" :value="0"></el-option>
            </template>
           </responsibility-unit>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogtransfer = false">取 消</el-button>
        <el-button type="primary" @click="transferConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改案件对话框 -->

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的数据(按案件编号更新)
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <SrcaseView
      :open.sync="viewOpen"
      :viewObj="viewObj"
      :form="viewForm"
    ></SrcaseView>
  </div>
</template>

<script>
import {
  listSrcase,
  getSrcase,
  delSrcase,
  addSrcase,
  updateSrcase,
  caseRedirectRecord,
  auditZhuanbanSrcase,
} from "@/api/srhjjg/srcase";
import { treeListProblemType } from "@/api/srhjjg/problemType";
import { listDept } from "@/api/system/dept";
import { listMonitorPoint } from "@/api/srhjjg/monitorPoint";
import * as validateForm from "@/utils/validateForm";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SrcaseView from "@/views/components/srcase/SrcaseView";
import StoreListSel from "@/views/components/store/StoreListSel";
import MonitorPointListSel from "@/views/components/monitorPoint/MonitorPointListSel";
import DistrictListSel from "@/views/components/district/DistrictListSel";
import { pickerOptions } from "@/utils/constant";
import { listDistrict } from "@/api/srhjjg/district";
import blTable from "@/components/blade/bl-table";
import responsibilityUnit  from "@/views/srhjjg/srcase/components/responsibilityUnit"
import blImageList from "@/components/blade/bl-image-list";
import { getToken } from "@/utils/auth";

export default {
  name: "Srcase",
  dicts: ["case_status", "yyt_yes_no", "district", "case_type"],
  components: {
    Treeselect,
    SrcaseView,
    StoreListSel,
    MonitorPointListSel,
    DistrictListSel,
    blTable,
    responsibilityUnit,
    blImageList
  },
  data() {
    return {
      caseNumObj:{},
      dialogtransfer: false,
      transferForm: {},
      tagType: 1,
      caseStatus: null,
      pickerOptions: {},
      // 遮罩层
      loading: false,
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
      // 案件表格数据
      srcaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        returnCaseStatusNum:true,
        isTimeout: null,
        caseStatus: 0,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        caseNum: null,
        problemParentId: null,
        monitorId: null,
        monitorName: null,
        fbTimeArr: [],
        districtId: null,
        joinCurrentHandle: null,
        caseNumAndProblemNameLike: null,
        isSpecial:null,
      },
      // 表单参数
      form: {
        isPoint: 0,
        store: {
          name: null,
        },
        monitorPoint: {
          name: null,
        },
        district: {
          name: null,
        },
      },

      tabModel: 0,
      messageTabModel: "all",
      showMessageTab: false,

      problemTypeOptions: [],
      orgOptions: [],
      monitorOptions: [],

      viewOpen: false,
      viewObj: {
        problemType: {},
        problem: {},
        district: {},
        organization: {},
        monitorPoint: {},
        store: {},
      },
      viewForm: {
        id: null,
        msgType: "_default_",
        groupName: null,
        handleUserNames: null,
        handleUserIds: null,
      },

      overTimeCaseNum: 0,

      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/srhjjg/srcase/importData",
      },
    };
  },
  created() {
    this.getList();
    this.setIntervalFun();
    /*  this.getProblemTreeselect(); */
    this.getOrgTreeSelect();
    this.getMonitorOptions();
    this.getDistrictList();
  },
  mounted() {},
  activated() {
    this.getList();
    this.setIntervalFun();
  },
  deactivated(){ clearInterval(this.timmer);},
  beforeDestroy(){
    clearInterval(this.timmer);
    const dom = document.querySelector('.el-tooltip__popper')
    if (dom) {
        dom.remove()
    }
  },
  watch: {},
  methods: {
    setIntervalFun(){
        const _this=this;
        this.timmer=setInterval(_this.getList,1000*90)
    },
    changeTime(val) {
      let symbol = "";
      if (Number(val) < 0) {
        symbol = "-";
      }
      val = Math.abs(+val);
      if (val != val) return "";
      let f = (val % 60) + "分";
      let s = "";
      if (val >= 60) {
        s = Math.trunc(val / 60) + "时:";
      }
      return symbol + s + f;
    },
    /** 查询片区列表 */
    getDistrictList() {
      const queryParams = {
        pageNum: 1,
        pageSize: 100,
      };
      listDistrict(queryParams).then((response) => {
        this.districtList = response.rows || [];
      });
    },
    //审核转办待处理
    transferPending(row) {
      this.transferForm = {
        redirectReason: row.currentRedirectRecord.redirectReason,
        organizationId: row.currentRedirectRecord.targetOrganizationId||0,
        currentRedirectRecordId: row.currentRedirectRecord.id,
        redirectReasonImg:row.currentRedirectRecord.redirectReasonImg
      };
      this.dialogtransfer = true;
    },
    //编辑转办信息
    handleChangeOrganization(e) {
      console.log(e);
      if (e||e==0) {
        let obj = {
          id: this.transferForm.currentRedirectRecordId,
          targetOrganizationId: e||null,
        };
        caseRedirectRecord(obj).then((res) => {
          if (res.code != 200) {
          }
        });
      }
    },
    transferConfirm() {
      /* this.transferForm */
      if (this.transferForm.organizationId) {
        auditZhuanbanSrcase({
          id: this.transferForm.currentRedirectRecordId,
          pass: true,
        }).then((res) => {
          if (res.code == 200) {
            this.$modal.msgSuccess("操作成功");
            this.getList();
            this.dialogtransfer = false;
          }
        });
      } else {
        this.$message.error("请选择责任部门");
      }
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    orgNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    //tab切换列表
    handleTabClick(tab, event) {
      this.queryParams.isDifficult = null;
      this.queryParams.isRedirect = null;
      this.queryParams.isSpecial = null;
      this.queryParams.caseStatus = null;
      this.queryParams.joinCurrentHandle = false;
      switch (tab.name) {
        case "isDifficult":
          this.queryParams.isDifficult = 1;
          break;
        case "isRedirect":
          this.queryParams.isRedirect = 1;
           this.queryParams.joinCurrentHandle = true;
          break;
        case "isSpecial":
          this.queryParams.isSpecial = 1;
          break;
        default:
          this.queryParams.caseStatus = tab.name;
      }
      clearInterval(this.timmer);
      this.getList();
      this.setIntervalFun();
      
    },
    getProblemTreeselect() {
      treeListProblemType({ pageSize: 0 }).then((response) => {
        const optionsData = this.handleTree(response.data);
        optionsData.forEach((item) => {
          if (!item.children) {
            item.isDisabled = true;
          }
        });
        this.problemTypeOptions = optionsData;
      });
    },
    getOrgTreeSelect() {
      listDept({ pageSize: 0 }).then((response) => {
        this.orgOptions = this.handleTree(response.data, "deptId");
      });
    },
    getMonitorOptions() {
      listMonitorPoint({ pageSize: 0 }).then((response) => {
        this.monitorOptions = response.rows;
      });
    },
    /** 查询案件列表 */
    getList() {
     /*  this.loading = true; */
      if (
        this.queryParams.fbTimeArr &&
        this.queryParams.fbTimeArr.length === 2
      ) {
        this.queryParams.fbTimeStart = this.queryParams.fbTimeArr[0];
        this.queryParams.fbTimeEnd = this.queryParams.fbTimeArr[1];
      } else {
        this.queryParams.fbTimeStart = "";
        this.queryParams.fbTimeEnd = "";
      }
      listSrcase(this.queryParams).then((response) => {
        this.srcaseList = response.rows || [];
        this.caseNumObj=response.data;
        this.queryParams.total = response.total;
        /* this.loading = false; */
      }).catch(()=>{
         clearInterval(this.timmer);
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.monitorName = null;
      this.queryParams.fbTimeArr = [];
      this.queryParams.fbTimeStart = null;
      this.queryParams.fbTimeEnd = null;
      this.queryParams.isTimeout = null;
      this.queryParams.problemParentId = null;
      this.queryParams.districtId = null;
      this.queryParams.joinCurrentHandle = null;
      this.queryParams.caseNumAndProblemNameLike = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    //疑难案件
    handleDifficult(row) {
      const _this = this;
      this.handleConfirm("调整为疑难案件", function () {
        const updateObj = {
          id: row.id,
          isDifficult: 1,
        };
        updateSrcase(updateObj).then((res) => {
          if (res.code == 200) {
            _this.getList();
            _this.$modal.msgSuccess("调整为疑难案件成功!");
          }
        });
      });
    },
    //回退
    handleGoBack(row) {
      row.caseStatus = 0;
      const _this = this;
      this.handleConfirm("回退", function () {
        updateSrcase(row).then((res) => {
          if (res.code == 200) {
            _this.getList();
            _this.$modal.msgSuccess("案件回退成功!");
          }
        });
      });
    },
    handleConfirm(text = "", calaback) {
      this.$confirm("确认是否进行" + text + "操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          calaback();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      /*  this.reset();
      this.open = true;
      this.title = "添加案件"; */
      this.$router.push("/srcase/add");
    },
    handleView(row) {
      this.$router.push({
        path: "/srcase/detail",
        query: { id: row.id, caseStatus: row.caseStatus },
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        path: "/srcase/edit",
        query: { id: row.id, caseStatus: row.caseStatus },
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return delSrcase(ids);
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
        "srhjjg/srcase/export?pageSize=0",
        {
          ...this.queryParams,
        },
        `案件_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "案件导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "srhjjg/srcase/importTemplate",
        {},
        `案件导入模板_${new Date().getTime()}.xlsx`
      );
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
        response.msg +
        "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    storeConfirm(data) {
      if (data) {
        this.form.storeId = data.id;
        this.form.store = this.form.store || {};
        this.form.store.storeName = data.storeName;
      }
    },
    storeCancle() {
      this.form.storeId = null;
      this.form.store.storeName = null;
    },
    monitorConfirm(data) {
      if (data) {
        this.queryParams.monitorId = data.id;
        this.queryParams.monitorName = data.name;
      }
    },
    monitorCancle() {
      this.queryParams.monitorId = null;
      this.queryParams.monitorName = null;
    },
    monitorFormConfirm(data) {
      if (data) {
        this.form.monitorId = data.id;
        this.form.monitorPoint.name = data.name;
      }
    },
    monitorFormCancle() {
      this.form.monitorId = null;
      this.form.monitorPoint.name = null;
    },
    districtConfirm(data) {
      if (data) {
        this.form.districtId = data.id;
        this.form.district.name = data.name;
      }
    },
    districtCancle() {
      this.form.districtId = null;
      this.form.district.name = null;
    },
  },
};
</script>
<style>
.el-badge__content.is-fixed {
  top: 7px;
  right: 1px;
}

.el-form-item__label {
  font-weight: 400;
}
.blue {
  color: #2a8dff;
}
.blue .el-icon-arrow-down::before {
  color: #2a8dff;
}
.orange {
  color: #ff6b36;
}
.green {
  color: #15cc83;
}
.zise {
  color: #8c25e6;
}
.zise:hover {
  color: #8c25e6;
}
.el-table .activebg {
  background: url("../../../assets/images/apoint.png") #fff2ed left top
    no-repeat;
  background-size: 40px 40px;
}
.el-table .activebg.hover-row {
  background: url("../../../assets/images/apoint.png") #fff2ed left top
    no-repeat;
  background-size: 40px 40px;
}
.el-table__body .activebg.hover-row > td.el-table__cell,
.el-table__body .activebg:hover > td.el-table__cell {
  background: none !important;
}
.page-wrap .page {
  margin: 0 auto;
}

.desc-box {
  word-break: break-all;
}
</style>
