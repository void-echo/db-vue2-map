<template>
  <div class="root">
    <el-container>
      <el-aside width="14%" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px">
        <div class="left_menu">
          <el-row class="my_row">
            <el-col>
              <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  style="height: 100vh">
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">地图</span>
                </el-menu-item>

                <el-menu-item index="2" @click="SIDE_DING_DAN">
                  <i class="el-icon-menu"></i>
                  <span slot="title">订单</span>
                </el-menu-item>
                <el-menu-item index="3" @click="SIDE_YU_E">
                  <i class="el-icon-document"></i>
                  <span slot="title">收益</span>
                </el-menu-item>
                <el-menu-item index="4" @click="SIDE_WO_DE">
                  <i class="el-icon-setting"></i>
                  <span slot="title">我的</span>
                </el-menu-item>
                <el-menu-item index="5" @click="SIDE_CAR">
                  <i class="el-icon-setting"></i>
                  <span slot="title">汽车</span>
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
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button @click="catchNewBill" v-if="this.requestProcessing">接单</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button @click="processYoYaKu" v-if="yoYaKu.btmVisible">处理预约单</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button @click="customerGotOnCar">确认乘客已经上车</el-button>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button @click="endThisDrearyRide">结束订单</el-button>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-button @click="openGPS">GPS</el-button>
                </div>
              </el-col>
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

    <el-dialog title="订单" :visible.sync="layOut_.DingDanVisible" width="90%" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 5%;">
      <div>
        <el-table
            :data="allBillsOfMe"
            height="500"
            border
            style="width: 100%">
          <el-table-column prop="id" label="编号" width="180"></el-table-column>
          <el-table-column prop="time" label="姓名" width="180"></el-table-column>
          <el-table-column prop="money" label="金额"></el-table-column>
          <el-table-column prop="score" label="评分"></el-table-column>
          <el-table-column prop="driverId" label="司机用户名"></el-table-column>
          <el-table-column prop="customerId" label="顾客用户名"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="duration" label="持续时间"></el-table-column>
          <el-table-column prop="fromPlace" label="从"></el-table-column>
          <el-table-column prop="toPlace" label="到"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="收益" :visible.sync="layOut_.YuEVisible">

    </el-dialog>

    <el-dialog title="发现新的预约订单" :visible.sync="yoYaKu.confirmDialogVisible" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 12%;">
      <div>
        确认接单吗？
      </div>

      <span slot="footer">
        <el-button @click="cancelYoYaKuBill"> 取消 </el-button>
        <el-button @click="handleYoYaKuBill"> 确定接单 </el-button>
      </span>
    </el-dialog>

    <el-dialog title="我的" :visible.sync="layOut_.WoDeVisible" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 12%;">
      <div class="profile" v-if="profileNotEditing">
        <div v-if="driver.haveImg">
          <div style="align-items: center; text-align: center">
            <div class="grid-content bg-purple">
              <avatar :src="driver.image" :size="100"></avatar>
            </div>
          </div>
        </div>
        <el-descriptions class="margin-top" :column="2">
          <el-descriptions-item label="用户名"> {{ this.id_ }}</el-descriptions-item>
          <el-descriptions-item label="昵称"> {{ this.driver.name }}</el-descriptions-item>
          <el-descriptions-item label="电话"> {{ this.driver.tel }}</el-descriptions-item>
          <el-descriptions-item label="邮箱"> {{ this.driver.mail }}</el-descriptions-item>
        </el-descriptions>
        <div>
          <el-button v-if="!driver.haveImg" @click="changeImage"> 添加头像</el-button>
          <el-button v-else @click="changeImage"> 修改头像</el-button>
          <el-button> 修改</el-button>
          <el-button @click="layOut_.WoDeVisible = false"> 关闭</el-button>
        </div>
      </div>

      <el-dialog :visible.sync="innerVisible" append-to-body>
        <uploader :user-id="driver.id" sign-up-type="driver"></uploader>
      </el-dialog>
    </el-dialog>

    <el-dialog title="汽车" :visible.sync="layOut_.CarVisible" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 12%;">
      <div>
        <div v-if="layOut_.haveCar">
          <div v-if="driver.hisCar.haveImg">
            <div style="align-items: center; text-align: center">
              <div class="grid-content bg-purple">
                <avatar :src="driver.hisCar.image" :size="100"></avatar>
              </div>
            </div>
          </div>
          <el-descriptions class="margin-top" :column="2">
