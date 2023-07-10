<template>
  <div class="detail-container">
    <div class="page-head">
      <div class="tit">查看台账</div>
      <div class="charges">
        <template>
          <!--  -->
          <!--  1 待分配  2待处理 -->
          <!--   -->
          <el-button
            v-if="dataObj.todoCaseStatusSub == 1"
            size="small"
            type="primary"
            icon="iconfont icon-biaoqian1-mianxing"
            @click="userSelVisible = true"
            >受理</el-button
          >
        </template>
        <template>
          <!-- -->
          <!--  1 待分配  2待处理 -->
          <el-button
            v-if="dataObj.todoCaseStatusSub == 1||dataObj.todoCaseStatusSub == 2"
            size="small"
            type="primary"
            icon="iconfont icon-fanhui"
            @click="dialogGobackVisible = true"
            >回退</el-button
          >
        </template>
        <template
          v-if="
            dataObj.todoCaseStatusSub == 1 || dataObj.todoCaseStatusSub == 2
          "
        >
          <!--  1 待分配  2待处理 -->
          <el-button
            size="small"
            type="primary"
            plain
            @click="dealInfoVisible = true"
            >填写处理情况</el-button
          >
        </template>
        <!--          <template v-if="caseStatus == 2&&!dataObj.isSpecial">
          <el-button size="small" type="primary" @click="updateIsSpecial"
          icon="iconfont icon-jinggao" class="pink" >特殊案件</el-button
          >
        </template>
        <template v-if="caseStatus == 2&&!dataObj.isDifficult">
          <el-button size="small" type="primary" @click="updateDifficult"
          icon="iconfont icon-jinggao" class="zise" >疑难案件</el-button
          >
        </template> -->

        <!--   <template v-if="caseStatus == 3">
          <el-button
            size="small"
            type="primary"
            @click="handleReject"
            icon="iconfont icon-fanhui"
            >驳回</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="handleComment"
            icon="iconfont icon-shenhehoutai_mian"
            >结案</el-button
          >
        </template> -->
        <el-button
          size="small"
          type="primary"
          plain
          @click="cancel"
          class="back"
          >返回</el-button
        >
      </div>
    </div>
    <blScrollContent>
      <div class="info">
        <div class="block baseinfo">
          <div class="fiximg">
            <img
              class="rejectimg"
              v-if="dataObj.isDifficult"
              src="@/assets/images/difficult.png"
            />
            <img
              class="difficultimg"
              v-if="dataObj.isRedirect"
              src="@/assets/images/reject.png"
            />
            <img
              class="isSpecial"
              v-if="dataObj.isSpecial"
              src="@/assets/images/special.png"
            />
          </div>

          <div class="info-item">
            <span>案件编号：</span>{{ dataObj.caseNum }}
          </div>
          <div class="info-item">
            <span>案件来源：</span
            ><!-- {{ dataObj.caseType }} -->
            <dict-tag
              :options="dict.type.case_type"
              :value="dataObj.caseType"
            />
          </div>
          <div class="info-item">
            <span>上报人：</span>{{ dataObj.fbPerson }}
          </div>
          <div class="info-item">
            <span>上报时间：</span>{{ dataObj.fbTime }}
          </div>
          <div class="info-item">
            <span>问题描述：</span>
            <div class="desc-wrap">{{ dataObj.caseDetail }}</div>
          </div>
          <div class="info-item">
            <span>联系电话：</span>{{ dataObj.fbPhone }}
          </div>
          <div class="info-item flex">
            <span>问题图片：</span>
            <div class="imgList-wrap">
              <blImageList
                :imgType="dataObj.caseType === 'grid' ? 'grid' : ''"
                :imgList="dataObj.caseImages"
              ></blImageList>
            </div>
          </div>
        </div>
        <!-- 未立案 -->
        <div class="block" v-if="caseStatus == 1">
          <div class="info-item">
            <span>问题类别(大类)：</span
            >{{
              dataObj.problemRoot && dataObj.problemRoot.name
                ? dataObj.problemRoot.name
                : ""
            }}
          </div>
          <div class="info-item">
            <span>主要问题(小类)：</span
            >{{
              dataObj.problemParent && dataObj.problemParent.name
                ? dataObj.problemParent.name
                : ""
            }}
          </div>
          <div class="info-item">
            <span>不立案原因：</span>
            <div class="desc-box">{{ dataObj.unhandleReason }}</div>
          </div>
          <div class="info-item">
            <span>备注：</span>
            <div class="desc-box">{{ dataObj.remark }}</div>
          </div>
        </div>
        <div class="block" v-if="caseStatus != 0 && caseStatus != 1">
          <div class="info-item">
            <span>问题类别(大类)：</span
            >{{
              dataObj.problemRoot && dataObj.problemRoot.name
                ? dataObj.problemRoot.name
                : ""
            }}
          </div>
          <div class="info-item">
            <span>主要问题(小类)：</span
            >{{
              dataObj.problemParent && dataObj.problemParent.name
                ? dataObj.problemParent.name
                : ""
            }}
          </div>
          <div class="info-item">
            <span>立案条件：</span
            >{{
              dataObj.problem && dataObj.problem.startCaseCondition
                ? dataObj.problem.startCaseCondition
                : ""
            }}
          </div>
          <div class="info-item">
            <span>是否督办案件：</span>{{ dataObj.isPoint == 0 ? "否" : "是" }}
          </div>
          <div class="info-item">
            <span>责任单位：</span
            >{{
              dataObj.organization && dataObj.organization.deptName
                ? dataObj.organization.deptName
                : ""
            }}
          </div>
          <div class="info-item">
            <span>是否短信通知：</span
            >{{ dataObj.msgNoticeType == 1 ? "是" : "否" }}
          </div>
          <div class="info-item">
            <span>关联商铺：</span
            >{{
              dataObj.store && dataObj.store.storeName
                ? dataObj.store.storeName
                : ""
            }}
          </div>
          <div class="info-item"><span>备注：</span>{{ dataObj.remark }}</div>
        </div>
        <!-- 立案编辑 -->
        <div class="block" v-if="caseStatus == 0">
          <el-form
            :rules="lianRules"
            :inline="true"
            ref="form"
            label-position="top"
            :model="dataObj"
          >
            <el-form-item label="问题类别(大类)" prop="problemRootId">
              <el-select
                filterable
                v-model="dataObj.problemRootId"
                placeholder="请选择问题类别(大类)"
                clearable
                @change="handleChangeproblemRoot"
              >
                <el-option
                  v-for="dict in problemTypeOptions1"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="问题类别(小类)" prop="problemParentId">
              <el-select
                filterable
                clearable
                v-model="dataObj.problemParentId"
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
            <el-form-item label="立案条件" required prop="problemId">
              <el-select
                filterable
                v-model="dataObj.problemId"
                clearable
                placeholder="请选择立案条件"
              >
                <el-option
                  v-for="dict in problemTypeList"
                  :key="dict.id"
                  :label="dict.startCaseCondition"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否督办案件" prop="isPoint">
              <el-select
                v-model="dataObj.isPoint"
                placeholder="请选择是否督办案件"
              >
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
                :form="dataObj"
              ></responsibility-unit>
            </el-form-item>
            <el-form-item label="是否短信通知" prop="msgNoticeType">
              <el-select
                v-model="dataObj.msgNoticeType"
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
            <el-form-item label="关联商铺">
              <StoreListSel
                class="myinput"
                :inputVal="dataObj.store.storeName"
                @confirmCB="storeConfirm"
                @clearCB="storeCancle"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="dataObj.remark"
                type="textarea"
                placeholder="备注"
                maxlength="300"
                show-word-limit
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="block">
          <div class="info-item">
            <span>所在片区：</span
            >{{
              dataObj.district && dataObj.district.name
                ? dataObj.district.name
                : ""
            }}
          </div>
          <div class="info-item"></div>
           <div class="info-item" v-if="dataObj.caseType == 'task'">
            <span>监控点：</span>{{ dataObj.monitorPoint.name }}
          </div>
          <div class="info-item" v-if="dataObj.caseType == 'feedback'">
            <span>问题地址：</span>{{ dataObj.address }}
          </div>
          <div class="info-item"></div>
          <div class="info-item fullitem mapitem">
            <drawMap
              ref="mydrawMap"
              class="mymap-wrap"
              :path="path"
              :strokeColor="strokeColor"
              :pcenter="center"
              :markers="markersStr"
              @searchcomplete="searchcomplete"
            ></drawMap>
          </div>
        </div>

        <!-- 除待派发、未立案显示 -->
        <div class="block" v-if="caseStatus != 0 && caseStatus != 1">
          <div class="info-item">
            <span>立案条件：</span
            >{{
              dataObj.problem && dataObj.problem.startCaseCondition
                ? dataObj.problem.startCaseCondition
                : ""
            }}
          </div>
          <div class="info-item">
            <span>结案条件：</span
            >{{
              dataObj.problem && dataObj.problem.endCaseCondition
                ? dataObj.problem.endCaseCondition
                : ""
            }}
          </div>
          <div class="info-item">
            <span>处置时限：</span>
            <div class="green">{{ dealTimeLimit }}</div>
          </div>
          <div class="info-item">
            <span>立案时间：</span>{{ dataObj.dispatchTime }}
          </div>
          <div class="info-item">
            <span>责任单位：</span
            >{{
              dataObj.organization && dataObj.organization.deptName
                ? dataObj.organization.deptName
                : ""
            }}
          </div>
          <div class="info-item">
            <span>预计结案时间：</span>{{ dataObj.predicateFixTime }}
          </div>
        </div>
        <srcaseTimeLine class="block" :caseId="id"></srcaseTimeLine>
      </div>
    </blScrollContent>
    <!-- 不立案 -->
    <el-dialog
      title="不立案"
      :visible.sync="dialogUnRegister"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="dataObj">
        <el-form-item label="不立案原因" required>
          <el-input
            v-model="dataObj.unhandleReason"
            type="textarea"
            placeholder="请输入不立案原因"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUnRegister = false">取 消</el-button>
        <el-button type="primary" @click="noRigisterConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 驳回 -->
    <el-dialog
      title="驳回"
      :visible.sync="dialogReject"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="dataObj">
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="dataObj.unhandleReason"
            type="textarea"
            placeholder="请输入驳回原因"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="rejectConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!--  回退 -->
    <el-dialog
      title="回退"
      :visible.sync="dialogGobackVisible"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="gobackInfo" :rules="gobackRules" ref="gobackInfo">
        <el-form-item label="回退原因"  prop="redirectReason">
          <el-input
            v-model="gobackInfo.redirectReason"
            type="textarea"
            placeholder="请填写回退原因，遇到的情况"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="佐证图片"  prop="redirectReasonImg">
        </el-form-item>
        <el-form-item style="width: 100%">
          <image-upload
            class="myupload"
            v-model="gobackInfo.redirectReasonImg"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGobackVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHuitui">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 填写处理情况 -->
    <el-dialog
      title="填写处理情况"
      :visible.sync="dealInfoVisible"
       width="480px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form :model="dealInfo">
        <el-form-item label="处理情况" required style="width: 100%">
          <el-input
            v-model="dealInfo.handleDescribe"
            type="textarea"
            placeholder="请输入处理情况"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="" style="width: 100%">
          <image-upload class="myupload" v-model="dealInfo.rectifyImages" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dealInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDealInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 结案 -->
    <el-dialog
      title="结案评价"
      :visible.sync="dialogComment"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="dataObj">
        <el-form-item class="fullrow">
          <el-rate v-model="dataObj.stars"></el-rate>
        </el-form-item>
        <el-form-item class="fullrow">
          <el-input
            v-model="dataObj.comment"
            type="textarea"
            placeholder="请输入结案评价"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item class="fullrow">
          <image-upload class="myupload" v-model="dataObj.finishImages" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogComment = false">取 消</el-button>
        <el-button type="primary" @click="commentConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <userSelTree
      v-if="userSelVisible"
      @updateUserSelVisible="updateUserSelVisible"
      @getUserData="getUserData"
      :parentInfo="parentInfo"
      :parentId="dataObj.organizationId"
    ></userSelTree>
  </div>
