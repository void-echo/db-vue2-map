<template>
  <div class="main">
    <div class="component1">
      <div class="mapOuter">
        <div id="mapContainer">
        </div>
      </div>
      <div>
        <el-button @click="naviGate_Car_test">
          测试导航
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: "MyMap",

  beforeCreate: () => document.body.className = 'welcome',
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  data() {
    return {
      map: null,
      my_place: []
    }
  },

  methods: {
    initMap() {
      AMapLoader.load({
        key: "ca1beeb0abaeca2b3c3ab0a5ce115a6d",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Driving', 'AMap.ToolBar'],
        // 需要使用的的插件列表，如比例尺'AMap.Scale等
      }).then((AMap_) => {
        this.map = new AMap_.Map("mapContainer", {  //设置地图容器id
          viewMode: "3D",    //是否为3D地图模式
          zoom: 5,           //初始化地图级别
          center: [105.602725, 37.076636], //初始化地图中心点位置
        });

        AMap.plugin('AMap.ToolBar', () => {//异步加载插件
          var toolbar = new AMap.ToolBar();
          this.map.addControl(toolbar);
        });

      }).catch(e => {
        console.log(e);
      });
    },


    naviGate_Car(startLngLat, endLngLat) {
      AMap.plugin('AMap.Driving', () => {
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map
        })
        driving.search(startLngLat, endLngLat, {waypoints: [[100.12, 30.00]]}, (status, result) => {
          // 未出错时，result即是对应的路线规划方案
        })
      });
    },

    naviGate_Car_test() {
      var startLngLat = [116.379028, 39.865042];
      var endLngLat = [116.427281, 39.903719];
      this.naviGate_Car(startLngLat, endLngLat);
    }
  },

  destroyed() {
    this.map.destroy();
    this.map = null;
  }
}


</script>

<style scoped>

#mapContainer {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.mapOuter {
  width: 800px;
  height: 400px;
}

</style>