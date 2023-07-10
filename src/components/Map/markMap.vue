<template>
  <div class="markmap">
    <div :id="mapId" class="allmap" />
  </div>
</template>

<script>
export default {
  props: {
    canAddMarker: {
      type: Boolean,
      default: false,
    },
    searchKeyword: String,
    keyword: {
      type: [Array, String],
    },
    strokeColor: {
      type: String,
      default: "#2A8DFF",
    },
    path: {
      type: String,
      default: "",
    },

    markers: {
      type: String,
      default: "",
    },
    pcenter: {
      type: Object,
      default: () => ({
        lng: 114.97731018066408,
        lat: 25.8246784210205,
      }),
    },
  },
  components: {},

  data() {
    return {
      markerInd:0,
      markersOverlay: [],
      mapId: "map" + new Date().getTime(),
      zoom: 13,
      center: {
        lng: 114.97731018066408,
        lat: 25.8246784210205,
      },
    };
  },
  watch: {
    searchKeyword: {
      handler(val) {
        if (val) {
          this.localSearchFun();
        }
      },
    },
    pcenter: {
      handler(val) {
        this.handleChangeMapCenter(val);
      },
    },
    markers: {
      handler(val) {
        if (val) {
          let arr = JSON.parse(val);
          if (arr && arr.length > 0) {
            if (this.markersOverlay && this.markersOverlay.length > 0) {
              this.markersOverlay.forEach((item) => {
                this.map.removeOverlay(item);
              });
            }
            if(this.markerInd){
               arr.forEach((item) => {
                this.customMarkerOverlay(item);
            });
            }else{
              this.markerInd++;
              this.timmer1=setTimeout(()=>{
              arr.forEach((item) => {
                this.customMarkerOverlay(item);
                });
              },1000) 
            }
         
          }
        }
      },
      immediate:true
    },
    path: {
      handler(val, oldVal) {
        if (val) {
          this.timmer2=setTimeout(() => {
            this.drawDefault(val);
          }, 1000);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.mapId = "map" + new Date().getTime();
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeDestroy(){
    clearTimeout( this.timmer1);
    clearTimeout( this.timmer2);
  },
  methods: {
    //默认多边形
    drawDefault(points) {
      if (points) {
        let newPonits = [];
        let arr = points.split(";");
        arr.forEach((item) => {
          let itemArr = item.split(",");
          newPonits.push(new BMap.Point(itemArr[0], itemArr[1]));
        });
        const polygon = new BMap.Polygon(newPonits, {
          strokeColor: this.strokeColor||"#2A8DFF",
          strokeWeight: 4,
          strokeOpacity: 1,
          fillColor: this.strokeColor||"#2A8DFF",
          fillOpacity: 0.2,
        });
        this.map.removeOverlay(this.polygonOverlay);
        this.map.addOverlay(polygon);
        this.handleChangeMapCenter(newPonits[0]);
        this.polygonOverlay = polygon;
      }
    },
    //地图初始化
    initMap() {
      const _this = this;
      const point = new BMap.Point(114.97731018066408, 25.8246784210205);
      _this.map = new BMap.Map(this.mapId, {
        enableMapClick: false,
        minZoom: 4,
        maxZoom: 16,
      }); // 创建Map实例,GL版命名空间为BMap(鼠标右键控制倾斜角度)
      _this.map.centerAndZoom(point, this.zoom); // 初始化地图,设置中心点坐标和地图级别
      /*  _this.map.enableScrollWheelZoom(true);  */ // 开启鼠标滚轮缩放
      _this.suofang();
      /*   _this.cerateMarker(point);   */

      this.map.addControl(
        new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      ); //type:BMAP_NAVIGATION_CONTROL_ZOOM type:BMAP_NAVIGATION_CONTROL_SMALL,enableGeolocation:true

      this.map.addControl(
        new BMap.GeolocationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
      );

      this.map.addEventListener("click", function (e) {
        _this.mapClickFun(e);
      });
    },
    /* 标记点 */
    createMarkerDOM(markerObj) {
      const img = document.createElement("img");
      img.style.height = "50px";
      img.style.width = "50px";
      img.src = markerObj.src;
      img.draggable = markerObj.dragging;
      return img;
    },
    customMarkerOverlay(markerObj) {
      console.log("加标记");
      console.log("------------",markerObj);
      const _this = this;
      let myIcon = new BMap.Icon(markerObj.icon, new BMap.Size(45, 45));
      let pt = new BMap.Point(markerObj.lng, markerObj.lat);
      var marker = new BMap.Marker(pt, {
        icon: myIcon,
        enableDragging: markerObj.dragging,
        oType: "marker",
        offset: markerObj.offset
          ? new BMap.Size(...markerObj.offset)
          : new BMap.Size(5, -17),
      });
      /* this.map.removeOverlay */
      this.map.addOverlay(marker);
      this.markersOverlay.push(marker);
      // 绑定点击事件
      marker.addEventListener("click", function (e) {
        console.log("eeee", e);
      });
      //绑定拖拽事件
      marker.addEventListener("dragend", function (e) {
        _this.$emit("updateMarkerLocal", e.point);
      });
    },
    handleChangeMapCenter(val) {
      const point = new BMap.Point(val.lng, val.lat);
      this.map.setCenter(point);
    },
    cerateMarker(point) {
      const marker = new BMap.Marker(point);
      // 将标记点添加到地图上
      this.map.addOverlay(marker);
    },
    handlerMap({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
    },
    //点击地图事件 增加标记点
    mapClickFun(ev) {
      if (this.canAddMarker) {
        this.$emit("updateMarkerLocal", ev.point);
      }
    },
    //缩放
    suofang() {
      document.querySelector(".markmap").onmousewheel = (e) => {
        e = e || window.event;
        if (e.stopPropagation) {
          //这是取消冒泡
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
        if (e.preventDefault) {
          //这是取消默认行为，要弄清楚取消默认行为和冒泡不是一回事
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        //放大 getZoom返回地图当前缩放级别
        if (e.wheelDelta > 0) {
          this.zoom = this.zoom + 1;
          if (this.zoom > 19) {
            this.zoom = 19;
          }
        }
        //缩小
        if (e.wheelDelta < 0) {
          e.cancelBubble = true;
          this.zoom = this.zoom - 1;
          if (this.zoom < 4) {
            this.zoom = 4;
          }
        }
        this.map.setZoom(this.zoom);
      };
    },
    //拖拽标记
    markerDragendEvent(e) {
      const _this = this;
      _this.$emit("updateMarkerLocal", e.point);
      /*  let  geoc=new BMap.Geocoder();
      geoc.getLocation(e.point,function(rs){
       _this.$emit('updateMarkerLocal',e.point,rs);
      }) */
    },
    //关键词搜索
    localSearchFun(searchWord) {
      const _this = this;
      this.$nextTick(() => {
        const local = new BMap.LocalSearch(this.map, {
          onSearchComplete: function (e) {
            _this.$emit("searchcomplete", e);
          },
        });
        local.search(searchWord ? searchWord : this.searchKeyword);
      });
    },
    lookDetail() {},
    searchcomplete(e) {},
  },
};
</script>
<style lang="scss" scoped>
.markmap {
  width: 800px;
  height: 500px;
  .allmap {
    width: 100%;
    height: 100%;
  }
}
</style>