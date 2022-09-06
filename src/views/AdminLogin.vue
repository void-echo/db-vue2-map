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
      <br/> <br/>
      <br/>

      <el-input placeholder="密码" v-model="pwd" clearable show-password></el-input>
      <el-button @click="login"> 登录</el-button>
      <div>
        系统管理员登录页面
      </div>

    </el-card>
    <vue-firework :el="this.$refs.main"></vue-firework>

  </div>
</template>


<script>
import axios from "axios";
import sjcl from "sjcl";

export default {
  name: "AdminLogin",
  beforeCreate: function () {
    document.body.className = 'home';
  },

  computed: {
    signUpType() {
      return "admin"
    },
  },

  data() {
    return {
      pwd: "",
      userID: "",
      spring_boot_url_base: "http://localhost:17747/",
      type_: "admin",
    }
  },
  methods: {
    login() {
      this.axiosGet("acc/login", "GET",
          {
            user: this.userID,
            pwdSha: this.pwdEncode(this.pwd),
            userType: this.type_
          }, {},
          (response) => {
            console.log(response.data)
            let status = response.data
            if (status === 'success') {
              this.$router.push({
                name: 'AdminMain',
                params: {
                  id_: this.userID
                }
              })
            } else {
              this.warnMsg("用户名或密码不正确")
            }
          }
      )
    },

    errorMsg(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: "error"
      })
    },

    serverErr() {
      this.errorMsg("服务器内部错误, 请稍后重试")
    },

    warnMsg(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: "warning"
      })
    },

    successMsg(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: "success"
      })
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


    pwdEncode(pwd) {
      let sha_alpha = this.my_sha256(pwd)
      let salt = '683gd98798he90weq90e313r4o0908j9y7e9123'
      let sha_beta = this.my_sha256(salt + sha_alpha)
      let total = this.userID + sha_beta
      return this.my_sha256(total);
    },

    notNil(obj) {
      return !(obj === null || obj === undefined)
    },
  }
}
</script>

<style scoped>

</style>