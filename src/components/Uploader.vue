<template>
<div class="root">
  <div class="main">
    <el-upload
        class="upload-demo"
        ref="upload"
        :action="spring_boot_url_base + 'file/upload'"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :data="my_data"
        :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;"
                 size="small"
                 type="success"
                 @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

  </div>
</div>
</template>

<script>
export default {
  name: "Uploader",

  updated() {
    console.log("新的文件上传器被更新了")
    console.log("userId: " + this.my_data.userId)
    console.log("type: " + this.my_data.type)
  },

  props: {
    userId: String,
    signUpType: String,   // customer | driver,
    hotUpdate: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    if (this.hotUpdate) {

    }
  },

  data() {
    return {
      my_data: {
        userId: this.userId,
        type: this.signUpType
      },
      formData: null,
      fileList: [],
      spring_boot_url_base: "http://localhost:17747/",
    }
  },

  methods: {
    submitUpload() {
      try {
        console.warn = () => {}
        this.$refs.upload.submit();
        setTimeout(() => {this.$refs.upload.clearFiles();}, 100)
        this.fileList = []
      } catch (e) {
        console.log("Ha Ha Ha")
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },

    united_print(obj) {
      console.log(JSON.stringify(obj, null, 2));
    },
  }
}
</script>

<style scoped>

</style>