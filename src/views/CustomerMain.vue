<template>
  <div class="root">
    <el-container>
      <el-aside width="14%" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px">
        <div class="left_menu" >
          <el-row class="my_row">
            <el-col >
              <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
                  style="height: 100vh">
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">地图</span>
                </el-menu-item>

                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title" @click="layOut_.DingDanVisible = true">订单</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title" >余额</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">我的</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>

      </el-aside>
      <el-main style="height: 100%; margin-top: -18px">
        <div class="main" v-if="this.loggedIn">
          <div id="mapContainer" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px">

          </div>
          <br/><br/>
          <el-card shadow="always" style=" border-radius: 30px">
            <el-row>
              <el-col :span="6"><div class="grid-content bg-purple">
                <el-button @click="bindClickEvent"> 选取点</el-button>
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                <el-button @click="toHere"> 到这儿去</el-button>
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                <el-button @click="init_profile(id_)"> init_profile</el-button>
              </div></el-col>
            </el-row>
          </el-card>

          <div class="profile">
            <div v-if="customer.haveImg">
              <avatar :src="customer.image">

              </avatar>
              {{ this.id_ }}
              <br/>
              {{ this.customer.name }}
              <br/>
              {{ this.customer.tel }}
              <br/>
              {{ this.customer.mail }}
            </div>
          </div>


          <div class="viewController">

          </div>
        </div>

        <div v-else>
          你尚未登陆!
        </div>

      </el-main>
    </el-container>

    <el-dialog title="订单" :visible.sync="layOut_.DingDanVisible">

    </el-dialog>

    <el-dialog title="余额" :visible.sync="layOut_.YuEVisible">

    </el-dialog>

    <el-dialog title="我的" :visible.sync="layOut_.WoDeVisible">

    </el-dialog>

    <el-dialog title="您想为这次的订单打几分？" :visible.sync="give_score_dialog_visible">
      <el-input placeholder="评分(可选)" v-model="my_score" clearable></el-input>
      <el-button @click="give_score"> 确定 </el-button>
    </el-dialog>

  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";
import Avatar from 'vue-avatar'

