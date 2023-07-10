<template>
  <div class="seat">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item>
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="onExport"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="queryParams.realName"
            placeholder="请输入人员姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="queryParams.time"
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
            @click="query"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    <bl-table
      :listData="seatList"
      :queryParams="queryParams"
      :loading="loading"
      @getList="getList"
    >
      <template slot="col">
        <el-table-column
          label="姓名"
          align="left"
          prop="姓名"
        />
        <el-table-column
          label="立案数"
          align="left"
          prop="立案数"
        />
        <el-table-column
          label="未立案数"
          align="left"
          prop="未立案数"
        />
        <el-table-column
          label="结案数"
          align="left"
          prop="结案数"
        
        />
        <el-table-column
          label="回退次数"
          align="left"
          prop="回退次数"
        />
      </template>
    </bl-table>
  </div>
</template>

<script>
import blTable from "@/components/blade/bl-table";
import { seatAssessmentAnalysis } from "@/api/analysis";
import {exportExcel} from "@/utils/exportExcel"
export default {
  props: [],
  components: { blTable },
  data() {
    return {
        loading:false,
      queryParams: {
        time:[],
        realName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      seatList: [],
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    onExport() {
      let fieldKeys = ["姓名", "立案数", "未立案数", "结案数", "回退次数"];
      let fieldLabels = ["姓名", "立案数", "未立案数", "结案数", "回退次数"];
      let fileName = "坐席考核分析";
      let dataList=[];
      const params={
        realName: this.queryParams.realName,
        timeStart: (this.queryParams.time&&this.queryParams.time.length)?this.queryParams.time[0]+" "+"00:00:00":"",
        timeEnd:  (this.queryParams.time&&this.queryParams.time.length)?this.queryParams.time[1]+" "+"59:59:59":"",
        pageNum: 1,
        pageSize:0,
       }
      seatAssessmentAnalysis(params).then((res) => {
        if (res.data.rows && res.data.rows.length > 0) {
          dataList = res.data.rows;
        } else {
          dataList = [];
        }
        exportExcel(dataList, fieldLabels, fieldKeys, fileName);
      });
      
    },
    //搜索
    query(){
         this.getList();
    },
    //重置
    reset(){
     this.queryParams= {
        time:[],
        realName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.getList();
    },
    getList() {
       const params={
        realName: this.queryParams.realName,
        timeStart: (this.queryParams.time&&this.queryParams.time.length)?this.queryParams.time[0]+" "+"00:00:00":"",
        timeEnd:  (this.queryParams.time&&this.queryParams.time.length)?this.queryParams.time[1]+" "+"59:59:59":"",
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
       }
      seatAssessmentAnalysis(params).then((res) => {
        if (res.data.rows && res.data.rows.length > 0) {
          this.seatList = res.data.rows;
        } else {
          this.seatList = [];
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.seat{
    padding: 24px;
}
</style>