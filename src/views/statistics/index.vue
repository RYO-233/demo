<template>
  <div class="statistics">
    <iframe ref="mapiframe" class="map-wrap" :src="mapSrc + '?time=' + timeTamp + '&token=' + token"></iframe>
    <div class="top">
      <div class="left">
        <img src="@/assets/images/statistics/logo.png" /><span>
          {{ currentDateTime }}</span>
      </div>
      <div class="center">市容环境监管云平台</div>
      <div class="right">
        <top-nav-action>
          <template #itemAction>
            <router-link to="/srcase">
              <el-dropdown-item class="text">管理平台</el-dropdown-item>
            </router-link>
          </template>
        </top-nav-action>
      </div>
    </div>
    <div class="main-content">
      <div class="left">
        <div class="part1">
          <div class="tit">各街道结案率</div>
          <div class="tabs">
            <div :class="['tab', { 'active': activeTab == 1 }]" @click="handleChangeBar(1)">镇街责任单位</div>
            <div :class="['tab', { 'active': activeTab == 2 }]" @click="handleChangeBar(2)">区级政企单位</div>
          </div>
          <div class="endPercent-chart-scroll personality">
            <bl-chart type="bar" v-if="caseEndPercentLen > 0" class="bar-chart"
              :style="{ height: caseEndPercentLen * 56 + 'px' }" :option="barOptionData" />
          </div>
        </div>
        <div class="part2">
          <div class="tit">本周案件情况</div>
          <bl-chart type="pie" class="pie-chart" :option="pieOptionData" />
          <div class="dimension">
            <div class="item" v-for="(item, key) in colors" :key="key">
              <div class="dot" :style="{ background: item }"></div>
              {{ key }}
            </div>
          </div>
        </div>
      </div>
      <div class="center" v-if="showNewCase"> <!-- -->
        <div class="new-case">
          <div class="tit"><img src="@/assets/images/statistics/warning.png" />新事件</div>
          <div class="detail">
            <div class="img-box">
              <image-preview :src="newCaseObj.caseImages" class="img" />
            </div>
            <div class="info-box">
              <div class="name" v-if="newCaseObj.problemRoot">
                {{ newCaseObj.problemRoot.name | ellipsis(15) }}
              </div>
              <div class="r">
                <span>上报时间：</span>{{ newCaseObj.fbTime }}
              </div>
              <div class="r pdetail">
                <span>问题描述：</span>
                <div>{{ newCaseObj.caseDetail | ellipsis(50) }}</div>
              </div>
            </div>
          </div>
          <div class="action">
            <div class="btn btn1" @click="handleView(newCaseObj)">立即处理</div>
            <div class="btn btn2" @click="showNewCase = false">忽略</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="tit">待立案事件</div>
        <el-scrollbar class="scroll">
          <div class="caselist-wrap" v-if="caseList && caseList.length > 0">
            <div class="item" v-for="item in caseList" :key="item.id" @click="handleCaseInfo(item)">
              <image-preview :src="item.caseImages" class="img" />
              <!-- <img src="@/assets/images/difficult.png"/> -->
              <div class="info">
                <div class="r"><span>案件编号：</span>{{ item.caseNum }}</div>
                <div class="r"><span>上报时间：</span>{{ item.fbTime }}</div>
                <div class="r">
                  <span>问题类别：</span>
                  <template v-if="item.problemRoot">
                    {{ item.problemRoot.name | ellipsis(15) }}
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pieOption } from "@/views/statistics/chart/pieChartOptions";
import { barOption } from "@/views/statistics/chart/barChartOptions";
import blChart from "@/components/blade/bl-chart";
import {
  districtEndPercent,
  thisWeekCaseNum,
  todoCaseList,
} from "@/api/srhjjg/statistics";
import dayjs from "dayjs";
import Stomp from "stompjs";
import { getToken } from "@/utils/auth";
import topNavAction from "@/layout/components/topNavAction";

