<template>
  <el-dialog title="详细信息" :visible.sync="open" width="800px" append-to-body :before-close="beforeClose">
    <el-descriptions class="margin-top" :column="1" border>
      <el-descriptions-item label="案件编号">{{ viewObj.caseNum }}</el-descriptions-item>
      <el-descriptions-item label="案件类别">
        <dict-tag :options="dict.type.case_type" :value="viewObj.caseType" />
      </el-descriptions-item>
      <el-descriptions-item label="是否为督办案件">
        <dict-tag :options="dict.type.yyt_yes_no" :value="viewObj.isPoint" />
      </el-descriptions-item>
      <el-descriptions-item label="发现时间">{{ viewObj.fbTime }}</el-descriptions-item>
      <el-descriptions-item label="问题类别">{{ viewObj.problemParent ? viewObj.problemParent.name : '' }}</el-descriptions-item>
      <el-descriptions-item label="存在的主要问题">{{ viewObj.problem ? viewObj.problem.name : '' }}</el-descriptions-item>
      <el-descriptions-item label="所属片区">{{ viewObj.district.dictLabel }}</el-descriptions-item>
      <el-descriptions-item label="责任单位">{{ viewObj.organization.deptName }}</el-descriptions-item>
      <el-descriptions-item label="地址（监控点）">{{ viewObj.monitorPoint.name }}</el-descriptions-item>
      <el-descriptions-item label="位置"></el-descriptions-item>
      <el-descriptions-item label="问题图片">
        <image-preview :src="viewObj.caseImages" v-show="viewObj.caseImages" :width="100" :height="100" :imgType="viewObj.caseType === 'grid' ? 'grid':''" />
      </el-descriptions-item>
      <el-descriptions-item label="关联店铺">{{ viewObj.store ? viewObj.store.storeName : '' }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ viewObj.remark }}</el-descriptions-item>
    </el-descriptions>
    <el-divider>处理</el-divider>
    <el-form ref="form" label-width="110px" :model="form" :rules="rules">
      <el-form-item label="短信通知" prop="msgType" required>
        <el-select v-model="form.msgType" placeholder="请选择短信通知">
          <el-option label="不发送短信" value="_default_"></el-option>
          <el-option v-for="dict in dict.type.sms_notice_type" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="群名" prop="groupName" required>
        <el-input v-model="form.groupName" placeholder="请输入群名" clearable />
      </el-form-item> -->
      <el-form-item label="处理人员" prop="handleUserNames" required>
        <el-input v-model="form.handleUserNames" placeholder="请选择处理人员" 
          clearable 
          @click.native="showUserSel"/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm(2)">点击立案</el-button>
      <el-button type="warning" @click="submitForm(1)">删除,不立案</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

    <UserListSelTable ref="userListSelTable" :multiSel=true @confirmCB="userSelConfirmCB"/>
  </el-dialog>
</template>

<script>
import UserListSelTable from "@/views/components/user/UserListSelTable";

export default {
  name: "SrcaseView",
  dicts: ['case_type', 'yyt_yes_no', 'sms_notice_type'],
  components: {
    UserListSelTable
  },
  data() {
    return {
      rules: {
        msgType: [
          { required: true, message: "短信通知不能为空", trigger: "change" },
        ],
        groupName: [
          { required: true, message: "群名不能为空", trigger: "blur" },
        ],
        handleUserNames: [
          { required: true, message: "处理人员不能为空", trigger: "change" },
        ],
      }
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    viewObj: Object,
    form: {
      type: Object,
      default: () => {
        return {
          id: null,
          msgType: "_default_",
          groupName: null,
          handleUserNames: null,
          handleUserIds: null
        }
      },
    },
  },
  methods: {
    beforeClose() {
      this.$emit('update:open', false);
    },
    submitForm(caseStatus) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.caseStatus = caseStatus;
          updateSrcase(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    cancel() {
      this.$emit('update:open', false);
    },
    showUserSel(e) {
      if (e.target.tagName === "I") {
        this.form.handleUserIds = null;  
        this.form.handleUserNames = null;
      } else {
        this.$refs.userListSelTable.show();
      }
    },
    userSelConfirmCB(data) {
      this.form.handleUserIds = data.map(item => item.userId);
      this.form.handleUserNames = data.map(item => item.realName).join(",");
    }
  },
  filters: {
  }
}
</script>
<style scoped></style>