<!--            id: "",
          use_start_time: "",
          band: "",
          type: "",
          max_speed: 0,
          haveImg: false,
          img: ""-->
            <el-descriptions-item label="用户名"> {{ this.driver.hisCar.id }}</el-descriptions-item>
            <el-descriptions-item label="开始使用时间"> {{ this.driver.hisCar.use_start_time }}</el-descriptions-item>
            <el-descriptions-item label="车型"> {{ this.driver.hisCar.type }}</el-descriptions-item>
            <el-descriptions-item label="最高时速"> {{ this.driver.hisCar.max_speed }}</el-descriptions-item>
          </el-descriptions>
          <div>
            <el-button v-if="!driver.hisCar.haveImg" @click="changeImage2"> 添加头像</el-button>
            <el-button v-else @click="changeImage2"> 修改车辆照片 </el-button>
            <el-button> 修改</el-button>
            <el-button @click="layOut_.CarVisible = false"> 关闭</el-button>
          </div>

          <el-dialog :visible.sync="Image2" append-to-body>
            <uploader :user-id="driver.hisCar.id" sign-up-type="car"></uploader>
          </el-dialog>
        </div>

        <div v-if="!layOut_.haveCar">
          <div>
            您还没有绑定车辆哦! <br/> <br/> 点击下方按钮绑定或注册车辆吧.
          </div>
          <el-button @click="car_bind__"> 绑定</el-button>
          <el-button @click="car_sign_up__"> 注册</el-button>
        </div>
      </div>

      <el-dialog :visible.sync="inner2visible" append-to-body>
        <div>
          <div v-if="signUpForCarVisible">
            <div>ID
              <el-input v-model="signUpCar.id"></el-input>
            </div>
            <div>品牌
              <el-input v-model="signUpCar.band"></el-input>
            </div>
            <div>最高时速
              <el-input-number v-model="signUpCar.max_speed"></el-input-number>
            </div>
            <div>车辆类型
              <el-input v-model="signUpCar.car_type"></el-input>
            </div>
            <div> 在此上传照片</div>
            <div>
              <uploader :userId="signUpCar.id" signUpType="car" v-if="canShowCarSignUpFileUpLoader"></uploader>
              <el-button @click="car_sign_up_finish">确定</el-button>
            </div>
          </div>
          <div v-if="bindCarVisible">
            请选择要绑定的汽车 ID: <br/><br/>
            <div>
              <el-input v-model="carIdToBind"></el-input>
            </div>
            <div>
              <el-button @click="car_bind_finish">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";
import Uploader from "@/components/Uploader";
import Avatar from 'vue-avatar'