export default {
  props: [],
  components: { blChart, topNavAction },
  data() {
    return {
      activeTab: 1,
      showNewCase: false,
      newCaseObj: {},
      caseEndPercentLen: 0,
      currentDateTime: "",
      barOptionData: {},
      pieOptionData: {},
      caseList: [],
      timeTamp: new Date().getTime(),
      token: getToken(),
      mapSrc: process.env.NODE_ENV == 'production' ? 'http://' + location.host + process.env.VUE_APP_MAP_URL + "SRHJJG_Map/" : process.env.VUE_APP_MAP_URL + "/SRHJJG_Map/",
      colors: {
        待立案: "#f2d220",
        未立案: "#ff23bf",
        立案待处理: "#0bea5d",
        待结案: "#1c68f9",
        已结案: "#02eafe",
      },
      redirect: undefined
    };
  },
  watch: {
    /*     $route: {
          handler: function (route) {
            //this.redirect = route.query.redirect + "?" + str;
            this.redirect = route.query && route.query.redirect;
            console.info(this.redirect);
          },
          immediate: true
        } */
  },
  created() {
    /*     const token = this.$route.query?.token || null;
        if (token != null) {
          this.$store.dispatch("LoginSSO", token).then(() => {
            // 刷新页面
            this.$router.push({ path: this.redirect || "/" }).catch(() => { });
          }).catch(() => {
          });
        } else {
          this.$router.push({ path: this.redirect || "/" }).catch(() => { });
        } */
  },
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    /*  this.getCaseList(); */
    this.thisWeekCaseNumFun();
    this.districtEndPercentFun();
    this.timerTask();
    this.connect();
    this.getMapMessage();
  },

  beforeDestroy() {
    this.timed = null;
    clearTimeout(this.timed);
    this.stompClient.disconnect(() => {
      console.log('Disconnected');
    });
  },
  methods: {
    handleChangeBar(org) {
      this.activeTab = org;
      this.districtEndPercentFun(org);

    },
    //获取地图发送的消息
    getMapMessage() {
      //onEnterCaseDetail
      const _this = this;
      window.addEventListener(
        "message",
        function (e) {
          if (e.data && typeof e.data === 'string') {
            console.log("可视化界面接收-------", e);
            const obj = JSON.parse(e.data);
            _this.handleView(obj.content);
          }
          console.log(e);
        },
        false
      );
    },
    //发送消息给iframe地图
    postMessageToMap(obj) {
      console.log("可视化界面发送-------");
      console.log(this.mapSrc, JSON.stringify(obj));
      this.$refs.mapiframe.contentWindow.postMessage(
        JSON.stringify(obj),
        this.mapSrc
      );
    },
    getScoketURL() {
      process.env.VUE_APP_SCOKET_URL;
    },

    connect() {
      const url = process.env.NODE_ENV == 'production' ? 'ws://' + location.hostname + ":8081/sr" : process.env.VUE_APP_SCOKET_URL + "/sr";
      this.socket = new WebSocket(url);
      this.stompClient = Stomp.over(this.socket);
      // 连接 WebSocket 服务器s
      this.stompClient.connect(
        { Authorization: "Bearer " + getToken() },
        () => {
          console.log("Connected");
          // 订阅消息并接收处理
          this.stompClient.subscribe("/topic/todoCaseList", (message) => {
            /*     console.log('Received: ', message.body?JSON.parse(message.body):""); */
            if (message.body) {
              const res = JSON.parse(message.body);
              if (res.code == 200) {
                this.caseList = res.data.rows || [];
              } else if (Object.keys(res).length) {
                this.caseList.unshift(res);
                this.newCaseObj = res;
                this.showNewCase = true;
                /*  this.handleCaseInfo(res); */
              }
            }
          });

          // 发送消息(主动拉取)
          this.stompClient.send("/app/todoCaseList", {});
        }
      );
    },
    timerTask() {
      this.timed = window.setInterval(async () => {
        setTimeout(await this.getCurrentDateTime(), 0);
      }, 1000);
    },
    //获取当前时间
    getCurrentDateTime() {
      let day = "";
      switch (dayjs().day()) {
        case 0:
          day = "日";
          break;
        case 1:
          day = "一";
          break;
        case 2:
          day = "二";
          break;
        case 3:
          day = "三";
          break;
        case 4:
          day = "四";
          break;
        case 5:
          day = "五";
          break;
        case 6:
          day = "六";
          break;

        default:
          break;
      }
      this.currentDateTime = dayjs()
        .format(`YYYY年MM月DD日  星期${day}  HH:mm:ss`)
        .toString();
    },
    //点击待立案案件
    handleCaseInfo(row) {
      const obj = {
        action: "sendCase",
        content: {
          ...row,
        },
      };
      /*    this.newCaseObj = row;
                  this.showNewCase=true; */
      this.postMessageToMap(obj);
    },
    //查看详情
    handleView(row) {
      console.log(row);
      this.$router.push({
        path: "/srcase/detail",
        query: { id: row.id },
      });
    },
    //街道结案率
    districtEndPercentFun(org = 1) {
      districtEndPercent({ org: org }).then((res) => {
        const caseEndPercentData = res.data || {};
        this.caseEndPercentLen = Object.keys(caseEndPercentData).length;
        this.$nextTick(() => {
          this.barOptionData = barOption(caseEndPercentData);
        });
      });
    },
    //本周案件情况
    thisWeekCaseNumFun() {
      thisWeekCaseNum().then((res) => {
        const caseNumData = res.data || {};
        let saveData = [];
        for (let key in caseNumData) {
          let obj = {
            name: key,
            value: caseNumData[key]||0,
            itemStyle: {
              color: this.colors[key],
            },
          };
          saveData.push(obj);
        }
        console.log(saveData);
        this.pieOptionData = pieOption(saveData);
      });
    },

    //待结案列表
    getCaseList() {
      todoCaseList().then((res) => {
        if (res.code == 200) {
          this.caseList = res.data.rows || [];
        }
      });
    },
    logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => { });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/util.scss";

