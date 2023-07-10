<template>
  <div class="">
    <el-dialog
      title="选择处理人"
      :visible.sync="isVisible"
      width="320px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form inline="true">
          <el-form-item label="">
            <el-input style="width:180px;margin-right:10px" size="small" placeholder="搜索处理人" v-model="filterText" clearable>
            </el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>

        <div class="tit">{{ parentInfo.organizationName }}</div>
        <el-tree
          class="myuserTree"
          :data="data"
          show-checkbox
          node-key="id"
          ref="tree"
          empty-text="暂无数据"
          highlight-current
          :check-strictly="true"
          @check="changeTree"
          @check-change="handelCheckChange"
          :props="defaultProps"
          :filter-node-method="filterNode"
        >
        </el-tree>
        <div class="user" v-if="selUser.realName || selUser.userName">
          已选择{{ selUser.realName || selUser.userName }}为处理人
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept } from "@/api/system/dept";
import { listUser, listUserPost, deptTreeSelect } from "@/api/system/user";
export default {
  props: {
    parentId: String,
    parentInfo: Object,
  },
  components: {},
  data() {
    return {
      selUser: {},
      filterText: "",
      isVisible: true,
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        disabled: "selectable",
      },
    };
  },

  created() {},
  mounted() {},
  destroyed() {
    clearTimeout(this.timmer);
  },
  watch: {
    filterText(val) {
      /* this.$refs.tree.filter(val); */
    },
    parentId: {
      handler(val) {
        this.getOrgTreeSelect();
      },
      immediate: true,
    },
  },
  methods: {
    handleQuery() {
      this.$refs.tree.filter(this.filterText);
    },
    getOrgTreeSelect(val) {
      const _this = this;

      let obj = {
        children: [],
        label: this.parentInfo.organizationName,
        id: this.parentInfo.organizationId,
      };
      listDept({ pageSize: 0, parentId: this.parentId }).then((response) => {
        const newarr = response.data.map((item, index) => {
          item.label = item.deptName;
          item.id = item.deptId;
          item.selectable = true;
          item.disabled = true;
          this.timmer = setTimeout(() => {
            _this.getUserData(item).then((newChild) => {
              _this.$set(item, "children", []);
              item.children = newChild;
            }, 1000 * index);
          });
          return item;
        });
        this.data = newarr;
        console.log(this.data);
      });
    },
    //获取用户数据
    getUserData(params) {
      console.log(params);
      return new Promise(function (resolve, reject) {
        if (params.deptId) {
          listUserPost({ deptId: params.deptId, pageSize: 1000 }).then(
            (res) => {
              if (res.rows && res.rows.length > 0) {
                const newChild = res.rows.map((item) => {
                  return {
                    ...item,
                    label: item.realName || item.nickName,
                    id: item.userId,
                    isUser: true,
                    parentId: item.deptId,
                  };
                });
                resolve(newChild);
              }
            }
          );
        } else {
          resolve([]);
        }
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleCancel() {
      this.$emit("updateUserSelVisible", false);
    },
    confirm() {
      const ids = this.$refs.tree.getCheckedKeys();

      this.$emit("getUserData", ids[0] || null);
    },
    handelCheckChange() {
      /*   */
    },
    /* 实现单选代码 */
    changeTree(node, list) {
      if (list.checkedKeys.length > 1) {
        //单选实现
        console.log(node);
        this.$refs.tree.setCheckedKeys([node.id]);
      }
      const selNodes = this.$refs.tree.getCheckedNodes();
      if (selNodes.length > 0) {
        this.selUser = this.$refs.tree.getCheckedNodes()[0];
      } else {
        this.selUser = {};
      }
    },
  },
};
</script>
<style lang="scss" >
.tit {
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  margin-top: 10px;
  font-weight: 600;
  font-size: 16px;
}
.user {
  padding: 25px 10px 0;
}
.myuserTree .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>