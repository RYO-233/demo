<template>
  <div class="volunteerReport">
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
        <el-form-item label="行政区划">
          <treeselect
            v-model="filterForm.deptIds"
            :options="deptOptions"
            :show-count="false"
            :multiple="true"
            placeholder="请选择"
            class="deptSelect"
            @select="handleSelect"
            @deselect="handleDeselect"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filterForm.time"
            style="width: 240px"
            value-format="yyyy-MM-dd"
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
            size="small"
            @click="query"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- <div class="countInfo">总注册账号数：{{ registTotalNum }}</div> -->
    </div>
    <el-table :data="dataList" id="volunteerTable">
      <el-table-column type="index" label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{
            queryParams.pageSize * (queryParams.pageNum - 1) + scope.$index + 1
          }}</span>
        </template></el-table-column
      >
      <el-table-column label="街道" align="center" prop="街道" />
      <el-table-column label="社区（村）" align="center" prop="社区" />
      <el-table-column label="志愿者单位" align="center" prop="志愿者单位" />
      <el-table-column label="志愿者姓名" align="center" prop="志愿者姓名" />
      <el-table-column label="手机号" align="center" prop="手机号" />
      <el-table-column label="反馈数" align="center" prop="反馈数" />
      <el-table-column label="立案数" align="center" prop="立案数" />
      <el-table-column label="未结案数" align="center" prop="未结案数">
        <!-- <template slot-scope="scope">
          <span style="color: #ffad29">{{ scope.row.未结案数 }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="结案数" align="center" prop="结案数">
        <!-- <template slot-scope="scope">
          <span style="color: #15cc83">{{ scope.row.结案数 }}</span>
        </template> -->
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
import { volunteerAnalysis } from "@/api/analysis";
import { deptTreeSelect } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
export default {
  props: [],
  components: { Treeselect },
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
      deptIdArr: [],
      registTotalNum: 0,
      deptOptions: [],
      //
    };
  },
  created() {},
  mounted() {
    this.getDeptTree();
    this.initData();
  },
  methods: {
    getChildrenID(data, type = "add") {
      if (data) {
        if (data.children && data.children.length > 0) {
          return this.getChildrenID(data.children, type);
        }
        /*  新增或移除多个 */
        if (Array.isArray(data)) {
          if (type == "add") {
            const arr = data.map((item) => {
              return item.id;
            });
            this.deptIdArr = this.deptIdArr.concat(arr);
          }
          if (type == "remove") {
            data.forEach((item) => {
              this.deptIdArr = this.deptIdArr.filter(
                (deptItiem) => deptItiem != item.id
              );
            });

            console.log(this.deptIdArr);
          }
        } else {
          /*  新增或移除单个 */
          if (type == "add") {
            this.deptIdArr.push(data.id);
          }
          if (type == "remove") {
            this.deptIdArr.splice(this.deptIdArr.indexOf(data.id), 1);
          }
        }
      }
    },
    handleSelect(data) {
      console.log("selectedId");
      console.log(data);
      this.getChildrenID(data);
    },
    handleDeselect(data) {
      console.log("unselect");
      console.log(data);
      this.getChildrenID(data, "remove");
    },
    /** 查询责任单位下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data.filter((item) => {
          return item.label == "志愿者组";
        });
      });
    },
    query() {
      this.isFilter = true;
      console.log(this.filterForm.deptIds, "部门信息");
      this.initData();
    },
    reset() {
      this.deptIdArr=[];
      this.filterForm = {
        deptIds: [],
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
          deptIdArr: this.deptIdArr,
          timeStart: this.filterForm.time
            ? this.filterForm.time[0] + " " + "00:00:00"
            : undefined,
          timeEnd: this.filterForm.time
            ? this.filterForm.time[1] + " " + "59:59:59"
            : undefined,
        };
      }
      volunteerAnalysis(param).then((res) => {
        console.log(res, "志愿者上报分析");

        this.total = res.data.total;
        this.dataList = res.data.rows;
      });
    },

    onExport() {
      // let ws = XLSX.utils.table_to_book(
      //   document.querySelector("#volunteerTable")
      // );
      // let wbout = XLSX.write(ws, {
      //   bookType: "xlsx",
      //   bookSST: true,
      //   type: "array",
      // });
      // // 自定义导出文件名
      // let excelname = "志愿者上报分析.xlsx";
      // FileSaver.saveAs(
      //   new Blob([wbout], { type: "application/octet-stream" }),
      //   excelname
      // );
      this.download(
        "srhjjg/chart/zy/export",
        {
          deptIdArr: this.deptIdArr,
          timeStart: this.filterForm.time
            ? this.filterForm.time[0] + " " + "00:00:00"
            : undefined,
          timeEnd: this.filterForm.time
            ? this.filterForm.time[1] + " " + "59:59:59"
            : undefined,
        },
        `志愿者上报分析_${new Date().getTime()}.xlsx`
      );
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.volunteerReport {
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
}
</style>
<style lang="scss">
.volunteerReport {
  .deptSelect {
    .vue-treeselect__control {
      width: 340px;
      height: 32px;
      margin-right: 20px;
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
