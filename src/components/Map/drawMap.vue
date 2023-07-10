<template>
  <div class="map-wrap">
    <div class="flex">
      <div class="button-wrap">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit"
          @click="handleDraw('polygon')"
          >编辑</el-button
        >
        <el-button size="small" icon="el-icon-check" @click="handelFinishDraw"
          >完成</el-button
        >
        <el-button
          size="small"
          icon="el-icon-refresh-left"
          @click="handleClearDraw"
          >重置</el-button
        >
      </div>
      <div class="picker-color">
        <div class="text">选择颜色</div>
        <span
          @click="handleChangeColor(item)"
          v-for="item in colors"
          :key="item.code"
          :class="[
            'color' + item.code,
            drawColor == item.value ? 'active' : '',
          ]"
        >
          <i v-if="drawColor == item.value" class="el-icon-check"></i>
          <i v-else>&nbsp;</i>
        </span>
      </div>
    </div>
    <div :id="mapId" class="allmap" />
  </div>
</template>

<script>

export default {
  props: {
    pcenter: {
      type: Object,
      default: () => ({
        lng: 114.97731018066408,
        lat: 25.8246784210205,
      }),
    },
    defaultArea:String,
    defaultColor:String
  },
  components: {},
  data() {
    return {
      map: null,
      mapId: null,
      actNav: null,
      drawColor: "#2A8DFF",
      drawingManagers: null,
      colors: [
        { code: 1, value: "#FF6B36" },
        { code: 2, value: "#FFAD29" },
        { code: 3, value: "#FFDA21" },
        { code: 4, value: "#29E98F" },
        { code: 5, value: "#1EEDE6" },
        { code: 6, value: "#2A8DFF" },
        { code: 7, value: "#CC16EF" },
        { code: 8, value: "#F53ABD" },
      ],
    };
  },
  created() {},
  mounted() {
       this.mapId = "map" + new Date().getTime();
        const point = new BMap.Point(114.97731018066408, 25.8246784210205);
    this.$nextTick(()=>{
       this.initMap(point);
    })
   
  },
  watch:{
     pcenter: {
      handler(val) {
         this.handleChangeMapCenter(val);
      },
    },
    "defaultArea":{
      handler(val){
      if(val){
         this.drawColor=this.defaultColor||"#2A8DFF";
          setTimeout(()=>{
           this.drawDefault(val);
          },1000)
          
        }
      },
      immediate:true,
      deep:true
    }
  },
  destroyed() {
    /* this.map.destroy(); */
  },
  methods: {
    drawDefault(points){
     if(points){
        let newPonits = [];
        let arr=points.split(";");
        arr.forEach(item=>{
          let itemArr=item.split(",");
          newPonits.push(new BMap.Point(itemArr[0],itemArr[1]))
        })
        const polygon= new BMap.Polygon(newPonits, {strokeColor:this.drawColor, strokeWeight:4, strokeOpacity:1,fillColor:this.drawColor,fillOpacity: 0.2});
       this.map.addOverlay(polygon);
       this.handleChangeMapCenter(newPonits[0]);
      }
    },
    initMap(point) {
      const _this = this;
        _this.map = new BMap.Map(this.mapId, { enableMapClick: false }); // 创建Map实例,GL版命名空间为BMap(鼠标右键控制倾斜角度)
        _this.map.centerAndZoom(new BMap.Point(114.97731018066408, 25.8246784210205), 13); // 初始化地图,设置中心点坐标和地图级别
        _this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        _this.cerateMarker(point);  
    },
    cerateMarker(point) {
      const marker = new BMap.Marker(point);
      // 将标记点添加到地图上
      this.map.addOverlay(marker);
    },
    handleChangeColor(item){
      this.drawColor = item.value;
      /* this.drawingManagers.setStrokeColor(item.value); */
      
    },
    //编辑
    handleDraw() {
      const _this=this;
        const styleOptions = {
          strokeColor: this.drawColor || "#2A8DFF", // 边线颜色
          fillColor: this.drawColor || "#2A8DFF", // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 4, // 边线宽度，以像素为单位
          strokeOpacity: 1, // 边线透明度，取值范围0-1
          fillOpacity: 0.2, // 填充透明度，取值范围0-1
        };
         const labelOptions = {
            borderRadius: '2px',
            background: '#FFFBCC',
            border: '1px solid #E1E1E1',
            color: '#703A04',
            fontSize: '12px',
            letterSpacing: '0',
            padding: '5px'
        };
      this.drawingManagers = new BMapGLLib.DrawingManager(this.map, {
          isOpen: false, // 是否开启绘制模式
          enableCalculate: true, // 绘制是否进行测距测面
          enableSorption: true, // 是否开启边界吸附功能
          sorptiondistance: 20, // 边界吸附距离
          polygonOptions: styleOptions, // 多边形的样式
          labelOptions:labelOptions,
        });
      this.drawingManagers.setDrawingMode('polygon');
      this.drawingManagers.open();
      this.drawingManagers.addEventListener("overlaycomplete", function (e) {
        _this.points=e.overlay.Qn;
        _this.$emit("getMapPointsData",e.overlay.Qn,_this.drawColor)
       
      });
    },
     handleChangeMapCenter(val){
       const point=new BMap.Point(val.lng,val.lat);
         this.map.setCenter(point );
    },
    //重置
    handleClearDraw() {
      /*  */
      this.map.clearOverlays();
      this.$emit("getMapPointsData",[],"")
   /*  document.getElementById('cancelOperate').click(); */
        
    },
    //完成
    handelFinishDraw() {
      if( document.getElementById('confirmOperate')){
         document.getElementById('confirmOperate').click();
      }
      
    },
  },
};
</script>
<style lang="scss" scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .flex {
    display: flex;
    flex-shrink: 0;
    white-space: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
  }
}
.allmap {
  width: 100%;
  height: calc(100% - 50px);
  position: absolute;
}
ul {
  list-style: none;
}
.picker-color {
  text-align: right;
  padding-right: 30px;

  .text {
    display: inline-block;
    padding: 0 10px;
    float: left;
  }
  span {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 20px;
    border-radius: 4px;
    border-width: 2px;
    border-style: solid;
    margin-left: 8px;
    overflow: hidden;
    text-align: center;
    margin-top: 10px;
    float: left;
    i {
      font-weight: 600;
    }
  }

  .color1 {
    border-color: #ff6b36;
    background: rgba(255, 107, 54, 0.3);
    color: #ff6b36;
  }
  .color2 {
    border-color: #ffad29;
    background: rgba(255, 173, 41, 0.3);
    color: #ffad29;
  }
  .color3 {
    border-color: #ffda21;
    background: rgba(255, 218, 33, 0.3);
    color: #ffda21;
  }
  .color4 {
    border-color: #29e98f;
    background: rgba(41, 233, 143, 0.3);
    color: #29e98f;
  }
  .color5 {
    border-color: #1eede6;
    background: rgba(30, 237, 230, 0.3);
    color: #1eede6;
  }
  .color6 {
    border-color: #2a8dff;
    background: rgba(42, 141, 255, 0.3);
    color: #2a8dff;
  }
  .color7 {
    border-color: #cc16ef;
    background: rgba(204, 22, 239, 0.3);
    color: #cc16ef;
  }
  .color8 {
    border-color: #f53abd;
    background: rgba(245, 58, 189, 0.3);
    color: #f53abd;
  }
}
</style>