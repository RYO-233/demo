<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--责任单位数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入责任单位名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <!-- default-expand-all -->
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
        >
          <el-form-item label="志愿者姓名" prop="realName" v-if="isVolunteer">
            <el-input
              v-model="queryParams.realName"
              placeholder="请输入志愿者姓名"
              clearable
              class="formInput"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName" v-else-if="isWxGroup">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入昵称"
              clearable
              class="formInput"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户名称" prop="userName" v-else>
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名"
              clearable
              class="formInput"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              class="formInput"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              class="formInput"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最近登录时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              size="mini"
              @click="resetQuery"
              >重置</el-button
            >
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
              v-hasPermi="['system:user:add']"
              v-if="!isWxGroup"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-user"
              size="mini"
              @click="empower.open = true"
              v-hasPermi="['system:user:limit']"
              >批量授权</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-time"
              size="mini"
              @click="handleRemindAction"
              v-hasPermi="['system:user:remind']"
              >到期提醒设置</el-button
            >
          </el-col>

          <!--
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col> -->
          <!--           <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
              v-hasPermi="['system:user:import']" v-if="!isWxGroup">{{isVolunteer?'志愿者导入':'导入'}}</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['system:user:export']">导出</el-button>
          </el-col> -->
          <!-- <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar> -->
        </el-row>
        <bl-table
          :listData="userList"
          :queryParams="queryParams"
          :loading="loading"
          @getList="getList"
          @handleSelectionChange="handleSelectionChange"
        >
          <template slot="col">
            <!-- <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          /> -->
            <template v-if="isVolunteer">
              <el-table-column
                label="街道"
                align="left"
                key="parentName"
                prop="dept.parentName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="社区（村）"
                align="left"
                key="deptName11"
                prop="dept.deptName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="志愿者单位"
                align="left"
                key="deptName1"
                prop="zyOrgName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="志愿者姓名"
                align="center"
                key="realName1"
                prop="realName"
                :show-overflow-tooltip="true"
              />
            </template>
            <el-table-column
              label="用户昵称"
              align="center"
              key="nickName"
              prop="nickName"
              v-if="isWxGroup"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="用户名"
              align="center"
              key="userName"
              prop="userName"
              v-else-if="!isVolunteer"
              :show-overflow-tooltip="true"
            />

            <el-table-column
              label="姓名"
              align="center"
              key="realName"
              prop="realName"
              v-if="columns[2].visible && !isVolunteer"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="责任单位"
              align="center"
              key="deptName"
              prop="dept.deptName"
              v-if="columns[3].visible && !isWxGroup && !isVolunteer"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="手机号"
              align="center"
              key="phonenumber"
              prop="phonenumber"
              v-if="columns[4].visible"
              width="120"
            />
            <el-table-column label="角色" key="roles" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.roles && scope.row.roles.length > 0
                    ? scope.row.roles[0].roleName
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="用户总积分"
              align="center"
              key="totalScore"
              prop="totalScore"
              v-if="isWxGroup"
            />
            <el-table-column
              label="状态"
              align="center"
              key="status"
              v-if="columns[5].visible"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <!--             <el-table-column label="注册时间" align="left" key="createTime" prop="createTime" v-if="isWxGroup"
              :show-overflow-tooltip="true" />
            <el-table-column :label="columns[6].label" align="center" key="createTime1" prop="createTime"
              v-else-if="columns[6].visible" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              label="有效期至"
              align="center"
              key="expireTime"
              width="155"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.expireTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="最近登录时间"
              align="center"
              key="loginDate"
              width="155"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.loginDate) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="220"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope" v-if="scope.row.userId !== 1">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleInfo(scope.row)"
                  >详情</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                  v-show="
                    !(
                      (scope.row.dept &&
                        scope.row.dept.deptId === outerSysDeptId) ||
                      (scope.row.dept &&
                        scope.row.dept.deptId === wxCommonUserDeptId)
                    )
                  "
                  >修改</el-button
                >
                <el-button
                  v-if="isVolunteer"
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                  :disabled="
                    scope.row.dept && scope.row.dept.deptId === outerSysDeptId
                  "
                  >移除志愿者</el-button
                >
                <el-button
                  v-else
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                  :disabled="
                    scope.row.dept && scope.row.dept.deptId === outerSysDeptId
                  "
                  >删除</el-button
                >

                <el-button
                  size="mini"
                  type="text"
                  v-show="scope.row.openId && scope.row.isWxCommonUser !== 1"
                  @click="unbind(scope.row)"
                  >微信解绑</el-button
                >
                <el-dropdown
                  size="mini"
                  @command="(command) => handleCommand(command, scope.row)"
                  v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
                  v-show="
                    !(
                      (scope.row.dept &&
                        scope.row.dept.deptId === outerSysDeptId) ||
                      (scope.row.dept &&
                        scope.row.dept.deptId === wxCommonUserDeptId)
                    )
                  "
                >
                  <el-button size="mini" type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="handleResetPwd"
                      icon="el-icon-key"
                      v-hasPermi="['system:user:resetPwd']"
                      >重置密码</el-dropdown-item
                    >
                    <!-- <el-dropdown-item
                    command="unbind"
                    icon="el-icon-close"
                    v-show="scope.row.openId !== null"
                    v-hasPermi="['system:user:edit']"
                    >解绑</el-dropdown-item
                  > -->
                    <!-- <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </template>
        </bl-table>
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="472px"
      append-to-body
      :close-on-click-modal="false"
      custom-class="userDialog"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="用户名" prop="userName" v-if="!isVolunteer">
          <el-input
            v-model="form.userName"
            placeholder="请输入用户名(仅支持数字与字母)"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="志愿者姓名" prop="realName" v-if="isVolunteer">
          <el-input
            v-model="form.realName"
            placeholder="请输入志愿者姓名(仅支持数字与字母)"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="form.userId == undefined"
        >
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            maxlength="20"
            show-password
          />
        </el-form-item>
        <el-form-item label="姓名" prop="realName" v-if="!isVolunteer">
          <el-input
            v-model="form.realName"
            placeholder="请输入姓名"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input
            v-model="form.phonenumber"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="性别" class="radio-item">
          <el-radio-group v-model="form.sex" placeholder="请选择性别">
            <el-radio
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位" prop="deptId" v-if="!isVolunteer">
          <treeselect
            v-model="form.deptId"
            :options="deptOptions"
            :show-count="true"
            placeholder="请选择"
          />
        </el-form-item>
        <div v-show="isVolunteer">
          <el-form-item label="所属社区" prop="deptId">
            <treeselect
              v-model="form.deptId"
              :disable-branch-nodes="true"
              :normalizer="orgNormalizer"
              :options="volunteerDeptOptions"
              :show-count="true"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="志愿者单位" prop="zyOrgName">
            <el-input
              v-model="form.zyOrgName"
              placeholder="请输入志愿者单位"
              maxlength="30"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ upload.updateSupportInfo }}
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--  授权 -->
    <el-dialog
      title="批量授权"
      :visible.sync="empower.open"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="empowerForm" :model="empower" :rules="empowerRules">
        <el-form-item label="选择用户组" prop="groupId">
          <treeselect
            v-model="empower.groupId"
            :options="deptOptions"
            :show-count="false"
            placeholder="请选择"
            class="deptSelect"
            @select="handleGroupNodeClick"
          />
        </el-form-item>
        <el-form-item label="到期时间" prop="empowerTime">
          <el-date-picker
            disabled
            style="width: 100%"
            v-model="empower.empowerTime"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="授权时间" prop="type">
          <el-radio-group
            v-model="empower.type"
            @change="handleChangeEmpowerDate"
          >
            <el-radio :label="1">长期有效</el-radio>
            <el-radio :label="2">有效期</el-radio>
            <el-radio :label="3">到期时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="empower.type == 2">
          <el-input
            class="numInp"
            v-model.number="empower.dayNum"
            type="number"
            maxlength="20"
            :min="0"
            placeholder="请输入天数"
            @input="handleBlurDay"
          ></el-input>
        </el-form-item>
        <el-form-item label="" v-if="empower.type == 3">
          <el-date-picker
            style="width: 100%"
            v-model="empower.empowerTime"
            placeholder="选择到期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEmpowerForm"
          >确 定</el-button
        >
        <el-button size="small" @click="empower.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 到期提醒 -->
    <el-dialog
      title="到期提醒"
      :visible.sync="expirationRemind.open"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="expirationRemind">
        <el-form-item label="授权时间" required>
          <el-radio-group v-model="expirationRemind.type">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="距离到期时间还剩"
          v-if="expirationRemind.type == 1"
          required
        >
          <el-input
            type="number"
             class="numInp"
            maxlength="20"
            style="width: 80px"
            size="mini"
            :min="0"
            v-model.number="expirationRemind.restday"
            placeholder="请输入"
          ></el-input>
          天开始提醒
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="updateConfigInfo"
          >确 定</el-button
        >
        <el-button size="small" @click="expirationRemind.open = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUserPost,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect,
  unbind,
  checkPhone,
} from "@/api/system/user";
import { getConfigKeyObj, updateConfig } from "@/api/system/config";
import {userExpireRecordAdd,userExpireRecordBatchAdd} from "@/api/srhjjg/validDateUser"
import { listDept } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import blTable from "@/components/blade/bl-table";
import * as validateForm from "@/utils/validateForm";
import {formateDate} from '@/utils/formate'
export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { Treeselect, blTable },
  data() {
    return {
      checkPhoneNumber: (rule, value, callback) => {
        if (value) {
          const phoneValidateObj =
            this.rules.phonenumber[this.rules.phonenumber.length - 1];
          if (phoneValidateObj.dbPhonenumber === value) {
            callback();
          } else {
            checkPhone({ phonenumber: value }).then((res) => {
              if (res.code == 200) {
                if (res.msg == "该手机号可以使用") {
                  callback();
                } else {
                  callback(new Error(res.msg));
                }
              }
            });
          }
        }
      },
      checkPhoneNumber2: (rule, value, callback) => {
        if (value) {
          const phoneValidateObj =
            this.rules.phonenumber[this.rules.phonenumber.length - 1];
          if (phoneValidateObj.dbPhonenumber === value) {
            callback();
          } else {
            checkPhone({ phonenumber: value }).then((res) => {
              if (res.code == 200) {
                if (res.msg == "该手机号可以使用") {
                  callback();
                } else {
                  if (!res.data) {
                    callback(
                      new Error(
                        res.msg + ",继续点击确定可以把对应用户转为志愿者账号"
                      )
                    );
                  } else {
                    callback(new Error(res.msg));
                  }
                }
              }
            });
          }
        }
      },
      empower: {
        open: false,
        groupId:null,
        empowerTime:null,
        type: null,
        dayNum: null,
      },
      expirationRemind: {
        open: false,
        restday: null,
        type: 1,
      },
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

      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 责任单位树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 责任单位名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        userName: null,
        realName: null,
        password: null,
        phonenumber: null,
        sex: "0",
        roleId: null,
        deptId: null,
        zyOrgName: null,
        status: "0",
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        updateSupportInfo: "是否更新已经存在的用户数据",
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userName: null,
        phonenumber: null,
        realName: null,
        status: null,
        deptId: null,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `姓名`, visible: true },
        { key: 3, label: `责任单位`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      empowerRules:{
        groupId:[{ required: true, message: "请选择", trigger: "change" }],
        type:[{ required: true, message: "请选择", trigger: "change" }],
        empowerTime:[{ required: true, message: "请选择", trigger: "change" }]
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            validator: validateForm.onlyNumberAndEnglish,
            message: "用户名只支持数字与字母",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phonenumber: [
          {
            validator: validateForm.checkPhoneAllowEmpty,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        roleId: [{ required: true, message: "请选择", trigger: "blur" }],
        deptId: [
          { required: true, message: "请选择", trigger: ["blur", "change"] },
        ],
        zyOrgName: [
          /* { required: true, message: "请输入", trigger: "blur" } */
        ],
      },
      outerSysDeptId: null,
      wxCommonUserDeptId: null,
      isWxGroup: false,
      isVolunteer: false,
      isOrgDept: false,
      volunteerDeptList: [],
      volunteerDeptOptions: [],
    };
  },
  watch: {
    // 根据名称筛选责任单位树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    isVolunteer(newVal, oldVal) {
      if (newVal) {
        if (this.rules.phonenumber.length === 2) {
          this.rules.phonenumber.pop();
          this.rules.phonenumber.push({
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          });
          this.rules.phonenumber.push({
            validator: this.checkPhoneNumber2,
            trigger: "blur",
          });
        }
        if (this.rules.phonenumber.length === 3) {
          this.rules.phonenumber.pop();
          this.rules.phonenumber.pop();
          this.rules.phonenumber.push({
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          });
          this.rules.phonenumber.push({
            validator: this.checkPhoneNumber2,
            trigger: "blur",
          });
        }

        this.rules.zyOrgName.push({
          required: true,
          message: "请输入",
          trigger: "blur",
        });
      } else {
        if (this.rules.phonenumber.length === 3) {
          this.rules.phonenumber.pop();
          this.rules.phonenumber.pop();
          this.rules.phonenumber.push({
            validator: this.checkPhoneNumber,
            trigger: "blur",
          });
        }
        this.rules.zyOrgName.pop();
      }
    },
  },
  created() {
    this.rules.phonenumber.push({
      validator: this.checkPhoneNumber,
      trigger: "blur",
      dbPhonenumber: null,
    });
    this.getOrgUserDeptId();
   
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
    this.getConfigKey("outer_sys_dept_id").then((response) => {
      // 外部系统用户部门id
      this.outerSysDeptId = response.msg;
    });
    this.getConfigKey("wx_common_user_dept_id").then((response) => {
      // 外部系统用户部门id
      this.wxCommonUserDeptId = response.msg;
    });
    //志愿者部门ID
    this.getVolunteerConfig();
  },
  methods: {
    getOrgUserDeptId() {
      this.getConfigKey("org_user_dept_id").then((response) => {
        this.queryParams.deptId = response.msg;
         this.getList();
      });
    },
    //到期提醒按钮操作
    async handleRemindAction() {
      const switchData = await this.getConfigInfo("expire_switch");
      this.expirationRemind.type = Number(switchData.configValue);
      this.switchConfig = switchData;
     /*  if (this.expirationRemind.type == 1) {//开启 */
        const dayData = await this.getConfigInfo("expire_info_day");
        this.expirationRemind.restday = dayData.configValue;
        this.dayConfig= dayData;
    /*   } */
      this.expirationRemind.open = true;
    },
    getConfigInfo(param) {
      return new Promise((resolve, reject) => {
        getConfigKeyObj(param).then((res) => {
          resolve(res.data);
        });
      });
    },
    updateConfigFun(params) {
      return new Promise((resolve, reject) => {
        updateConfig({
          configName:params.configName,
          configId: params.configId,
          configKey:params.configKey,
          configValue:params.configValue,
        }).then((res) => {
          resolve(res);
        });
      });
    },
    //更新过期提醒设置
    updateConfigInfo() {
      if (!this.expirationRemind.type) return;
        if (this.expirationRemind.type == 1) {//开启
          if(this.expirationRemind.restday){
            this.switchConfig.configValue=1;
            const p1=this.updateConfigFun(this.switchConfig);
            this.dayConfig.configValue=this.expirationRemind.restday;
            const p2=this.updateConfigFun(this.dayConfig)
            Promise.all([p1,p2]).then((res) => {
              this.expirationRemind.open = false;
              this.$message.success("到期提醒设置更新成功！");
            });
          }else{
            this.$message.warning("请输入距离到期时间提醒剩余天数！");
          }
      }
      if (this.expirationRemind.type == 2) {//关闭
         this.switchConfig.configValue=2;
         this.updateConfigFun(this.switchConfig).then(res=>{
           this.$message.success("到期提醒设置更新成功！");
          this.expirationRemind.open = false;
        })
      }
    },
    handleBlurDay(val) {
      let today = new Date();
      this.empower.empowerTime = new Date(
        Date.parse(today) + this.empower.dayNum * 1000 * 60 * 60 * 24
      );
    },
    //授权时间切换
    handleChangeEmpowerDate(val) {
      console.log(val);
      if (val == 1 || val == "1") {
        let date=new Date();
        date.setFullYear(date.getFullYear() + 1000);
        this.empower.empowerTime = date;
      }
      if (val == 2 || val == "2") {
        this.handleBlurDay();
      }
      if (val == 3 || val == "3") {
      }
    },
    handleGroupNodeClick(e) {
      console.log(e);
    },
    //批量授权 确定
    submitEmpowerForm() {
      this.$refs["empowerForm"].validate((valid, fields) => {
        if(valid){
         
          if(this.empower.type==2&&!this.empower.dayNum){
            this.$message.warning("请输入有效期天数");
          }else{
            const params={
              deptId:this.empower.groupId,
              dayNum:this.empower.type==2?this.empower.dayNum:null,
              expireTime: formateDate(this.empower.empowerTime,'yyyy-MM-dd')+" "+"23:59:59",
              type:this.empower.type
            }
            console.log(params);
            userExpireRecordBatchAdd(params).then(res=>{
              this.$message.success("批量授权成功");
              this.empower.open=false;
            })
             console.log(this.empower);
          }

        }
      })
    },

    //校验手机号是否被使用
    checkPhoneFun(phonenumber) {
      checkPhone({ phonenumber: phonenumber }).then((res) => {
        /*  console.log(res); */
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
      const obj = {
        pageSize: 0,
        params: { ancestorsLikeAndSelf: this.zyDeptId },
      };
      listDept(obj).then((response) => {
        /*  this.deptOptions = response.data; */
        this.volunteerDeptList = response.data;
        /*    console.log(response.data); */
        this.volunteerDeptOptions = this.handleTree(response.data, "deptId");
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
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const params = {
        ...this.queryParams,
        params: {
          loginDateArr:
            this.dateRange.length > 0
              ? [
                  this.dateRange[0] + " 00:00:00",
                  this.dateRange[1] + " 23:59:59",
                ]
              : null,
        },
      };
      listUserPost(params).then((response) => {
        this.userList = response.rows;
        this.queryParams.total = response.total;
        if (this.userList[0] && this.userList[0].zyUser) {
          this.isVolunteer = true;
        }
        this.loading = false;
      });
    },
    /** 查询责任单位下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data.filter((item) => {
          return item.label == "责任单位用户组" || item.label == "指挥中心";
        });
        /*         this.deptOptions = response.data; */
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node) {
      this.isWxGroup = false;
      this.isVolunteer = false;
      this.isOrgDept = false;
      if (
        data.label == "责任单位用户组" ||
        node.parent.data.label == "责任单位用户组"
      ) {
        this.isOrgDept = true;
      }
      if (data.label == "公众用户组") {
        this.isWxGroup = true;
        this.columns[6].label = "注册时间";
      } else {
        this.columns[6].label = "创建时间";
      }
      if (data.label == "志愿者组") {
        this.isVolunteer = true;
      }
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
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
        userName: null,
        realName: null,
        password: null,
        phonenumber: null,
        sex: "0",
        roleId: null,
        deptId: null,
        zyOrgName: null,
        status: "0",
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.realName = null;
      this.queryParams.deptId = null;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        case "unbind":
          this.unbind(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加人员";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);

        const phoneValidateObj =
          this.rules.phonenumber[this.rules.phonenumber.length - 1];
        phoneValidateObj.dbPhonenumber = this.form.phonenumber;

        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    unbind: function (row) {
      // 解绑微信openid
      this.$confirm("此操作不可撤回", "确认解绑吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          return unbind(row.userId);
        })
        .then((res) => {
          if (res.code === 200) {
            row.openId = null;
            this.$modal.msgSuccess("解绑成功");
          }
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.isVolunteer) {
        this.$refs["form"].validate((valid, fields) => {
          let flag = false;
          if (Object.keys(fields)[0] === "phonenumber") {
            flag = true;
          }
          if (valid || flag) {
            if (this.form.userId != undefined && valid) {
              updateUser(this.form).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              this.form.userName = this.form.phonenumber;
              if (flag) {
                checkPhone({ phonenumber: this.form.phonenumber }).then(
                  (res) => {
                    let that = this;
                    if (res.msg !== "该手机号可以使用" && !res.data) {
                      this.$modal
                        .confirm("该手机号已经存在,是否需要转为志愿者账号?")
                        .then(function () {
                          that.form.params = { trans2ZY: true };
                          addUser(that.form).then((response) => {
                            that.$modal.msgSuccess("转移成功");
                            that.open = false;
                            that.getList();
                          });
                        })
                        .then(() => {
                          //this.$modal.msgSuccess("成功");
                        })
                        .catch(function (e) {
                          /*   console.info(e); */
                          that.$modal.msgError("失败");
                        });
                    }
                  }
                );
              } else {
                addUser(this.form).then((response) => {
                  this.$modal.msgSuccess("转移成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          }
        });
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.userId != undefined) {
              updateUser(this.form).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addUser(this.form).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm("此操作不可撤回", "确认删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.isVolunteer) {
        this.download(
          "system/user/exportZY",
          {
            ...this.queryParams,
          },
          `user_${new Date().getTime()}.xlsx`
        );
      } else {
        this.download(
          "system/user/export",
          {
            ...this.queryParams,
          },
          `user_${new Date().getTime()}.xlsx`
        );
      }
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.open = true;
      if (this.isVolunteer) {
        this.upload.title = "志愿者用户导入";
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/system/user/importDataZY";
        this.upload.updateSupportInfo =
          "是否更新已经存在的用户数据(按手机号更新)";
      } else {
        this.upload.title = "用户导入";
        this.upload.url =
          process.env.VUE_APP_BASE_API + "/system/user/importData";
        this.upload.updateSupportInfo = "是否更新已经存在的用户数据";
      }
    },
    /** 下载模板操作 */
    importTemplate() {
      if (this.isVolunteer) {
        this.download(
          "system/user/importTemplateZY",
          {},
          `zy_user_template_${new Date().getTime()}.xlsx`
        );
      } else {
        this.download(
          "system/user/importTemplate",
          {},
          `user_template_${new Date().getTime()}.xlsx`
        );
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
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
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleInfo(row) {
      this.$router.push({
        path: "/system/user/detail",
        query: { id: row.userId },
      });
    },
    //索引
    indexMethod(index) {
      return (
        index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      );
    },
    //
  },
};
</script>
<style>
.numInp .el-input__inner{
 padding-right: 0;
}
.vue-treeselect--single .vue-treeselect__input{
  height: 100%;
  line-height: 100%;
}
.vue-treeselect--has-value .vue-treeselect__input{
  vertical-align: middle;
    
}
</style>
<style lang="scss" scoped>
.formInput {
  width: 155px;
}

</style>
<style lang="scss">
.userDialog {
  .el-dialog__body {
    padding: 0 36px !important;
  }
}

.el-form--label-top .radio-item {
  margin-bottom: 0;
}

.el-form--label-top .radio-item .el-form-item__label {
  float: left;
  margin-right: 10px;
}
</style>
