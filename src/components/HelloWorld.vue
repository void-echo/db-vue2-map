<template>
  <div ref="main" class="hello" style="position: absolute; margin: auto; top: 0;
        left: 0;
        right: 0;
        bottom: 0;">
    <div class="main">
<!--      <el-upload-->
<!--          class="upload-demo"-->
<!--          ref="upload"-->
<!--          :action="this.spring_boot_url_base + 'file/upload'"-->
<!--          :on-preview="handlePreview"-->
<!--          :on-remove="handleRemove"-->
<!--          :file-list="fileList"-->
<!--          :data="{userId: this.userID, type: this.signUpType}"-->
<!--          :auto-upload="false">-->
<!--        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--        <el-button style="margin-left: 10px;"-->
<!--                   size="small"-->
<!--                   type="success"-->
<!--                   @click="submitUpload">上传到服务器</el-button>-->
<!--        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--      </el-upload>-->
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
      center: {lng: 0, lat: 0},
      zoom: 3,
      keyword: "",
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
      let a = this.my_sha256(pwd)
      let total = this.userID + a;
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


  }


}
</script>

<style scoped>

</style>
