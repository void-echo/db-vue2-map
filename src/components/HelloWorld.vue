<template>
  <div class="hello">
    <div class="main">
      <div class="map">
        <baidu-map center="北京" :zoom="zoom" @ready="handler" class="map">

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
      zoom: 3
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.map {
  width: 400px;
  height: 300px;
}

</style>
