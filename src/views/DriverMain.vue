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
                <el-button @click="catchNewBill" v-if="this.requestProcessing">接单</el-button>
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                <el-button @click="customerGotOnCar">确认乘客已经上车</el-button>
              </div></el-col>
              <el-col :span="6"><div class="grid-content bg-purple">
                <el-button @click="endThisDrearyRide">结束订单</el-button>
              </div></el-col>
            </el-row>
          </el-card>
        </div>
        <div v-else>
          你尚未登陆!
        </div>

      </el-main>
    </el-container>
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: auto;">
      <span> 请输入本次的定价 </span>
      <div>
        <el-input v-model="billPrice" placeholder="本次收取价格" clearable></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmBillPrice">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog title="订单" :visible.sync="layOut_.DingDanVisible">

    </el-dialog>

    <el-dialog title="余额" :visible.sync="layOut_.YuEVisible">

    </el-dialog>

    <el-dialog title="我的" :visible.sync="layOut_.WoDeVisible">

    </el-dialog>


  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";
import Avatar from 'vue-avatar'


export default {
  name: "DriverMain",

  components: {
    // Avatar
  },

  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
    document.addEventListener('keydown', this.handleKeyDown);
    this.init_socket();
  },


  computed: {
    id_() {
      return this.$route.params.id_;
    },

    loggedIn() {
      return this.notNil(this.id_)
    },

  },

  data() {
    return {
      layOut_: {
        DiTuVisible: true,
        DingDanVisible: false,
        YuEVisible: false,
        WoDeVisible: false
      },

      billPrice: "",
      centerDialogVisible: false,
      spring_boot_url_base: "http://localhost:17747/",
      speed: 0.1,
      driver: {
        id: "",
        name: "",
        tel: "",
        mail: "",
        haveImg: false,
        image: "",
      },
      map: null,
      now_status: {
        my_place: [120.10101, 39.23098],
        my_dot_marker: null,
      },
      my_socket: {
        msg: '',
        socket: null
      },

      upDateIntervalSet: false,
      startedMoving: false,
      exe: null,  // execute per second 4 place update
      exe__: null,   // execute per 2 second 4 view fit
      customer: null,
      customer_marker: null,
      destination: [],
      destination_marker: null,
      requestProcessing: false, // 如果是，则会问你是否接单。
      preBillId: "",
      customerId: "",
      cat: {
        // used for navigation
        lng: 0,
        lat: 0,
        lng2: 0,
        lat2: 0
      },

      guide: {
        driving: null,
        status: null,
        driving_result: null
      },

      bill: {
        id: "",
        timeStart: null,
        timeEnd: null,
        driver_id: "",
        customer_id: "",
        status: ""
      }
    }
  },


  methods: {
    confirmBillPrice() {
      this.axiosGet_Config("running/store1bill", "GET", {
        billId: this.preBillId,
        customerId: this.customerId,
        money: this.billPrice
      }, {}, () => {
        this.customerId = ""
      })
      this.centerDialogVisible = false
    },
    toHere() {
      this.naviGate_Car(this.now_status.my_place, this.target_place)
    },

    initMap() {
      AMapLoader.load({
        key: "ca1beeb0abaeca2b3c3ab0a5ce115a6d",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Driving', 'AMap.ToolBar'],
        // 需要使用的的插件列表，如比例尺'AMap.Scale等
      }).then((AMap_) => {
        this.map = new AMap_.Map("mapContainer", {  //设置地图容器id
          resizeEnable: true,
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

    united_print(obj) {
      console.log(JSON.stringify(obj, null, 2));
    },

    handle_msg(env) {
      if (this.notNil(env.data)) {
        console.log(env.data)
        const obj = JSON.parse(env.data)
        if (this.notNil(obj["preBillId"])) {
          this.preBillId = obj["preBillId"]
        }
        if (this.notNil(obj["customerId"])) {
          this.customerId = obj["customerId"]
        }
        if (this.notNil(obj["lng"])) {
          this.cat.lng = obj["lng"]
        }
        if (this.notNil(obj["lat"])) {
          this.cat.lat = obj["lat"]
        }
        if (this.notNil(obj["lng2"])) {
          this.cat.lng2 = obj["lng2"]
        }
        if (this.notNil(obj["lat2"])) {
          if (this.notNil(this.customer_marker)) {
            this.map.remove(this.customer_marker)
          }

          if (this.notNil(this.destination_marker)) {
            this.map.remove(this.destination_marker)
          }
          this.cat.lat2 = obj["lat2"]
          this.requestProcessing = true
          this.$message("发现新的乘客打车请求")
          this.setCustomerDot(this.cat.lng, this.cat.lat)
          this.setDestinationDot(this.cat.lng2, this.cat.lat2)
          this.map.setFitView();
        }
      }
    },

    init_profile(id) {
      this.axiosGet_Config("running/driverInfo", "GET", {driverId: id}, {},
          (response) => {
            let dt = response.data;
            this.driver.mail = dt["mail"];
            this.driver.tel = dt["tel"];
            this.driver.name = dt["name"];
          });

      this.axiosGet_Header("file/get-pic", "GET", {type: "customer", id: id}, {'Content-type': 'image/jpeg'},
          (response) => {
            this.customer.haveImg = false;
            this.customer.image = 'data:image/jpg;base64,'.concat(this.customer.image.concat(response.data));
            this.customer.haveImg = true;
          });
    },


    placeUpdateOne() {
      this.axiosGet_Config("running/updateDriverPlace", "POST",
          {
            id: this.id_,
            lng: this.now_status.my_place[0],
            lat: this.now_status.my_place[1],
          }, {},
          () => {

          })
    },

    placeUpdateTwo() {
      this.my_socket.socket.send("PLACE: " + this.now_status.my_place[0] + " , " + this.now_status.my_place[1]);
    },


    handleKeyDown(e) {
      this.startedMoving = true;
      if (!this.upDateIntervalSet) {
        this.upDateIntervalSet = true
        if (this.notNil(this.exe) || this.exe !== {}) {
          clearInterval(this.exe)
        }
        this.exe = setInterval(this.placeUpdateOne, 1000)
      }

      var key = window.event ? e.keyCode : e.which;
      if (key === 65 || key === 83 || key === 68 || key === 87) {
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
        this.setMyselfDot()
      }

    },

    del_my_marker_if_exist() {
      if (!(this.now_status.my_dot_marker === null || this.now_status.my_dot_marker === undefined)) {
        this.now_status.my_dot_marker = null;
      }
    },

    setMyselfDot() {
      this.now_status.my_dot_marker = new AMap.Marker({
        position: this.now_status.my_place,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '我的位置'
      });
      this.map.add(this.now_status.my_dot_marker);
    },


    catchNewBill() {
      // preBillId, String customerId, String driverId
      this.axiosGet_Config("running/handle-new-travel", "GET",
          {
            preBillId: this.preBillId,
            customerId: this.customerId,
            driverId: this.id_
          }, {},
          (response) => {
            let data = response.data;
            console.log(data)
            if (data === 'success') {
              this.exe = null;
              this.requestProcessing = false
              this.naviGate_Car(this.cat.lng, this.cat.lat, this.cat.lng2, this.cat.lat2)
            } else {
              this.map.remove(this.customer_marker)
              this.map.remove(this.destination_marker)
              this.$message({
                type: "error",
                message: "该乘客已经被接单",
                showClose: true
              })

              this.requestProcessing = false
            }
          }
      )
    },

    endThisDrearyRide() {
      this.centerDialogVisible = true
      this.axiosGet_Config("running/rideEnd", "GET",
          {
            driverId: this.id_,
            customerId: this.customerId
          }, {},
          (response) => {
            let data = response.data
            if (data === "success") {
              if (this.notNil(this.exe) || this.exe !== {}) {
                clearInterval(this.exe)
              }
              this.exe = null
              if (this.notNil(this.exe__)) {
                clearInterval(this.exe__)
                this.exe__ = null
              }
              this.upDateIntervalSet = false
              this.startedMoving = false
              this.customer = null
              this.map.remove(this.customer_marker)
              this.map.remove(this.destination_marker)
              this.guide.driving.clear()
              this.destination_marker = null
              this.customer_marker = null
              this.destination = []
              this.setNull(this.cat)
              this.map.remove(this.guide.driving_result)
              this.guide.driving_result = null
              this.guide.status = null
              this.$message({
                showClose: true,
                message: "成功完成了一个订单! 详细账单已发送至乘客。",
                type: "success"
              })
              setTimeout(() => {
                this.$message({
                  showClose: true,
                  message: "乘客付款之后，支付费用将汇至您的账户。",
                  type: "success"
                })
              }, 2000)
            }
            // TODO HERE: WHO CARES HOW THE CUSTOMER RESPONSE TO ME ?
          })

    },


    naviGate_Car(lng, lat, lngDest, latDest) {
      console.log("开始规划路线")
      AMap.plugin('AMap.Driving', () => {
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map
        })
        this.guide.driving = driving
        let kara = [this.now_status.my_place[0], this.now_status.my_place[1]];
        let made = [lngDest, latDest]

        driving.search(kara, made, {waypoints: [[lng, lat]]}, (status, result) => {
          this.guide.status = status;
          this.guide.driving_result = result;
          console.log(status)
          console.log(result)
          console.log("规划完成")
          if (this.notNil(this.exe) || this.exe !== {}) {
            clearInterval(this.exe)
          }
          this.exe = setInterval(this.placeUpdateTwo, 1000)
          this.exe__ = setInterval(() => {
            if (this.notNil(this.map)) {
              this.map.setFitView()
            }
          }, 2000)
        })
      })
    },

    customerGotOnCar() {
      this.axiosGet_Config("running/caught", "GET",
          {
            customerId: this.customerId
          }, {},
          (response) => {
            let data = response.data;

          })
    },


    setCustomerDot(lng, lat) {
      this.customer_marker = new AMap.Marker({
        position: [lng, lat],
        title: "乘客上车点",
      });
      this.map.add(this.customer_marker);
    },

    setDestinationDot(lng, lat) {
      this.destination_marker = new AMap.Marker({
        position: [lng, lat],
        title: "乘客目的地",
      });
      this.map.add(this.destination_marker);
    },


    notNil(obj) {
      return !(obj === null || obj === undefined)
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
    setAll(obj, val) {
      Object.keys(obj).forEach((index) => {
        obj[index] = val
      });
    },
    setNull(obj) {
      this.setAll(obj, null);
    },
  }
}
</script>

<style scoped>
#mapContainer {
  width: 800px;
  height: 400px;
}

body, html {
  height: 100%;
}

</style>