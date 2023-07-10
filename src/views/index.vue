<template>
<!--   <baidu-map ak="p8HOIlwKI9M57bF0Xb7RyQpInXE5Vyfu" class="baidu-map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true"
    @click="mapClick"
    @rightclick="mapRightClick"
    @ready="handler">
    <bm-polygon :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" 
      @lineupdate="updatePolygonPath"
      @mouseover="polygonMouseover"
      @mouseout="polygonMouseout"
      @click="polygonClick"
      />
  </baidu-map> -->
  <div :id="mapId" class="baidu-map" />
</template>

<script>
/* import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmPolygon from 'vue-baidu-map/components/overlays/Polygon.vue'
 */
export default {
  name: 'Index',
  components: {
   /*  BaiduMap, BmPolygon */
  },
  data() {
    return {
      map:null,
      mapId:"map" + new Date().getTime(),
      center: "赣州",
      zoom: 15,
      polygonPath: [
      ],
      inPolygon: false
    }
  },
  created(){
    this.mapId = "map" + new Date().getTime();
  },
  mounted(){
     
   
      this.initMap();
   
     
  },
  methods: {
    initMap() {
      const _this = this;
      const point = new BMap.Point(114.97731018066408, 25.8246784210205);
        _this.map = new BMap.Map(this.mapId, { enableMapClick: false }); // 创建Map实例,GL版命名空间为BMap(鼠标右键控制倾斜角度)
        _this.map.centerAndZoom(new BMap.Point(114.97731018066408, 25.8246784210205), 15); // 初始化地图,设置中心点坐标和地图级别
        _this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    },
    handler ({BMap, map}) {
      console.log(BMap, map)
      // this.center.lng = 116.404
      // this.center.lat = 39.915
      // this.zoom = 15
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    },
    addPolygonPoint () {
      this.polygonPath.push({lng: 114.97731018066408,
        lat: 25.8246784210205,})
    },
    mapClick(e) {
      console.info(e.point);
      this.polygonPath.push(e.point);
    },
    mapRightClick({type, target, point, pixel, overlay}) {
    
      console.info(type,target,point,pixel,overlay);
    },
    polygonMouseover(e) {
      console.info("over");
      this.inPolygon = false;
    },
    polygonMouseout(e) {
      console.info("out");
      this.inPolygon = true;
    },
    polygonClick({type, target, point, pixel}) {
      if(this.inPolygon) {
        return false;
      }
    }
  }
}
</script>

<style scoped>
.baidu-map {
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
