<template>
  <div class="img-wrap" v-if="imgList">
    <div class="item" v-for="(item, index) in imgList.split(',')" :key="index">
      <el-image :src="toRealUrl(item)" :preview-src-list="toRealUrls(imgList)">
      </el-image>
      <div class="modal"><i class="el-icon-zoom-in"></i></div>
    </div>
  </div>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    imgList: {
      type: String,
      default: ""
    },
    imgType: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {
        dialogTableVisible:false,
        showSrc:null,
    };
  },
  created() {},
  mounted() {},
   computed: {
    headSrc() {
      return process.env.VUE_APP_BASE_API ;
    },
   },
  methods: {
    showModal(src){
        this.showSrc=src;
        this.dialogTableVisible=true;
    },
    closeModal(){
         this.showSrc="";
        this.dialogTableVisible=false;
    },
    toRealUrls(imgsList){
      let imgArr= imgsList.split(',');
      const list=imgArr.map(item=>{
        const realUrl= this.toRealUrl(item);
        return realUrl
      })
      return list;
    },
    toRealUrl(url) {
      if(this.imgType === 'grid') {
        if(url.startsWith("http")) {
          return url;
        } else if(url.startsWith("upload") || url.startsWith("/upload")) {
          return process.env.VUE_APP_GRID_IMAGE_URL + url;
        } else if(url.startsWith("Picture") || url.startsWith("/Picture")) {
          console.info(process.env.VUE_APP_GRID_IMAGE_URL + "/alarmvideo/" + url);
          return process.env.VUE_APP_GRID_IMAGE_URL + "/alarmvideo/" + url;
        }
        return process.env.VUE_APP_GRID_IMAGE_URL + url;
      } else {
        if (isExternal(url)) {
          return url;
        }
       /*  if(url.startsWith("https")||url.startsWith("http")) {
          const ind=url.indexOf('/profile');
          url=url.slice(ind,url.length);
        } */
        return this.headSrc + url;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.img-wrap {
  width: 100%;
  .item {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    position: relative;
    border: 1px solid #efefef;
    margin-right: 12px;
    .modal {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(39, 45, 57, 0.3);
      color: #fff;
      text-align: center;
      line-height: 100px;
      display: none;
      pointer-events: none;
      i {
        font-size: 28px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    &:hover {
      .modal {
        display: inline-block;
      }
    }
  }

  img,
  .el-image {
    width: 100px;
    height: 100px;
  }
  .fullimg {
    width: 100%;
    height: auto;
  }
}
</style>