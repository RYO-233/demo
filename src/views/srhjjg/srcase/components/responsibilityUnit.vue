<template>
  <div class="">
    <el-input v-model="inputVal" placeholder="请输入责任单位" class="hide"></el-input>
    <treeselect
      :disabled="disabled"
      v-if="type == 'tree'"
      @select="handleChangeOrganization"
      @input="inputChange"
      v-model="inputValInner"
      :normalizer="orgNormalizer"
      :options="orgOptions"
      :show-count="true"
      :disable-branch-nodes=" level=='responsibility'?true:false"
      placeholder="请选择责任单位"
      noResultsText="无数据"
    />
    <el-select
      v-if="type == 'select'"
      v-model="inputValInner"
      @change="handleChangeOrganization"
      placeholder="请选择责任单位"
    >
      <slot name="opt"></slot>
      <el-option
        v-for="item in orgOptions"
        :key="item.deptId"
        :label="item.deptName"
        :value="item.deptId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { listDept } from "@/api/system/dept";
export default {
  props: {
    inputVal: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "tree",
    },
    level: {
      type: String,
      default: "responsibility",
    },
  },
  components: { Treeselect },
  data() {
    return {
      inputValInner: "",
      orgOptions: [],
      orgUserDeptId: null,
      inputValInner: null,
    };
  },
  watch: {
    inputVal: {
      handler(val) {
        this.inputValInner = val;
        console.log(val);
      },
      immediate: true,
    },
    inputValInner(val) {},
    level: {
      handler() {
        this.$nextTick(() => {
          this.getOrgUserDeptId();
        });
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getOrgUserDeptId() {
      this.getConfigKey("org_user_dept_id").then((response) => {
        this.orgUserDeptId = response.msg;
        this.getOrgTreeSelect();
      });
    },
    //获取tree数据
    getOrgTreeSelect() {
      let params = {};
      if (this.level == "responsibility") {
        params = {
          ancestorsLikeOnlyLevelNext: "0," + this.orgUserDeptId,
        };
      }
      if (this.level == "handleOrg") {
        params = {
          ancestorsLike: "0," + this.orgUserDeptId,
        };
      }
      listDept({ pageSize: 0, params: params }).then((response) => {
        this.orgOptions = this.handleTree(response.data, "deptId");
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
    inputChange(val) {
      this.$emit("changeOrganization", this.inputValInner);
    },
    //编辑转办信息
    handleChangeOrganization(val) {
      /*   console.log(e); */
      /*   this.$emit("changeOrganization",e.deptId||e); */
    },
  },
};
</script>
<style lang="scss" >
.vue-treeselect__single-value .vue-treeselect__input{
  height: 100%;
  line-height: 100%;
   vertical-align: middle;
   display: block;
}
.vue-treeselect--has-value .vue-treeselect__input{
  vertical-align: middle;
    
}
.hide{
  display: none;
}
</style>