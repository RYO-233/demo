<template>
  <div class="search-form">
    <el-form :model="form" :inline="true" size="small">
      <div class="row" :style="{'justify-content':justifyContent?justifyContent:'flex-start'}">
        <div :class="itemJustify=='space-between'?'column spaceBetween':'column '" >
          <form-item :form="form" v-on="$listeners" v-bind="$attrs"></form-item>
        </div>

        <div class="column actions">
          <el-button
            size="small"
            type="add"
            @click="updateListDataFun('search')"
            >查询</el-button
          >
          <el-button size="small" type="reset" @click="updateListDataFun()"
            >重置</el-button
          >
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import formItem from "@/components/blade/bl-form-item.vue";
export default {
  props: ["form","justifyContent","itemJustify"],
  components: { formItem },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    //查询
    updateListDataFun(type) {
      if (!type) {
        //重置
        let keys = Object.keys(this.form);
        console.log(keys)
        let saveForm = {};
        keys.forEach((item) => {
          saveForm[item] = null;
        });
        this.$emit("updateform", saveForm, "reset");
      }
      this.$emit("updateListData");
    },
  },
};
</script>
<style lang="less" scoped>
.search-form {
  background: #fff;
  padding: 20px 20px;
  .row{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .spaceBetween{
      display: flex;
      flex: 1;
      justify-content: space-between;
    }
    .actions{
      margin-left: 10px;
    }
  }
}
</style>