export default {
  name: "DriverMain",

  components: {
    Uploader,
    Avatar
  },

  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
    document.addEventListener('keydown', this.handleKeyDown);
    this.init_socket();
  },


  computed: {
    canShowCarSignUpFileUpLoader() {
      console.log("能显示车辆的 uploader 吗? " + ((this.signUpCar.band !== "") && (this.notNil(this.signUpCar.id))))
      return ((this.signUpCar.band !== "") && (this.notNil(this.signUpCar.id)))
    },
    id_() {
      return this.$route.params.id_;
    },

    loggedIn() {
      return this.notNil(this.id_)
    },

  },

  data() {
    return {
      allBillsOfMe: null,
      layOut_: {
        DiTuVisible: true,
        DingDanVisible: false,
        YuEVisible: false,
        WoDeVisible: false,
        CarVisible: false,
        haveCar: false
      },
      innerVisible: false,
      signUpForCarVisible: false,
      bindCarVisible: false,
      inner2visible: false,       // inner2visible = signUpForCarVisible | bindCarVisible 一定要注意
      signUpCar: {
        id: "",
        band: "",
        max_speed: 40,
        car_type: ""
      },
      carIdToBind: "",
      profileNotEditing: true,
      geoVar: null,

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
        carId: "",
        hisCar: {
          id: "",
          use_start_time: "",
          band: "",
          type: "",
          max_speed: 0,
          haveImg: false,
          img: ""
        }
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
      customer: {
        id: "",
        name: "",
        tel: "",
        mail: "",
        haveImg: false,
        image: "",
      },
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

      yoYaKu: {
        btmVisible: false,
        confirmDialogVisible: false,
        preBillId: null,
        customerId: null,
        customer_yoYaKu_Place: [],
        customer_dest_Place: [],
        markerA: null,
        markerB: null
      },

      yoYaKuConfirmVisible: false,

      bill: {
        id: "",
        timeStart: null,
        timeEnd: null,
        driver_id: "",
        customer_id: "",
        status: ""
      },

      Image2: false  // 车辆照片
    }
  },


  methods: {

    changeImage2() {
      this.Image2 = true
    },
    getAllBillsOfMe() {
      this.axiosGet_Config("bill/get-all-by-driver", "GET", {
        driverId: this.id_
      }, {}, (res) => {
        if (res.status === 200) {
          this.allBillsOfMe = res.data;
          this.layOut_.DingDanVisible = true
        }
      })
    },
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
        plugins: ['AMap.Driving', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.Scale'],
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

        this.geoVar = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量
          offset: [10, 20],
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          position: 'RB'
        })

        this.map.addControl(new AMap.Scale())
      }).catch(e => {
        console.log(e);
      });
    },

    SIDE_DING_DAN() {
      this.getAllBillsOfMe()
    },

    SIDE_YU_E() {
      this.layOut_.YuEVisible = true
    },

    SIDE_WO_DE() {
      console.log("点击：我的")
      this.init_profile(this.id_)
    },

    SIDE_DI_TU() {
      this.layOut_.DiTuVisible = true
    },

    SIDE_CAR() {
      this.UPDATE_HIS_CAR()
      console.log("他的车如下")
      console.log(this.driver.hisCar)
      if (this.notNil(this.driver.carId) && this.driver.carId !== "") {
        this.layOut_.haveCar = true
        console.log("有车")
      } else {
        this.layOut_.haveCar = false
        console.log("没车")
      }
      this.layOut_.CarVisible = true
    },


    // 以下两个:  v-if="!layOut_.haveCar" 的情况下有对应的按钮
    car_bind__() {
      this.bindCarVisible = true
      this.inner2visible = true
    },

    car_bind_finish() {
      /*     @RequestMapping("bind-car-to-driver")
    public ResponseEntity<Boolean> bindCar2driver(String driverId, String carId) {
 */
      this.axiosGet_Config("running/bind-car-to-driver", "GET", {
        driverId: this.id_,
        carId: this.carIdToBind
      }, {}, (res) => {
        if (res.status === 200 && res.data === true) {
          this.$message({
            message: "绑定车辆成功! ",
            type: "success",
            showClose: true
          })
        }
      })
      this.driver.carId = this.carIdToBind
      this.bindCarVisible = false
      this.inner2visible = false
      setTimeout(() => {
        this.layOut_.CarVisible = false;
      }, 300)
    },

    car_sign_up__() {
      this.signUpForCarVisible = true
      this.inner2visible = true
    },
    // layout.CarVisible
    // signUpForCarVisible: false,
    // bindCarVisible: false,
    // inner2visible: false,       // inner2visible = signUpForCarVisible | bindCarVisible 一定要注意
    car_sign_up_finish() {
      // String driverId, String carId, String band, int max_speed, String carType
      this.axiosGet_Config("running/sign-up-new-car", "GET", {
        driverId: this.id_,
        carId: this.signUpCar.id,
        band: this.signUpCar.band,
        max_speed: this.signUpCar.max_speed,
        carType: this.signUpCar.car_type
      }, {}, (res) => {
        if (res.status === 200 && res.data === true) {
          this.driver.carId = this.signUpCar.id
          this.$message({
            message: "注册车辆成功! ",
            type: "success",
            showClose: true
          })
        }
      })
      this.signUpForCarVisible = false
      this.inner2visible = false
      setTimeout(() => {
        this.layOut_.CarVisible = false;
      }, 300)
    },


    openGPS() {
      AMap.plugin('AMap.Geolocation', () => {
            if (this.notNil(this.geoVar)) {
              this.geoVar.getCurrentPosition((status, result) => {
                console.log(status)
                if (status === 'complete') {
                  this.onComplete(result)
                } else {
                  this.onError(result)
                }
              });
            }
          }
      )
    },

    onComplete(data) {
      console.log("定位成功，定位信息：")
      console.log(data)
      let lng__ = data["position"]["lng"]
      let lat__ = data["position"]["lat"]
      if (this.notNil(this.now_status.my_dot_marker)) {
        this.map.remove(this.now_status.my_dot_marker)
      }
      this.now_status.my_place[0] = lng__
      this.now_status.my_place[1] = lat__

      this.del_my_marker_if_exist()
      // data是具体的定位信息
      this.now_status.my_dot_marker = new AMap.Marker({
        position: this.now_status.my_place,
        title: '我的位置'
      })

      this.map.add(this.now_status.my_dot_marker)
      this.map.setFitView();
    },

    onError(data) {
      console.log("定位失败，定位信息：")
      console.log(data)
      // 定位出错
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

    processYoYaKu() {
      this.yoYaKu.confirmDialogVisible = true
    },

    handle_msg(env) {
      if (this.notNil(env.data)) {
        console.log(env.data)
        const obj = JSON.parse(env.data)
        const isYoYaKu =( this.notNil(obj["isYoYaKu"]) && (obj["isYoYaKu"] === true))
        if (isYoYaKu) {
          let OP = obj["dateTime"]
          this.yoYaKu.btmVisible = true
          this.yoYaKu.customer_yoYaKu_Place[0] = obj["lng"]
          this.yoYaKu.customer_yoYaKu_Place[1] = obj["lat"]
          this.yoYaKu.customer_dest_Place[0] = obj["lng2"]
          this.yoYaKu.customer_dest_Place[1] = obj["lat2"]
          if (this.notNil(this.yoYaKu.markerA)) {
            this.map.remove(this.yoYaKu.markerA)
          }

          if (this.notNil(this.yoYaKu.markerB)) {
            this.map.remove(this.yoYaKu.markerB)
          }
          this.$message("发现新的预约单请求")
          this.yoYaKu.markerA = new AMap.Marker({
            position: this.yoYaKu.customer_yoYaKu_Place,
            title: "乘客上车点",
          })
          this.map.add(this.yoYaKu.markerA)

          this.yoYaKu.markerB = new AMap.Marker({
            position: this.yoYaKu.customer_dest_Place,
            title: "乘客上车点",
          })
          this.map.add(this.yoYaKu.markerB)

        } else {
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
      }
    },

    init_profile(id) {
      this.axiosGet_Config("running/driverInfo", "GET", {driverId: id}, {},
          (response) => {
            let dt = response.data;
            this.driver.id = dt["id"]
            this.driver.mail = dt["mail"];
            this.driver.tel = dt["tel"];
            this.driver.name = dt["name"];
            this.driver.carId = dt["carId"];
            this.UPDATE_HIS_CAR()
          });

      this.axiosGet_Header("file/get-pic", "GET", {type: "driver", id: id}, {'Content-type': 'image/jpeg'},
          (response) => {
            if (response.data === "") {
              console.log("司机没有头像")
            } else {
              this.driver.haveImg = false;
              this.driver.image = 'data:image/jpg;base64,'.concat(response.data);
              this.driver.haveImg = true;
            }
            this.layOut_.WoDeVisible = true
          });
    },


    UPDATE_HIS_CAR() {
      if ((this.driver.carId !== "") && this.notNil(this.driver.carId)) {
        this.layOut_.haveCar = true
        console.log("UPDATE_HIS_CAR() 显示司机有没有车?" + ((this.driver.carId !== "") && this.notNil(this.driver.carId)))
        this.axiosGet_Config("car/" + this.driver.carId, "GET", {}, {},
            (res) => {
              let dt = res.data;
              if (this.notNil(dt)) {
                if (this.notNil(dt["id"])) {
                  this.driver.hisCar.id = dt["id"]
                }
                if (this.notNil(dt["startUsingTime"])) {
                  this.driver.hisCar.use_start_time = dt["startUsingTime"]
                }
                if (this.notNil(dt["band"])) {
                  this.driver.hisCar.band = dt["band"]
                }
                if (this.notNil(dt["carType"])) {
                  this.driver.hisCar.type = dt["carType"]
                }
                if (this.notNil(dt["maxSpeed"])) {
                  this.driver.hisCar.max_speed = dt["maxSpeed"]
                }
              }

              this.axiosGet_Header("file/get-pic", "GET", {
                type: "car",
                id: this.driver.hisCar.id
              }, {'Content-type': 'image/jpeg'}, (response) => {
                if (response.data === "") {
                  console.log("汽车没有图片")
                } else {
                  this.driver.hisCar.haveImg = false;
                  this.driver.hisCar.image = 'data:image/jpg;base64,'.concat(response.data);
                  this.driver.hisCar.haveImg = true;
                }
              })
            })

      }

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

    cancelYoYaKuBill() {

    },
    handleYoYaKuBill() {

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


    changeImage() {
      this.innerVisible = true
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
  width: 100%;
  height: 650px;
}

body, html {
  height: 100%;
}



</style>