<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
};
</script>

<style lang="css">
@import "./assets/styles/srhjjg.css";
.wl-transfer .filter-tree {
    z-index: 999;
    position: sticky;
    top: -10px;
    background: #fff;
}

</style>

<style scoped>
#app .theme-picker {
  display: none;
}

</style>
