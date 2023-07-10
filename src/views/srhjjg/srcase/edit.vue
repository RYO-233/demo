<template>
  <div class="edit-container">
    <div class="page-head">
      <div>编辑台账</div>
      <div>
        <el-button size="small" type="primary" @click="submitForm" class="back"
          >完成</el-button
        >
        <el-button
          size="small"
          type="primary"
          plain
          @click="cancel"
          class="back"
          >取消</el-button
        >
      </div>
    </div>
    <blScrollContent>
      <el-form
        class="addform"
        ref="form"
        :inline="true"
        label-position="top"
        :model="form"
        :rules="rules"
        label-width="120px"
        @submit.native.prevent
      >
        <div class="block">
          <div class="info-item"><span>案件编号：</span>{{ form.caseNum }}</div>
          <div class="info-item">
            <span>案件来源：</span
            ><!-- {{form.caseType}} -->
            <dict-tag :options="dict.type.case_type" :value="form.caseType" />
          </div>
          <div class="info-item"><span>上报人：</span>{{ form.fbPerson }}</div>
          <div class="info-item"><span>上报时间：</span>{{ form.fbTime }}</div>
          <div class="info-item">
            <span>问题描述：</span>
            <div  class="desc-wrap">{{ form.caseDetail }}</div>
          </div>
          <div class="info-item"><span>联系电话：</span>{{ form.fbPhone }}</div>
          <div class="info-item">
            <span>问题图片：</span>
            <blImageList
              :imgType="form.caseType === 'grid' ? 'grid' : ''"
              :imgList="form.caseImages"
            />
          </div>
        </div>
        <div class="block">
          <el-form-item label="问题类别(大类)" prop="problemRootId" required>
            <el-select
              filterable
              clearable
              v-model="form.problemRootId"
              placeholder="请选择问题类别(大类)"
              @change="handleChangeproblemRoot"
            >
              <el-option
                v-for="dict in problemTypeOptions1"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              ></el-option>
            </el-select>
            <!--  <treeselect v-model="form.problemParentId" 
            :normalizer="normalizer"
            :options="problemTypeOptions1" 
            :show-count="true" 
            :disable-branch-nodes="true"
            placeholder="请选择问题类别(大类)" /> -->
          </el-form-item>
          <el-form-item label="问题类别(小类)" prop="problemParentId" required>
            <el-select
              filterable
              clearable
              v-model="form.problemParentId"
              placeholder="请选择问题类别(小类)"
              @change="handleChangeProblemParent"
            >
              <el-option
                v-for="dict in problemTypeOptions2"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="立案条件" prop="problemId">
            <el-select
              filterable
              clearable
              v-model="form.problemId"
              placeholder="请选择立案条件"
              @change="handleChangestartCaseCondition"
            >
              <el-option
                v-for="dict in problemTypeList"
                :key="dict.id"
                :label="dict.startCaseCondition"
                :value="String(dict.id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否督办案件" prop="isPoint">
            <el-select v-model="form.isPoint" placeholder="请选择是否督办案件">
              <el-option
                v-for="dict in dict.type.yyt_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任单位" prop="organizationId">
            <responsibility-unit
              class="myinput"
              :inputVal="form.organizationId"
              @changeOrganization="handleChangeOrganizationId"
            ></responsibility-unit>
            <!-- <el-select
              v-model="form.organizationId"
              placeholder="请选择责任单位"
              @change="handleChangeOrganizationId"
            >
              <el-option
                v-for="item in orgOptions"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select> -->
            <!--  <treeselect
            v-model="form.organizationId"
            :normalizer="orgNormalizer"
            :options="orgOptions"
            :show-count="true"
            :disable-branch-nodes="true"
            placeholder="请选择责任单位"
          /> -->
          </el-form-item>
          <el-form-item label="是否短信通知" prop="msgNoticeType">
            <el-select
              v-model="form.msgNoticeType"
              placeholder="请选择是否短信通知"
            >
              <el-option
                v-for="dict in dict.type.yyt_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联商铺" prop="storeId">
            <StoreListSel
              class="myinput"
              :inputVal="form.store.storeName"
              @confirmCB="storeConfirm"
              @clearCB="storeCancle"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="300"
              :rows="4"
              show-word-limit
            />
          </el-form-item>
        </div>
        <div class="block">
          <el-form-item label="所在片区" prop="districtId">
            <el-select
              v-model="form.districtId"
              @change="handleChangeDistrict"
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
          <el-form-item></el-form-item>
          <el-form-item
            label="监控位置"
            prop="monitorId"
            v-if="form.caseType == 'task'"
          >
            <MonitorPointListSel
              class="myinput"
              :inputVal="form.monitorPoint.name"
              @confirmCB="monitorFormConfirm"
              @clearCB="monitorFormCancle"
            />
          </el-form-item>

          <el-form-item
            label="问题地址"
            prop="address"
            v-if="form.caseType == 'feedback'"
          >
            <el-input
              v-model.trim="form.address"
              placeholder="请输入问题地址"
              maxlength="20"
            ></el-input>
            <!--  @blur="handleChangeAddress" -->
            <!--  <el-autocomplete
          class="myinput"
          v-model="form.address"
          :fetch-suggestions="queryAddressSearch"
          placeholder="请输入问题地址"
          @select="handleAddressSelect"
          :maxlength="20"
          clearable
        ></el-autocomplete> -->
          </el-form-item>
          <el-form-item label=" "></el-form-item>
          <el-form-item label=" " class="fullitem">
            <drawMap
              ref="mydrawMap"
              class="mymap-wrap"
              :canAddMarker="canAddMarker"
              :path="path"
              :strokeColor="strokeColor"
              :pcenter="center"
              :markers="markersStr"
              @searchcomplete="searchcomplete"
              @updateMarkerLocal="updateMarkerLocal"
            ></drawMap>
            <!--  :searchKeyword="searchKeyword"
            @searchcomplete="searchcomplete" -->
          </el-form-item>
        </div>
        <!--  编辑 立案 -->
        <div class="block" v-if="caseStatus != 0">
          <el-form-item label="立案条件" prop="problemId">
            <el-select
              v-model="form.problemId"
              required
              placeholder="请选择立案条件"
              @change="handleChangestartCaseCondition"
            >
              <el-option
                v-for="dict in problemTypeList"
                :key="dict.id"
                :label="dict.startCaseCondition"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结案条件">
            <el-select
              @change="handleChangestartCaseCondition"
              v-model="form.problemId"
              placeholder="请选择结案条件"
            >
              <el-option
                v-for="dict in problemTypeList"
                :key="dict.id"
                :label="dict.endCaseCondition"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处置时限">
            <!-- commonAreaTimeLimit coreAreaTimeLimit -->
            <el-select
              disabled
              v-model="form.dealTimeLimit"
              placeholder="请选择处置时限"
            >
              <!--  <el-option
              v-for="dict in dealTimeLimit"
              :key="dict.id"
              :label="dict.commonAreaTimeLimit"
              :value="dict.id"
            ></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="立案时间">
            <el-date-picker
              clearable
              disabled
              v-model="form.dispatchTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择立案时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="责任单位" prop="organizationId">
            <responsibility-unit
              class="myinput"
              :inputVal="form.organizationId"
              ref=""
              @changeOrganization="handleChangeOrganizationId"
            ></responsibility-unit>
          </el-form-item>
          <el-form-item label="预计结案时间">
            <el-date-picker
              clearable
              disabled
              v-model="form.predicateFixTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择结案时间"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <srcaseTimeLine
          class="block"
          :caseId="form.caseId"
          type="edit"
          @getTimeLineDealData="getTimeLineDealData"
        >
          <!-- 处理 -->
          <template #handleItem>
            <el-form
              :model="timeDealForm"
              label-position="top"
              class="block-form"
              label-width="120px"
            >
              <el-form-item label="处理时间">
                <el-date-picker
                  clearable
                  v-model="timeDealForm.nodeTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择处理时间"
                  :picker-options="pickerOptions1"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="处理部门" required>
                <responsibility-unit
                  class="myinput"
                  :inputVal="timeDealForm.handleOrgId"
                  level="handleOrg"
                  @changeOrganization="handleChangeHandleOrgId"
                ></responsibility-unit>
                <!--  <el-select
                v-model="timeDealForm.handleOrgId"
                placeholder="请选择处理单位"
                @change="handleOrgIdSelect"
              >
              <el-option
                v-for="item in orgOptionsDeal"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
              </el-select> -->
              </el-form-item>
              <el-form-item label="处理人" required>
                <el-input
                  :disabled="!timeDealForm.handleOrgId"
                  clearable
                  @click.native="showUserSel($event, 'handle')"
                  v-model="timeDealForm.handleUserName"
                  placeholder="请选择处理人员"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="处理情况" required>
                <el-input
                  v-model="timeDealForm.text"
                  placeholder="请输入处理情况"
                ></el-input>
              </el-form-item>
              <el-form-item label="处理图片">
                <image-upload class="myupload" v-model="timeDealForm.images" />
                <!-- <blImageList :imgList="timeDealForm.images"></blImageList> -->
              </el-form-item>
            </el-form>
          </template>
          <!--  案件分配 -->
          <template #dispatchItem="{ activity }">
            <el-form
              :model="timeDealForm"
              label-position="top"
              class="block-form"
              label-width="120px"
            >
              <el-form-item label="立案时间" required>
                <el-date-picker
                  clearable
                  disabled
                  v-model="activity.nodeTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择立案时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="立案人">
                <el-input
                  disabled
                  v-model="activity.receiverName"
                  placeholder="请选择立案人"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="责任单位" required>
                <responsibility-unit
                  class="myinput"
                  :inputVal="form.organizationId"
                  @changeOrganization="handleChangeOrganizationId"
                ></responsibility-unit>
              </el-form-item>
              <el-form-item label="责任人" required>
                <el-input
                  clearable
                  @click.native="showUserSel($event, 'responsibility')"
                  v-model="timeDealForm.dispatchUserName"
                  placeholder="请选择责任人"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="处理单位" required>
                <responsibility-unit
                  class="myinput"
                  :disabled="!form.organizationId"
                  :inputVal="timeDealForm.deptId"
                  level="handleOrg"
                  @changeOrganization="handleChangeHandleOrgId"
                ></responsibility-unit>
                <!--  <el-select
                v-model="timeDealForm.deptId"
                placeholder="请选择处理单位"
                @change="handleOrgIdSelect"
              >
              <el-option
                v-for="item in orgOptionsDeal"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
              </el-select> -->
              </el-form-item>
              <el-form-item label="处理人" required>
                <el-input
                  :disabled="!timeDealForm.deptId"
                  clearable
                  @click.native="showUserSel($event, 'handle')"
                  v-model="timeDealForm.handleUserName"
                  placeholder="请选择处理人员"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </template>
        </srcaseTimeLine>
        <!--  </template> -->
      </el-form>
    </blScrollContent>
    <UserListSelTable
      v-if="userListSelTableVisible"
      ref="userListSelTable"
      :label="userSelect.label"
      :parentId="userSelect.parentId"
      :queryParams="userListSelQueryParams"
      @confirmCB="userSelConfirmCB"
      @updateUserListSelTableVisible="updateUserListSelTableVisible"
    />
  </div>
