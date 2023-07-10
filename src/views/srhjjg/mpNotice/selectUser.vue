<template>
  <div class="tree-wrap">
    <tree-transfer
      :title="title"
      :from_data="fromData"
      :to_data="toData"
      pid="parentId"
      :defaultProps="{ label: 'label' }"
      @add-btn="add"
      @remove-btn="remove"
      :mode="mode"
      height="360px"
      filter
    >
    </tree-transfer>
  </div>
</template>

<script>
import treeTransfer from "el-tree-transfer"; // 引入
import {listUser, listUserPost, deptTreeSelect } from "@/api/system/user";

export default {
  data() {
    return {
      mode: "transfer", // transfer addressList
      title: ["未选择", "已选择"],
      fromData: [],
      toData: [],
      selectedUsers:[],
    };
  },
  created() {
    this.getGroupList();
  },
  beforeDestroy(){
    clearTimeout(this.myTimeout);
  },
  methods: {
    //获取全部部门列表
    getGroupList() {
      deptTreeSelect().then((res) => {
        let treeData = res.data;
        let newTree = treeData.filter((item) => {
          return item.label == "志愿者组" || item.label == "公众用户组";
        });
        const tempData = this.recursion(newTree);
        this.fromData = tempData;
      });
    },
    recursion(data) {
      const _this = this;
      if (data instanceof Array && data.length > 0) {
        const newData = data.map((item,index) => {
          if (item.ancestors) {
            let ancesArr = item.ancestors.split(",");
            if(ancesArr.length>=2){
              const pid = ancesArr[ancesArr.length - 2];
              item.parentId = pid;
            }
            
          }
          if (item.children && item.children.length > 0) {
            this.recursion(item.children);
          } else {
            //判断当前节点不是用户节点
            if (!item.isUser && item.id) {
              //获取用户数据  延迟加载
              this.myTimeout=setTimeout(() => {
                _this.getUserData(item).then(newChild=>{
                _this.$set(item, "children", []);
                item.children = newChild;
              });
              }, 2000*index);
              
            }
          }
          return item;
        });
        return newData;
      }
    },
    //获取用户列表
    getUserData(params) {
      return new Promise(function (resolve,reject) {
        if (params.id) {
          listUserPost({ deptId: params.id, pageSize: 1000 }).then((res) => {
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
          });
        }else{
          resolve([])
        }
      });
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      
      this.updateTodate(toData);
    },
    
    // 监听穿梭框组件移除

    remove(fromData, toData, obj) {
        this.updateTodate(toData);
    },
    updateTodate(toData){
        this.selectedUsers=[];
        this.recursionUser(toData);
       this.$emit("UpdateToData", toData,this.selectedUsers);
    },
     recursionUser(data) {
      data.forEach((v) => {
        if ( !v.children || v.children.length == 0) {
          this.selectedUsers.push( {userId:v.userId});
        }else{
          this.recursionUser(v.children);
        }
      });
     },
  },

  components: { treeTransfer }, // 注册
};
</script>
<style lang="scss" scoped>
.tree-wrap {
  width: 680px;
  margin-top: 10px;
  background: #fff;
  border: 1px solid #d8dce6;
  padding: 24px;
}
</style>
<style  lang="scss">
.wl-transfer .transfer-main {
 height: calc(100% - 71px) !important;
}
   
</style>