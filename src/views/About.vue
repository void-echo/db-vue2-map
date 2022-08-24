<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  beforeCreate: function() {
    document.body.className = 'about';
  },

  // updated () {
  //   // background-image: url("./assets/work_2.svg");
  //   document.querySelector('body').setAttribute('style', 'backgroundImage: url("../assets/work_3.svg");')
  // },
}
</script>

<style scoped>

</style>