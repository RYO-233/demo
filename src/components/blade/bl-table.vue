<template>
  <div class="">
    <div class="table-wrap">
      <el-table
        :max-height="maxHeight"
        :row-class-name="tableRowClassName"
        ref="table"
        id="scrollContent"
        v-loading="loading"
        :data="listData"
        @selection-change="handleSelectionChange"
        key="001"
        :border="border"
        tooltip-effect="dark"
      >
         <el-table-column  v-if="selection"  type="selection" width="55" align="center" />
        <el-table-column
          key="c1"
          label="序号"
          type="index"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              queryParams.pageSize * (queryParams.pageNum - 1) +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <slot name="col"></slot>
      </el-table>
    </div>
    <div class="page-wrap">
      <pagination
        v-show="queryParams.total > 0"
        :total="queryParams.total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script>
import { calculateHeight } from "@/utils/calcHeight";
export default {
  props: {
    selection:{
       type:Boolean,
        default:false
    },
    //是否显示table边框
    border:{
        type:Boolean,
        default:false
    },
    //是否显示序号
    showIndex: {
      type: Boolean,
      default: true,
    },
    //列表查询参数，包含分页信息
    queryParams: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 10,
        total:0,
      }),
    },
    //table数据
    listData: {
      type: Array,
      default: () => [],
    },
    //loading
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
        maxHeight: 200,
    };
  },
  watch: {
    listData: {
      handler(val) {
        this.handleResize();
      },
    },
  },
  created() {},
  mounted() {
   window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy(){
     window.removeEventListener("resize",this.handleResize);
  },
  methods: {
    handleResize(){
      this.$nextTick(()=>{
        this.maxHeight = calculateHeight([],100);
      })
    },
    tableRowClassName({ row, rowIndex }) {
     if (row.isPoint == 1) {
        return "activebg";
      } else {
        return "";
      }
      this.$emit("tableRowClassNameAction", { row, rowIndex });
    },
    handleSelectionChange(selection) {
      this.$emit("tableRowClassNameAction", selection);
    },
    //分页切换
    handlePagination(){
        this.$emit('getList');
    },
  },
};
</script>
<style lang="scss" scoped>
</style>