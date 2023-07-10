<template>
  <div class="summary">
    <blScrollContent>
      <el-form :model="filterForm" ref="queryForm" size="small" :inline="true">
        <!-- <el-form-item label="责任单位" wi>
          <el-select
            v-model="filterForm.org"
            placeholder="请选择"
            class="formInput"
          >
            <el-option :key="1" label="镇街责任单位" :value="1" />
            <el-option :key="2" label="区级政企单位" :value="2" />
          </el-select>
        </el-form-item> -->
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
            v-model="filterForm.status"
            placeholder="请选择"
            clearable
            class="formInput"
          >
            <el-option label="全部" value=" " />
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
      <div class="topInfo">
        <div class="summaryInfo">
          <div
            class="summaryItem"
            v-for="(item, index) in summaryList"
            :key="index"
            :style="{
              backgroundImage:
                'url(' +
                require('../../assets/images/analysis/bg' + index + '.png') +
                ')',
            }"
          >
            <div class="count">
              <div class="label">{{ item.label }}</div>
              {{
                item.label == "结案率" ? item.count + "%" : item.count + "件"
              }}
            </div>
          </div>
        </div>
        <div class="dealRate">
          <div class="title">一体化数字城管案件处置率</div>
          <div class="dealChart" ref="dealRateChart"></div>
        </div>
      </div>

      <div class="block">
        <div class="title">
          部门结案率分析

          <el-select
            v-model="rateChartOrg"
            placeholder="请选择"
            class="formInput"
            @change="handleChangeRateChartOrg"
          >
            <el-option :key="1" label="镇街责任单位" :value="1" />
            <el-option :key="2" label="区级政企单位" :value="2" />
          </el-select>
        </div>
        <div class="rateChart" ref="rateChart"></div>
      </div>
      <div class="block">
        <div class="title">
          部门案件情况
          <el-select
            v-model="caseChartOrg"
            placeholder="请选择"
            class="formInput"
            @change="handleChangeCaseChartOrg"
          >
            <el-option :key="1" label="镇街责任单位" :value="1" />
            <el-option :key="2" label="区级政企单位" :value="2" />
          </el-select>
        </div>
        <div class="rateChart" ref="caseChart"></div>
      </div>
    </blScrollContent>
  </div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";
