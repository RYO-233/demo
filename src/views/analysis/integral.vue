<template>
  <div class="summary">
    <div class="summaryInfo">
      <div
        class="summaryItem"
        :class="[item.type == 1 ? 'flexItem' : '']"
        v-for="(item, index) in summaryList"
        :key="index"
        :style="{
          backgroundImage:
            'url(' +
            require('../../assets/images/analysis/integral/bg' +
              index +
              '.png') +
            ')',
        }"
      >
        <div class="single" v-if="item.type == 0">
          <div class="label">
            {{ index == 0 ? "总获取积分" : "总兑换积分" }}
          </div>
          <div class="count">
            {{
              index == 0 ? summaryInfo["总获取积分"] : summaryInfo["总兑换积分"]
            }}
          </div>
        </div>
        <div class="multiple" v-else>
          <div class="integralInfo">
            {{ index == 2 ? "当天获取积分" : "当周获取积分" }}
            <span>
              {{
                index == 2
                  ? summaryInfo["当天获取积分"]
                  : summaryInfo["当周获取积分"]
              }}</span
            >
          </div>
          <div class="integralInfo">
            {{ index == 2 ? "当天兑换积分" : "当周兑换积分" }}
            <span>{{
              index == 2
                ? summaryInfo["当天兑换积分"]
                : summaryInfo["当周兑换积分"]
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tableList">
      <div class="block">
        <div class="title">
          <span>积分获取记录</span>
          <el-button
            type="text"
            icon="el-icon-download"
            size="mini"
            @click="integralExport"
            >下载表格</el-button
          >
        </div>
        <el-table border :data="integralList" ref="integral">
          <el-table-column type="index" width="70" label="序号" align="center">
            <template slot-scope="scope">
              <span>{{
                integralQuery.pageSize * (integralQuery.pageNum - 1) +
                scope.$index +
                1
              }}</span>
            </template></el-table-column
          >
          <el-table-column label="手机号" prop="gotUser.phonenumber" />
          <el-table-column label="获取时间" prop="gotTime" width="160" />
          <el-table-column label="获取积分" prop="score" width="80">
            <template slot-scope="scope">
              <span style="color: #2a8dff">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column label="来源" prop="source">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.score_source"
                :value="scope.row.source"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="integralTotal"
          :page.sync="integralQuery.pageNum"
          :limit.sync="integralQuery.pageSize"
          :pagerCount="3"
          @pagination="integralAnalysis"
        />
      </div>
      <div class="block">
        <div class="title">
          <span>积分兑换记录</span>
          <el-button
            type="text"
            icon="el-icon-download"
            size="mini"
            @click="exchangeExport"
            >下载表格</el-button
          >
        </div>
        <el-table border :data="exchangeList">
          <el-table-column type="index" width="50" label="序号" align="center">
            <template slot-scope="scope">
              <span>{{
                exchangeQuery.pageSize * (exchangeQuery.pageNum - 1) +
                scope.$index +
                1
              }}</span>
            </template></el-table-column
          >
          <el-table-column label="手机号" prop="createByUser.phonenumber" />
          <el-table-column label="兑换时间" prop="exchangeTime" width="160" />
          <el-table-column label="兑换类型" prop="type">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.score_exchange_type"
                :value="scope.row.type"
              />
            </template>
          </el-table-column>
          <el-table-column label="花费积分" prop="score" width="80">
            <template slot-scope="scope">
              <span style="color: #ffad29">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.score_exchange_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="exchangeTotal"
          :page.sync="exchangeQuery.pageNum"
          :limit.sync="exchangeQuery.pageSize"
          :pagerCount="3"
          @pagination="exchangeAnalysis"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  integralSummary,
  integralAnalysis,
  exchangeAnalysis,
} from "@/api/analysis";
export default {
  dicts: ["score_exchange_status", "score_exchange_type", "case_type","score_source"],
  props: [],
  components: {},
  data() {
    return {
      filterForm: {},
      statusList: [],
      summaryList: [
        {
          label: "总获取积分",
          count: 52,
          type: 0,
        },
        {
          label: "总兑换积分",
          count: 21,
          type: 0,
        },
        {
          type: 1,
        },
        {
          type: 1,
        },
      ],
      summaryInfo: {},
      integralTotal: 0,
      integralQuery: { pageNum: 1, pageSize: 10 },
      integralList: [],
      exchangeTotal: 0,
      exchangeQuery: { pageNum: 1, pageSize: 10 },
      exchangeList: [],
      //
    };
  },
  created() {},
  mounted() {
    this.integralSummary();
    this.integralAnalysis();
    this.exchangeAnalysis();
  },
  methods: {
    query() {},
    reset() {},
    integralSummary() {
      integralSummary().then((res) => {
        console.log(res, "积分总览");
        this.summaryInfo = res.data;
      });
    },
    integralAnalysis() {
      integralAnalysis({
        pageNum: this.integralQuery.pageNum,
        pageSize: this.integralQuery.pageSize,
      }).then((res) => {
        console.log(res, "积分获取记录");
        this.integralTotal = res.data.total;
        this.integralList = res.data.rows;
      });
    },
    exchangeAnalysis() {
      exchangeAnalysis({
        pageNum: this.exchangeQuery.pageNum,
        pageSize: this.exchangeQuery.pageSize,
      }).then((res) => {
        console.log(res, "积分兑换记录");
        this.exchangeTotal = res.data.total;
        this.exchangeList = res.data.rows;
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
    getNameByType(type, val) {
      if (val) {
        let dictList = [];

        switch (type) {
          case 0: //积分来源
            dictList = this.dict.type.case_type;
            break;
          case 1: //兑换类型
            dictList = this.dict.type.score_exchange_type;
            break;
          case 2: //状态
            dictList = this.dict.type.score_exchange_status;
            break;
        }
        let dict = dictList.filter((i) => i.value == val);

        if (dict) {
          return dict[0].label;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    integralExport() {
      //根据列表获取导出需要的数据
      let integralList = [];
      this.integralList.forEach((item) => {
        integralList.push({
          phone: item.gotUser ? item.gotUser.phonenumber : "",
          gotTime: item.gotTime,
          score: item.score,
          source: this.getNameByType(0, item.source),
        });
      });
      let fieldKeys = ["phone", "gotTime", "score", "source"];
      let fieldLabels = ["手机号", "获取时间", "获取积分", "来源"];
      let fileName = "积分获取记录";

      this.exportExcel(integralList, fieldLabels, fieldKeys, fileName);
    },
    exchangeExport() {
      //根据列表获取导出需要的数据
      let exchangeList = [];
      this.exchangeList.forEach((item) => {
        exchangeList.push({
          phone: item.createByUser.phonenumber,
          exchangeTime: item.exchangeTime,
          type: this.getNameByType(1, item.type),
          score: item.score,
          status: this.getNameByType(2, item.status),
        });
      });
      let fieldKeys = ["phone", "exchangeTime", "type", "score", "status"];
      let fieldLabels = ["手机号", "兑换时间", "兑换类型", "花费积分", "状态"];
      let fileName = "积分兑换记录";

      this.exportExcel(exchangeList, fieldLabels, fieldKeys, fileName);
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
    justify-content: space-between;
    .summaryItem {
      width: 24%;
      height: 140px;
      filter: drop-shadow(0 2px 6px rgb(153, 161, 180, 0.3));
      background-image: url("../../assets/images/analysis/bg0.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;

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
    .flexItem {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .integralInfo {
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 16px;
      line-height: 32px;
      color: #fff;
      span {
        font-family: "Microsoft YaHei UI Bold";
        font-weight: 700;
        font-size: 30px;
        margin-left: 20px;
      }
    }
  }
  .tableList {
    display: flex;
    justify-content: space-between;
  }
  .block {
    width: 49%;
    margin-top: 24px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px #272d391a;
    padding: 24px;
    .title {
      display: flex;
      justify-content: space-between;
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 24px;
      color: #272d39;
      margin-bottom: 24px;
    }
    .rateChart {
      height: 95%;
    }
  }
}
</style>
