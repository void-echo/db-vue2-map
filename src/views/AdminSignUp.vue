<template>
  <div ref="main" class="hello" style="position: absolute; margin: auto; top: 0;
        left: 0;
        right: 0;
        bottom: 0;">
    <div class="main">
    </div>

    <el-card class="box-card" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: auto;
        position: absolute;
        top: 20%;
        left: 20%;
        right: 20%;
        bottom: 20%;">
      <div slot="header" class="clearfix">
        <span>欢迎注册!</span>
      </div>

      <div class="test">
        <el-input placeholder="ID" v-model="userID" clearable></el-input><br/><br/>
        <el-input show-password placeholder="密码" v-model="pwd" clearable></el-input><br/><br/>
        <el-input placeholder="昵称" v-model="userName" clearable></el-input><br/><br/>
        <el-input placeholder="电话号码" v-model="tel" clearable></el-input><br/><br/>
        <el-input placeholder="邮箱" v-model="mail" clearable></el-input><br/><br/>
        <el-button @click="signUp"> 注册</el-button>
        <el-button @click="disappear"> 返回欢迎界面</el-button>
      </div>

      <div class="message">
        目前, 您正在注册成为管理员.
      </div>


    </el-card>

    <vue-firework :el="this.$refs.main"></vue-firework>

  </div>
</template>

<script>
import axios from 'axios'
import sjcl from 'sjcl'

export default {
  name: "AdminSignUp",
  beforeCreate: function () {
    document.body.className = 'home';
  },
  data() {
    return {
      spring_boot_url_base: "http://localhost:17747/",
      pwd: "",
      userID: "",
      userName: "",
      tel: "",
      mail: "",
      signUpType: "admin"
    }
  },

  methods: {
    disappear() {
      this.$router.push('/welcome')
    },

    submitUpload() {
      this.$refs.upload.submit();
      this.fileList = []
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    united_print(obj) {
      console.log(JSON.stringify(obj, null, 2));
    },
    signUp() {
      if (!this.isCorrect_phone()) {
        this.warnMsg("手机号格式不正确")
        this.tel = ""
        return
      } else if (!this.isCorrect_mail()) {
        this.warnMsg("邮箱格式不正确")
        this.mail = ""
        return
      }
      this.axiosGet("admin", "POST", {
        id: this.userID,
        name: this.userName,
        tel: this.tel,
        mail: this.mail,
        passwordSha256: this.pwdEncode(this.pwd)
      }, {}, (response) => {
        if (response.status === 200) {
          this.redirectToLogin()
        } else {
          console.log(response)
        }
      });

    },

    isCorrect_phone() {
      var res = /^1[3,456.789][0-9]{9}$/
      return res.test(this.tel)
    },

    isCorrect_mail() {
      var res = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      return res.test(this.mail)
    },

    redirectToLogin() {
      this.$message({
        message: "注册成功！即将重定向至登录界面",
        type: "success",
        showClose: true
      })

      setTimeout(() => {
        let loginType = this.signUpType
        //
        this.$router.push({
          name: "AdminLogin",
          params: {
            type_: loginType
          }
        })
      }, 1500)
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


    axiosGet(url, httpType, params, _config, lambdaThen) {
      axios({
        url: url,
        method: httpType,
        config: _config,
        baseURL: this.spring_boot_url_base,
        params: params
      }).then(lambdaThen);
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

  }
}
</script>

<style scoped>

</style>
