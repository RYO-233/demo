<template>
  <div class="assessment">
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
      <el-form-item label="责任单位">
        <el-select
          v-model="filterForm.org"
          placeholder="请选择"
          class="formInput"
        >
          <el-option :key="1" label="镇街责任单位" :value="1" />
          <el-option :key="2" label="区级政企单位" :value="2" />
          <el-option :key="3" label="全部" :value="3" />
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
    <el-table
      :data="dataList"
      :summary-method="getSummaries"
      show-summary
      id="exportTable"
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="处理部门" prop="处理部门" />
      <el-table-column label="立案数" prop="立案数" />
      <el-table-column label="按时待处置数" prop="按时待处置数" width="110" />
      <el-table-column label="按时结案数" prop="按时结案数" width="90" />
      <el-table-column label="按期结案率" prop="按期结案率" width="90" />
      <el-table-column label="结案数" prop="结案数" />
      <el-table-column label="结案率" prop="结案率" />
      <el-table-column label="返工数" prop="返工数" />
      <el-table-column label="返工率" prop="返工率" />
      <el-table-column
        label="按期结案率评分"
        prop="按期结案率评分"
        width="120"
      />
      <el-table-column label="结案率评分" prop="结案率评分" width="90" />
      <el-table-column label="返工率评分" prop="返工率评分" width="90" />
      <el-table-column label="督办评分" prop="督办评分" />
      <el-table-column label="综合评分" prop="综合评分" />
      <!-- <el-table-column label="与上月比较" prop="与上月比较" width="90">
        <template slot-scope="scope">
          <div
            class="compareIcon arrowUp"
            v-if="scope.row.与上月比较 == 1"
          ></div>
          <div
            class="compareIcon arrowDown"
            v-if="scope.row.与上月比较 == -1"
          ></div>
          <div class="compareIcon flat" v-if="scope.row.与上月比较 == 0"></div>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="tip">
      <div>
        *按期结案率=按期结案数/（立案数-按时待处置数）；结案率=结案数/（立案数-按时待处置数）；返工率=返工数/立案数
      </div>
      <div>
        *综合评分=[按期结案率×100×50%+结案率×100×30%+(1-返工率)×100×10%＋(10-督办数×0.5-督办未处理数)]
      </div>
    </div>
  </div>
</template>