</template>

<script>
import drawMap from "@/components/Map/markMap";
import blImageList from "@/components/blade/bl-image-list";
import StoreListSel from "@/views/components/store/StoreListSel";
import MonitorPointListSel from "@/views/components/monitorPoint/MonitorPointListSel";
import { pickerOptions } from "@/utils/constant";
import { treeListProblemType, listProblemType } from "@/api/srhjjg/problemType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listDept } from "@/api/system/dept";
import { listMonitorPoint } from "@/api/srhjjg/monitorPoint";
import responsibilityUnit from "@/views/srhjjg/srcase/components/responsibilityUnit";
import {
  getSrcase,
  addSrcase,
  updateSrcase,
  addHandleSrcase,
  updateHandleSrcase,
  srcasePredicateTime,
  srcaseDispatchNodeEdit,
} from "@/api/srhjjg/srcase";
import moment from "moment"; 
import { listDistrict } from "@/api/srhjjg/district";
import UserListSelTable from "@/views/components/user/UserListSelTable";
import blScrollContent from "@/components/blade/bl-scroll-content";
import srcaseTimeLine from "@/views/srhjjg/srcase/components/srcaseTimeLine";
export default {
  props: [],
  dicts: ["case_status", "yyt_yes_no", "district", "case_type"],
  components: {
    StoreListSel,
    MonitorPointListSel,
    pickerOptions,
    Treeselect,
    UserListSelTable,
    blImageList,
    drawMap,
    blScrollContent,
    srcaseTimeLine,
    responsibilityUnit,
  },
  data() {
    return {
      timeDealForm: {},
      userSelect: {
        parentId: null,
        label: "",
        type: null,
        /* form.handleOrgId */
      },
      userParentID: null,
      id: null,
      canAddMarker: true,
      userListSelTableVisible: false,
      searchKeyword: null,
      strokeColor: "",
      path: null,
      center: {},
      markers: [{}, {}],
      markersStr: "",
      caseStatus: null,
      districtList: [],
      problemTypeList: [],
      nodetail: true,
      problemTypeOptions1: [],
      problemTypeOptions2: [],
      orgOptions: [],
      orgOptionsDeal: [],
      monitorOptions: [],
      form: {
        organizationId: null,
        msgNoticeType: 0,
        dealTimeLimit: null,
        caseId: null,
        handleOrgId: "",
        handleUserName: null,
        handleUserId: null,
        handleDescribe: "",
        problemRootId: null,
        isPoint: null,
        districtId: null,
        district: null,
        address: null,
        latitude: null,
        longitude: null,
        store: {
          name: null,
          storeName: null,
          storeId: null,
        },
        monitorId: null,
        monitorPoint: {
          name: null,
        },
      },
      // 表单校验
      rules: {
        isPoint: [
          { required: true, message: "督办案件不能为空", trigger: "change" },
        ],
        fbTime: [
          { required: true, message: "发现时间不能为空", trigger: "blur" },
        ],

        problemRootId: [
          { required: true, message: "问题大类不能为空", trigger: "change" },
        ],
        problemParentId: [
          { required: true, message: "问题小类不能为空", trigger: "change" },
        ],
        problemId: [
          { required: true, message: "立案条件不能为空", trigger: "change" },
        ],
        districtId: [
          { required: true, message: "所在片区不能为空", trigger: "blur" },
        ],
        msgNoticeType: [
          { required: true, message: "请选择是否短信通知", trigger: "change" },
        ],
        address: [
          { required: true, message: "问题地址不能为空", trigger: "blur" },
        ],
        organizationId: [
          { required: true, message: "责任单位不能为空", trigger: "change" },
        ],
        handleOrgId: [
          { required: true, message: "处理单位不能为空", trigger: "change" },
        ],
        handleUserName: [
          { required: true, message: "处理人不能为空", trigger: "change" },
        ],
        monitorId: [
          { required: true, message: "监控点不能为空", trigger: "change" },
        ],
        remark: [{ max: 300, message: "长度不得超过300", trigger: "blur" }],
      },
      userListSelQueryParams: {
        pageNum: 1,
        pageSize: 20,
        realName: null,
        phonenumber: null,
        params: {
          roleKeys: ["dispatcher", "handler"],
        },
      },

      orgUserDeptId: null,
      pickerOptions1: {},
    };
  },
  beforeCreate() {
    const dom = document.querySelector(".el-tooltip__popper");
    if (dom) {
      dom.remove();
    }
  },
  created() {},
  mounted() {
    const id = this.$route.query?.id || null;
    if (id) {
      this.id = id;
      this.getDetail(id);
    }
    const caseStatus = this.$route.query?.caseStatus || 0;
    this.caseStatus = caseStatus;
    this.getProblemselect();
    /* this.getProblemTreeselect(); */
    this.getConfigKey("org_user_dept_id").then((response) => {
      this.orgUserDeptId = response.msg;
      this.getOrgTreeSelect();
    });
    this.getMonitorOptions();
    this.getDistrictList();
  },
  watch: {
    'timeDealForm.nodeTime'(selectTime) {
      const date = moment(selectTime).format('YYYY-MM-DD');
      if(this.preNode){
        const preNodeTime = moment(this.preNode.nodeTime).format('YYYY-MM-DD');
        if (date === preNodeTime){
          this.pickerOptions1.selectableRange = `${moment(this.preNode.nodeTime).format('HH:mm:ss')} - 23:59:59`
        } else {
          this.pickerOptions1.selectableRange = '00:00:00 - 23:59:59'
        }
      }
    },
},
  methods: {
    getTimePickerRange(dateStr) {
      this.pickerOptions1 = {
        disabledDate(time) {
          var date = new Date(dateStr);
          var time1 = date.getTime() - 1 * 24 * 60 * 60 * 1000; //得到时间戳
          return time.getTime() < time1;
        },
        selectableRange: '00:00:00 - 23:59:59'
      };
    },
    getTimeLineDealData(data, preNode) {
      console.log("上一节点信息");
      console.log(preNode);

      if (data) {
        //案件分配
        if (data.nodeType == "dispatch") {
          data.dispatchUserId = data.dispatchUserId ? data.dispatchUserId : "";
          data.dispatchUserName = data.dispatchUserName
            ? data.dispatchUserName
            : "";
          data.handleUserId = data.userId ? data.userId : "";
          data.handleUserName = data.userName ? data.userName : "";
        }
        //处理情况
        if (data.nodeType == "handle") {
          data.handleOrgId = data.deptId ? data.deptId : "";
          data.handleUserId = data.userId ? data.userId : "";
          data.handleUserName = data.userName ? data.userName : "";
        }
        this.timeDealForm = JSON.parse(JSON.stringify(data));
      } else {
        this.timeDealForm = {};
      }
      if (preNode && data.nodeType == "handle") {
        this.preNode=preNode;
        this.getTimePickerRange(preNode.nodeTime);
      }
    },
    getMarkersStr() {
      let newArr = [];
      this.markers.forEach((item) => {
        if (Object.keys(item).length != 0) {
          newArr.push(item);
        }
      });
      if (newArr.length > 0) {
        this.markersStr = JSON.stringify(newArr);
      } else {
        this.markersStr = "";
      }
    },
    //处理部门选择
    handleOrgIdSelect(val) {
      this.timeDealForm.handleUserName = null;
      this.timeDealForm.handleUserId = null;
      if (this.form.organizationId) {
        this.timeDealForm.handleOrgId = val;
        this.form.handleOrgId = val;
      } else {
        this.$message.warning("请先选择责任单位！");
        this.timeDealForm.handleOrgId = null;
        this.form.handleOrgId = null;
      }
    },
    //处理部门树切换
    handleChangeHandleOrgId(val) {
      console.log("时间线处理部门");
      this.timeDealForm.deptId = val;
      this.timeDealForm.handleOrgId = val;
      this.form.handleOrgId = val;
      this.timeDealForm.handleUserName = null;
      this.timeDealForm.handleUserId = null;
    },

    //问题地址
    queryAddressSearch(queryString, cb) {
      var restaurants = [];
      if (this.restaurants) {
        restaurants.push({
          value: this.restaurants.address,
          point: this.restaurants.point,
        });
        this.restaurants.surroundingPois.forEach((item) => {
          restaurants.push({
            value: item.address + "-" + item.title,
            point: item.point,
          });
        });
      }
      /* let  results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants; */
      // 调用 callback 返回建议列表的数据
      cb(restaurants);
    },
    handleAddressSelect(e) {
      this.form.address = e.value;
      this.form.latitude = e.point.lat;
      this.form.longitude = e.point.lng;
    },
    handleChangeAddress() {
      this.searchKeyword = this.form.address;
    },
    addProblemAddressMark(point, updateCenter = true) {
      const address = {
        ...point,
        dragging: true,
        icon: require("@/assets/images/address.png"),
        offset: [3, -18],
      };
      this.markers[1] = address;
      if (updateCenter) {
        this.center = point;
      }
      this.getMarkersStr();
    },
    //更新问题地址标记
    updateMarkerLocal(point) {
      this.addProblemAddressMark(point, false);
      this.form.latitude = point.lat;
      this.form.longitude = point.lng;
      this.$forceUpdate();
    },
    searchcomplete(e) {
      if (e && e.Yr && e.Yr.length > 0) {
        const point = e.Yr[0].point;
        this.addProblemAddressMark(point);
        this.center = point;
        this.form.latitude = point.lat;
        this.form.longitude = point.lng;
      }
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
    //获取详情数据
    getDetail(id) {
      this.reset();
      getSrcase(id).then((res) => {
        let data = res.data;
        if (!data.store) {
          data.store = {
            name: null,
            storeName: null,
            storeId: null,
          };
        }
        if (!data.monitorPoint) {
          data.monitorPoint = {
            name: "",
          };
        }
        //短信通知，默认否处理
        if (!data.msgNoticeType) {
          data.msgNoticeType = 0;
        }

        data.caseId = data.id;
        //片区
        if (data.district && data.district.areaPoints) {
          this.path = data.district.areaPoints;
          if (data.district.polygonColor) {
            this.strokeColor = data.district.polygonColor;
          }
        }
        //处理单位 处理人
        if (
          data &&
          data.currentHandleDetail &&
          data.currentHandleDetail.handleOrgId
        ) {
          const detail = data.currentHandleDetail;
          const handleUserName =
            detail.handleUser && detail.handleUser.realName
              ? detail.handleUser.realName
              : "";
          data.handleUserName = handleUserName;
          data.handleOrgId = detail.handleOrgId;

          data.handleUserId = String(detail.handleUserId) || "";
          data.rectifyImages = detail.rectifyImages;
        }

        this.form = data;
        //获取处理单位
        this.getDealOrgList();
        //商铺标记点
        if (res.data && res.data.store) {
          this.center = {
            lng: data.store.longitude || 114.97731018066408,
            lat: data.store.latitude || 25.8246784210205,
          };
          this.markers[0] = {
            lng: data.store.longitude,
            lat: data.store.latitude,
            icon: require("@/assets/images/shop.png"),
          };
        }
        //问题地址
        /*         if (data.address) {
          this.searchKeyword = this.form.address;
        }
        if (data.longitude) {
          let point = {
            lat: data.latitude,
            lng: data.longitude,
          };
          this.addProblemAddressMark(point);
        } else {
          this.markers[1] = {};
        } */
        //问题地址
        this.getProblemAddressMark(res.data);
        //获取监控点位置图标
        this.getMonitorMark(res.data);
        this.getMarkersStr();
        if (data.problemRootId) {
          this.getProblemselect(1, data.problemRootId, true);
        }

        this.problemTypeListFun();

        this.searchKeyword = data.address;
        /* 处理时限 */
        this.transformDealTimeLimit();
      });
    },
    getProblemAddressMark(data) {
      if (data.longitude && data.caseType == "feedback") {
        const address = {
          lat: data.latitude,
          lng: data.longitude,
          icon: require("@/assets/images/address.png"),
          offset: [3, -18],
        };

        this.markers[1] = address;
        this.center = address;
      }
    },
    //获取监控点位置图标
    getMonitorMark(data) {
      if (
        data.caseType == "task" &&
        data.monitorPoint &&
        data.monitorPoint.latitude
      ) {
        const address = {
          lat: data.monitorPoint.latitude,
          lng: data.monitorPoint.longitude,
          icon: require("@/assets/images/addMinor.png"),
          /*   offset:[3,-18] */
        };
        this.markers[1] = address;
        this.center = address;
      }
    },
    //片区切换
    handleChangeDistrict(e) {
      let ind = this.districtList.findIndex((item) => {
        return item.id == e;
      });
      if (ind > -1) {
        this.path = this.districtList[ind].areaPoints;
        this.strokeColor = this.districtList[ind].polygonColor;
        this.form.district = this.districtList[ind];
        this.transformDealTimeLimit();
        this.changePredicateFixTime();
      }
    },
    //立案条件切换
    handleChangestartCaseCondition(val) {
      this.form.endCaseCondition = val;
      const ind = this.problemTypeList.findIndex((item) => {
        return item.id == this.form.problemId;
      });
      if (ind > -1) {
        this.form.problem = this.problemTypeList[ind];
      }
      this.transformDealTimeLimit();
      this.changePredicateFixTime();
    },
    //处置时限处理
    transformDealTimeLimit() {
      if (this.form.district && this.form.district.prop == "common") {
        const dataSave =
          this.form.problem && this.form.problem.commonAreaTimeLimit
            ? this.form.problem.commonAreaTimeLimit
            : "";
        const unit =
          this.form.problem && this.form.problem.commonAreaTimeLimitUnit
            ? this.form.problem.commonAreaTimeLimitUnit
            : "";
        this.form.dealTimeLimit =
          dataSave +
          "" +
          (unit == "work_hour" ? "工作时" : unit == "work_day" ? "工作日" : "");
      }
      if (this.form.district && this.form.district.prop == "core") {
        const dataSave =
          this.form.problem && this.form.problem.coreAreaTimeLimit
            ? this.form.problem.coreAreaTimeLimit
            : "";
        const unit =
          this.form.problem && this.form.problem.coreAreaTimeLimitUnit
            ? this.form.problem.coreAreaTimeLimitUnit
            : "";
        this.form.dealTimeLimit =
          dataSave +
          "" +
          (unit == "work_hour" ? "工作时" : unit == "work_day" ? "工作日" : "");
      }
    },

    //预计结案
    changePredicateFixTime() {
      const obj = {
        districtId: this.form.districtId,
        id: this.id,
        problemId: this.form.problemId,
      };
      if (
        this.caseStatus != 0 &&
        this.caseStatus != 1 &&
        this.form.problemId &&
        this.form.districtId
      ) {
      }
      srcasePredicateTime(obj).then((res) => {
        if (res.code == 200) {
          this.form.predicateFixTime = res.data.endTime || "";
        }
      });
    },
    //问题大类切换
    handleChangeproblemRoot(id) {
      this.form.problemParentId = null;
      this.form.problemId = null;
      if (id) {
        this.getProblemselect(1, id);
      } else {
        this.problemTypeOptions2 = [];
      }
      this.problemTypeList = [];
    },
    //问题小类切换
    handleChangeProblemParent(id) {
      this.form.problemId = null;
      this.problemTypeListFun();
    },
    /** 查询问题类别列表立案条件信息 */
    problemTypeListFun() {
      if (this.form.problemParentId) {
        listProblemType({
          pageNum: 1,
          pageSize: 100,
          parentId: this.form.problemParentId,
        }).then((res) => {
          this.problemTypeList = res.data || [];
        });
      } else {
        this.problemTypeList = [];
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
    async getProblemselect(level = 0, id = null, init = false) {
      if (level == 0) {
        listProblemType({
          level: level,
          pageNum: 1,
          pageSize: 100,
          id: id,
        }).then((res) => {
          this.problemTypeOptions1 = res.data || [];
        });
      } else {
        listProblemType({
          pageNum: 1,
          pageSize: 100,
          parentId: id,
        }).then((res) => {
          this.problemTypeOptions2 = res.data || [];
          if (init) {
            this.problemTypeListFun();
          }
        });
      }
    },
    getProblemTreeselect() {
      treeListProblemType({ pageSize: 0 }).then((response) => {
        const optionsData = this.handleTree(response.data);
        optionsData.forEach((item) => {
          if (!item.children) {
            item.isDisabled = true;
          }
        });
        this.problemTypeOptions2 = optionsData;
      });
    },
    updateUserListSelTableVisible() {
      this.userListSelTableVisible = false;
    },
    //选择处理人
    showUserSel(e, type = "handle") {
      this.userSelect.type = type;
      console.log(type);
      if (type == "handle") {
        this.userSelect.label = "处理人";
        this.getHandleSel(e);
      }
      if (type == "responsibility") {
        this.userSelect.label = "责任人";
        this.getResponsibilitySel(e);
      }
    },
    getHandleSel(e) {
      if (this.timeDealForm.handleOrgId || this.timeDealForm.deptId) {
        if (e.target.tagName == "I") {
          this.timeDealForm.handleUserId = "";
          this.timeDealForm.handleUserName = "";
          this.$forceUpdate();
        } else {
          this.userSelect.parentId = this.timeDealForm.handleOrgId;
          this.userListSelTableVisible = true;
          this.$nextTick(() => {
            this.$refs.userListSelTable.show();
          });
        }
      } else {
        this.$message.warning("请先选择处理部门！");
      }
    },
    getResponsibilitySel(e) {
      if (!this.form.organizationId) {
        this.$message.warning("请先选择责任单位！");
      } else {
        if (e.target.tagName == "I") {
          this.timeDealForm.dispatchUserId = "";
          console.log("清除");
          this.$forceUpdate();
        } else {
          console.log(this.form.organizationId);
          this.userSelect.parentId = this.form.organizationId;
          this.userListSelTableVisible = true;

          this.$nextTick(() => {
            this.$refs.userListSelTable.show(["dispatcher"]);
          });
        }
      }
    },

    userSelConfirmCB(data) {
      //处理人
      if (this.userSelect.type == "handle") {
        this.updateHandleInfo(data);
      }
      //责任人
      if (this.userSelect.type == "responsibility") {
        this.updateResponsibilityInfo(data);
      }
      this.userListSelTableVisible = false;
    },

    //选择处理人
    updateHandleInfo(data) {
      if (Array.isArray(data)) {
        this.timeDealForm.handleUserId = data.map((item) => item.userId);
        this.timeDealForm.handleUserName = data
          .map((item) => item.realName)
          .join(",");
      } else {
        if (data.realName) {
          this.timeDealForm.handleUserId = String(data.userId);
          this.timeDealForm.handleUserName = data.realName;
          console.log();
        } else {
          this.timeDealForm.handleUserId = "";
          this.timeDealForm.handleUserName = "";

          this.$message.warning(
            "用户名未设置，请联系管理员将该用户信息补充完整！"
          );
        }
      }
      this.$forceUpdate();
    },
    //选择责任人
    updateResponsibilityInfo(data) {
      if (data.realName) {
        this.timeDealForm.dispatchUserId = String(data.userId);
        this.timeDealForm.dispatchUserName = data.realName;
        /*  this.handledispatchNodeEdit(); */
      } else {
        this.timeDealForm.dispatchUserId = "";
        this.timeDealForm.dispatchUserName = "";
        this.$message.warning(
          "用户名未设置，请联系管理员将该用户信息补充完整！"
        );
      }
    },
    getOrgTreeSelect() {
      listDept({ pageSize: 0, parentId: this.orgUserDeptId }).then(
        (response) => {
          this.orgOptions = this.handleTree(response.data, "deptId");
        }
      );
    },
    //责任单位切换
    handleChangeOrganizationId(val) {
      //处理情况 处理人清除
      this.form.organizationId = val;
      if (
        this.timeDealForm.nodeType &&
        this.timeDealForm.nodeType == "handle"
      ) {
        this.timeDealForm.handleOrgId = null;
        this.timeDealForm.handleUserId = null;
        this.timeDealForm.handleUserName = null;
      }
      //案件分配
      if (
        this.timeDealForm.nodeType &&
        this.timeDealForm.nodeType == "dispatch"
      ) {
        //责任人清除
        this.timeDealForm.dispatchUserId = null;
        this.timeDealForm.dispatchUserName = null;
        //处理人处理单位信息清除
        this.timeDealForm.handleOrgId = null;
        this.timeDealForm.deptId = null;
        this.timeDealForm.deptName = null;

        this.timeDealForm.handleUserName = null;
      }
      if (val) {
        this.getDealOrgList();
      } else {
        this.orgOptionsDeal = [];
      }
    },
    //处理单位
    getDealOrgList() {
      if (this.form.organizationId) {
        listDept({ pageSize: 0, parentId: this.form.organizationId }).then(
          (response) => {
            this.orgOptionsDeal = response.data;
          }
        );
      } else {
        this.orgOptionsDeal = [];
      }
    },
    getMonitorOptions() {
      listMonitorPoint({ pageSize: 0 }).then((response) => {
        this.monitorOptions = response.rows;
      });
    },
    storeConfirm(data) {
      if (data) {
        this.form.storeId = data.id;
        this.form.store = data || {};
        this.form.store.storeName = data.storeName;
        let address = {
          lng: data.longitude,
          lat: data.latitude,
          icon: require("@/assets/images/shop.png"),
        };
        this.center = address;
        this.markers[0] = address;
        this.getMarkersStr();
      }
    },
    storeCancle() {
      this.form.storeId = null;
      this.form.store.storeName = null;
    },
    monitorFormConfirm(data) {
      if (data) {
        if (data) {
          this.form.monitorId = data.id;
          this.form.monitorPoint.name = data.name;
          const address = {
            lng: data.longitude,
            lat: data.latitude,
            icon: require("@/assets/images/addMinor.png"),
          };
          this.markers[1] = address;
          this.center = address;
          this.getMarkersStr();
        }
      }
    },
    monitorFormCancle() {
      this.form.monitorId = null;
      this.form.monitorPoint.name = null;
    },
    // 取消按钮
    cancel() {
      /* this.reset(); */
      this.$router.go(-1);
      /* this.$router.push({path:'/srcase'}); */
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        isPoint: 0,
        fbTime: null,
        problemRootId: null,
        problemId: null,
        problemParentId: null,
        districtId: null,
        organizationId: null,
        monitorId: null,
        caseImages: null,
        storeId: null,
        remark: null,
        caseType: "task",
        store: {
          storeName: null,
          storeId: null,
        },
        monitorPoint: {
          name: null,
        },
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.form.caseType === 'task' && this.form.monitorPoint && this.form.monitorPoint.name) {
            this.form.address = this.form.monitorPoint.name;
          }
        /*   if (!this.form.latitude || !this.form.longitude) {
            this.$message.warning("请在地图上标注问题地址经纬度");
          } else { */
          if (this.form.id != null) {
            let bool = true;
            //案件分配
            if (
              this.timeDealForm.nodeType &&
              this.timeDealForm.nodeType == "dispatch" &&
              this.caseStatus == 2
            ) {
              if (this.timeDealForm.dispatchUserName) {
                bool = true;
                this.handledispatchNodeEdit();
              } else {
                bool = false;
                this.$message.warning("请选择案件分配责任人！");
              }
            }
            //处理结果
            if (
              this.timeDealForm.nodeType &&
              this.timeDealForm.nodeType == "handle"
            ) {
              if (
                this.timeDealForm.handleOrgId &&
                this.timeDealForm.handleUserName&&this.timeDealForm.text
              ) {
                bool = true;
                this.updateHandleSrcaseRequest();
              } else {
                bool = false;
                this.$message.warning(
                  "请将处理结果处理人处理部门等信息补充完整！！"
                );
              }
            }
            if (bool) {
              this.form.caseStatus = null;
              delete this.form.txlatitude;
              delete this.form.txlongitude;
              updateSrcase(this.form).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.$router.go(-1);
              });
            }
          } else {
            addSrcase(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$router.go(-1);
            });
          }
          /*   } */
        }
      });
    },
    //案件分配修改
    handledispatchNodeEdit() {
      const obj = {
        caseId: this.form.caseId,
        organizationId: this.form.organizationId, //责任单位
        dispatchUserId: this.timeDealForm.dispatchUserId, //责任人
        handleOrgId: this.timeDealForm.handleOrgId, //处理单位
        handleUserId: this.timeDealForm.handleUserId, //处理人
      };
      console.log("案件分配更新");
      console.log(this.timeDealForm);
      console.log(obj);
      srcaseDispatchNodeEdit(obj).then((res) => {
        console.log("案件分配更新成功！");
      });
    },

    /********处理*******/
    handleSrcaseFun() {
      if (this.form.currentHandleDetail && this.form.currentHandleDetail.id) {
        this.form.id = this.form.currentHandleDetail.id;
        this.updateHandleSrcaseRequest();
      } else {
        this.addHandleSrcaseRequest();
      }
    },
    /* 新增处理信息 */
    addHandleSrcaseRequest() {
      addHandleSrcase(this.form).then((res) => {});
    },
    /* 更新处理信息 */
    updateHandleSrcaseRequest() {
      const obj = {
        caseId: this.id,
        id: this.form.currentHandleDetail.id,
        handleOrgId: this.timeDealForm.handleOrgId,
        handleTime: this.timeDealForm.nodeTime,
        handleUserId: this.timeDealForm.handleUserId,
        handleDescribe: this.timeDealForm.text,
        rectifyImages: this.timeDealForm.images,
        params: {
          updateHandleDescribeForce: true,
        },
      };
      console.log("更新处理信息 ");
      console.log(obj);
      updateHandleSrcase(obj).then((res) => {
        console.log("编辑处理信息成功！");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-container {
  padding: 0 24px;
  background: #f9fafc;
  padding-top: 1px;

  .block {
    padding: 20px 24px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(39, 45, 57, 0.1);
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .page-head {
    font-family: "Microsoft YaHei UI Bold";
    font-weight: 700;
    font-size: 24px;
    text-align: left;
    color: #272d39;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;

    .el-button {
      padding: 7px 20px;
      font-size: 14px;
    }

    .iconfont {
      font-size: 14px;
    }

    .back {
      padding: 7px 25px;
    }
  }

  .info-item {
    display: flex;
    flex-shrink: 0;
    width: 50%;
    box-sizing: border-box;
    padding-right: 10px;
    line-height: 2.2em;
    color: #272d39;

    span {
      display: inline-block;
      width: 130px;
      color: #99a1b4;
      flex-shrink: 0;
    }
  }
}

.el-form-item {
  width: 50%;
  margin-right: 0;
}

.fullitem {
  width: 100%;
}

.el-input,
.el-select,
.el-textarea,
.vue-treeselect,
.myinput {
  width: 400px !important;
}
.desc-wrap{
  flex: 1;
  overflow: hidden;
 word-wrap:break-word; 
}
</style>