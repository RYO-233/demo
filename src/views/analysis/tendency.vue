<template>
  <div class="summary">
    <blScrollContent>
      <el-form :model="filterForm" ref="queryForm" size="small" :inline="true">
        <el-form-item label="问题类别">
          <el-select
            v-model="filterForm.type"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option
              v-for="dict in typeList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否督办">
          <el-select
            v-model="filterForm.isSupervise"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option label="全部" :value="null" />
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="案件来源">
          <el-select
            v-model="filterForm.source"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option
              v-for="dict in dict.type.case_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-select
            v-model="filterForm.timeType"
            placeholder="请选择"
            class="formInput"
            @change="timeTypeChange"
          >
            <el-option :key="0" label="按年分析" value="year" />
            <el-option :key="1" label="按月分析" value="month" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filterForm.year"
            type="year"
            format="yyyy年"
            value-format="yyyy"
            placeholder="请选择"
            v-if="filterForm.timeType == 'year'"
            :clearable="false"
          ></el-date-picker>
          <el-date-picker
            v-model="filterForm.month"
            type="month"
            format="yyyy年M月"
            value-format="yyyy-M"
            placeholder="请选择"
            :clearable="false"
            v-else
          >
          </el-date-picker>
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
      <div class="block">
        <div class="title">{{ title }}</div>
        <div class="rateChart" ref="caseChart"></div>
      </div>
    </blScrollContent>
  </div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";
import { listData } from "@/api/system/dict/data";
import { listProblemType } from "@/api/srhjjg/problemType";
import { trendAnalysis } from "@/api/analysis";
import blScrollContent from "@/components/blade/bl-scroll-content";
export default {
  dicts: ["case_type"],
  props: [],
  components: { blScrollContent },
  data() {
    return {
      filterForm: {
        timeType: "year",
        year: new Date().getFullYear() + "",
        month: new Date().getFullYear() + "-" + (new Date().getMonth() + 1),
      },
      typeList: [],
      sourceList: [],
      isFilter: false,
      time: "",
      title: "",
    };
  },
  created() {},
  mounted() {
    this.title = this.filterForm.year + "年案件情况分析";
    this.initDict();
    this.trendAnalysis();
  },
  methods: {
    initDict() {
      this.getDict();
      this.getTypeList();
    },
    getDict() {
      listData({
        pageNum: 1,
        pageSize: 10,
        dictType: "case_type",
      }).then((res) => {
        this.sourceList = res.rows;
      });
    },
    getTypeList() {
      listProblemType({ level: 0, pageSize: 10 }).then((response) => {
        this.typeList = response.data;
      });
    },
    query() {
      this.isFilter = true;
      this.trendAnalysis();
    },
    reset() {
      this.filterForm = {
        type: "",
        isSupervise: null,
        source: "",
        timeType: "year",
        year: new Date().getFullYear() + "",
        month: "",
      };
      this.isFilter = false;
      this.trendAnalysis();
    },
    timeTypeChange() {
      if (this.filterForm.timeType == "year") {
        this.filterForm.year = new Date().getFullYear() + "";
      } else {
        this.filterForm.month =
          new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
        console.log(this.filterForm.month, "月份");
        //根据月份获取开始时间和结束时间
        // this.time = this.getfirstDateAndlastDate(this.filterForm.month);
      }
    },
    getfirstDateAndlastDate(dateStr) {
      var date = new Date(dateStr);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month > 12) {
        month = 1;
        year++;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var monthLastDay = new Date(year, month, 0).getDate();
      var firstDate = year + "-" + month + "-" + "01" + " 00:00:00";
      var lastDate = year + "-" + month + "-" + monthLastDay + " 23:59:59";
      console.log(firstDate);
      console.log(lastDate);
      return [firstDate, lastDate];
    },
    trendAnalysis() {
      var param = {
        timeType: this.filterForm.timeType,
        year: parseInt(this.filterForm.year), //默认查询当年数据
        month: 1,
      };
      console.log(this.filterForm.time, "选择的月份信息");

      if (this.isFilter) {
        console.log(this.filterForm.isSupervise, "dhdhhdhd");
        param = {
          caseType: this.filterForm.source, //案件类别
          isPoint: this.filterForm.isSupervise!=null
            ? this.filterForm.isSupervise
            : undefined, //是否督办
          problemRootId: this.filterForm.type, //问题类别
          timeType: this.filterForm.timeType,
        };
      }
      if (this.filterForm.timeType == "year") {
        //按年查询
        if (this.filterForm.year) {
          param.year = parseInt(this.filterForm.year);
          param.month = 1;
          this.title = this.filterForm.year + "年案件情况分析";
        } else {
          this.$message.error("请选择时间");
          return;
        }
      } else {
        //根据月份获取开始时间和结束时间
        if (this.filterForm.month) {
          param.year = this.filterForm.month.split("-")[0];
          param.month = this.filterForm.month.split("-")[1];
          this.title =
            this.filterForm.month.split("-")[0] +
            "年" +
            this.filterForm.month.split("-")[1] +
            "月案件情况分析";
        } else {
          this.$message.error("请选择时间");
          return;
        }
      }
      trendAnalysis(param).then((res) => {
        console.log(res, "趋势分析");
        this.initCaseChart(res.data);
      });
    },
    initCaseChart(info) {
      let timeList = [];
      let caseList = []; //立案数
      let completeList = []; //结案数
      for (var val in info) {
        if (this.filterForm.timeType == "year") {
          timeList.push(val + "月");
        } else {
          timeList.push(val);
        }
        caseList.push(info[val].left);
        completeList.push(info[val].right);
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.caseChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            saveAsImage: { show: true },
          },
          right: "24px",
        },
        legend: {
          data: ["立案数", "结案数"],
          top: "5px",
          right: "120px",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: timeList,
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "立案数",
            data: caseList,
            type: "bar",
            barWidth: "10px",
            itemStyle: {
              normal: {
                color: "#2A8DFF",
                barBorderRadius: [5, 5, 0, 0],
              },
            },
          },
          {
            name: "结案数",
            data: completeList,
            type: "bar",
            barWidth: "10px",
            itemStyle: {
              normal: {
                color: "#29E98F",
                barBorderRadius: [5, 5, 0, 0],
              },
            },
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.summary {
  padding: 24px;
  background: #f9fafc;
  .formInput {
    width: 106px;
  }
  .summaryInfo {
    display: flex;

    .summaryItem {
      width: 400px;
      height: 140px;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url("../../assets/images/analysis/bg0.png");
      .label {
        font-family: "Microsoft YaHei UI Bold";
        font-weight: 700;
        font-size: 18px;
        color: #fff;
        margin-top: 24px;
        margin-left: 36px;
      }
      .count {
        font-family: "Microsoft YaHei Bold";
        font-weight: 700;
        font-size: 48px;
        line-height: 60px;
        text-align: center;
        color: #fff;
      }
    }
  }
  .block {
    margin-top: 24px;
    height: 700px;
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
