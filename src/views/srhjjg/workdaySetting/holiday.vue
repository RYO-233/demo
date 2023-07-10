<template>
  <div class="">
    <div class="action">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        >添加</el-button
      >
    </div>
    <bl-table
      :listData="holidayList"
      :queryParams="queryParams"
      :loading="loading"
      @getList="getList"
    >
      <template slot="col">
        <el-table-column
          label="节假日名称"
          align="left"
          prop="holidaysName"
          min-width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="开始时间" align="left" prop="startTime" />
        <el-table-column label="结束时间" align="left" prop="endTime" />
        <el-table-column label="假日类型" align="left">
          <template slot-scope="scope">
            {{ scope.row.holidaysType == 2 ? "节假日调休补班" : "法定节假日" }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="left"
          prop="remark"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="right" prop="name" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </template>
    </bl-table>
    <!-- 新增 修改节假日 -->
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
      v-if="visible"
    >
      <el-form :model="form" label-position="top" ref="form" :rules="rules">
        <el-form-item label="节假日名称" prop="holidaysName">
          <el-input
            v-model.trim="form.holidaysName"
            maxlength="20"
            placeholder="请输入节假日名称"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            @change="handleEndTimeChange"
            v-model="form.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="form.remark"
            type="textarea"
            placeholder="请输入备注"
            maxlength="300"
            show-word-limit
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="假日类型" prop="holidaysType">
          <el-select v-model="form.holidaysType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="bttns">
          <el-button type="primary" size="small" @click="handleSubmit"
            >确定</el-button
          >
          <el-button type="primary" plain size="small" @click="handleCancle"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import blTable from "@/components/blade/bl-table";
import {
  addHoliday,
  holidays,
  holidaysDetail,
} from "@/api/srhjjg/workdaySetting";
export default {
  props: [],
  components: { blTable },
  data() {
    var validateDateCompare = (rule, value, callback) => {
      const start = new Date(this.form.startTime);
      const end = new Date(this.form.endTime);
      if (start - end > 0) {
        callback(new Error("结束时间不能小于开始时间！"));
      } else {
        callback();
      }
    };
    return {
      title: "添加节假日",
      visible: false,
      loading: false,
      holidayList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      options: [
        { label: "法定节假日", value: 1 },
        { label: "节假日调休补班", value: 2 },
      ],
      form: {
        id: null,
        holidaysName: "",
        startTime: "",
        endTime: "",
        remark: "",
        holidaysType: 1,
      },
      rules: {
        holidaysName: [
          { required: true, message: "节假日名称不能为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" },
          { validator: validateDateCompare, trigger: "change" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "change" },
          { validator: validateDateCompare, trigger: "change" },
        ],
        holidaysType: [
          { required: true, message: "假日类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      holidays(this.queryParams).then((res) => {
        if (res.rows && res.rows.length > 0) {
          this.holidayList = res.rows;
          this.queryParams.total = res.total || 0;
        }
      });
    },
    //提交按钮
    handleSubmit() {
      this.addHilidayReq();
    },
    //重置
    handleReset() {
      this.form = {
        id: null,
        holidaysName: "",
        startTime: "",
        endTime: "",
        remark: "",
        holidaysType: 1,
      };
    },
    handleCancle() {
      this.visible = false;
    },
    handleEndTimeChange(val) {
      let dateStr = "";
      if (val) {
        dateStr = val.split(" ")[0] + " " + "23:59:59";
      }
      this.form.endTime = dateStr;
    },
    //添加
    handleAdd() {
      this.title = "添加节假日";
      this.handleReset();
      this.visible = true;
    },
    //新增  编辑请求
    addHilidayReq() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addHoliday(this.form).then((res) => {
            if (res.code == 200) {
              let text = "更新";
              if (this.form.id) {
                text = "编辑";
              } else {
                text = "新增";
              }
              this.$message.success(text + "节假日设置成功！");
              this.getList();
              this.visible = false;
            }
          });
        }
      });
    },
    //修改
    handleEdit(row) {
      this.form = {
        id: row.id,
        holidaysName: row.holidaysName,
        holidaysType: row.holidaysType,
        startTime: row.startTime,
        endTime: row.endTime,
        remark: row.remark,
      };
      this.title = "修改";
      this.visible = true;
    },
    //获取数据
  },
};
</script>
<style lang="scss" scoped>
.action {
  margin-bottom: 15px;
}
.bttns {
  text-align: center;
  .el-button {
    padding-left: 30px;
    padding-right: 30px;
  }
}
.el-date-editor {
  width: 100%;
}
</style>