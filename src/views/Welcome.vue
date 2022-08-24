<template>
  <div ref="main" class="welcome">
    <div class="slogan">
      <div class="anime-container">
        <kinesis-container>
          <kinesis-element :strength="20">
            <vue-typed-js :strings="['Start off on the right foot.', '一站式地图服务中心']"
                          :loop="true" :typeSpeed="50">
              <div class="typing"></div>
            </vue-typed-js>
          </kinesis-element>
        </kinesis-container>
      </div>
    </div>
    <vue-firework :el="this.$refs.main"></vue-firework>

    <div class="bottoms">
      <el-row class="btm-row">
        <el-button type="primary" plain size="medium" @click="signInAsC" style="width: 200px;">Customer Sign In</el-button>
        <el-button type="primary" plain size="medium" @click="signUp" style="width: 200px;">Sign Up</el-button>
        <el-button type="primary" plain size="medium" @click="signInAsD" style="width: 200px;">Driver Sign In</el-button>
      </el-row>
    </div>

  </div>
</template>

<script>


export default {
  beforeCreate: () => document.body.className = 'welcome',
  name: "Welcome",

  methods: {
    signUp() {
      this.$router.push('/sign-up')
    },

    foo() {
      console.log("123123")
    },

    signInAsC() {
      this.$router.push({
        name: 'Login',
        params: {
          type_: 'customer'
        }
      })
    },
    signInAsD() {
      this.$router.push({
        name: 'Login',
        params: {
          type_: 'driver'
        }
      })
    }
  }
}
</script>

<style scoped>
.slogan {
  height: 500px;
  padding-top: 100px;
  margin: auto;
  width: 1000px;
  place-content: center;
  font-family: "Segoe Script", "仿宋", serif;
  font-size: 90px;
}

.btm-row {
  place-content: center;
  margin: auto;

}
</style>