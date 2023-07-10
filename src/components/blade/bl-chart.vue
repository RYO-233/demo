<template>
  <div class="chart-box">
    <div ref="myChart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";

export default {
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    echarts,
  },
  data() {
    return {};
  },
  watch: {
    option: {
      handler(val) {
        if (val) {
         this.initChart();
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.resizeEcharts);
  },
  beforeDestroy(){
    window.removeEventListener("resize",this.resizeEcharts);
  },
  methods: {
    //图表适配
    resizeEcharts(){
        this.myEcharts.resize()
    },

    initChart() {
      this.$nextTick(() => {
        this.myEcharts = echarts.init(this.$refs.myChart);
        this.myEcharts.setOption(this.option);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chart,
.chart-box {
  width: 100%;
  height: 100%;
}
.chart-box {
  height: 100%;
}
</style>