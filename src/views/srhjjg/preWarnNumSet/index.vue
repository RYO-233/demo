<template>
  <div class="app-container">
    <div class="con">
      <div>预警案件数：</div>
      <div class="circle green"></div>
      <div>≤</div>
      <div class="inputDiv">
        <el-input v-model="maxGreenNumObj.configValue" />
      </div>
      <div>&lt;</div>
      <div class="circle yellow"></div>
      <div>≤</div>
      <div class="inputDiv">
        <el-input v-model="maxYellowNumObj.configValue" />
      </div>
      <div>&lt;</div>
      <div class="circle red"></div>
      <div class="btnDiv">
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateConfig,getConfigKeyObj } from "@/api/system/config";

export default {
  name: "PreWarnNumSet",
  components: {
  },
  data() {
    return {
      maxGreenNumObj: null,
      maxYellowNumObj: null
    };
  },
  created() {
    // 绿灯研判案件数,maxGreenNum
    // 黄灯研判案件数,maxYellowNum
    getConfigKeyObj("maxGreenNum").then(response => {
      this.maxGreenNumObj = response.data;
    });
    getConfigKeyObj("maxYellowNum").then(response => {
      this.maxYellowNumObj = response.data;
    });
  },
  activated() {
  },
  methods: {
    save() {
      if(!this.isPositiveInteger(this.maxGreenNumObj.configValue)) {
        this.$modal.msgError("只能输入正整数");
        return;
      }
      if(!this.isPositiveInteger(this.maxYellowNumObj.configValue)) {
        this.$modal.msgError("只能输入正整数");
        return;
      }
      const a = parseInt(this.maxGreenNumObj.configValue);
      const b = parseInt(this.maxYellowNumObj.configValue);
      if(a > 999 || b > 999) {
        this.$modal.msgError("不能大于999");
        return;
      }
      if(a >= b) {
        this.$modal.msgError("最大警告数必须小于最大报警数");
        return;
      }

      updateConfig(this.maxGreenNumObj).then(response => {
        updateConfig(this.maxYellowNumObj).then(response => {
          this.$modal.msgSuccess("修改成功");
        });
      });
    },
    isPositiveInteger(str) {
      // 正则表达式：以数字开头，后面可以跟任意个数字，且不能以 0 开头
      const reg = /^[1-9]\d*$/;
      return reg.test(str);
    }
  }
};
</script>

<style lang="scss" scoped>
.con {
  display: flex;
  flex-direction: row;
  width: 700px;
  align-items: center;
  .inputDiv {
    width: 60px;
  }
  > div {
    margin-right: 15px;
  }
  .btnDiv {
    margin-left: 25px;
  }
}
.circle {
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
  border-radius: 20px;
}
.green {
  background-color: #27ea8f;
}
.yellow {
  background-color: #ffdc22;
}
.red {
  background-color: #ff6d38;
}
</style>
