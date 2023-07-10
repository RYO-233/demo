<template>
  <div class="">
    <el-dialog :title="params.registerType==1?'立案':'不立案'" :visible.sync="dialogTableVisible">
    <el-form :model="form" v-if="params.registerType==1">
      <el-form-item label="处理单位">
        <treeselect
          v-model="form.handleOrgId"
          :normalizer="orgNormalizer"
          :options="orgOptions"
          :show-count="true"
          :disable-branch-nodes="true"
          placeholder="请选择处理单位"
        />
      </el-form-item>
      <el-form-item label="处理人">
        <el-input
          v-model="form.handleUserNames"
          placeholder="请选择处理人员"
          clearable
          @click.native="showUserSel"
        />
      </el-form-item>
      <el-form-item label="责任单位" required>
          <treeselect
            v-model="form.organizationId"
            :normalizer="orgNormalizer"
            :options="orgOptions"
            :show-count="true"
            :disable-branch-nodes="true"
            placeholder="请选择责任单位"
          />
        </el-form-item>
        <el-form-item label="立案条件"  required>
          <el-select
            v-model="form.problemId"
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
    </el-form>
    <el-form :model="form1">
      <el-form-item label="不立案原因">
         <el-input
            v-model="form1.unhandleReason"
            type="textarea"
            placeholder="请输入不立案原因"
            maxlength="500"
            show-word-limit
          />
      </el-form-item>
    </el-form>
     <div slot="footer" class="dialog-footer">
    <el-button @click="handleCancle">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </div>
    </el-dialog>
    <UserListSelTable
      ref="userListSelTable"
      :multiSel="false"
      @confirmCB="userSelConfirmCB"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import UserListSelTable from "@/views/components/user/UserListSelTable";
import { listDept } from "@/api/system/dept";
import { treeListProblemType, listProblemType } from "@/api/srhjjg/problemType";
import {lianSrcase} from "@/api/srhjjg/srcase";
export default {
  props: ["params"],
  components: {Treeselect,UserListSelTable},
  data() {
    return {
        dialogTableVisible:true,
        showUserSelect:false,
         orgOptions: [],
         problemTypeList: [],
        form:{
            id:this.$route.query?.id || null,
            caseStatus:2,
            handleOrgId:null,
            handleUserId:null,
            handleUserNames:null,
            organizationId:null,
            problemId:null
        },
        form1:{
          id:this.$route.query?.id || null,
          unhandleReason:null,
        }
        
    };
  },
  created() {},
  mounted() {
    this.getOrgTreeSelect();
  },
  watch:{
    "params":{
        handler(val){
            console.log(val);
            if(val.problemParentId){
               
                this.problemTypeListFun(val.problemParentId);
            }
           
        },
        deep:true,
        immediate:true
    }
  },
  methods: {
    //取消
    handleCancle(){
        this.$emit('updateModalVisible')
    },
    //确定
    handleConfirm(){
       
        let param={};
        if(params.registerType==1){
         param=this.form;
        }else{
            param=this.form1
        }
      lianSrcase(param).then(res=>{
        console.log(res);
        if(res.code==200){
             this.$emit("refreshData");
            this.$emit('updateModalVisible')
        }
      })
    },
    //获取组织结构树
    getOrgTreeSelect() {
      listDept({ pageSize: 0 }).then((response) => {
        this.orgOptions = this.handleTree(response.data, "deptId");
      });
    },
    //立案条件
    async problemTypeListFun(parentId) {
      let res = await listProblemType({
        pageNum: 1,
        pageSize: 100,
        parentId: parentId,
      });
      this.problemTypeList = res.data || [];
    },
    //选择用户弹框
     showUserSel(e) {
      if (e.target.tagName === "I") {
        this.form.handleUserIds = null;
        this.form.handleUserNames = null;
      } else {
        this.$refs.userListSelTable.show();
      }
    },
    //选择用户  确认
    userSelConfirmCB(data){
        if(Array.isArray(data)){
           this.form.handleUserId = data.map((item) => item.userId);
           this.form.handleUserNames = data.map((item) => item.nickName).join(",");
        }else{
            console.log(data);
           this.form.handleUserId=data.userId;
           this.form.handleUserNames=data.nickName
        }
     
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
  },
};
</script>
<style lang="scss" scoped>
</style>