import {
  getCaseNum,
  getOrgCaseNum,
  getOrgCaseRate,
  getCaseRate,
} from "@/api/analysis";
import { listProblemType } from "@/api/srhjjg/problemType";
import blScrollContent from "@/components/blade/bl-scroll-content";
export default {
  dicts: ["case_type"],
  props: [],
  components: { blScrollContent },
  data() {
    return {
      rateChartOrg: 1,
      caseChartOrg: 1,
      filterForm: { org: 1 },
      typeList: [],
      statusList: [],
      sourceList: [],
      summaryList: [
        {
          label: "立案数",
          count: 52,
        },
        {
          label: "未立案数",
          count: 21,
        },
        {
          label: "结案数",
          count: 36,
        },
        {
          label: "结案率",
          count: 92,
        },
      ],
      isFilter: false, //是否按条件过滤
    };
  },
  created() {},
  mounted() {
    console.log(this.dict.type.case_type, "案件来源");
    this.initDict();
    this.initAllChart();
  },
  methods: {
    initDict() {
      this.getTypeList();
    },
    getTypeList() {
      listProblemType({ level: 0, pageSize: 0 }).then((response) => {
        this.typeList = response.data;
      });
    },
    initAllChart() {
      var param = { org: null };
      if (this.isFilter) {
        param = this.handleGetParams(null);
      }
      this.getCaseNum(param);
      this.getCaseRate(param);
      param.org = 1;
      this.getOrgCaseNum(param);
      this.getOrgCaseRate(param);
    },
    handleGetParams(orgId) {
      const param = {
        org: orgId || null, //责任单位
        caseType: this.filterForm.source, //案件来源
        isPoint:
          this.filterForm.status == " " ? undefined : this.filterForm.status,
        problemRootId: this.filterForm.type,
        timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
        timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
      };
      return param;
    },
    handleChangeRateChartOrg(val) {
      const param = this.handleGetParams(val);
      this.getOrgCaseRate(param);
    },
    handleChangeCaseChartOrg(val) {
      const param = this.handleGetParams(val);

      this.getOrgCaseNum(param);
    },
    getCaseNum(param) {
      getCaseNum(param).then((res) => {
        console.log(res, "案件总览");
        let info = res.data;
        for (var val in info) {
          console.log("数据:" + val + " " + info[val]); //输出如:name
        }
        this.summaryList = [
          {
            label: "立案数",
            count: info["立案数"],
          },
          {
            label: "未立案数",
            count: info["未立案数"],
          },
          {
            label: "结案数",
            count: info["结案数"],
          },
          {
            label: "结案率",
            count: info["结案率"] == "-" ? 0 : info["结案率"],
          },
        ];
      });
    },
    getOrgCaseNum(param) {
      getOrgCaseNum(param).then((res) => {
        console.log(res, "部门案件分析");
        this.initCaseChart(res.data);
      });
    },
    getOrgCaseRate(param) {
      getOrgCaseRate(param).then((res) => {
        console.log(res, "部门结案率");
        this.initChart(res.data);
      });
    },
    getCaseRate(param) {
      getCaseRate(param).then((res) => {
        console.log(res, "处置率");
        this.initDealChart(res.data);
      });
    },
    query() {
      this.isFilter = true;
      this.initAllChart();
    },
    reset() {
      this.filterForm = {
        org: null,
        type: "",
        status: "",
        source: "",
        time: "",
      };
      this.isFilter = false;
      this.initAllChart();
    },
    initChart(info) {
      let orgList = [];
      let rateList = [];

      for (var val in info) {
        orgList.push(val);
        rateList.push((info[val] * 100).toFixed(2));
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.rateChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<div style="display:flex;align-items:center;"><div style="width: 8px;height: 8px;border-radius: 4px;background: linear-gradient(180.00deg, #fba900 0%, #ff5b11 100%);margin-right:6px;"></div>${params[0].seriesName}：${params[0].value}%</div>`
            );
          },
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "24px",
        },
        legend: {
          data: ["结案率"],
          top: "5px",
          right: "60px",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          data: orgList,
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} %",
          },
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            left: "9%",
            bottom: "20px",
            start: 10,
            end: 85, //初始化滚动条
          },
        ],
        series: [
          {
            name: "结案率",
            //data: [84, 56, 92, 78, 86, 90, 89],
            data: rateList,
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
                  formatter: "{c}" + "%",
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
    initCaseChart(info) {
      let orgList = [];
      let caseList = []; //立案数
      let completeList = []; //结案数
      for (var val in info) {
        orgList.push(val);

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
          top: "0px",
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

          data: orgList,
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            left: "9%",
            bottom: "20px",
            start: 10,
            end: 85, //初始化滚动条
          },
        ],
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
    initDealChart(info) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.dealRateChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return (
              `<div style="display:flex;align-items:center;"><div style="width: 8px;height: 8px;border-radius: 4px;background: linear-gradient(180.00deg,` +
              params.color.colorStops[0].color +
              ` 0%, ` +
              params.color.colorStops[1].color +
              ` 100%);margin-right:6px;"></div>${params.name}：${params.value}</div>`
            );
          },
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
          top: "0px",
          right: "24px",
        },
        legend: {
          icon: "circle",
          bottom: "10px",
        },
        series: [
          {
            //startAngle:270, //起始角度
            type: "pie",
            radius: "50%",
            data: [
              {
                value: info.按时结案数,
                name: "按期结案数",
                itemStyle: {
                  normal: {
                    //颜色渐变
                    color: new echarts.graphic.LinearGradient(
                      1,
                      1,
                      1,
                      0, //(上-下 渐变)

                      [
                        { offset: 0, color: "#2a8dff" },

                        { offset: 1, color: "#1eede6" },
                      ]
                    ),
                  },
                },
              },
              {
                value: info.未处置数,
                name: "未处置数",
                itemStyle: {
                  normal: {
                    //颜色渐变
                    color: new echarts.graphic.LinearGradient(
                      1,
                      1,
                      1,
                      0, //(上-下 渐变)

                      [
                        { offset: 0, color: "#29E98F" },

                        { offset: 1, color: "#C5FF21" },
                      ]
                    ),
                  },
                },
              },
              {
                value: info.超时结案数,
                name: "超时结案数",
                itemStyle: {
                  normal: {
                    //颜色渐变
                    color: new echarts.graphic.LinearGradient(
                      1,
                      1,
                      1,
                      0, //(上-下 渐变)
                      [
                        { offset: 0, color: "#FFDA21" },

                        { offset: 1, color: "#FF6B36" },
                      ]
                    ),
                  },
                },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              // formatter: "{b} \n  {d}%", //带当前图例名 + 百分比
              formatter: (params) => {
                if (params.name !== "") {
                  return [
                    "{a| " + params.name + "}",
                    "{b" +
                      params.dataIndex +
                      "|" +
                      (params.percent === undefined ? 0 : params.percent) +
                      "%}",
                  ].join("\n");
                }
                return "";
              },
              rich: {
                a: {
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#99A1B4",
                  lineHeight: 30,
                },
                b0: {
                  fontSize: 24,
                  color: "#2A8DFF",
                },
                b1: {
                  fontSize: 24,
                  color: " #15CC83",
                },
                b2: {
                  fontSize: 24,
                  color: "#FFAD29",
                },
              },
              //修改样式
            },
            labelLine: {
              normal: {
                length: 25, // 修改引导线第一段的长度
                length2: 20, // 修改引导线第二段的长度
                lineStyle: {
                  color: "#D8DCE6", // 修改引导线的颜色
                },
              },
            }, //引导线调整
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
    width: 135px;
  }
  .topInfo {
    display: flex;
    justify-content: space-between;
  }
  .summaryInfo {
    width: 58%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .summaryItem {
      width: 48%;
      height: 200px;
      filter: drop-shadow(0 2px 6px rgb(153, 161, 180, 0.3));
      background-image: url("../../assets/images/analysis/bg0.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain; //关键属性
      display: flex;
      flex-direction: column;
      justify-content: center;

      .label {
        font-family: "Microsoft YaHei UI Bold";
        font-weight: 700;
        font-size: 18px;
        color: #fff;
        margin-left: 36px;
        bottom: 50px;
        position: absolute;
      }
      .count {
        font-family: "Microsoft YaHei Bold";
        font-weight: 700;
        font-size: 48px;
        line-height: 60px;
        text-align: center;
        color: #fff;
        position: relative;
      }
    }
  }
  .dealRate {
    width: 40%;
    //height: 424px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 4px #272d391a;
    .dealChart {
      height: 90%;
    }
  }
  .block {
    margin-top: 24px;
    height: 500px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px #272d391a;

    .rateChart {
      height: 90%;
    }
  }
  .title {
    font-family: "Microsoft YaHei UI Bold";
    font-weight: 700;
    font-size: 24px;
    color: #272d39;
    padding-top: 18px;
    margin-left: 24px;
  }
}
</style>
