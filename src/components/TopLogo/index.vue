<template>
  <div class="nav">
    <img src="@/assets/images/logo.png"/>
    <span>市容环境监管云平台</span>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
   return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.nav{
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    color: #272D39;
    font-weight: 700;
    display: inline-block;
    
    img{
        height: 36px;
        width: 36px;
        margin-top: 5px;
        margin-right: 6px;
        float: left;
    }
    span{
      float: left;
    }
}
</style>