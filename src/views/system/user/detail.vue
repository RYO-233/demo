<template>
  <div class="detail-container">
    <div class="page-head">
      <div class="title">用户详情</div>
      <div class="charges" v-if="!isEdit">
        <el-button
          icon="el-icon-edit"
          type="primary"
          size="small"
          @click="edit"
          v-if="!isWxUser"
          >修改</el-button
        >
        <el-button type="primary" size="small" plain @click="back"
          >返回</el-button
        >
      </div>
      <div class="charges" v-else>
        <el-button type="primary" size="small" @click="onConfirm"
          >完成</el-button
        >
        <el-button type="primary" size="small" plain @click="isEdit = false"
          >取消</el-button
        >
      </div>
    </div>
    <blScrollContent>
      <div class="info">
        <!-- 微信公众用户 -->
        <div class="wechatUser" v-if="isWxUser">
          <div class="block wechatUser">
            <div class="info-item" style="width: 100%">
              <span>微信头像：</span>
              <image-preview
                v-show="info.avatar"
                :src="info.avatar"
                :width="100"
                :height="100"
              />
            </div>
            <div class="info-item">
              <span>用户昵称：</span>{{ info.nickName }}
            </div>
            <div class="info-item"><span>姓名：</span>{{ info.realName }}</div>
            <div class="info-item">
              <span>手机号：</span>{{ info.phonenumber }}
            </div>
            <div class="info-item">
              <span>注册时间：</span>{{ info.createTime }}
            </div>
            <div class="info-item">
              <span>最近登录时间：</span>{{ info.loginDate | formateDate }}
            </div>
            <div class="info-item" v-if="info.expireTime">
              <span>有效期至：</span>{{ info.expireTime | formateDate }}
            </div>
          </div>
          <div class="block wechatUser">
            <div class="info-item"><span>账号类型：</span>公众</div>
            <div class="info-item">
              <span>总获取积分：</span>{{ info.totalScore }}
            </div>
            <div class="info-item">
              <span>总兑换积分：</span>{{ info.usedScore }}
            </div>
            <div class="info-item"><span>可用积分：</span>{{ info.score }}</div>
          </div>
          <div class="block feedbackHistory flex-vertical">
            <div class="subTitle">反馈记录</div>
            <el-table v-loading="loading" :data="feedbackList">
              <el-table-column
                type="index"
                width="70"
                label="序号"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{
                    queryParams.pageSize * (queryParams.pageNum - 1) +
                    scope.$index +
                    1
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="反馈时间" align="center" prop="fbTime" />
              <el-table-column label="问题地点" align="center" prop="address" />
              <el-table-column
                label="问题类别"
                align="center"
                prop="problemParent.name"
              />
              <el-table-column
                label="案件状态"
                align="center"
                prop="caseStatus"
              >
                <template slot-scope="scope">
                  {{ statusList[scope.row.caseStatus].dictLabel }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="caseInfo(scope.row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getCaseList"
            />
          </div>
          <div
            class="block"
            style="display: flex; justify-content: space-between"
          >
            <div class="integralRecord flex-vertical">
              <div class="subTitle">积分获取记录</div>
              <el-table :data="integralList">
                <el-table-column type="index" width="70" label="序号">
                  <template slot-scope="scope">
                    <span>{{
                      integralQuery.pageSize * (integralQuery.pageNum - 1) +
                      scope.$index +
                      1
                    }}</span>
                  </template></el-table-column
                >
                <el-table-column label="获取时间" prop="gotTime">
                  <template slot-scope="scope">
                    {{ scope.row.gotTime | formatGotTime }}
                  </template>
                </el-table-column>
                <el-table-column label="获取积分" prop="score">
                  <template slot-scope="scope">
                    <span class="blue">{{ scope.row.score }}</span></template
                  >
                </el-table-column>
                <el-table-column label="来源" prop="source">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_source"
                      :value="scope.row.source"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="integralTotal"
                :page.sync="integralQuery.pageNum"
                :limit.sync="integralQuery.pageSize"
                @pagination="getIntegralList"
              />
            </div>
            <div class="integralRecord flex-vertical">
              <div class="subTitle">积分兑换记录</div>
              <el-table :data="exchangeList">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">
                    <span>{{
                      exchangeQuery.pageSize * (exchangeQuery.pageNum - 1) +
                      scope.$index +
                      1
                    }}</span>
                  </template></el-table-column
                >
                <el-table-column label="兑换时间" prop="exchangeTime">
                </el-table-column>
                <el-table-column label="兑换类型" prop="type">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_exchange_type"
                      :value="scope.row.type"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="花费积分" prop="score">
                  <template slot-scope="scope">
                    <span class="orange">{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="兑换状态" prop="status">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_exchange_status"
                      :value="scope.row.status"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="exchangeTotal"
                :page.sync="exchangeQuery.pageNum"
                :limit.sync="exchangeQuery.pageSize"
                @pagination="getExchangeList"
              />
            </div>
          </div>
        </div>
        <!-- 志愿者组 -->
        <div v-if="isVolunteer">
          <div class="block edit" v-if="isEdit">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="120px"
              label-position="top"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="志愿者姓名" prop="realName">
                    <el-input
                      v-model="form.realName"
                      placeholder="请输入志愿者姓名"
                      maxlength="50"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phonenumber">
                    <el-input
                      v-model="form.phonenumber"
                      placeholder="请输入手机号码"
                      maxlength="11"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="街道" prop="streetId">
                    <!-- <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择" /> 
              -->
                    <el-select
                      v-model="form.streetId"
                      placeholder="请选择街道"
                      @change="handleChangeStreet"
                      class="editInput"
                    >
                      <el-option
                        v-for="item in volunteerDeptList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="社区（村）" prop="deptId">
                    <el-select
                      class="editInput"
                      v-model="form.deptId"
                      placeholder="请选择社区（村）"
                    >
                      <el-option
                        v-for="item in communityList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="志愿者单位" prop="zyOrgName">
                    <el-input
                      v-model="form.zyOrgName"
                      placeholder="请输入志愿者单位"
                      maxlength="11"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-date-picker
                      disabled
                      v-model="form.createTime"
                      type="datetime"
                      placeholder="请选择时间"
                      class="editInput"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="状态" prop="status">
                    <el-switch
                      v-model="form.status"
                      active-color="#2A8DFF"
                      inactive-color="#ccc"
                      active-value="0"
                      inactive-value="1"
                    >
                    </el-switch>
                    &nbsp; &nbsp;
                    <el-button
                      type="primary"
                      v-show="info.openId !== null && !isWxUser"
                      @click="handeleUnbind"
                      plain
                      size="mini"
                      >微信解绑</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="block" v-else>
            <div class="info-item">
              <span>志愿者姓名：</span>{{ info.realName }}
            </div>
            <div class="info-item">
              <span>手机号：</span>{{ info.phonenumber }}
            </div>
            <div class="info-item">
              <span>街道：</span>{{ info.dept.parentName }}
            </div>
            <div class="info-item">
              <span>社区（村）：</span>{{ info.dept.deptName }}
            </div>
            <div class="info-item">
              <span>志愿者单位：</span>{{ info.dept ? info.dept.deptName : "" }}
            </div>
            <div class="info-item">
              <span>创建时间：</span>{{ info.createTime }}
            </div>
            <div class="info-item">
              <span>最近登录时间：</span>{{ info.loginDate | formateDate }}
            </div>
            <div class="info-item" v-if="info.expireTime">
              <span>有效期至：</span>{{ info.expireTime | expireTime }}
            </div>
            <div class="info-item">
              <span>状态：</span>
              <el-switch
                v-model="info.status"
                active-color="#2A8DFF"
                inactive-color="#ccc"
                disabled
                active-value="0"
                inactive-value="1"
              >
              </el-switch>
            </div>
          </div>
          <div class="block wechatUser">
            <div class="info-item"><span>账号类型：</span>志愿者</div>
            <div class="info-item">
              <span>总获取积分：</span>{{ info.totalScore }}
            </div>
            <div class="info-item">
              <span>总兑换积分：</span>{{ info.usedScore }}
            </div>
            <div class="info-item"><span>可用积分：</span>{{ info.score }}</div>
          </div>
          <div class="block feedbackHistory flex-vertical">
            <div class="subTitle">反馈记录</div>
            <el-table v-loading="loading" :data="feedbackList">
              <el-table-column type="index" width="50" label="序号">
                <template slot-scope="scope">
                  <span>{{
                    queryParams.pageSize * (queryParams.pageNum - 1) +
                    scope.$index +
                    1
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="反馈时间" prop="fbTime" />
              <el-table-column label="问题地点" prop="address" />
              <el-table-column label="问题类别" prop="problemParent.name" />
              <el-table-column label="案件状态" prop="caseStatus">
                <template slot-scope="scope">
                  {{ statusList[scope.row.caseStatus].dictLabel }}
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="caseInfo(scope.row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getCaseList"
            />
          </div>
          <div
            class="block"
            style="display: flex; justify-content: space-between"
          >
            <div class="integralRecord flex-vertical">
              <div class="subTitle">积分获取记录</div>
              <el-table :data="integralList">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">
                    <span>{{
                      integralQuery.pageSize * (integralQuery.pageNum - 1) +
                      scope.$index +
                      1
                    }}</span>
                  </template></el-table-column
                >
                <el-table-column label="获取时间" prop="gotTime">
                  <template slot-scope="scope">
                    {{ scope.row.gotTime | formatGotTime }}
                  </template>
                </el-table-column>

                <el-table-column label="获取积分" prop="score">
                  <template slot-scope="scope">
                    <span class="blue">{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="来源" prop="source">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_source"
                      :value="scope.row.source"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="integralTotal"
                :page.sync="integralQuery.pageNum"
                :limit.sync="integralQuery.pageSize"
                @pagination="getIntegralList"
              />
            </div>
            <div class="integralRecord flex-vertical">
              <div class="subTitle">积分兑换记录</div>
              <el-table :data="exchangeList">
                <el-table-column type="index" width="50" label="序号">
                  <template slot-scope="scope">
                    <span>{{
                      exchangeQuery.pageSize * (exchangeQuery.pageNum - 1) +
                      scope.$index +
                      1
                    }}</span>
                  </template></el-table-column
                >
                <el-table-column label="兑换时间" prop="exchangeTime">
                </el-table-column>
                <el-table-column label="兑换类型" prop="type">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_exchange_type"
                      :value="scope.row.type"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="花费积分" prop="score">
                  <template slot-scope="scope">
                    <span class="orange">{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="兑换状态" prop="status">
                  <template slot-scope="scope">
                    <dict-tag
                      :options="dict.type.score_exchange_status"
                      :value="scope.row.status"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="exchangeTotal"
                :page.sync="exchangeQuery.pageNum"
                :limit.sync="exchangeQuery.pageSize"
                @pagination="getExchangeList"
              />
            </div>
          </div>
        </div>

        <!--  非微信公众用户及非志愿者 -->
        <div class="user" v-if="!isWxUser && !isVolunteer">
          <div class="block" v-if="!isEdit">
            <div class="info-item">
              <span>用户名：</span>{{ info.userName }}
            </div>
            <div class="info-item"><span>姓名：</span>{{ info.realName }}</div>
            <div class="info-item">
              <span>责任单位：</span>{{ info.dept ? info.dept.deptName : "" }}
            </div>
            <div class="info-item">
              <span>手机号：</span>{{ info.phonenumber }}
            </div>
            <div class="info-item">
              <span>状态：</span>
              <el-switch
                v-model="info.status"
                active-color="#2A8DFF"
                inactive-color="#ccc"
                disabled
                active-value="0"
                inactive-value="1"
              >
              </el-switch>
            </div>
            <div class="info-item">
              <span>创建时间：</span>{{ info.createTime }}
            </div>
            <div class="info-item">
              <span>最近登录时间：</span>{{ info.loginDate | formateDate }}
            </div>
            <div class="info-item" v-if="info.expireTime">
              <span>有效期至：</span>{{ info.expireTime | formateDate }}
            </div>
          </div>
          <div class="block edit" v-else>
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="120px"
              label-position="top"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="用户名" prop="userName">
                    <el-input
                      v-model="form.userName"
                      placeholder="请输入用户名"
                      maxlength="30"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓名" prop="realName">
                    <el-input
                      v-model="form.realName"
                      placeholder="请输入姓名"
                      maxlength="50"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="责任单位" prop="deptId">
                    <treeselect
                      v-model="form.deptId"
                      :options="deptOptions"
                      :show-count="true"
                      placeholder="请选择归属责任单位"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号码" prop="phonenumber">
                    <el-input
                      v-model="form.phonenumber"
                      placeholder="请输入手机号码"
                      maxlength="11"
                      class="editInput"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="状态" prop="status">
                    <el-switch
                      v-model="form.status"
                      active-color="#2A8DFF"
                      inactive-color="#ccc"
                      active-value="0"
                      inactive-value="1"
                    >
                    </el-switch>
                    &nbsp; &nbsp; &nbsp;
                    <el-button
                      type="primary"
                      v-show="info.openId !== null && !isWxUser"
                      @click="handeleUnbind"
                      plain
                      size="mini"
                      >微信解绑</el-button
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-date-picker
                      v-model="form.createTime"
                      type="datetime"
                      placeholder="请选择时间"
                      class="editInput"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="block" v-if="info.openId">
            <div class="info-item">
              <span>绑定微信头像：</span>
              <image-preview
                v-show="info.avatar"
                :src="info.avatar"
                :width="100"
                :height="100"
              />
            </div>
            <div class="info-item">
              <span>绑定微信昵称：</span>{{ info.nickName }}
            </div>
          </div>
        </div>
        <!-- 指挥中心 责任单位用户组 -->
        <div class="authorization" v-if="showAuthorizationRecord">
          <div class="subTitle">授权记录</div>
          <authorizationRecord></authorizationRecord>
        </div>
      </div>
    </blScrollContent>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect,
  unbind,
} from "@/api/system/user";
import { formateDate } from "@/utils/formate";
import { listDept } from "@/api/system/dept";
import { listData } from "@/api/system/dict/data";
import { listSrcase } from "@/api/srhjjg/srcase";
import { listUserScoreRecord } from "@/api/srhjjg/userScoreRecord";
import { listScoreExchangeRecord } from "@/api/srhjjg/scoreExchangeRecord";
import authorizationRecord from "@/views/system/user/authorizationRecord";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import blScrollContent from "@/components/blade/bl-scroll-content";
import moment from "moment";
const projectStartDate = moment("2023-04-14");
export default {
  dicts: [
    "score_exchange_status",
    "score_exchange_type",
    "case_type",
    "score_source",
  ],
  props: [],
  components: { Treeselect, blScrollContent, authorizationRecord },
  data() {
    return {
      isVolunteer: false,
      showAuthorizationRecord: false,
      id: 0,
      info: {
        status: true,
      },
      loading: false,
      feedbackList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isWxUser: false, //isWxCommonUser 1为微信公众用户组
      isEdit: false, //是否编辑
      form: { zyOrgName: null, deptId: null, streetId: "", zyOrgName: null },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phonenumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        streetId: [{ required: true, message: "请选择", trigger: "change" }],
        deptId: [
          { required: true, message: "请选择", trigger: ["blur", "change"] },
        ],
        zyOrgName: [{ required: true, message: "请输入", trigger: "blur" }],
        status: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      deptOptions: [],
      statusList: [],
      integralTotal: 0,
      integralQuery: { pageNum: 1, pageSize: 10 },
      integralList: [],
      exchangeTotal: 0,
      exchangeQuery: { pageNum: 1, pageSize: 10 },
      exchangeList: [],
      volunteerDeptList: [],
      communityList: [],
      //
    };
  },
  created() {},
  mounted() {
    this.id = this.$route.query?.id || null;
    if (this.id) {
      this.getDetail();
    }
  },
  filters: {
    formateDate,
    formatGotTime(dateStr) {
      if (dateStr) {
        const filterDate = moment(dateStr);
        if (filterDate.isBefore(projectStartDate)) {
          return filterDate.format("YYYY-MM-DD");
        }
      }
      return dateStr;
    },
  },
  methods: {
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //切换街道
    handleChangeStreet(val) {
      this.form.deptId = null;
      listDept({ pageSize: 0, parentId: val }).then((response) => {
        this.communityList = response.data;
      });
    },
    //获取责任单位id
    getOrgUserDeptId() {
      const _this = this;
      return new Promise((resolve, reject) => {
        _this.getConfigKey("org_user_dept_id").then((response) => {
          _this.orgUserDeptId = +response.msg;
          resolve(+response.msg);
        });
      });
    },
    //获取志愿者id
    getVolunteerConfig() {
      this.getConfigKey("zy_dept_id").then((response) => {
        // 志愿者组id
        this.zyDeptId = response.msg;
        this.getVolunteerOptions();
      });
    },
    getVolunteerOptions() {
      listDept({ pageSize: 0, parentId: this.zyDeptId }).then((response) => {
        /*  this.deptOptions = response.data; */
        this.volunteerDeptList = response.data;
      });
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

    getDetail() {
      getUser(this.id).then((res) => {
        console.log(res, "详情信息");
        this.info = res.data;
        this.isWxUser = res.data.isWxCommonUser == 1 ? true : false;
        this.isVolunteer = res.data.zyUser ? true : false;
        if (res.data.dept && res.data.dept.deptName) {
          if (res.data.dept.deptName == "指挥中心") {
            this.showAuthorizationRecord = true;
          }
          this.getOrgUserDeptId().then((orgUserDeptId) => {
            if (
              res.data.dept &&
              res.data.dept.ancestors &&
              res.data.dept.ancestors.split(",")[1] == orgUserDeptId
            ) {
              this.showAuthorizationRecord = true;
            }
          });
        }

        if (this.isWxUser) {
          this.getStatusList();
          this.getCaseList();
          this.getIntegralList();
          this.getExchangeList();
        }
        if (this.isVolunteer) {
          this.getVolunteerConfig();
          if (res.data.dept && res.data.dept.parentId) {
            console.log(res.data.dept.parentId);
            this.info.streetId = res.data.dept.parentId;
            this.handleChangeStreet(res.data.dept.parentId);
          }
          this.getStatusList();
          this.getCaseList();
          this.getIntegralList();
          this.getExchangeList();
        }
      });
    },
    //解绑
    handeleUnbind: function () {
      // 解绑微信openid
      this.$confirm("此操作不可撤回", "确认解绑吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          return unbind(this.info.userId);
        })
        .then((res) => {
          if (res.code === 200) {
            row.openId = null;
            this.info.info = null;
            this.$modal.msgSuccess("解绑成功");
          }
        })
        .catch(() => {});
    },
    getCaseList() {
      listSrcase({
        fbPersonId: this.id,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        orderByColumn: "fb_time",
        isAsc: "desc",
      }).then((res) => {
        console.log(res, "列表信息");
        this.feedbackList = res.rows;
        this.total = res.total;
      });
    },
    caseInfo(row) {
      this.$router.push({
        path: "/srcase/detail",
        query: { id: row.id, caseStatus: row.caseStatus },
      });
    },
    getStatusList() {
      listData({
        pageNum: 1,
        pageSize: 10,
        dictType: "case_status",
      }).then((response) => {
        this.statusList = response.rows;
      });
    },
    //获取用户积分列表
    getIntegralList() {
      listUserScoreRecord({
        userId: this.id,
        pageNum: this.integralQuery.pageNum,
        pageSize: this.integralQuery.pageSize,
      }).then((res) => {
        this.integralList = res.rows;
        this.integralTotal = res.total;
      });
    },
    //获取用户积分兑换列表
    getExchangeList() {
      listScoreExchangeRecord({
        userId: this.id,
        pageNum: this.exchangeQuery.pageNum,
        pageSize: this.exchangeQuery.pageSize,
      }).then((res) => {
        this.exchangeList = res.rows;
        this.exchangeTotal = res.total;
      });
    },
    edit() {
      this.isEdit = true;
      this.getDeptTree();
      this.form = this.info;
    },
    back() {
      this.$router.go(-1);
    },
    onConfirm() {
      console.log(this.form, "用户信息");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateUser(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.isEdit = false;
            this.getDetail();
          });
        }
      });
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 0 24px;
  background: #f9fafc;
  margin-bottom: 60px;
  .authorization {
    margin-top: 20px;
    padding: 20px 24px 50px;
    background: #fff;
    .subTitle {
      font-size: 16px;
    }
  }
  .block {
    padding: 20px 24px;
    padding-bottom: 0px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(39, 45, 57, 0.1);
    border-radius: 8px;
    margin-top: 24px;
    color: #272d39;
    display: flex;
    flex-wrap: wrap;
    .info-item {
      display: flex;
      width: 50%;
      line-height: 20px;
      margin-bottom: 20px;
      span {
        color: #99a1b4;
        width: 112px;
      }
    }
  }
  .flex-vertical {
    flex-direction: column;
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
    align-items: center;
  }
  .title {
    font-family: "Microsoft YaHei Bold";
    font-weight: 700;
    font-size: 24px;
    color: #333;
    margin: 0;
  }
  .subTitle {
    font-family: "Microsoft YaHei Bold";
    font-weight: 700;
    font-size: 24px;
    color: #333;
    margin-bottom: 24px;
  }
  .integralRecord {
    width: 48%;
  }
  .edit {
    display: block;
  }
  .editInput {
    width: 400px;
  }
  .blue {
    color: #2a8dff;
  }
  .orange {
    color: #ffad29;
  }
}
</style>