.statistics {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #031936;

  .map-wrap {
    width: 100vw;
    height: 100vh;
    border: none;
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .left,
  .right {
    flex-shrink: 0;
  }

  .top {
    display: flex;
    justify-content: space-between;
    height: vh(97);
    font-size: 18px;
    color: #00f6ff;
    background: url("./../../assets/images/statistics/topbg.png") center no-repeat;
    background-size: 100% vh(97);
    position: relative;
    z-index: 99;

    .left,
    .right {
      width: vw(560);
    }

    .left {
      display: flex;
      padding-top: vh(15);

      img {
        width: vw(150);
        height: vw(24);
        margin-right: vw(20);
        margin-left: vw(15);
      }
    }

    .right {
      height: vh(80);
      line-height: vh(70);
      text-align: right;
      overflow: hidden;
    }

    .center {
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 50px;
      letter-spacing: 0.08px;
      text-align: center;
      color: #fff;
      text-shadow: 0 8px 20px #000d14;
    }
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    padding-top: vh(40);

    .tit {
      font-family: "Microsoft YaHei UI Bold";
      font-weight: 700;
      font-size: 1.4em;
      letter-spacing: 0.05px;
      text-align: left;
      color: #fff;
      text-shadow: 0 3px 4px #00052e;
      height: vh(66);
      line-height: vh(66);
      padding-left: vw(60);
    }

    .left {
      width: vw(380);
      /*  margin-left: vw(15); */
      animation: LeftToRight 1s;
      -webkit-animation: LeftToRight 1s;
      z-index: 99;

      .bar-chart {
        width: vw(328);
        min-height: vh(32);
        margin-left: vw(20);
        overflow: hidden;
      }

      .part1 {
        width: vw(380);
        height: vh(532);
        background: url("./../../assets/images/statistics/bg1.png") top center no-repeat;
        background-size: vw(380) vh(532);
        box-sizing: border-box;
        padding-right: 10px;
      }

      .tabs {
        height: vh(32);
        line-height: vh(32);
        display: flex;
        padding-left: vw(10);
        margin: vw(10) 0 vw(15);

        .tab {
          width: vw(120);
          height: vw(30);
          line-height: vw(30);
          background: url("./../../assets/images/statistics/cbtn1.png") top center no-repeat;
          background-size: cover;
          color: #fff;
          font-size: 14px;
          text-align: center;
          flex-shrink: 0;
          margin-left: 14px;

          &:hover {
            cursor: pointer;
          }
        }

        .active {
          background: url("./../../assets/images/statistics/cbtn2.png") top center no-repeat;
          background-size: cover;
        }
      }

      .endPercent-chart-scroll {
        height: vh(400);
        overflow-y: scroll;
      }

      .pie-chart {
        width: vw(300);
        height: vw(260);
        background: url("./../../assets/images/statistics/piebg.png") vw(30) vw(44) no-repeat;
        background-size: vw(207) vw(120);
      }

      .part2 {
        width: vw(378);
        height: vh(342);
        background: url("./../../assets/images/statistics/bg2.png") top center no-repeat;
        background-size: vw(378) vh(342);
        position: relative;
        margin-top: vh(20);

        .dimension {
          position: absolute;
          top: vh(120);
          right: vw(15);
          z-index: 999;
          color: #fff;
          font-size: 12px;
          line-height: 2em;
        }

        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          box-shadow: 0 0 6px #00f6ff;
          flex-shrink: 0;
          background: #ff0;
        }
      }
    }

    .right {
      width: vw(380);
      height: vh(902);

      background: url("./../../assets/images/statistics/bg3.png") top center no-repeat;
      background-size: vw(380) vh(902);
      overflow: hidden;
      z-index: 99;
      animation: RightToLeft 1s;
      -webkit-animation: RightToLeft 1s;

      .scroll {
        height: vh(800);
      }

      .caselist-wrap {
        font-size: 14px;
        color: #00f6ff;
        margin: 0 vw(25) 0 vw(38);

        span {
          color: #fff;
        }

        .img {
          width: vw(100);
          height: vw(70);
          flex-shrink: 0;
          margin-right: vw(10);
        }

        .item {
          width: 100%;
          display: flex;
          align-items: center;
          line-height: 1.6em;
        }

        .info {
          border-bottom: 1px solid rgba(0, 246, 255, 0.2);
          padding: vh(20) 0;
          flex: 1;

          &:hover {
            cursor: pointer;
          }

          .r {
            white-space: nowrap;
          }
        }
      }
    }

    .center {
      z-index: 9;
      /*  background: #fff; */
      width: 413px;
      height: 246px;
      position: fixed;
      left: 50%;
      bottom: 10%;
      transform: translateX(-50%);

      .new-case {
        width: 413px;
        height: 246px;
        background: url("./../../assets/images/statistics/cbg.png") center no-repeat;
        background-size: 413px 246px;
        color: #fff;
        padding: 20px 30px;
        box-sizing: border-box;
      }

      .detail {
        display: flex;
        font-size: 14px;
      }

      .tit {
        font-family: "Microsoft YaHei UI Bold";
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 0.2px;
        color: #ffbf10;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          margin-right: 5px;

        }
      }

      .img-box {
        width: 102px;
        height: 98px;
        background: url("./../../assets/images/statistics/cimgbg.png") center no-repeat;
        background-size: 102px 98px;
        flex-shrink: 0;
        text-align: center;
        margin-right: 10px;

        .img {
          width: 90px;
          height: 86px;
          margin: 5px auto;
        }
      }

      .info-box {
        .name {
          font-weight: 700;
          letter-spacing: 0.01px;
          line-height: 30px;
          text-align: left;
          color: #ff0;
        }

        .r {
          color: #ffbf10;
          line-height: 1.6em;

          span {
            color: #fff;
            opacity: 0.7;
            flex-shrink: 0;
          }
        }

        .pdetail {
          display: flex;
        }
      }

      .action {
        display: flex;
        justify-content: center;
        margin-top: 6px;

        .btn {
          width: 120px;
          height: 40px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;

          &:hover {
            cursor: pointer;
          }
        }

        .btn1 {
          background: url("./../../assets/images/statistics/cbtn2.png") no-repeat;
          background-size: cover;
        }

        .btn2 {
          background: url("./../../assets/images/statistics/cbtn1.png") center top no-repeat;
          background-size: cover;
        }
      }
    }
  }
}

.no-data {
  color: #fff;
  text-align: center;
  line-height: 80px;
}

@media screen and (max-width: 1600px) {
  .statistics .top .center {
    font-size: 42px;
  }

  .statistics .main-content .left {
    width: 380px;

    .tit {
      padding-left: 55px;
    }

    .part1 {
      width: 380px;
      background-size: 380px vh(532);
    }

    .part2 {
      width: 378px;
      background-size: 378px vh(342);
    }

    .bar-chart {
      width: 328px;
    }

    .pie-chart {
      background: url("./../../assets/images/statistics/piebg.png") 30px 44px no-repeat;
      background-size: 207px 120px;
      width: 300px;
      height: 260px;
    }
  }

  .statistics .main-content .right {
    width: 380px;
    background-size: 380px vh(902);

    .tit {
      padding-left: 55px;
    }

    .caselist-wrap {
      margin-left: 38px;

      .img {
        margin-right: 15px;
        margin-left: 5px;
      }
    }
  }
}

@keyframes LeftToRight {
  0% {
    margin-left: vw(-450);
  }

  100% {
    margin-left: vw(15);
  }
}

@keyframes RightToLeft {
  0% {
    margin-right: vw(-450);
  }

  100% {
    margin-right: vw(15);
  }
}
</style>
