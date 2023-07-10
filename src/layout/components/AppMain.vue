<template>
  <section class="app-main"  id="pageContent">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="!$route.meta.link" :key="key" />
      </keep-alive>
    </transition>
    <iframe-toggle />
    <div class="copyRight" id="copyRight">
        Copyright © 2002-2023 憶源科技.版权所有
      </div>
  </section>
</template>

<script>
import iframeToggle from "./IframeToggle/index"

export default {
  name: 'AppMain',
  components: { iframeToggle },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 114px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
  .copyRight{
    position: fixed;
    z-index: 0;
    bottom: 0;
    right: 0;
    width: calc(100% - 130px);
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-family: "SimHei ";
    font-weight: 400;
    font-size: 12px;
    color: #d8dce6;
    pointer-events: none;
  }
</style>
