<template>
  <div class="caseAnalysis">
    <blScrollContent>
      <el-form :model="filterForm" ref="queryForm" size="small" :inline="true">
        <el-form-item label="案件来源">
          <el-select
            v-model="filterForm.caseType"
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
        <el-form-item label="问题类型">
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
        <el-form-item label="时间" v-show="!startCompare">
          <el-date-picker
            v-model="filterForm.time"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
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
          <el-button
            type="primary"
            size="mini"
            @click="onStartCompare"
            v-if="!startCompare"
            >开启对比</el-button
          >
          <el-button
            type="primary"
            plain
            size="mini"
            @click="cancelCompare"
            v-else
            >取消对比</el-button
          >
        </el-form-item>
      </el-form>
      <div v-if="startCompare" class="compareBtn">
        <el-radio-group v-model="compareActive" size="mini" @input="onChange">
          <el-radio-button label="0">本周VS上周</el-radio-button>
          <el-radio-button label="1">本月VS上月</el-radio-button>
          <el-radio-button label="2">本季VS上季</el-radio-button>
          <el-radio-button label="3">本年VS上年</el-radio-button>
        </el-radio-group>
      </div>
      <div class="mainInfo">
        <div class="block">
          <div class="title">{{ leftTitle }}</div>
          <div class="rateChart" ref="rateChart"></div>
        </div>
        <div class="block" style="position: relative">
          <div class="title">{{ rightTitle }}</div>
          <div class="rateChart" ref="caseChart"></div>
          <div class="compareTitle" v-if="startCompare">
            <div class="subTitle">{{ nowTitle }}</div>
            <div class="subTitle">{{ lastTitle }}</div>
          </div>
        </div>
      </div>
      <div class="block tableInfo">
        <div class="title" style="margin-bottom: 24px">
          <div>
            {{ tableTitle }}
            <el-select
              v-model="caseChartOrg"
              placeholder="请选择"
              class="orgSelect"
              @change="handleChangeCaseChartOrg"
            >
              <el-option :key="1" label="镇街责任单位" :value="1" />
              <el-option :key="2" label="区级政企单位" :value="2" />
            </el-select>
          </div>

          <el-button
            type="text"
            icon="el-icon-download"
            size="mini"
            @click="onExport"
            >导出报表</el-button
          >
        </div>
        <el-table border :data="caseList" max-height="390">
          <template v-for="item in tableList">
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
        </el-table>
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
import {
  areaAnalysisBar,
  areaAnalysisPie,
  areaAnalysisTable,
} from "@/api/analysis";
import blScrollContent from "@/components/blade/bl-scroll-content";
import dayjs from "dayjs";
export default {
  dicts: ["case_type"],
  props: [],
  components: { blScrollContent },
  data() {
    return {
      filterForm: { time: "" },
      typeList: [],
      sourceList: [],
      statusList: [],
      caseList: [],
      tableList: [],
      startCompare: false,
      leftTitle: "最近一月总案件各区域分析",
      rightTitle: "最近一月总案件各区域占比",
      tableTitle: "最近一月总案件详情",
      compareActive: 1,
      compareArr: ["week", "month", "season", "year"],
      titleArr: [
        "本周与上周对比",
        "本月与上月对比",
        "本季与上季对比",
        "本年与上年对比",
      ],
      isShowTooltip: false,
      lastTitle: "上月",
      nowTitle: "本月",
      typeArr: ["周", "月", "季", "年"],
      caseChartOrg: 1,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.initDate();
    this.initDict();
    this.getCount();
  },
  methods: {
    initDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.filterForm.time = [
        dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
      ];
      console.log(start, end, this.filterForm.time);
    },
    onMouseOver(refName) {
      let parentWidth = this.$refs[refName].parentNode.offsetWidth;
      sss;
      let contentWidth = this.$refs[refName].offsetWidth;
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      }
    },

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
      listProblemType({ level: 0, pageSize: 0 }).then((response) => {
        this.typeList = response.data;
      });
    },

    getCount() {
      var param = {};
      if (this.isFilter) {
        param = {
          caseType: this.filterForm.caseType, //案件类别
          problemRootId: this.filterForm.type, //问题类别
          timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
          timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
        };
      }
      if (this.startCompare) {
        param.openCompare = true;
        param.compareType = this.compareArr[this.compareActive];
      }
      areaAnalysisBar(param).then((res) => {
        console.log(res, "统计信息");
        this.initChart(res.data);
      });
      areaAnalysisPie(param).then((res) => {
        console.log(res, "环形图统计信息");

        this.initCaseChart(res.data);
      });

      this.areaAnalysisTable();
    },
    areaAnalysisTable() {
      areaAnalysisTable(
        this.caseChartOrg,
        this.filterForm.time[0],
        this.filterForm.time[1]
      ).then((res) => {
        console.log(res, "表格信息");
        this.caseList = [];
        this.tableList = [];
        let tableInit = false; //是否赋值完成

        for (var val in res.data) {
          let obj = res.data[val];
          obj.责任单位 = val;
          if (!tableInit) {
            this.tableList.push("责任单位");
            for (var info in obj) {
              if (info != "责任单位") {
                this.tableList.push(info);
              }
            }
          }
          tableInit = true;

          this.caseList.push(obj);
        }
        console.log(this.tableList, "table信息", this.caseList);
      });
    },
    query() {
      this.isFilter = true;
      //修改标题信息
      this.leftTitle =
        this.filterForm.time[0].split(" ")[0] +
        "至" +
        this.filterForm.time[1].split(" ")[0] +
        "总案件各区域分析";
      this.rightTitle =
        this.filterForm.time[0].split(" ")[0] +
        "至" +
        this.filterForm.time[1].split(" ")[0] +
        "总案件各区域占比";
      this.tableTitle =
        this.filterForm.time[0].split(" ")[0] +
        "至" +
        this.filterForm.time[1].split(" ")[0] +
        "总案件详情";
      this.getCount();
    },
    reset() {
      this.filterForm = {
        type: "",
        caseType: "",
        time: "",
      };
      this.initDate();
      this.leftTitle = "最近一月总案件各区域分析";
      this.rightTitle = "最近一月总案件各区域占比";
      this.tableTitle = "最近一月总案件详情";
      this.isFilter = false;
      this.getCount();
    },
    onStartCompare() {
      this.startCompare = true;
      this.compareChange();
    },
    cancelCompare() {
      this.startCompare = false;
      this.leftTitle = "最近一月总案件各区域分析";
      this.rightTitle = "最近一月总案件各区域占比";
      this.getCount();
    },
    compareChange() {
      this.leftTitle = this.titleArr[this.compareActive] + " 总案件各区域分析";
      this.rightTitle = this.titleArr[this.compareActive] + " 总案件各区域占比";
      this.getCount();
    },
    //对比项切换
    onChange() {
      this.compareChange();
    },
    initChart(info) {
      let orgList = [];
      let caseList = []; //案件数
      let lastList = []; //上月案件数
      for (var val in info) {
        orgList.push(val);
        caseList.push(info[val].left);

        lastList.push(info[val].right ? info[val].right : 0);
      }
      console.log(lastList, "右侧数据");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.rateChart);

      if (this.startCompare) {
        let typeArr = ["周", "月", "季", "年"];
        myChart.clear();
        myChart.setOption({
          tooltip: {
            trigger: "axis",
          },
          toolbox: {
            feature: {
              magicType: { show: true, type: ["line", "bar"] },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: [
              "上" + typeArr[this.compareActive] + "案件数",
              "本" + typeArr[this.compareActive] + "案件数",
            ],
            top: "5px",
            right: "100px",
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
            name: "件数",
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
              name: "上" + typeArr[this.compareActive] + "案件数",
              data: lastList,
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
                        color: "#2A8DFF", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#3E4AE9", // 100% 处的颜色
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
            {
              name: "本" + typeArr[this.compareActive] + "案件数",
              data: caseList,
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
      } else {
        myChart.clear();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              //获取最近一月时间信息
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

              let nowTime =
                end.getFullYear() +
                "-" +
                (end.getMonth() + 1) +
                "-" +
                end.getDate();
              let lastData =
                start.getFullYear() +
                "-" +
                (start.getMonth() + 1) +
                "-" +
                start.getDate();
              return (
                `${params[0].name}<br/>` +
                `${lastData}至${nowTime}<br/>` +
                `<div style="display:flex;align-items:center;"><div style="width: 8px;height: 8px;border-radius: 4px;background: linear-gradient(180.00deg, #2a8dff 0%, #3e4ae9 100%);margin-right:6px;"></div>${params[0].seriesName}：${params[0].value}</div>`
              );
            },
          },
          toolbox: {
            feature: {
              magicType: {
                show: true,
                type: ["line", "bar"],
                // icon: {
                //   line:"path://M 105.784 71.818 a 3.909 3.909 0 1 0 -3.941 -3.909 A 3.929 3.929 0 0 0 105.784 71.818 Z m 10.972 15.843 l -3.106 -10.8 c -1.239 -4.318 -4.856 -4.18 -4.856 -4.18 h -6.01 v -0.005 h -0.005 s -3.616 -0.138 -4.856 4.18 l -3.106 10.8 a 1.558 1.558 0 0 0 1.138 2.032 a 1.591 1.591 0 0 0 2.016 -1 l 3.016 -10.53 h 0.824 L 96.583 96.383 h 4.925 l 0.005 0.005 V 109.77 a 1.92 1.92 0 0 0 1.936 1.872 a 2.082 2.082 0 0 0 1.931 -1.968 V 96.383 h 0.792 v 13.3 a 2.09 2.09 0 0 0 1.931 1.968 a 1.924 1.924 0 0 0 1.936 -1.872 V 96.4 l 0.005 -0.005 h 4.925 l -5.217 -18.231 h 0.824 l 3.016 10.53 a 1.589 1.589 0 0 0 2.016 1 A 1.561 1.561 0 0 0 116.756 87.661 Z",
                //  // line: "path://M 19469 3357.7 l -6 -6 l 1.412 -1.413 l 4.291 4.288 V 3344 h 2 v 10.588 l 4.3 -4.293 l 1.412 1.413 l -6 6 a 1 1 0 0 1 -1.412 0 Z ",
                //   bar: "path://M8.973,30.977,4.836,26.95,2.229,29.608.819,28.1l3.895-4.276L9.1,28.018l7.222-5.8,1.419,1.767Z  ",
                //   //bar: "path://M 105.784 71.818 a 3.909 3.909 0 1 0 -3.941 -3.909 A 3.929 3.929 0 0 0 105.784 71.818 Z m 10.972 15.843 l -3.106 -10.8 c -1.239 -4.318 -4.856 -4.18 -4.856 -4.18 h -6.01 v -0.005 h -0.005 s -3.616 -0.138 -4.856 4.18 l -3.106 10.8 a 1.558 1.558 0 0 0 1.138 2.032 a 1.591 1.591 0 0 0 2.016 -1 l 3.016 -10.53 h 0.824 L 96.583 96.383 h 4.925 l 0.005 0.005 V 109.77 a 1.92 1.92 0 0 0 1.936 1.872 a 2.082 2.082 0 0 0 1.931 -1.968 V 96.383 h 0.792 v 13.3 a 2.09 2.09 0 0 0 1.931 1.968 a 1.924 1.924 0 0 0 1.936 -1.872 V 96.4 l 0.005 -0.005 h 4.925 l -5.217 -18.231 h 0.824 l 3.016 10.53 a 1.589 1.589 0 0 0 2.016 1 A 1.561 1.561 0 0 0 116.756 87.661 Z",
                // },
              },
              saveAsImage: {
                show: true,
                //icon: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
              },
            },
            emphasis: {
              //触发时
              iconStyle: {
                borderColor: "#2A8DFF", //图形的描边颜色
              },
            },
          },
          legend: {
            data: ["案件件数"],
            top: "5px",
            right: "100px",
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
            name: "件数",
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
              // type: "slider", // slider表示有滑动块的，inside表示内置的
              // show: true, // 是否显示dataZoom，在完全自定义的时候需要用到
              // xAxisIndex: [0], // dataZoom控制的图标的是哪条x轴，因为会有多轴一图，可以控制多轴
              // yAxisIndex: [0, 1], // dataZoom控制的图标的是哪条y轴，因为会有多轴一图，可以控制多轴
              // start: 10, // 和startValue不要弄混，这里是百分比
              // end: 50, // 和endValue不要弄混，这里是百分比
              // startValue: 0, // 滑块左端对应的x值
              // endValue: 500, // 滑块右端对应的x值
              // height: 10, // dataZoom整体高度
              // //filterMode: "none", // 过滤模式，有filter, weakFilter, empty, none四个值，过滤会把整个数据段隐藏，而none则只是移动坐标轴
              // left: 0,
              // right: 0,
              // top: 0,
              // bottom: 0, // dataZoom相对图标的位置

              // throttle: 100, // 设置视图刷新的频率，ms
              // showDetail: false,
              // showDataShadow: false,
              // borderColor: "#0000", // dataZoom边框颜色
              // fillerColor: "#ffffff4c", //  滑块颜色
              // handleSize: "0%",
              // brushSelect: false, // 是否允许拖动滑块长度改变视图范围，不允许就是固定范围
            },
          ],
          series: [
            {
              name: "案件件数",
              data: caseList,
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
                        color: "#2A8DFF", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#3E4AE9", // 100% 处的颜色
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
      }
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    initCaseChart(info) {
      let chartArr = [];
      let rightArr = [];
      for (var val in info) {
        chartArr.push({
          value: info[val].left,
          name: val,
        });
        rightArr.push({
          value: info[val].right,
          name: val,
        });
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.caseChart);
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

      if (this.startCompare) {
        this.nowTitle = "本" + this.typeArr[this.compareActive];
        this.lastTitle = "上" + this.typeArr[this.compareActive];
        series = [
          {
            // 第一环
            type: "pie",
            zlevel: 1,
            silent: true,
            radius: [109, 110],
            center: ["25%", "45%"],
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
            center: ["25%", "45%"],
            radius: [120, 140],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                //formatter: "{d}%" + "\n\r" + "{a|{b}}",
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
            //中间圆环
            type: "pie",
            zlevel: 1,
            silent: true,
            radius: [99, 100],
            center: ["75%", "45%"],
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
            center: ["75%", "45%"],
            radius: [120, 140],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                //formatter: "{{d}?{d}:0}%" + "\n\r" + "{a|{b}}",
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
            data: rightArr,
          },
        ];
      }
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
    /**
     * 导出表格数据到 Excel 文件
     * @param {Array} tableData - 表格数据
     * @param {Array} fieldLabels - 表头组成的数组
     * @param {Array} fieldKeys - 列属性名组成的数组
     * @param {String} fileName - 导出的文件名
     */
    exportExcel(tableData, fieldLabels, fieldKeys, fileName) {
      let dataStr = fieldLabels.toString() + "\r\n";
      tableData.forEach((item, index) => {
        item.Index = index + 1;
        fieldKeys.forEach((key) => {
          // 加引号是为了使换行符在单元格内正常显示
          dataStr += `"${item[key] ? item[key] : ""}"\t,`;
        });
        dataStr += "\r\n";
      });

      // encodeURIComponent 解决中文乱码
      const url =
        "data:text/xls;charset=utf-8,\ufeff" + encodeURIComponent(dataStr);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName + ".xls";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //释放标签
    },
    onExport() {
      let fileName = "案件详情";

      this.exportExcel(this.caseList, this.tableList, this.tableList, fileName);
    },
    handleChangeCaseChartOrg(val) {
      this.areaAnalysisTable();
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
  .orgSelect {
    width: 160px;
    margin-left: 36px;
  }
  .mainInfo {
    display: flex;
    justify-content: space-between;
  }
  .block {
    width: 49%;
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
  .compareTitle {
    position: absolute;
    bottom: 100px;
    display: flex;
    width: 95%;
    justify-content: center;
    .subTitle {
      width: 50%;
      text-align: center;
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 18px;
      color: #272d39;
    }
  }
  .tableInfo {
    width: 100%;
  }
}
</style>
<style lang="scss">
.compareBtn {
  .el-radio-button {
    margin-right: 12px;
  }
  .el-radio-button__inner {
    border: 1px solid #2a8dff;
    border-radius: 4px;
    color: #2a8dff;
    background: #f1f9fe;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #2a8dff;
    border-radius: 4px;
  }
}
</style>
