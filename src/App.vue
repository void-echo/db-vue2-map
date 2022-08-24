<template>
  <div id="app">
    <!--    <hello-world ref="myMain"></hello-world>-->

    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <router-view/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

let time = 0;

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },

  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode:'ff3c47c4f5f3808fdee2a61e6294b80c',
    }
  },

  beforeDestroy() {
    document.querySelector('body').setAttribute('style', '')
  },

  data() {
    return {}
  },

  computed: {},
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

body.home {
  background-image: url("./assets/work_2.svg");
}

body.about {
  background-image: url("./assets/work_3.svg");
}

body.welcome {
  background-image: url("./assets/work_1.svg");
}
</style>
