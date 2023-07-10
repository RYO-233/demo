<template>
  <div class="">
    <blScrollContent :cutClassNames="cutClassNames">
      <el-form :model="form1" label-position="top">
        <div class="tit">夏令时</div>
        <div class="block">
          <el-form-item label="执行时间">
            <el-date-picker
              v-model="form1.executeDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上午上下班">
            <el-time-picker
              is-range
              v-model="form1.amTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="下午上下班">
            <el-time-picker
              is-range
              v-model="form1.pmTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </el-form>
      <el-form :model="form2" label-position="top">
        <div class="tit">冬令时</div>
        <div class="block">
          <el-form-item label="执行时间">
            <el-date-picker
              v-model="form2.executeDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上午上下班">
            <el-time-picker
              is-range
              v-model="form2.amTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="下午上下班">
            <el-time-picker
              is-range
              v-model="form2.pmTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </el-form>
      <el-form :model="form3" label-position="top">
        <div class="tit">工作周期</div>
        <div class="block">
          <el-form-item>
            <el-checkbox-group v-model="form3.workCycles">
              <el-checkbox label="MONDAY" name="type">星期一</el-checkbox>
              <el-checkbox label="TUESDAY" name="type">星期二</el-checkbox>
              <el-checkbox label="WEDNESDAY" name="type">星期三</el-checkbox>
              <el-checkbox label="THURSDAY" name="type">星期四</el-checkbox>
              <el-checkbox label="FRIDAY" name="type">星期五</el-checkbox>
              <el-checkbox label="SATURDAY" name="type">星期六</el-checkbox>
              <el-checkbox label="SUNDAY" name="type">星期日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
    </blScrollContent>
    <div class="buttons">
      <el-button type="primary" size="mini" @click="handleSubmit"
        >提交</el-button
      >
      <el-button type="primary" plain size="mini" @click="handleReset"
        >重置</el-button
      >
    </div>
  </div>
</template>

<script>
import blScrollContent from "@/components/blade/bl-scroll-content";
import { editTimeSet, queryTimeSet } from "@/api/srhjjg/workdaySetting";

export default {
  props: [],
  components: { blScrollContent },
  data() {
    return {
      cutClassNames: ["buttons"],
      form1: {
        timeType: 0,
        executeDate: [],
        amTime: [],
        pmTime: [],
      },
      form2: {
        timeType: 1,
        executeDate: [],
        amTime: [],
        pmTime: [],
      },
      form3: {
        workCycles: [],
      },
    };
  },
  created() {},
  mounted() {
    this.getDataInfo();
  },
  methods: {
    //日期格式处理
    toShortDate(date, time) {
      const arr = date.split(" ") || [];
      let res = "";
      if (arr && arr.length > 0) {
        res = arr[0];
      }
      if (time) {
        res = res + " " + time;
      }
      return res;
    },
    //时间比较
     compareTimeDate(t1,t2){
        var date = new Date();
        var a = t1.split(":");
        var b = t2.split(":");
        return date.setHours(a[0],a[1],a[2]) > date.setHours(b[0],b[1],b[2]);
    },

    //获取详情
    getDataInfo() {
      queryTimeSet().then((res) => {
        if (res.data && res.data.length > 0) {
          const data1 = res.data[0],
            data2 = res.data[1];
          this.form1 = {
            timeType: 1,
            executeDate: [data1.executeStartTime, data1.executeEndTime],
            amTime: [data1.amStartTime, data1.amEndTime],
            pmTime: [data1.pmStartTime, data1.pmEndTime],
          };
          this.form2 = {
            timeType: 2,
            executeDate: [data2.executeStartTime, data2.executeEndTime],
            amTime: [data2.amStartTime, data2.amEndTime],
            pmTime: [data2.pmStartTime, data2.pmEndTime],
          };
          this.form3 = {
            workCycles: data1.workCycle[0].split(","),
          };
        }
      });
    },
    determineTOrF1(name) {
      if (this.form1[name] && this.form1[name].length > 0) {
        return true;
      } else {
        return false;
      }
    },
    determineTOrF2(name) {
      if (this.form2[name] && this.form2[name].length > 0) {
        return true;
      } else {
        return false;
      }
    },
    validDate() {
      if (
        this.form1.amTime &&
        this.form1.amTime.length &&
        this.form2.amTime &&
        this.form2.amTime.length
      ) {
        let start1 = this.form1.amTime[1];
        let end1 = this.form1.pmTime[0];
        let start2 = this.form2.amTime[1];
        let end2 =this.form2.pmTime[0];
        if (this.compareTimeDate(start1,end1)) {
          this.$message.warning("夏令时下午上班时间不能小于上午下班时间！");
          return false;
        }
         if (this.compareTimeDate(start2,end2)) {
          this.$message.warning("冬令时下午上班时间不能小于上午下班时间！");
          return false;
        } 
          return true;
      } else {
        return true;
      }
    },
    //提交
    handleSubmit() {
      let bol = this.validDate();
      if (bol) {
        let timeSetList = [];
        let workCycleStr = this.form3.workCycles + "";
        timeSetList[0] = {
          amEndTime: this.determineTOrF1("amTime")
            ? this.form1.amTime[1]
            : null,
          amStartTime: this.determineTOrF1("amTime")
            ? this.form1.amTime[0]
            : null,
          executeEndTime: this.determineTOrF1("executeDate")
            ? this.toShortDate(this.form1.executeDate[1], "23:59:59")
            : null,
          executeStartTime: this.determineTOrF1("executeDate")
            ? this.form1.executeDate[0]
            : null,
          id: "1",
          pmEndTime: this.determineTOrF1("pmTime")
            ? this.form1.pmTime[1]
            : null,
          pmStartTime: this.determineTOrF1("pmTime")
            ? this.form1.pmTime[0]
            : null,
          timeType: 1,
          workCycles: [workCycleStr],
        };
        timeSetList[1] = {
          amEndTime: this.determineTOrF2("amTime")
            ? this.form2.amTime[1]
            : null,
          amStartTime: this.determineTOrF2("amTime")
            ? this.form2.amTime[0]
            : null,
          executeEndTime: this.determineTOrF2("executeDate")
            ? this.toShortDate(this.form2.executeDate[1], "23:59:59")
            : null,
          executeStartTime: this.determineTOrF2("executeDate")
            ? this.form2.executeDate[0]
            : null,
          id: "2",
          pmEndTime: this.determineTOrF2("pmTime")
            ? this.form2.pmTime[1]
            : null,
          pmStartTime: this.determineTOrF2("pmTime")
            ? this.form2.pmTime[0]
            : null,
          timeType: 2,
          workCycles: [workCycleStr],
        };
        editTimeSet({ timeSetList: timeSetList }).then((res) => {
          if (res.code == 200) {
            this.$message.success("每日工作时间设置成功！");
          }
        });
      }
    },
    //重置
    handleReset() {
      this.form1 = {
        timeType: 0,
        executeDate: [],
        amTime: [],
        pmTime: [],
      };
      this.form2 = {
        timeType: 1,
        executeDate: [],
        amTime: [],
        pmTime: [],
      };
      this.form3 = {
        workCycles: [],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.tit {
  font-family: "Microsoft YaHei UI Bold";
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  color: #5f6677;
  height: 60px;
  line-height: 60px;
}
.block {
  border-bottom: 1px solid #d8dce6;
  margin-bottom: 15px;
}
.block:last-child {
  border: none;
}
.buttons {
  border-top: 1px solid #d8dce6;
  padding-top: 15px;
  .el-button {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>