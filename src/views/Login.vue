<template>
  <div ref="main" class="main" style="position: absolute; margin: auto;
  top: 0;
        left: 0;
        right: 0;
        bottom: 0;">

    <el-card class="box-card" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: auto;
        position: absolute;
        top: 30%;
        left: 30%;
        right: 30%;
        bottom: 30%;">
      <div slot="header" class="clearfix">
        <span>欢迎登陆!</span>
      </div>
      <el-input placeholder="ID" v-model="userID" clearable></el-input>
      <br/>      <br/>
      <br/>

      <el-input placeholder="密码" v-model="pwd" clearable show-password></el-input>
      <el-button @click="login"> 登录</el-button>
      <div>
        您将作为 {{ this.type_ }} 登录
      </div>

    </el-card>
    <vue-firework :el="this.$refs.main"></vue-firework>

  </div>
</template>

<script>
import axios from "axios";
import sjcl from "sjcl";

export default {
  name: "Login",
  beforeCreate: function () {
    document.body.className = 'home';
  },

  computed: {
    signUpType() {
      return this.$route.params.type_
    },
  },

  data() {
    return {
      pwd: "",
      userID: "",
      spring_boot_url_base: "http://localhost:17747/",
      type_: this.$route.params.type_,
    }
  },

  methods: {
    login() {
      this.axiosGet("acc/login", "GET",
          {
            user: this.userID,
            pwdSha: this.my_sha256(this.pwd),
            userType: this.type_
          }, {},
          (response) => {
            console.log(response.data)
            let status = response.data
            if (status === 'success') {
              if (this.signUpType === 'customer') {
                this.$router.push({
                  name: 'CustomerMain',
                  params: {
                    id_: this.userID
                  }
                })
              } else if (this.signUpType === 'driver') {
                this.$router.push({
                  name: 'DriverMain',
                  params: {
                    id_: this.userID
                  }
                })
              }
            }
          }
      )
    },
    axiosGet(url, httpType, params, _config, lambdaThen) {
      axios({
        url: url,
        method: httpType,
        config: _config,
        baseURL: this.spring_boot_url_base,
        params: params
      }).then(lambdaThen);
    },

    my_sha256(str) {
      let hash = sjcl.hash.sha256.hash(str);
      return sjcl.codec.hex.fromBits(hash);
    },

  }
}
</script>

<style scoped>

</style>