<template>

  <div class="timeline-wrap" v-if="activities.length > 0">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        type="primary"
      >
        <!-- 案件处理 -->
        <template
          v-if="
            activity.nodeType == 'handle' && !(type == 'edit' && index == 0)
          "
        >
          <div class="row head">
            <span class="blue"
              >
              {{ activity.nodeName }}</span
            >
            {{ activity.nodeTime }}
          </div>
          <div class="row"><span>处理部门：</span>{{ activity.deptName }}</div>
          <div class="row"><span>处理人：</span>{{ activity.userName }}</div>
          <div class="row flex" v-if="activity.text">
            <span>处理情况：</span>
            <div class="desc-wrap">
              {{ activity.text ? activity.text : "无" }}
            </div>
          </div>
          <div class="row flex" v-if="activity.images">
            <span>处理图片：</span>
            <blImageList :imgList="activity.images"></blImageList>
          </div>
        </template>
        <template
       v-if="activity.nodeType == 'handle' && type == 'edit' && index == 0" 
        >
         <div class="row head">
            <span class="blue">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
         <slot name="handleItem" :activity="activity"></slot>
        </template>
        <!-- 案件返工 驳回 -->
        <template v-if="activity.nodeType == 'redirect'">
          <div class="row head">
            <span class="orange">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
          <div class="row flex">
            <span>驳回原因：</span>
            <div class="desc-wrap">
              {{ activity.text ? activity.text : "无" }}
            </div>
          </div>
          <div class="row flex">
              <span>审核人：</span>
              {{ activity.auditUserName}}
            </div>
        </template>
        <!-- 案件分配 -->
        <template v-if="activity.nodeType == 'dispatch'">
          <div class="row head">
            <span class="blue">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
          <template v-if="type == 'edit' && index == 0">
           <slot name="dispatchItem" :activity="activity"></slot>
          </template>
          <template v-else>
            <div class="row flex">
              <span>立案人：</span>
              {{ activity.receiverName }}
            </div>
            <div class="row flex" v-if="activity.organizationName">
              <span>责任单位：</span>
              {{ activity.organizationName }}
            </div>
            <div class="row flex" v-if="activity.dispatchUserName">
              <span>责任人：</span>
              {{ activity.dispatchUserName }}
            </div>
             <div class="row flex" v-if="activity.deptName">
              <span>处理部门：</span>
              {{ activity.deptName }}
            </div>
            <div class="row flex" v-if="activity.userName">
              <span>处理人：</span>
              {{ activity.userName }}
            </div>
          </template>
        </template>
        <!-- 案件回退(原转办) -->
        <template v-if="activity.nodeType == 'switch'">
          <div class="row head">
            <span class="zise">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
          <div class="row flex">
            <span>回退原因：</span>
            <div class="desc-wrap">
              {{ activity.text ? activity.text : "无" }}
            </div>
          </div>
          <div class="row flex">
            <span>责任单位：</span>
            {{ activity.deptName }}
          </div>
          <div class="row flex" >
            <span>责任人：</span>
            {{ activity.userName }}
          </div>
          <div class="row flex" v-if="activity.images&&activity.images.length>0">
            <span>佐证图片：</span>
            <blImageList :imgList="activity.images"></blImageList>
          </div>
        </template>
        <!-- 案件立案 -->
         <template v-if="activity.nodeType == 'start'">
          <div class="row head">
            <span class="blue">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
          <div class="row flex">
              <span>立案人：</span>
              {{ activity.receiverName }}
            </div>
           <div class="row flex">
            <span>责任单位：</span>
            {{ activity.organizationName }}
          </div>
           <!-- <div class="row flex">
            <span>责任人：</span>
            {{ activity.dispatchUserName }}
          </div> -->
         </template>
        <!-- 公众评价  结案评价-->   <!--  -->
         <template v-if="activity.nodeType == 'public'||activity.nodeType == 'end'">
          <div class="row head">
            <span class="blue">{{ activity.nodeName }}</span
            >{{ activity.nodeTime }}
          </div>
         
            <div class="row flex grey">
              <span>评分：</span>
               <el-rate v-model="activity.star" disabled></el-rate>
               <template v-if="activity.star">
                {{activity.star}}分，{{activity.star?commentObj[activity.star]:""}}
               </template>
               
            </div>
          <div class="row flex">
            <span>评价内容：</span>
            <div class="desc-wrap">
              {{ activity.text ? activity.text : "无" }}
            </div>
          </div>
          <div class="row flex" v-if="activity.images&&activity.images.length>0">
            <span>评价图片：</span>
            <blImageList :imgList="activity.images"></blImageList>
          </div>
         </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { srcaseHeadTimeLine } from "@/api/srhjjg/srcase";
import blImageList from "@/components/blade/bl-image-list";
export default {
  props: {
    type: {
      type: String,
      default: "view",
    },
    caseId: {
      type: String,
      default: null,
    },
  },
  components: { blImageList },
  data() {
    return {
      commentObj:{5:'很好',4:'好',3:'一般',2:'差',1:'很差'},
      activities: [],
      form: {},
    };
  },
  watch: {
    caseId: {
      handler(val) {
        if (val) {
          this.getSrcaseHeadTimeLineFun(val);
        }
      },
      immediate: true,
    },
    activities: {
      handler(val) {
     /*    console.log(val); */
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getSrcaseHeadTimeLineFun(caseId) {
      srcaseHeadTimeLine({
        caseId: caseId,
      }).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.length > 0&&res.data[0]) {
            res.data.forEach(item=>{
              if(item&&!item.star){
                item.star=5;
              }
            })
            let data = res.data;
            this.activities = data;
            this.$emit("getTimeLineDealData",data[0],data[1]||null);
          } else {
            this.activities = [];
             this.$emit("getTimeLineDealData",null,null);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 12px;
  font-size: 16px;

  span {
    color: #99a1b4;
    flex-shrink: 0;
    display: inline-block;
    width: 90px;
  }
  .blue {
    color: #2a8dff;
  }
  .desc-wrap {
    width: 100%;
    line-height: 1.5em;
    word-wrap:break-word;
  }
  .orange {
    color: #ff6b36;
  }
  .zise {
    color: #8c25e6;
  }
}
.head {
  font-weight: bold;
  color: #99a1b4;
  padding-top: 6px;
}
.flex {
  display: flex;
  justify-content: flex-start;
}
.el-timeline {
  width: 60%;
}
.grey{
  color: #99A1B4;
}
</style>