<template>
  <div class="caseAnalysis">
    <blScrollContent>
      <el-form :model="filterForm" ref="queryForm" size="small" :inline="true">
        <!--  <el-form-item label="案件状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option
              v-for="dict in dict.type.case_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否督办" prop="supervision">
          <el-select
            v-model="filterForm.isSupervise"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option label="全部" value=" " />
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="案件来源" prop="source">
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
          <el-date-picker
            v-model="filterForm.time"
            style="width: 240px"
            value-format="yyyy-MM-dd mm:HH:ss"
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
      <div class="mainInfo">
        <div class="flexChart">
          <div class="block">
            <div class="title">问题分析（部件类）</div>
            <div class="rateChart" ref="partChart"></div>
          </div>
          <div class="block">
            <div class="title">问题分析（事件类）</div>
            <div class="rateChart" ref="caseChart"></div>
          </div>
        </div>
        <div class="block tableInfo">
          <div class="title" style="margin-bottom: 24px">
            案件类型统计
            <el-button
              type="text"
              icon="el-icon-download"
              size="mini"
              @click="onExport"
              >导出报表</el-button
            >
          </div>
          <el-table :data="tableData" style="width: 100%" id="exportTable">
            <el-table-column label="事件" align="center">
              <template v-for="item in caseTypeList">
                <el-table-column :key="item">
                  <template slot="header">
                    <div class="header" :title="item">
                      <span
                        style="
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          display: block;
                        "
                        >{{ item }}</span
                      >
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <span> {{ scope.row[item] }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column label="部件" align="center">
              <template v-for="item in partTypeList">
                <el-table-column :key="item">
                  <template slot="header">
                    <div class="header" :title="item">
                      <span
                        style="
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          display: block;
                        "
                        >{{ item }}</span
                      >
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <span> {{ scope.row[item] }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column label="合计" align="center" prop="total">
            </el-table-column>
          </el-table>
        </div>
        <div class="flexChart">
          <div class="block">
            <div class="title">事件类占比</div>
            <div class="rateChart" ref="caseRate"></div>
          </div>
          <div class="block">
            <div class="title">部件类占比</div>
            <div class="rateChart" ref="partRate"></div>
          </div>
        </div>
      </div>
    </blScrollContent>
  </div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";
import { caseAnalysis } from "@/api/analysis";
import blScrollContent from "@/components/blade/bl-scroll-content";

import FileSaver from "file-saver";
import * as XLSX from "xlsx";
export default {
  dicts: ["case_status", "case_type"],
  props: [],
  components: { blScrollContent },
  data() {
    return {
      filterForm: {},
      statusList: [],
      sourceList: [],
      isFilter: false,
      caseInfo: {},
      partInfo: {},
      caseTypeList: [],
      partTypeList: [],
      tableData: [],
      total: 0,
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let param = {};
      if (this.isFilter) {
        param = {
          caseStatus: this.filterForm.status,
          isPoint:
            this.filterForm.isSupervise == " "
              ? undefined
              : this.filterForm.isSupervise, //是否督办
          caseType: this.filterForm.source, //案件来源
          timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
          timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
        };
      }
      this.partAnalysis(param);
      this.caseAnalysis(param);
      setTimeout(() => {
        this.tableData = [];
        //组合获得表格数据
        var newObj = {};

        Object.assign(newObj, this.caseInfo, this.partInfo);
        console.log(newObj, "组合后");

        //获取合计数量
        this.total = 0;
        for (var val in newObj) {
          this.total = this.total + parseInt(newObj[val]);
        }
        console.log(this.total, "合计");
        newObj.total = this.total;
        this.tableData.push(newObj);
      }, 1000);
    },
    //搜索
    query() {
      this.isFilter = true;

      this.initData();
    },
    //重置
    reset() {
      this.filterForm = {
        status: "",
        isSupervise: "",
        source: "",
        time: "",
      };
      this.isFilter = false;

      this.initData();
    },
    partAnalysis(param) {
      param.rootCatalog = "parts";
      caseAnalysis(param).then((res) => {
        console.log(res, "部件分析");
        this.initPartChart(res.data);
        this.initPartRate(res.data);
        this.partInfo = res.data;
        this.partTypeList = [];
        //初始化表格
        for (var val in res.data) {
          this.partTypeList.push(val);
        }
      });
    },
    initPartChart(info) {
      let typeList = [];
      let countList = [];

      for (var val in info) {
        typeList.push(val);
        countList.push(info[val]);
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.partChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<div style="display:flex;align-items:center;"><div style="width: 8px;height: 8px;border-radius: 4px;background: linear-gradient(180.00deg, #fba900 0%, #ff5b11 100%);margin-right:6px;"></div>${params[0].seriesName}：${params[0].value}</div>`
            );
          },
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "24px",
        },
        legend: {
          data: ["立案数"],
          top: "5px",
          right: "120px",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          data: typeList,
          axisPointer: {
            type: "shadow",
          },
          // axisLabel: {
          //   interval: 0, //代表显示所有x轴标签显示
          //   rotate: 45, //代表逆时针旋转45度
          // },
        },
        yAxis: {
          type: "value",
          name: "件数",
        },
        series: [
          {
            name: "立案数",
            data: countList,
            type: "bar",
            barWidth: "10px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FFDA21", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FF6B36", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                barBorderRadius: [5, 5, 0, 0],
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#5F6677",
                    fontSize: 16,
                  },
                  //   formatter: "{c}" + "%",
                },
              },
            },
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    caseAnalysis(param) {
      param.rootCatalog = "event";
      caseAnalysis(param).then((res) => {
        console.log(res, "事件分析");
        this.initCaseChart(res.data);
        this.initCaseRate(res.data);
        this.caseInfo = res.data;
        //初始化表格
        this.caseTypeList = [];
        for (var val in res.data) {
          this.caseTypeList.push(val);
        }
      });
    },
    initCaseChart(info) {
      let typeList = [];
      let countList = [];
      for (var val in info) {
        typeList.push(val);
        countList.push(info[val]);
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.caseChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<div style="display:flex;align-items:center;"><div style="width: 8px;height: 8px;border-radius: 4px;background: linear-gradient(180.00deg, #fba900 0%, #ff5b11 100%);margin-right:6px;"></div>${params[0].seriesName}：${params[0].value}</div>`
            );
          },
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "24px",
        },
        legend: {
          data: ["立案数"],
          top: "5px",
          right: "120px",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          data: typeList,
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
            data: countList,
            type: "bar",
            barWidth: "10px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FFDA21", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FF6B36", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                barBorderRadius: [5, 5, 0, 0],
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#5F6677",
                    fontSize: 16,
                  },
                  //   formatter: "{c}" + "%",
                },
              },
            },
          },
        ],
      });

      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    initCaseRate(info) {
      let chartArr = [];

      for (var val in info) {
        chartArr.push({
          value: info[val],
          name: val,
        });
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.caseRate);
      myChart.clear();
      let series = [
        {
          // 里面的环
          type: "pie",
          zlevel: 1,
          silent: true,
          radius: [109, 110],
          center: ["50%", "45%"],
          hoverAnimation: false,
          color: "#F0F3F7",
          // animation:false,    //charts3 no
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [1],
        },
        {
          color: [
            "#FF6B36",
            "#29E98F",
            "#FFAD29",
            "#2A8DFF",
            "#3E4AE9",
            "#CC16EF",
            "#DC3333",
            "#1EEDE6",
          ],
          type: "pie",
          center: ["50%", "45%"],
          radius: ["60%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              // formatter: "{d}%" + "\n\r" + "{a|{b}}",
              formatter: (params) => {
                if (params.name !== "") {
                  return (
                    `{value|${
                      params.percent === undefined ? 0 : params.percent
                    }%}` + `\n{a|${params.name}}`
                  );
                }
                return "";
              },
              fontSize: 36,
              color: "#2B2E36",
              fontWeight: "bold",
              lineHeight: 50,
              rich: {
                a: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#636478",
                  fontWeight: "normal",
                },
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: chartArr,
        },
        {
          // 里面的环
          type: "pie",
          zlevel: 1,
          silent: true,
          radius: [179, 180],
          center: ["50%", "45%"],
          hoverAnimation: false,
          color: "#F0F3F7",
          // animation:false,    //charts3 no
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [1],
        },
      ];

      // 绘制图表
      myChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "0",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
          icon: "circle",
        },
        series: series,
      });

      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    initPartRate(info) {
      let chartArr = [];

      for (var val in info) {
        chartArr.push({
          value: info[val],
          name: val,
        });
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.partRate);
      myChart.clear();
      let series = [
        {
          // 里面的环
          type: "pie",
          zlevel: 1,
          silent: true,
          radius: [109, 110],
          center: ["50%", "45%"],
          hoverAnimation: false,
          color: "#F0F3F7",
          // animation:false,    //charts3 no
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [1],
        },
        {
          color: [
            "#FF6B36",
            "#29E98F",
            "#FFAD29",
            "#2A8DFF",
            "#3E4AE9",
            "#CC16EF",
            "#DC3333",
            "#1EEDE6",
          ],
          type: "pie",
          center: ["50%", "45%"],
          radius: ["60%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              // formatter: "{d}%" + "\n\r" + "{a|{b}}",
              formatter: (params) => {
                if (params.name !== "") {
                  return (
                    `{value|${
                      params.percent === undefined ? 0 : params.percent
                    }%}` + `\n{a|${params.name}}`
                  );
                }
                return "";
              },
              fontSize: 36,
              color: "#2B2E36",
              fontWeight: "bold",
              lineHeight: 50,
              rich: {
                a: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#636478",
                  fontWeight: "normal",
                },
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: chartArr,
        },
        {
          // 里面的环
          type: "pie",
          zlevel: 1,
          silent: true,
          radius: [179, 180],
          center: ["50%", "45%"],
          hoverAnimation: false,
          color: "#F0F3F7",
          // animation:false,    //charts3 no
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [1],
        },
      ];

      // 绘制图表
      myChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "0",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
          icon: "circle",
        },
        series: series,
      });

      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //计算获取最后合计行的行号
      var num =
        Object.keys(this.caseInfo).length + Object.keys(this.partInfo).length; // 返回 所有对象属性 的数组
      console.log(num, "合并后长度");

      if (columnIndex === num) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

    onExport() {
      let ws = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      let wbout = XLSX.write(ws, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      // 自定义导出文件名
      let excelname = "数据详情.xlsx";
      FileSaver.saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        excelname
      );
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.caseAnalysis {
  padding: 24px;
  background: #f9fafc;
  .formInput {
    width: 106px;
  }
  .mainInfo {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
  }
  .flexChart {
    display: flex;
    justify-content: space-between;
    .block {
      width: 49%;
    }
  }
  .block {
    margin-top: 24px;
    height: 532px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px #272d391a;
    padding: 24px;
    margin-bottom: 20px;
    .title {
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 24px;
      color: #272d39;
      // padding-top: 18px;
      // margin-left: 24px;
      display: flex;
      justify-content: space-between;
    }
    .rateChart {
      height: 95%;
    }
  }
  .tableInfo {
    height: 292px;
  }
}
</style>
