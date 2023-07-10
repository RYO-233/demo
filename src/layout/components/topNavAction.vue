<template>
  <div class="nav-action">
   <div class="action" @click="logout">
      <i class="iconfont icon-quit"></i> 
      退出
    </div>
    <div class="action">
      <el-dropdown>
        <span class="el-dropdown-link">
          <div style="display: flex; align-items: center">
             
           <span class="iconfont icon icon-shezhi"></span>设置 
          </div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item class="text">个人中心</el-dropdown-item>
          </router-link>
           <el-dropdown-item @click.native="setting=true">
            <span>布局设置</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
          <slot name="itemAction"></slot>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
      <div class="action">{{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import '@/assets/font/iconfont.css'
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
    computed: {
    ...mapGetters(["name", 'sidebar',
      'avatar',
      'device']),
      setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    //布局设置
   
    //退出登录
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
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/util.scss";
.nav-action {
  width: 100%;
  display: flex;
  align-items: center;
   flex-direction: row-reverse; 
   .action {
        margin-right: 24px;
        display: flex;
        align-items: center;
        .el-dropdown {
          color: inherit;/* #00f6ff; */
          font-size: 18px;
        }
        .img {
          width: vw(30);
          height: vw(30);
          flex-shrink: 0;
          /*   margin-top: vw(15); */
          margin-right: vw(6);
          &:hover {
            cursor: pointer;
          }
        }
        .text {
          color: inherit;
        }
      }
      .iconfont{
        font-size: 20px;
        margin-right: 4px;
      }
      .icon-shezhi{
        font-size: 28px;
         margin-right: 2px;
      }
}
</style>