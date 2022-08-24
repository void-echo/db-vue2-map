<template>
  <div class="main">
    <!-- 本组件的父节点，必须有 btmMethod 方法 -->
    <el-button onclick="clk()">到这儿去</el-button>
  </div>
</template>

<script>
export default {
  name: "IntoCard",
  clk() {
    console.log("子组件")
    this.btmMethod()
  },
  methods: {
    clk() {
      console.log("子组件")
      this.btmMethod()
    }
  }
}
</script>

<style scoped>

</style>