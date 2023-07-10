<template>
  <div class="report">
    <div class="filterQuery">
      <el-form :model="filterForm" ref="queryForm" size="small" :inline="true">
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
        <el-form-item label="手机号">
          <el-input
            v-model="filterForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filterForm.time"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
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
      <div class="countInfo">总注册账号数：{{ registTotalNum }}</div>
    </div>
    <el-table :data="dataList">
      <el-table-column type="index" label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{
            queryParams.pageSize * (queryParams.pageNum - 1) + scope.$index + 1
          }}</span>
        </template></el-table-column
      >
      <el-table-column label="手机号" align="center" prop="手机号" />
      <el-table-column label="反馈数" align="center" prop="反馈数" />
      <el-table-column label="立案数" align="center" prop="立案数" />
      <el-table-column label="未立案数" align="center" prop="未立案数">
        <template slot-scope="scope">
          <span style="color: #ffad29">{{ scope.row.未立案数 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结案数" align="center" prop="结案数">
        <template slot-scope="scope">
          <span style="color: #15cc83">{{ scope.row.结案数 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="initData"
    />
  </div>
</template>

<script>
import { reportAnalysis } from "@/api/analysis";
import { exportExcel } from "@/utils/exportExcel";
export default {
  props: [],
  components: {},
  data() {
    return {
      filterForm: {},
      dataList: [],
      isFilter: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      registTotalNum: 0,
      //
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    query() {
      this.isFilter = true;
      this.initData();
    },
    reset() {
      this.filterForm = {
        phone: "",
        time: "",
      };
      this.isFilter = false;
      this.initData();
    },
    initData() {
      var param = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      if (this.isFilter) {
        param = {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          phone: this.filterForm.phone,
          timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
          timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
        };
      }
      reportAnalysis(param).then((res) => {
        console.log(res, "上报分析");
        this.registTotalNum = res.data.data.registTotalNum;
        this.total = res.data.total;
        this.dataList = res.data.rows;
      });
    },
    onExport() {
      // let fieldKeys = ["手机号", "反馈数", "立案数", "未立案数", "结案数"];
      // let fieldLabels = ["手机号", "反馈数", "立案数", "未立案数", "结案数"];
      // let fileName = "公众上报分析";

      // exportExcel(this.dataList, fieldLabels, fieldKeys, fileName);
      this.download(
        "srhjjg/chart/userReport/export",
        {
          phone: this.filterForm.phone,
          timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
          timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
        },
        `公众上报分析_${new Date().getTime()}.xlsx`
      );
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.report {
  padding: 24px;
  background: #fff;
  .filterQuery {
    display: flex;
    justify-content: space-between;
    .countInfo {
      font-family: "Microsoft YaHei UI";
      font-weight: 400;
      font-size: 16px;
      line-height: 32px;
      color: #5f6677;
      border: 1px solid #00000000;
    }
  }
  .formInput {
    width: 106px;
  }
  .tip {
    height: 100px;
    border-radius: 4px;
    background: #f9fafc;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: "Microsoft YaHei UI";
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
    color: #99a1b4;
    padding-left: 24px;
  }
  .block {
    margin-top: 24px;
    height: 500px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px #272d391a;
    .title {
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 24px;
      color: #272d39;
      padding-top: 18px;
      margin-left: 24px;
    }
    .rateChart {
      height: 95%;
    }
  }
}
</style>
