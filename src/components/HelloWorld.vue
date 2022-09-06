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
        <el-input placeholder="ID" v-model="userID" clearable></el-input>
        <el-input show-password placeholder="密码" v-model="pwd" clearable></el-input>
        <el-input placeholder="昵称" v-model="userName" clearable></el-input>
        <el-input placeholder="电话号码" v-model="tel" clearable></el-input>
        <el-input placeholder="邮箱" v-model="mail" clearable></el-input>
        <el-button @click="signUp"> 注册</el-button>
        <el-button @click="change2driver" v-if="this.signUpType === 'customer'"> 我是司机 </el-button>
        <el-button @click="change2customer" v-else> 我是用户 </el-button>
        <el-button @click="disappear"> 返回欢迎界面 </el-button>
      </div>

      <div class="message">
        目前, 您将作为 {{this.showingSignType}} 注册.
      </div>


    </el-card>

    <vue-firework :el="this.$refs.main"></vue-firework>

  </div>
</template>

<script>
import axios from 'axios'
import sjcl from 'sjcl'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },


  data() {
    return {
      spring_boot_url_base: "http://localhost:17747/",
      pwd: "",
      userID: "",
      userName: "",
      tel: "",
      mail: "",
      signUpType: "customer"
    }
  },

  computed: {
    showingSignType() {
      return this.signUpType === 'customer' ? "顾客" : "司机"
    }
  },
  methods: {
    change2driver() {
      this.signUpType = "driver"
    },

    change2customer() {
      this.signUpType = "customer"
    },

    disappear() {
      this.$router.push('/welcome')
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



    signUp() {
      if (!this.isCorrect_phone()) {
        this.warnMsg("手机号格式不正确")
        this.tel = ""
      } else if (!this.isCorrect_mail()) {
        this.warnMsg("邮箱格式不正确")
        this.mail = ""
      }
      if (this.signUpType === "customer") {
        this.axiosGet("customer", "POST", {
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
      } else if (this.signUpType === "driver") {
        this.axiosGet("driver", "POST", {
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
        })
      }
    },

    // if status === 200, redirect to Login page.
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
          name: "Login",
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

    isCorrect_phone() {
      var res = /^1[3,456.789][0-9]{9}$/
      return res.test(this.tel)
    },

    isCorrect_mail() {
      var res = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      return res.test(this.mail)
    },

    // 匹配手机号
// var res = /^[1][3,4,5,6.7,8,9][0-9]{9}$/
// let num = 18045216903
// console.log(res.test(num))

// 匹配身份证号码
// var res = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
// var n='52032119890615548X'
// console.log(res.test(n));

// 匹配用户名6-8位（纯数字）
// var res = /^[^0]\d{5,7}$/
// var user=12345678
// console.log(res.test(user));

// 匹配密码6-8位（数字加字符）
// var res=/^\w{5,7}$/
// var pwd='12345d_'
// console.log(res.test(pwd));

// 匹配QQ号码
// var res = /^[^0]\d{4,9}$/  //  /^[1-9][0-9]{4,9}$/
// var q = '0848514604'
// console.log(res.test(q));

// 取掉前后空格
// var res =/(^\s*)|(\s*$)/g
// let str = '  dsf sdfs fsdf 第三方  '
// console.log(str.replace(res,""))

// 取掉所有空格
// var res =/\s/g
// let str = '  dsf sdfs fsdf 第三方  '
// console.log(str.replace(res,""))

// 匹配邮箱
// var res = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
// var email='2384591034@gamil.com'
// console.log(res.test(email));



  }


}
</script>

<style scoped>

</style>