<script>
import { assessmentAnalysis } from "@/api/analysis";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listDept } from "@/api/system/dept";
export default {
  props: [],
  components: { Treeselect },
  data() {
    return {
      filterForm: { org: 3 },
      dataList: [],
      isFilter: false,
      orgUserDeptId: null,
      deptOptions: [],
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
        org: 3,
        time: "",
      };
      this.isFilter = false;
      this.initData();
    },
    initData() {
      var param = { org: this.filterForm.org };
      if (this.isFilter) {
        param = {
          org: this.filterForm.org, //责任单位
          timeStart: this.filterForm.time ? this.filterForm.time[0] : undefined,
          timeEnd: this.filterForm.time ? this.filterForm.time[1] : undefined,
          closeScoreRank: true
        };
      }
      assessmentAnalysis(param).then((res) => {
        console.log(res, "考核分析");
        this.dataList = res.data;
      });
    },
    //自定义总计数据
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let rawSum10 = null, rawSum11 = null, rawSum12 = null, rawSum13 = null;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        if (index === 1) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "";
        }
        
        switch (index) {
          case 5: //按期结案率
            var num = (sums[4] / (sums[2] - sums[3])) * 100;
            if (!num == 0) {
              num = num.toFixed(2);
              sums[index] = num + "%";
            } else {
              sums[index] = "0%";
            }
            break;
          case 7: //结案率
            var num = (sums[6] / (sums[2] - sums[3])) * 100;
            if (!num == 0) {
              num = num.toFixed(2);
              sums[index] = num + "%";
            } else {
              sums[index] = "0%";
            }
            break;
          case 9: //返工率
            var num = (sums[8] / sums[2]) * 100;
            if (!num == 0) {
              num = num.toFixed(2);
              sums[index] = num + "%";
            } else {
              sums[index] = "0%";
            }
            break;
          case 10: //按期结案率评分
            var num = (sums[4] / (sums[2] - sums[3])) * 50;
            rawSum10 = num;
            if (!num == 0) {
              sums[index] = num.toFixed(2);
            } else {
              sums[index] = 0;
            }
            break;
          case 11: //结案率评分
            var num = (sums[6] / (sums[2] - sums[3])) * 30;
            rawSum11 = num;
            if (!num == 0) {
              sums[index] = num.toFixed(2);
            } else {
              sums[index] = 0;
            }
            break;
          case 12: //返工率评分
            var num = (1 - sums[8] / sums[2]) * 10;
            rawSum12 = num;
            if (!num == 0) {
              sums[index] = num.toFixed(2);
            } else {
              sums[index] = 0;
            }
            break;
          case 13: //督办评分 (10-督办数×0.5-督办未处理数)
            //获取督办数总和
            let superviseNum = 0;
            let unprocessed = 0;
            for (var item in data) {
              superviseNum = superviseNum + parseInt(data[item].督办数);
              unprocessed = unprocessed + parseInt(data[item].督办未处理数);
            }

            var num = 10 - superviseNum * 0.5 - unprocessed;
            rawSum13 = num;
            if (!num == 0) {
              sums[index] = num.toFixed(2);
            } else {
              sums[index] = 0;
            }
            break;
          case 14: //综合评分
            var num = rawSum10 + rawSum11 + rawSum12 + rawSum13;
            //修复综合评分显示很多位小数问题
            if (!num == 0) {
              sums[index] = num.toFixed(2);
            } else {
              sums[index] = 0;
            }
            break;
          case 15: //与上月比较
            //获取上月评分
            let registered = 0; //获取上月总立案数
            let pendingDeal = 0; //获取上月总按时待处置数
            let scheduleCase = 0; //获取上月按期结案数
            let completeCase = 0; //结案数
            let rework = 0; //返工数
            let superviseCase = 0; //获取上月督办数
            let undealed = 0; //获取上月督办未处理数
            for (var item in data) {
              registered = registered + parseInt(data[item].立案数pre);
              pendingDeal = pendingDeal + parseInt(data[item].按时待处置数pre);
              scheduleCase = scheduleCase + parseInt(data[item].按时结案数pre);
              completeCase = completeCase + parseInt(data[item].结案数pre);
              rework = rework + parseInt(data[item].返工数pre);
              superviseCase = superviseCase + parseInt(data[item].督办数pre);
              undealed = undealed + parseInt(data[item].督办未处理数pre);
            }

            //*按期结案率=按期结案数/（立案数-按时待处置数）；结案率=结案数/（立案数-按时待处置数）；返工率=返工数/立案数
            //*综合评分=[按期结案率×100×50%+结案率×100×30%+(1-返工率)×100×10%＋(10-督办数×0.5-督办未处理数)]
            let completeRate =
              registered - pendingDeal == 0
                ? 0
                : completeCase / (registered - pendingDeal); //结案率
            let scheduleCompleteRate =
              registered - pendingDeal == 0
                ? 0
                : scheduleCase / (registered - pendingDeal); //按期结案率
            let reworkRate = registered == 0 ? 0 : rework / registered; //返工率

            let score =
              scheduleCompleteRate * 50 +
              completeRate * 30 +
              (1 - reworkRate) * 10 +
              (10 - superviseCase * 0.5 - undealed);
            console.log(score, "初始上月评分");
            score = Math.floor(score * 100) / 100; //保留两位小数
            console.log(score, "上月评分", sums[14], "本月评分");

            //比较上月评分与当月评分
            if (score == sums[14]) {
              sums[index] = <div class="compareIcon flat"></div>;
            } else {
              if (score > sums[14]) {
                //下降
                sums[index] = <div class="compareIcon arrowDown"></div>;
              } else {
                sums[index] = <div class="compareIcon arrowUp"></div>;
              }
            }

            break;
        }
      });
      // 有立案数，但没有结案数的返工率评分、督办评分、综合评分直接改为0
      if(sums[2] > 0 && sums[6] === 0) {
        sums[12] = 0;
        sums[13] = 0;
        sums[14] = 0;
      }
      return sums;
    },
    onExport() {
      const tableDom = document.querySelector("#exportTable");
      let ws = XLSX.utils.table_to_book(tableDom);
      const tableRowLength = tableDom.querySelectorAll("tr").length;
      // 立案数 =SUM(C2:C9)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=SUM(C2:C${tableRowLength-1})`}]], { origin: "C" + tableRowLength });
      // 按时待处置数 =SUM(D2:D9)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=SUM(D2:D${tableRowLength-1})`}]], { origin: "D" + tableRowLength });
      // 按时结案数 =SUM(E2:E9)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=SUM(E2:E${tableRowLength-1})`}]], { origin: "E" + tableRowLength });
      // 结案数 =SUM(G2:G9)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=SUM(G2:G${tableRowLength-1})`}]], { origin: "G" + tableRowLength });
      // 返工数 =SUM(I2:I9)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=SUM(I2:I${tableRowLength-1})`}]], { origin: "I" + tableRowLength });
      // 按期结案率 =ROUND(E10/(C10-D10)*100,2)&"%"
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(E${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*100,2)&"%"`}]], { origin: "F" + tableRowLength });
      // 结案率 =ROUND(G10/(C10-D10)*100,2)&"%"
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(G${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*100,2)&"%"`}]], { origin: "H" + tableRowLength });
      // 返工率 =ROUND(I10/C10*100,L92)&"%"
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(I${tableRowLength}/C${tableRowLength}*100,2)&"%"`}]], { origin: "J" + tableRowLength });
      // 按期结案率评分 =ROUND(E10/(C10-D10)*50,2)"
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(E${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*50,2)`}]], { origin: "K" + tableRowLength });
      // 结案率评分 =ROUND(G10/(C10-D10)*30,2)
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(G${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*30,2)`}]], { origin: "L" + tableRowLength });
      // 返工率评分 =(1-I10/C10)*10
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND((1-I${tableRowLength}/C${tableRowLength})*10,2)`}]], { origin: "M" + tableRowLength });
      // 督办评分，需要 督办未处理数，excel里面没有，暂时忽略
      // XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: ``}]], { origin: "N" + tableRowLength });
      // 综合评分 =ROUND(E10/(C10-D10)*50+G10/(C10-D10)*30+(1-I10/C10)*10+N10,2)&"%"
      XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[{t: "n", f: `=ROUND(E${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*50+G${tableRowLength}/(C${tableRowLength}-D${tableRowLength})*30+(1-I${tableRowLength}/C${tableRowLength})*10+N${tableRowLength},2)`}]], { origin: "O" + tableRowLength });
      // 循环把 按期结案率、结案率、返工率 转为百分比
      // 按期结案率 F2-F${tableRowLength-1}
      // 结案率 H2-H${tableRowLength-1}
      // 返工率 J2-J${tableRowLength-1}
      for (let index = 2; index < tableRowLength; index++) {
        XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[this.dataList[index-2].按期结案率]], { origin: "F" + index });
        XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[this.dataList[index-2].结案率]], { origin: "H" + index });
        XLSX.utils.sheet_add_aoa(ws.Sheets.Sheet1, [[this.dataList[index-2].返工率]], { origin: "J" + index });
      }
      let wbout = XLSX.write(ws, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      // 自定义导出文件名
      let excelname = "部门考核分析.xlsx";
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
.assessment {
  padding: 24px;
  background: #fff;
  .formInput {
    width: 136px;
  }
  .compareIcon {
    width: 20px;
    height: 20px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .arrowUp {
    background-image: url("../../assets/images/analysis/arrow-up.png");
  }
  .arrowDown {
    background-image: url("../../assets/images/analysis/arrow-down.png");
  }
  .flat {
    background-image: url("../../assets/images/analysis/flat.png");
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
  }
}
</style>
<style lang="scss">
.assessment {
  .deptSelect {
    .vue-treeselect__control {
      width: 260px;
      height: 32px;
    }
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      line-height: 29px;
    }
  }
  .el-form-item__content {
    line-height: 29px;
  }
}
</style>
