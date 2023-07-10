<template>
  <div class="workday">
    <el-tabs v-model="activeName" class="tabs"  type="card">
    <el-tab-pane label="每日工作时间设置" name="day"></el-tab-pane>
    <el-tab-pane label="节假日设置" name="holiday"></el-tab-pane>
  </el-tabs>
  <div>
    <component :is="activeName"></component>
  </div>
  </div>
</template>

<script>
import day from "@/views/srhjjg/workdaySetting/byday";
import holiday from "@/views/srhjjg/workdaySetting/holiday"
export default {
  props: [],
  components: {day,holiday},
  data() {
   return {
    activeName:"day",
   
   }
  },
  created() {},
  mounted() {},
  methods: {

  },
}
</script>
<style lang="scss" scoped>
.workday{
    padding: 0 24px;
}
.tabs {
    margin-top: 20px;
}

</style>