export default {
  name: "CustomerMain",

  components: {
    Avatar
  },

  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
    document.addEventListener('keydown', this.handleKeyDown);
    this.init_socket();
  },


  data() {
    return {
      moneyToPay: "",
      billId: "",
      layOut_: {
        DiTuVisible: true,
        DingDanVisible: false,
        YuEVisible: false,
        WoDeVisible: false
      },
      give_score_dialog_visible: false,
      my_score: "",
      spring_boot_url_base: "http://localhost:17747/",
      customer: {
        id: "",
        name: "",
        tel: "",
        mail: "",
        haveImg: false,
        image: "",
      },
      map: null,
      person_speed: 0.01,
      target_place: [],
      target_place_marker: null,
      infoWindow: null,
      now_status: {
        my_place: [105.602725, 37.076636],
        have_driver: false,
        my_dot_marker: null,
        driver_place: [],
        driver_marker: null,
        driver: {
          name: "",
          id: null,
          tel: null,
          mail: null,
          speed: 0.01,
          carId: "",
          score: 0,
          runtimes: 0
        },
        have_aim: false,
        aim_place: [],
      },

      guide: {
        status: null,
        driving_result: null
      },

      my_socket: {
        msg: '',
        socket: null
      },

      on_car: false,
      exe: null
    }
  },

  computed: {
    speed() {
      return this.person_speed;
    },

    loggedIn() {
      return this.notNil(this.id_)
    },

    id_() {
      return this.$route.params.id_;
    },
  },


  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    toHere() {
      this.axiosGet_Header("running/query4new-travel", "POST",
          {
            customerId: this.id_,
            lng: this.now_status.my_place[0],
            lat: this.now_status.my_place[1],
            lng2: this.target_place[0],
            lat2: this.target_place[1]
          }, {},
          () => {
          }
      );
      this.$message("正在为您寻找最近的司机......")
    },

    initMap() {
      AMapLoader.load({
        key: "ca1beeb0abaeca2b3c3ab0a5ce115a6d",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Driving', 'AMap.ToolBar'],
        // 需要使用的的插件列表，如比例尺'AMap.Scale等
      }).then((AMap_) => {
        this.map = new AMap_.Map("mapContainer", {  //设置地图容器id
          viewMode: "3D",    //是否为3D地图模式
          zoom: 5,           //初始化地图级别
          center: this.now_status.my_place, //初始化地图中心点位置
        });

        AMap.plugin('AMap.ToolBar', () => {//异步加载插件
          var toolbar = new AMap.ToolBar();
          this.map.addControl(toolbar);
        });

      }).catch(e => {
        console.log(e);
      });
    },


    handleKeyDown(e) {
      console.log("ON_CAR = " + this.on_car)
      if (!this.on_car) {
        var key = window.event ? e.keyCode : e.which;
        if (key === 65 || key === 83 || key === 68 || key === 87) {
          console.log("key = " + key)
          console.log("NotNil: MyPlaceMarker = " + !(this.now_status.my_dot_marker === null || this.now_status.my_dot_marker === undefined))
          if (!(this.now_status.my_dot_marker === null || this.now_status.my_dot_marker === undefined)) {
            this.map.remove(this.now_status.my_dot_marker);
          }
          this.del_my_marker_if_exist();
          if (key === 65) {
            // A
            this.now_status.my_place[0] -= this.speed
          } else if (key === 83) {
            // S
            this.now_status.my_place[1] -= this.speed
          } else if (key === 68) {
            // D
            this.now_status.my_place[0] += this.speed
          } else if (key === 87) {
            // W
            this.now_status.my_place[1] += this.speed
          }
          console.log("监听器说：现在位置" + this.now_status.my_place)
          this.setMyDot()
        }
      }
    },
    del_my_marker_if_exist() {
      if (!(this.now_status.my_dot_marker === null || this.now_status.my_dot_marker === undefined)) {
        this.now_status.my_dot_marker = null;
      }
    },
    notNil(obj) {
      return !(obj === null || obj === undefined)
    },
    clickedMap(event_) {
      if (this.notNil(this.infoWindow)) {
        this.infoWindow.close()
      }
      this.target_place = [event_.lnglat.getLng(), event_.lnglat.getLat()];
      var marker = new AMap.Marker({
        position: this.target_place,
        title: '北京'
      });
      if (!(this.target_place_marker === null || this.target_place_marker === undefined)) {
        this.map.remove(this.target_place_marker)
      }

      this.add_banner_on(marker);
      this.map.add(marker);
      this.target_place_marker = marker
    },
    add_banner_on(marker) {
      marker.on('click', () => {
        var content = [this.$refs.infoCard];
        this.infoWindow = new AMap.InfoWindow({
          content: content[0] //传入 dom 对象，或者 html 字符串
        });
        this.infoWindow.open(this.map, this.target_place);
        console.log(content[0])
      })
    },
    setMyDot() {
      this.now_status.my_dot_marker = new AMap.Marker({
        position: this.now_status.my_place,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '我的位置'
      });
      this.map.add(this.now_status.my_dot_marker);
    },

    bindClickEvent() {
      this.map.on('click', this.clickedMap)
    },

    init_socket() {
      if (this.notNil(this.my_socket.socket)) {
        this.my_socket.socket.close()
      }
      this.my_socket.socket = new WebSocket("ws://localhost:17747/api/websocket");
      this.my_socket.socket.onopen = () => {
        this.my_socket.socket.addEventListener('message', ev => {
          this.handle_msg(ev)
        })
        this.my_socket.socket.send("ID: " + this.id_)

      }
    },


    close_socket() {
      this.my_socket.socket.close()
    },

    send(obj) {
      this.my_socket.socket.send(obj)
    },

    naviGate_Car(startLngLat, endLngLat) {
      AMap.plugin('AMap.Driving', () => {
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map
        })
        driving.search(startLngLat, endLngLat, (status, result) => {
          // 未出错时，result即是对应的路线规划方案
          this.guide.status = status;
          this.guide.driving_result = result;
          console.log(result)
        })
      });
    },

    united_print(obj) {
      console.log(JSON.stringify(obj, null, 2));
    },

    setAll(obj, val) {
      Object.keys(obj).forEach((index) => {
        obj[index] = val
      });
    },
    setNull(obj) {
      this.setAll(obj, null);
    },


    clearDriverInfo() {
      this.map.remove(this.now_status.driver_marker)
      this.map.remove(this.target_place_marker)
      this.setNull(this.now_status.driver)
      this.now_status.driver_place = []
      this.now_status.driver_marker = null
      clearInterval(this.exe)
      this.exe = null
    },

    handle_msg(env) {
      if (this.notNil(env.data)) {
        console.log(env.data)
        const obj = JSON.parse(env.data)
        console.log(obj)
        if (this.notNil(obj["CAUGHT"])) {
          this.on_car = obj["CAUGHT"];
          console.log("CAUGHT 更新: on_car = " + this.on_car)
        }
        if (this.notNil(obj["money"])) {
          this.moneyToPay = obj["money"]
        }
        if (this.notNil(obj["billId"])) {
          this.billId = obj["billId"]
          setTimeout(this.give_score, 100)
        }
        if (this.notNil(obj["FINISHED"])) {
          this.$message({
            showClose: true,
            message: "您的订单已结束",
            type: "success"
          })
          this.on_car = false
          console.log("FINISHED 更新: on_car = " + this.on_car)
          document.removeEventListener('keydown', this.handleKeyDown)
          this.clearDriverInfo()
          document.addEventListener('keydown', this.handleKeyDown)
        }
        if (this.notNil(obj["ID"])) {
          this.now_status.driver.id = obj["ID"]
          this.exe = setInterval(() => {
            if (this.notNil(this.map)) {
              this.map.setFitView()
            }
          }, 2000)
        }
        if (this.notNil(obj["ID"])) {
          this.$message({
            showClose: true,
            message: "成功找到司机: " + obj["ID"],
            type: "success"
          })
          this.axiosGet_Header("running/driverInfo", "GET", {
            driverId: obj["ID"]
          }, {}, (response) => {
            const data = response.data;
            this.now_status.driver.name = data["name"];
            this.now_status.driver.tel = data["tel"];
            this.now_status.driver.mail = data["mail"];
            this.now_status.driver.runtimes = data["runtimes"];
            this.now_status.driver.score = data["score"];
            this.now_status.driver.carId = data["carId"];
            console.log(this.now_status.driver)
          })
        }
        if (this.notNil(obj["lng"])) {
          this.now_status.driver_place[0] = obj["lng"]
        }

        if (this.notNil(obj["lat"])) {
          this.now_status.driver_place[1] = obj["lat"]
          this.upDateDriverPlace()
        }

        console.log("现在, 司机的位置: ")
        console.log(this.now_status.driver_place)

        if (this.on_car) {
          if (!(this.now_status.my_dot_marker === null || this.now_status.my_dot_marker === undefined)) {
            this.map.remove(this.now_status.my_dot_marker);
          }
          this.del_my_marker_if_exist();
          this.now_status.my_place[0] = this.now_status.driver_place[0]
          this.now_status.my_place[1] = this.now_status.driver_place[1]
          this.setMyDot()
        }
      }
    },


    show_give_score_dialog() {

    },

    // "PayAndGiveScore")
    // giveScore(String billId, Optional<Integer> score_)
    give_score() {
      this.axiosGet_Header("running/PayAndGiveScore", "GET", {
        billId: this.billId,
        score: parseInt(this.my_score)
      }, {}, () => {
        this.$message({
          message: "支付并打分成功",
          type: "success",
          showClose: true
        })
      })
    },


    raise_dispute() {

    },


    upDateDriverPlace() {
      if (this.notNil(this.now_status.driver_marker)) {
        this.map.remove(this.now_status.driver_marker)
        this.now_status.driver_marker = null;
      }

      this.now_status.driver_marker = new AMap.Marker({
        position: this.now_status.driver_place,
        title: '司机位置'
      })

      this.map.add(this.now_status.driver_marker)
    },


    linearDistance(LngLatA, LngLatB) {
      return AMap.GeometryUtil.distance(p1, p2);
    },

    init_profile(id) {
      this.axiosGet_Config("running/customerInfo", "GET", {customerId: id}, {},
          (response) => {
            let dt = response.data;
            this.customer.mail = dt["mail"];
            this.customer.tel = dt["tel"];
            this.customer.name = dt["name"];
          });

      this.axiosGet_Header("file/get-pic", "GET", {type: "customer", id: id}, {'Content-type': 'image/jpeg'},
          (response) => {
            this.customer.haveImg = false;
            this.customer.image = 'data:image/jpg;base64,'.concat(this.customer.image.concat(response.data));
            this.customer.haveImg = true;
          });
    },



    axiosGet_Config(url, httpType, params, _config, lambdaThen) {
      axios({
        url: url,
        method: httpType,
        config: _config,
        baseURL: this.spring_boot_url_base,
        params: params
      }).then(lambdaThen);
    },


    axiosGet_Header(url, httpType, params, _header, lambdaThen) {
      axios({
        url: url,
        method: httpType,
        headers: _header,
        baseURL: this.spring_boot_url_base,
        params: params
      }).then(lambdaThen);
    },
  }

}
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 650px;
}

body, html {
  height: 100%;
}

</style>