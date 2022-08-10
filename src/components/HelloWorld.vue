<template>
  <div class="hello">
    <div class="main">
      <div class="map">
        <baidu-map
            center="济南"
            :zoom="zoom"
            @ready="handler"
            NavigationControlType="BMAP_NAVIGATION_CONTROL_LARGE"

            class="map">
          <bm-control :offset="{width: '10px', height: '10px'}">
            <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">
              <el-input v-model="keyword" placeholder="在此查找地点"></el-input>
            </bm-auto-complete>
          </bm-control>
          <bm-local-search :keyword="keyword" :auto-viewport="true"></bm-local-search>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :show-zoom-info=false>
          </bm-navigation>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        </baidu-map>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  data() {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      keyword: ""
    }
  },
  methods: {
    handler({BMap, map}) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    }
  }


}
</script>

<style scoped>

.map {
  width: 100%;
  height: 400px;
}

</style>
