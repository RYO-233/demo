<template>
  <div class="push-box">
    <div class="head-wrap">
      推送通知
      <div class="actions">
        <el-button type="primary" @click="submitForm">发 送</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
     <blScrollContent >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="110px"
    >
     <div  class="push-user">
      <el-form-item label="选择推送人员" prop="userNum">
          <el-input  v-model.trim="form.userNum" @click.native="changeShowSelectUser"   placeholder="请选择" readonly></el-input >
          <i :class="['selicon','el-icon-arrow-down',{'active':showSelectUser}]" ></i>
      </el-form-item>
      <personTree v-show="showSelectUser" @UpdateToData="UpdateToData" class="user-tree"></personTree>
      </div>
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title" placeholder="请输入标题" maxlength="20" />
      </el-form-item>
      <el-form-item label="通知内容" prop="content">
        <!--          <editor v-model="form.content" :min-height="192" /> -->
        <el-input
          type="textarea"
          maxlength="300"
          show-word-limit
          :rows="4"
          v-model.trim="form.content"
        ></el-input>
      </el-form-item>
    </el-form>
     </blScrollContent>
  </div>
</template>

<script>
import * as validateForm from "@/utils/validateForm";
import treeTransfer from "el-tree-transfer"; // 引入
import personTree from "@/views/srhjjg/mpNotice/selectUser"
import { deptTreeSelect, listUser } from "@/api/system/user";
import blScrollContent from "@/components/blade/bl-scroll-content";
import {
  addMpNotice,
  updateMpNotice,
  
} from "@/api/srhjjg/mpNotice";
import {addAndSentNotice}  from "@/api/srhjjg/mpNoticePushUser";
export default {
  props: [],
  components: { treeTransfer,personTree,blScrollContent },
  data() {
    return {
      showSelectUser:false,
      defaultExpandKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      userList:[],
      // 表单参数
      form: {
        title: "",
        content: "",
        userNum:"",
        noticePushUsers:[]
      },
      mode: "transfer",
      fromData: [],
      toData: [],
      userListData: [],
      deptOptions: [],
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, message: "通知内容为空", trigger: "blur" }],
        postTime: [],
        userNum:[{ required: true, message: "请选择推送人员", trigger: "blur" },{ required: true, message: "请选择推送人员", trigger: "change" }],
       /*  pushNum: [
          { validator: validateForm.validateIsNumber, trigger: "blur" },
        ],
        pushSuccessNum: [
          { validator: validateForm.validateIsNumber, trigger: "blur" },
        ],
        pushFailNum: [
          { validator: validateForm.validateIsNumber, trigger: "blur" },
        ], */
      },
    };
  },
  created() {
    /* this.getDeptTree(); */
  },
  mounted() {},
  methods: {
    
    changeShowSelectUser(){
        this.showSelectUser=!this.showSelectUser
    },
    UpdateToData(data,selectedUsers){
      this.form.noticePushUsers=selectedUsers;
      let noticePushUsers= this.form.noticePushUsers;
      if(this.form.noticePushUsers.length>0){
          this.form.userNum="已选择"+noticePushUsers.length+"人";
      }else{
         this.form.userNum="";
      }
    },

    handleAddBtn(data){
        console.log(data);
        if(data.length>0){
            this.form.userNum="已选择"+data.length+"人";
            let newArr=data.map(item=>{
              return {userId:item.userId}
            })
            this.form.noticePushUsers=newArr;
        }else{
            this.form.userNum="";
            this.form.noticePushUsers={}
        }

    },
 
    /** 查询责任单位下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((res) => {
        /*  this.fromData = response.data; */
        this.deptOptions = this.recursion(res.data);
      });
    },
    // 筛选节点
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMpNotice(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.$router.go(-1);
            });
          } else {
            const obj={
              title:this.form.title,
              content:this.form.content,
              noticePushUsers:this.form.noticePushUsers,

            }
            addAndSentNotice(obj).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$router.go(-1);
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
        this.$router.go(-1);
     /*  this.reset(); */
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        content: null,
        postUserId: null,
        postTime: null,
        pushNum: null,
        pushSuccessNum: null,
        pushFailNum: null,
      };
      this.resetForm("form");
    },
  },
};
</script>
<style lang="scss" scoped>
.push-box {
  background: #f9fafc;
  padding: 0 24px;
  height: calc(100vh - 120px);
  .head-wrap {
    font-family: "Microsoft YaHei UI Bold";
    font-weight: 700;
    font-size: 24px;
    text-align: left;
    color: #272d39;
    display: flex;
    justify-content: space-between;
    height: 78px;
    line-height: 78px;
  }
  .el-form {
    display: block;
    min-height: calc(100vh - 200px);
    padding: 24px;
    background: #fff;
    .el-input,
    .el-textarea {
      width: 400px;
    }
  }
  .push-user{
    position: relative;
    .user-tree{
      position: absolute;
      z-index: 999;
    }
    .selicon{
      position: absolute;
      right: 10px;
      z-index: 1;
      top: 12px;
      left: 370px;
    
      &.active{
        transform: rotateX(180deg);
      }
    }
  }
}
</style>