</template>

<script>
import userSelTree from "@/views/components/user/userSelTree";
import drawMap from "@/components/Map/markMap";
import blImageList from "@/components/blade/bl-image-list";
import {
  getSrcase,
  updateSrcase,
  bohuiSrcase,
  huitui,
  updateHandleSrcase,
  addHandleSrcase,
  handleDirect,
} from "@/api/srhjjg/srcase";
import { treeListProblemType, listProblemType } from "@/api/srhjjg/problemType";
import responsibilityUnit from "@/views/srhjjg/srcase/components/responsibilityUnit";
import StoreListSel from "@/views/components/store/StoreListSel";
import { listDept } from "@/api/system/dept";
import { listMonitorPoint } from "@/api/srhjjg/monitorPoint";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import blScrollContent from "@/components/blade/bl-scroll-content";
import Treeselect from "@riophae/vue-treeselect";
import srcaseTimeLine from "@/views/srhjjg/srcase/components/srcaseTimeLine";
import "@/assets/font/iconfont.css";
export default {
  props: [],
  dicts: ["case_status", "yyt_yes_no", "case_type"],
  components: {
    userSelTree,
    blImageList,
    Treeselect,
    StoreListSel,
    drawMap,
    blScrollContent,
    srcaseTimeLine,
    responsibilityUnit,
  },
  data() {
    return {
      id: null,
      path: null,
      strokeColor: "",
      searchKeyword: null,
      dealTimeLimit: "",
      center: {},
      markers: [{}, {}],
      markersStr: "",
      dialogUnRegister: false,
      dialogReject: false,
      dialogComment: false,
      componentName: null,
      caseStatus: null,
      problemTypeOptions1: [],
      problemTypeOptions2: [],
      problemTypeList: [],
      dataObj: {
        monitorId: null,
        monitorPoint: {
          name: null,
        },
        problemRootId: null,
        problemParentId: null,
        problemId: null,
        isPoint: 0,
        organizationId: null,
        msgNoticeType: 0,
        store: {
          name: null,
        },
        remark: "",
      },
      gobackRules: {
        redirectReason: [
          { required: true, message: "回退原因不能为空", trigger: "input" },
        ],
        redirectReasonImg: [
          { required: true, message: "佐证图片不能为空", trigger: "change" },
        ],
      },
      lianRules: {
        problemRootId: [
          {
            required: true,
            message: "问题类别(大类)不能为空",
            trigger: "change",
          },
        ],
        problemParentId: [
          {
            required: true,
            message: "问题类别(小类)不能为空",
            trigger: "change",
          },
        ],
        problemId: [
          { required: true, message: "立案条件不能为空", trigger: "change" },
        ],
        isPoint: [
          { required: true, message: "督办案件不能为空", trigger: "change" },
        ],
        organizationId: [
          { required: true, message: "责任单位不能为空", trigger: "change" },
        ],
        msgNoticeType: [
          {
            required: true,
            message: "是否短信通知不能为空",
            trigger: "change",
          },
        ],
      },
      orgOptions: [],
      /*  params:{
        id:this.$route.query?.id||null,
        registerType:null,
        problemParentId:null,
      } */
      orgUserDeptId: null,
      userSelVisible: false,
      dealInfoVisible: false,
      dealInfo: {},
      dialogGobackVisible: false,
      gobackInfo: {},
      parentInfo: {},
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
      this.getDetail();
    }
  },
  methods: {
    //处理情况 确认
    confirmDealInfo() {
      if (this.dealInfo.handleDescribe) {
        this.dealInfo.caseId = this.dataObj.id;
        if (this.dataObj.currentHandleDetail) {
          this.dealInfo.id = this.dataObj.currentHandleDetail.id;
          updateHandleSrcase(this.dealInfo).then((response) => {//更新处理情况
            this.getDetail();
            this.$message.success("已处理！");
            this.dealInfoVisible = false;
          });
        } else {
          handleDirect(this.dealInfo).then((response) => {//直接处理
            this.getDetail();
            this.$message.success("已处理！");
            this.dealInfoVisible = false;
          });
        }
      } else {
        this.$message.warning("请填写处理情况！");
      }
    },
    getUserData(userId) {
      if (userId) {
        const obj = {
          caseId: this.dataObj.id,
          handleOrgId: this.dataObj.organizationId,
          handleUserId: userId,
        };
        addHandleSrcase(obj).then((res) => {
          this.getDetail();
          this.$message.success("已受理案件！");
          this.userSelVisible = false;
        });
      } else {
        this.$message.warning("请选择处理人");
      }
    },
    //回退
    confirmHuitui() {
      this.$refs["gobackInfo"].validate((valid) => {
        if (valid) {
          this.gobackInfo.caseId = this.dataObj.id;
          huitui(this.gobackInfo).then((res) => {
            this.getDetail();
            this.$message.success("已回退！");
            this.dialogGobackVisible = false;
          });
        }
      });
    },
    updateUserSelVisible(arg) {
      this.userSelVisible = arg || false;
    },
    getMarkersStr() {
      let newArr = [];
      this.markers.forEach((item) => {
        if (Object.keys(item).length != 0) {
          console.log(item);
          newArr.push(item);
        }
      });
      this.markersStr = JSON.stringify(newArr);
    },
    searchcomplete(e) {
      if (e && e.Yr && e.Yr.length > 0) {
        const point = e.Yr[0].point;
        const address = {
          ...point,
          icon: require("@/assets/images/address.png"),
          offset: [3, -18],
        };
        this.markers[1] = address;
        this.center = address;
        this.getMarkersStr();
      }
    },
    //获取详情
    getDetail() {
      const _this = this;
      getSrcase(this.id).then((res) => {
        let data = res.data;

        this.parentInfo = {
          organizationId: data.organizationId,
          organizationName: data.organizationId
            ? data.organization.deptName
            : "",
        };
        this.caseStatus = data.caseStatus;

        if (data.caseStatus == 0) {
          this.getProblemselect();
        }
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
        if (!data.msgNoticeType) {
          data.msgNoticeType = 0;
        }
        _this.dataObj = data || {};
        if (res.data && res.data.store) {
          this.center = {
            lng: res.data.store.longitude || 114.97731018066408,
            lat: res.data.store.latitude || 25.8246784210205,
          };
          this.markers[0] = {
            lng: data.store.longitude,
            lat: data.store.latitude,
            icon: require("@/assets/images/shop.png"),
          };
        }
        //问题地址
        this.getProblemAddressMark(res.data);
        //获取监控点位置图标
        this.getMonitorMark(res.data);
        this.getMarkersStr();
        if (data.district && data.district.areaPoints) {
          this.path = data.district.areaPoints;
          if (data.district.polygonColor) {
            this.strokeColor = data.district.polygonColor;
          }
        }
        /* 处理时限 */
        if (this.dataObj.district && this.dataObj.district.prop == "common") {
          const data =
            this.dataObj.problem && this.dataObj.problem.commonAreaTimeLimit
              ? this.dataObj.problem.commonAreaTimeLimit
              : "";
          const unit =
            this.dataObj.problem && this.dataObj.problem.commonAreaTimeLimitUnit
              ? this.dataObj.problem.commonAreaTimeLimitUnit
              : "";
          this.dealTimeLimit =
            data +
            "" +
            (unit == "work_hour"
              ? "工作时"
              : unit == "work_day"
              ? "工作日"
              : "");
        }
        if (this.dataObj.district && this.dataObj.district.prop == "core") {
          const data =
            this.dataObj.problem && this.dataObj.problem.coreAreaTimeLimit
              ? this.dataObj.problem.coreAreaTimeLimit
              : "";
          const unit =
            this.dataObj.problem && this.dataObj.problem.coreAreaTimeLimitUnit
              ? this.dataObj.problem.coreAreaTimeLimitUnit
              : "";
          this.dealTimeLimit =
            data +
            "" +
            (unit == "work_hour"
              ? "工作时"
              : unit == "work_day"
              ? "工作日"
              : "");
        }
        if (res.data.problemRootId) {
          this.getProblemselect(1, res.data.problemRootId);
        }
        this.problemTypeListFun();
      });
    },
     getProblemAddressMark(data) {
      if (data.latitude && data.caseType == "feedback") {
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
    cancel() {
      this.$router.go(-1);
    },
    storeConfirm(data) {
      if (data) {
        this.dataObj.storeId = data.id;
        this.dataObj.store = data || {};
        this.dataObj.store.storeName = data.storeName;
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
      this.dataObj.storeId = null;
      this.dataObj.store.storeName = null;
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
    //特殊案件
    updateIsSpecial() {
      const _this = this;
      this.handleConfirm("调整为特殊案件", function () {
        const updateObj = {
          id: _this.dataObj.id,
          isSpecial: 1,
        };
        updateSrcase(updateObj).then((res) => {
          if (res.code == 200) {
            _this.dataObj.isSpecial = 1;
            _this.$modal.msgSuccess("操作成功");
          }
        });
      });
    },
    //疑难案件
    updateDifficult() {
      const _this = this;
      this.handleConfirm("调整为疑难案件", function () {
        const updateObj = {
          id: _this.dataObj.id,
          isDifficult: 1,
        };
        updateSrcase(updateObj).then((res) => {
          if (res.code == 200) {
            _this.dataObj.isDifficult = 1;
            _this.$modal.msgSuccess("操作成功");
          }
        });
      });
    },
    updateStatus(status, name = "") {
      const _this = this;
      this.handleConfirm(name, function () {
        _this.dataObj.caseStatus = status;
        _this.updateRequest();
      });
    },
    //确认提示
    handleConfirm(text, cb) {
      this.$confirm(`确认是否进行${text}操作？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确定");
          console.log(cb);
          cb();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //驳回
    handleReject() {
      if (
        this.dataObj.currentHandleDetail &&
        this.dataObj.currentHandleDetail.handleTime
      ) {
        this.dialogReject = true;
      } else {
        this.$message.warning("案件正在处理中，无法驳回！");
      }
    },
    rejectConfirm() {
      /*  this.dataObj.caseStatus=2;
      this.updateRequest(); */
      if (this.dataObj.unhandleReason) {
        bohuiSrcase({
          id: this.id,
          unhandleReason: this.dataObj.unhandleReason,
        }).then((res) => {
          if (res.code == 200) {
            this.$modal.msgSuccess("已驳回");
            this.$router.go(-1);
            /*   this.$router.push({path:'/srcase',query:{fresh:true}}); */
          }
        });
      } else {
        this.$message.error("请输入驳回原因");
      }
    },

    //结案评价、
    handleComment() {
      // if(this.dataObj.currentHandleDetail&&this.dataObj.currentHandleDetail.handleTime){
      this.dialogComment = true;
      // }else{
      //    this.$message.warning("案件正在处理中，无法进行结案！");
      // }
    },
    commentConfirm() {
      this.dataObj.caseStatus = 4;
      this.updateRequest();
    },

    //不立案
    handleNoRigister() {
      this.dialogUnRegister = true;
    },
    noRigisterConfirm() {
      if (!this.dataObj.unhandleReason) {
        this.$message.error("请输入不立案原因");
      } else {
        this.dataObj.caseStatus = 1;
        this.updateRequest();
      }
    },
    //立案
    handleRigister() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.updateStatus(2, "立案");
        }
      });
    },
    updateRequest() {
      updateSrcase(this.dataObj).then((res) => {
        if (res.code == 200) {
          this.$modal.msgSuccess("操作成功");
          this.$router.go(-1);
          /* this.$router.push({path:'/srcase',query:{fresh:true}}); */
        }

        /* this.open = false; */
        /*  this.getList(); */
      });
    },
    //跳转到修改页面
    gotoPage() {
      this.$router.push({
        path: "/srcase/edit",
        query: { id: this.id, caseStatus: this.caseStatus },
      });
    },

    //问题大类切换
    handleChangeproblemRoot(id) {
      this.dataObj.problemParentId = null;
      this.dataObj.problemId = null;
      if (id) {
        this.getProblemselect(1, id);
      } else {
        this.problemTypeOptions2 = [];
      }
      this.problemTypeList = [];
    },
    //问题小类切换
    handleChangeProblemParent(id) {
      this.dataObj.problemId = null;
      this.problemTypeListFun();
    },
    /** 查询问题类别列表立案条件信息 */
    problemTypeListFun() {
      if (this.dataObj.problemParentId) {
        listProblemType({
          pageNum: 1,
          pageSize: 100,
          parentId: this.dataObj.problemParentId,
        }).then((res) => {
          this.problemTypeList = res.data || [];
        });
      } else {
        this.problemTypeList = [];
      }
    },
    async getProblemselect(level = 0, id = null) {
      if (level == 0) {
        let res = await listProblemType({
          level: level,
          pageNum: 1,
          pageSize: 100,
          id: id,
        });
        this.problemTypeOptions1 = res.data || [];
      } else {
        let res = await listProblemType({
          pageNum: 1,
          pageSize: 100,
          parentId: id,
        });
        this.problemTypeOptions2 = res.data || [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 0 24px;
  background: #f9fafc;
  padding-top: 1px;
  .block {
    padding: 20px 24px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(39, 45, 57, 0.1);
    border-radius: 8px;
    margin-bottom: 24px;
    color: #272d39;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    .mymap-wrap {
    }
    .info-item {
      /*  display: inline-block; */
      display: flex;
      flex-shrink: 0;
      width: 50%;
      box-sizing: border-box;
      padding-right: 10px;
      line-height: 2.2em;
      span {
        display: inline-block;
        width: 130px;
        color: #99a1b4;
        flex-shrink: 0;
      }
    }
    .mapitem {
      width: 100%;
      padding-left: 130px;
      box-sizing: border-box;
    }
  }
  .itemchild-row {
    line-height: 2.2em;
    span {
      color: #99a1b4;
      width: 130px;
      display: inline-block;
    }
  }
  .fullitem {
    width: 100%;
  }
  .handle-item {
    border-bottom: 1px solid #d8dce6;
    padding: 20px 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    &:last-child {
      border-bottom: none;
    }
  }
  .noborder {
    border: none;
  }
  .baseinfo {
    position: relative;
    .fiximg {
      position: absolute;
      top: 20px;
      right: 8px;
      z-index: 99;
      display: inline-block;
      img {
        width: 120px;
        height: 120x;
        display: inline-block;
        margin-right: 10px;
      }
    }
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
    .charges {
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
  }
}
.el-form-item {
  width: 50%;
  margin-right: 0;
}
.fullrow {
  width: 100%;
}

.el-input,
.el-select,
.el-textarea,
.vue-treeselect,
.myinput {
  width: 400px !important;
}
.imgList-wrap {
  width: calc(100% - 130px);
  display: inline-block;
}
.flex {
  display: flex;
  justify-content: flex-start;
}
.zise {
  background: #f5f0ff;
  border: 1px solid #8c25e6;
  color: #8c25e6;
}
.pink {
  background: #feebf8;
  border: 1px solid #f53abd;
  color: #f53abd;
}
.desc-box {
  width: calc(100% - 130px);
  word-break: break-all;
}
.orange {
  color: #ff6b36;
}
.green {
  color: #15cc83;
}
</style>