<template>
  <div id="app">
    <div class="my-title">
      Welcome to MapRouter!
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-image: url("./assets/work_2.svg");
}

.my-title {
  font-family: "Segoe Script", serif;
  color: skyblue;
  font-size: 60px;
}
</style>
