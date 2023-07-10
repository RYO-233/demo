<template>
  <div class="scrollbar-container">
    <el-scrollbar class="scroll" id="scrollContent" :style="{ height: height ,width:width}">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
import { calculateHeight } from "@/utils/calcHeight";
export default {
  props: {
    //要减去高度的div的class  el-scrollbar下面的div
    cutClassNames:{
      type:Array,
      default:()=>[]
    }
  },
  components: {},
  data() {
    return {
      height: "100%",
      width:"100%",
    };
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy(){
     window.removeEventListener("resize",this.handleResize);
  },
  watch: {
    cutClassNames: {
      handler(val) {
         this.handleResize();
        
      },
      immediate:true
    },
  },

  methods: {
   handleResize(){
    this.$nextTick(()=>{
       this.height=calculateHeight(this.cutClassNames,50)+"px";
    })
   },
  },
};
</script>
<style lang="scss" scoped>

</style>