<template>
  <div class="hello">
    <div class="main">
      <el-upload
          class="upload-demo"
          ref="upload"
          :action="this.spring_boot_url_base + 'file/upload'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :data="{userId: this.userID, type: this.signUpType}"
          :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;"
                   size="small"
                   type="success"
                   @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>

    <div class="test">
      <el-button @click="testClick"> Click Me To Test</el-button>
      <div class="div">
        <div>

        </div>
      </div>
      <el-input placeholder="ID" v-model="userID" clearable></el-input>
      <el-input placeholder="密码" v-model="pwd" clearable></el-input>
      <el-input placeholder="用户名" v-model="userName" clearable></el-input>
      <el-input placeholder="电话号码" v-model="tel" clearable></el-input>
      <el-input placeholder="邮箱" v-model="mail" clearable></el-input>
      <el-button @click="signUp"> 注册</el-button>
      <el-button @click="change2driver" v-if="this.signUpType === 'customer'"> 我是司机 </el-button>
      <el-button @click="change2customer" v-else> 我是用户 </el-button>
<!--      <el-button @click="login"> 登录</el-button>-->
      <el-button @click="disappear"> 消失 </el-button>
    </div>

    <div class="message">
      目前, 您将作为 {{this.showingSignType}} 注册.
    </div>
  </div>
</template>

<script>
// id;
// name;
// tel;
// mail;
// passwordSha256;


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
      formData: null,
      fileList: [],
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
    handler({BMap, map}) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    },

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
          passwordSha256: this.my_sha256(this.pwd)
        }, {}, (response) => {
          console.log(response.data)
        });
      }
    },
    // String user, String pwdSha, Optional<String> userType
    login() {
      this.axiosGet("acc/login", "GET",
          {
            user: this.userID,
            pwdSha: this.my_sha256(this.pwd),
            userType: this.signUpType
        }, {},
        (response) => {
          console.log(response.data)
        }
      )
    },

    // my_hash(obj) {
    //   let Base64 = require('js-base64').Base64
    //   return Base64.encode(JSON.stringify(obj, null, 2));
    // },

    testClick() {
      this.axiosGet("acc/isLogin", "GET", {}, {}, (res) => {this.united_print(res.data)})
    },

    my_sha256(str) {
      let hash = sjcl.hash.sha256.hash(str);
      return sjcl.codec.hex.fromBits(hash);
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

.map {
  width: 100%;
  height: 400px;
}

</style>
