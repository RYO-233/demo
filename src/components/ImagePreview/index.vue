<template>
  <el-image
    :src="`${realSrc}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};`"
    :preview-src-list="realSrcList"
  >
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  name: "ImagePreview",
  props: {
    src: {
      type: String,
      default: "",
    },
    width: {
      type: [Number, String],
      default: "",
    },
    height: {
      type: [Number, String],
      default: "",
    },
    imgType: {
      type: String,
      default: "",
    },
  },
  computed: {
    realSrc() {
      if (!this.src) {
        return;
      }
      let srcSingle = this.src.split(",")[0];
      const realsrc = this.toRealSrc(srcSingle);
      return realsrc;
    },
    realSrcList() {
      if (!this.src) {
        return;
      }
      let real_src_list = this.src.split(",");
      let srcList = [];
      real_src_list.forEach((item) => {
        const itemReal = this.toRealSrc(item);
        srcList.push(itemReal);
      });
      return srcList;
    },
    realWidth() {
      return typeof this.width == "string" ? this.width : `${this.width}px`;
    },
    realHeight() {
      return typeof this.height == "string" ? this.height : `${this.height}px`;
    },
  },
  methods: {
    //图片URl转换处理
    toRealSrc(real_src) {
      if (this.imgType === "grid") {
        if (real_src.startsWith("http")) {
          return real_src;
        } else if (
          real_src.startsWith("upload") ||
          real_src.startsWith("/upload")
        ) {
          return process.env.VUE_APP_GRID_IMAGE_URL + real_src;
        } else if (
          real_src.startsWith("Picture") ||
          real_src.startsWith("/Picture")
        ) {
          return process.env.VUE_APP_GRID_IMAGE_URL + "/alarmvideo/" + real_src;
        }
        return process.env.VUE_APP_GRID_IMAGE_URL + real_src;
      } else {
        if (isExternal(real_src)) {
          return real_src;
        }
        return process.env.VUE_APP_BASE_API + real_src;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  ::v-deep .el-image__inner {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  ::v-deep .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
