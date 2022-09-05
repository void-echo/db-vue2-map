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
                  <span slot="title">余额</span>
                </el-menu-item>
                <el-menu-item index="4" @click="SIDE_WO_DE">
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
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-button type="primary" round @click="openGPS">GPS</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-button type="primary" round @click="toHere"> 到这儿去</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-button type="primary" round @click="YO_YAKU"> 发起预约单</el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <div class="hidden__">
          </div>
        </div>

        <div v-else>
          你尚未登陆!
        </div>

      </el-main>
    </el-container>

    <el-dialog title="订单" :visible.sync="layOut_.DingDanVisible" width="90%" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 5%;">
      <div>
        <el-table
            :data="visibleAllBillsOfMe"
            height="500"
            border
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%">
          <el-table-column sortable prop="id" label="编号" width="180">

          </el-table-column>
          <el-table-column sortable prop="time" label="时间" width="180">

          </el-table-column>
          <el-table-column sortable prop="money" label="金额">

          </el-table-column>
          <el-table-column sortable prop="score" label="评分">

          </el-table-column>
          <el-table-column sortable prop="driverId" label="司机用户名">

          </el-table-column>
          <el-table-column sortable prop="status" label="状态">

          </el-table-column>
          <el-table-column sortable prop="duration" label="持续时间">

          </el-table-column>
          <el-table-column sortable prop="fromPlace" label="从">

          </el-table-column>
          <el-table-column sortable prop="toPlace" label="到">

          </el-table-column>
          <el-table-column sortable label="操作">
            <template v-slot="scope">
              <el-button round @click="raiseNewDispute(scope.$index, scope.row)"
                         v-if="scope.row['status'] !== '有争议'">
                申请投诉
              </el-button>
              <el-button @click="viewDisputeProcess(scope.$index, scope.row)" type="primary" round v-else>
                查询进度
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="投诉进度" :visible.sync="dispute.checkingProcess" append-to-body width="90%" fullscreen
                 style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 16%;">
        <div>
          <el-descriptions class="margin-top" :column="1">
            <el-descriptions-item label="投诉类型"> {{ this.dispute.check.type }}</el-descriptions-item>
            <el-descriptions-item label="内容"> {{ this.dispute.check.contents }}</el-descriptions-item>
            <el-descriptions-item label="处理结果"> {{ this.dispute.check.checkResult }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dispute.cancelConfirm = true"> 取消投诉 </el-button>
        </span>

        <el-dialog title="确认取消本次投诉吗?" :visible.sync="dispute.cancelConfirm" append-to-body width="90%" fullscreen
                   style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 20%;">
          <el-button @click="cancelDispute">确认</el-button>
        </el-dialog>
      </el-dialog>


      <el-dialog title="投诉申请" :visible.sync="disputeRaisingVisible" append-to-body width="90%" fullscreen
                 style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 10%;">
        <div>
          若司机存在违规行为, 我们将依法采取措施进行处罚并补偿乘客.
        </div>
        <div>
          <div>类型</div>
          <div>
            <span>
            <el-select v-model="raiseDisputeType.value" placeholder="请选择">
              <el-option v-for="item in raiseDisputeType.options"
                         :key="item.value" :label="item.label" :value="item.value">

              </el-option>
            </el-select>
          </span>
          </div>
          <div>
            <br/><br/>
            详情
          </div>
          <div>
            <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="dispute.contents"
                maxlength="100"
                show-word-limit
            >
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="disputeRaisingVisible = false">取 消</el-button>
          <el-button type="primary" @click="_raiseNewDispute">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <el-dialog title="余额" :visible.sync="layOut_.YuEVisible"
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px">

    </el-dialog>

    <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px">
      <el-dialog title="我的" :visible.sync="layOut_.WoDeVisible" center>
        <div class="profile" v-if="profileNotEditing">
          <div v-if="customer.haveImg">
            <div style="align-items: center; text-align: center">
              <div class="grid-content bg-purple">
                <avatar :src="customer.image" :size="100"></avatar>
              </div>
            </div>
          </div>
          <el-descriptions class="margin-top" :column="2">
            <el-descriptions-item label="用户名"> {{ this.id_ }}</el-descriptions-item>
            <el-descriptions-item label="昵称"> {{ this.customer.name }}</el-descriptions-item>
            <el-descriptions-item label="电话"> {{ this.customer.tel }}</el-descriptions-item>
            <el-descriptions-item label="邮箱"> {{ this.customer.mail }}</el-descriptions-item>
          </el-descriptions>
          <div>
            <el-button v-if="!customer.haveImg" @click="changeImage"> 添加头像</el-button>
            <el-button v-else @click="changeImage"> 修改头像</el-button>
            <el-button> 修改</el-button>
            <el-button @click="layOut_.WoDeVisible = false"> 关闭</el-button>
          </div>
        </div>

        <el-dialog :visible.sync="innerVisible" append-to-body>
          <uploader :user-id="customer.id" sign-up-type="customer"></uploader>
        </el-dialog>

      </el-dialog>

    </div>

    <el-dialog title="您想为这次的订单打几分？" :visible.sync="give_score_dialog_visible">
      <el-input-number placeholder="评分(可选)" v-model="my_score" clearable></el-input-number>
      <el-button @click="give_score"> 确定</el-button>
    </el-dialog>

    <el-dialog title="在此选择上车时间" :visible.sync="selectedYoYaKuTime_visible" width="90%" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 18%;">
      <div>
        <div class="block">
          <el-date-picker
              v-model="selectedYoYaKuTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <br/><br/>
        <div>
          <el-button @click="start_yoYaKu"> 确定</el-button>
        </div>
      </div>
    </el-dialog>


    <el-dialog title="已成功找到司机" :visible.sync="now_status.driver.infoVisible" width="90%" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 12%;">
      <div>
        <div v-if="now_status.driver.haveImg">
          <div style="align-items: center; text-align: center">
            <div class="grid-content bg-purple">
              <avatar :src="now_status.driver.img" :size="100"></avatar>
            </div>
          </div>
        </div>
        <el-descriptions class="margin-top" :column="2">
          <el-descriptions-item label="ID "> {{ this.now_status.driver.id }}</el-descriptions-item>
          <el-descriptions-item label="昵称"> {{ this.now_status.driver.name }}</el-descriptions-item>
          <el-descriptions-item label="电话"> {{ this.now_status.driver.tel }}</el-descriptions-item>
          <el-descriptions-item label="邮箱"> {{ this.now_status.driver.mail }}</el-descriptions-item>
        </el-descriptions>
        <div>
          <el-button @click="() => {}"> 确定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";
import Avatar from 'vue-avatar';
import Uploader from "@/components/Uploader";

export default {
  name: "CustomerMain",

  components: {
    Avatar,
    Uploader
  },

  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
    document.addEventListener('keydown', this.handleKeyDown);
    this.init_socket();
  },


  data() {
    return {
      dispute: {
        billId: '',
        type: '',
        contents: '',
        checkingProcess: false,
        cancelConfirm: false,
        check: {
          billId: '',
          type: '',
          contents: '',
          checkResult: '',

        }
      },
      disputeRaisingVisible: false,
      raiseDisputeType: {
        options: [{
          value: '金额问题',
          label: '金额问题'
        }, {
          value: '安全问题',
          label: '安全问题',
        }, {
          value: '其他问题',
          label: '其他问题'
        }],
        value: ''
      },
      lookUpTable: {
        "HANGING": "已发起",
        "WAITING": "等待中",
        "GOING": "进行中",
        "NOT_PAID": "未支付",
        "NOT_SCORED": "未评分",
        "FINISHED": "已完成",
        "ON_DISPUTE": "有争议",
        "ARCHIVED": "已归档"
      },
      yyk: {
        reservedBillId: null,
      },
      allBillsOfMe: null,
      visibleAllBillsOfMe: null,
      innerVisible: false,
      moneyToPay: "",
      billId: "",
      geoVar: null,
      profileDone: false,
      profileNotEditing: true,
      layOut_: {
        DiTuVisible: true,
        DingDanVisible: false,
        YuEVisible: false,
        WoDeVisible: false
      },
      give_score_dialog_visible: false,
      my_score: 5,
      spring_boot_url_base: "http://localhost:17747/",
      customer: {
        id: "",
        name: "",
        tel: "",
        mail: "",
        haveImg: false,
        image: "",
      },
      geocoder: null,
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
          runtimes: 0,
          haveImg: false,
          img: "",
          infoVisible: false
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
      exe: null,
      bill: {
        id: "",
        timeStart: null,
        timeEnd: null,
        driver_id: "",
        customer_id: "",
        status: ""
      },

      selectedYoYaKuTime: null,
      selectedYoYaKuTime_visible: false,

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
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


    // 开始预约
    start_yoYaKu() {
      this.axiosGet_Header("running/query4new-travel", "POST",
          {
            customerId: this.id_,
            lng: this.now_status.my_place[0],
            lat: this.now_status.my_place[1],
            lng2: this.target_place[0],
            lat2: this.target_place[1],
            isYoYaKu: true,
            dateTime: this.selectedYoYaKuTime
          }, {},
          (res) => {
            this.selectedYoYaKuTime_visible = false
            if (res.status === 200)
              this.$message("正在为您寻找最合适的司机......")
            else {
              this.$message({
                message: "服务器发生未知错误",
                type: "error",
                showClose: true
              })
            }
          }
      );

      setTimeout(() => {
        this.goOnReservedBill()
      }, 12000)
    },

    YO_YAKU() {
      this.selectedYoYaKuTime_visible = true
    },
    changeImage() {
      this.innerVisible = true
    },
    initMap() {
      AMapLoader.load({
        key: "ca1beeb0abaeca2b3c3ab0a5ce115a6d",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Driving', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.Scale', 'AMap.Geocoder'],
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

        AMap.plugin('AMap.Geocoder', () => {
          var geocoder = new AMap.Geocoder({})
          this.geocoder = geocoder
        })

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
        this.bindClickEvent()
      }).catch(e => {
        console.log(e);
      });
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
    },

    viewDisputeProcess(a, b) {
      this.dispute.check.billId = b["id"]
      this.axiosGet_Config("dispute/get-1-by-bill-id", "GET", {
        billId: b["id"]
      }, {}, (res) => {
        if (res.status === 200) {
          let dt = res.data
          this.united_print(dt)
          this.dispute.check.type = dt["type"]
          this.dispute.check.contents = dt["contents"]
          if (dt["judgeResult"] !== null)
            this.dispute.check.checkResult = dt["judgeResult"]
          else this.dispute.check.checkResult = "管理员尚未处理"
          this.dispute.checkingProcess = true
        }
      })
    },

    _raiseNewDispute() {
      this.axiosGet_Config("running/raise-dispute", "GET", {
        billId: this.dispute.billId,
        type: this.raiseDisputeType.value,
        contents: this.dispute.contents
      }, {}, (res) => {
        console.log(res)
        if (res.status === 500) {
          this.serverErr()
        } else if (res.status === 200) {
          this.successMsg("投诉成功")
          this.disputeRaisingVisible = false
          this.visibleAllBillsOfMe.forEach((row) => {
            if (row["id"] === this.dispute.billId) {
              row["status"] = "有争议"
            }
          })
        }
      })
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

    successMsg(msg) {
      this.$message({
        message: msg,
        showClose: true,
        type: "success"
      })
    },

    raiseNewDispute(a, b) {
      if (!(b["status"] === "有争议")) {
        this.dispute.billId = b["id"]
        this.disputeRaisingVisible = true
      }
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


    getAllBillsOfMe() {
      this.axiosGet_Config("bill/get-all-by-customer", "GET", {
        customerId: this.id_
      }, {}, (res) => {
        if (res.status === 200) {
          this.united_print(res.data)
          this.allBillsOfMe = res.data;
          this.updateAllBillsOfMe2Visible()
          this.layOut_.DingDanVisible = true
        }
      })
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
    setMyDot() {
      this.now_status.my_dot_marker = new AMap.Marker({
        position: this.now_status.my_place,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '我的位置'
      });
      this.map.add(this.now_status.my_dot_marker);
    },

    goOnReservedBill() {
      this.axiosGet_Header("running/go-on-reserved-bill", "GET", {
        billId: this.yyk.reservedBillId
      }, {}, () => {

      })

      this.$message({
        message: "正在寻找已经预约了的司机"
      })
    },

    bindClickEvent() {
      this.map.on('click', this.clickedMap)
    },

    clickedMap(event_) {
      this.target_place = [event_.lnglat.getLng(), event_.lnglat.getLat()];
      var marker = new AMap.Marker({
        position: this.target_place,
        title: '目的地'
      });
      if (!(this.target_place_marker === null || this.target_place_marker === undefined)) {
        this.map.remove(this.target_place_marker)
      }

      this.map.add(marker);
      this.target_place_marker = marker
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

    getPlaceName_(PlaceList) {
      geocoder.getAddress(PlaceList, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          return result
        }
      })
    },


    getPlaceName(lng, lat) {

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
          this.successMsg("您已上车")
          console.log("CAUGHT 更新: on_car = " + this.on_car)
        }
        if (this.notNil(obj["money"])) {
          this.moneyToPay = obj["money"]
        }
        if (this.notNil(obj["billId"])) {
          this.billId = obj["billId"]
          setTimeout(() => {
            this.give_score_dialog_visible = true
          }, 100)
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
        if (this.notNil(obj["reservedBillId"])) {
          this.yyk.reservedBillId = obj["reservedBillId"]
        }
        if (this.notNil(obj["ID"])) {
          if (this.notNil(obj["YYK_GOT"])) {
            this.$message({
              message: "已有司机: " + obj["ID"] + " 接单",
              type: "success",
              showClose: true
            })
            setTimeout(() => {
              this.$message({
                type: "success",
                message: "届时请保持在线, 以便乘客联系.",
                showClose: true
              })
            }, 250)
          } else {
            this.now_status.driver.id = obj["ID"]
            this.exe = setInterval(() => {
              if (this.notNil(this.map)) {
                this.map.setFitView()
              }
            }, 2000)
          }
        }
        if (this.notNil(obj["ID"])) {
          let _msg = (this.notNil(obj["yyk"]) && obj["yyk"] === true) ? "成功找到预约了的司机" : "成功找到司机: "
          this.$message({
            showClose: true,
            message: _msg + obj["ID"],
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

        if (this.notNil(obj["YYK_GOT"])) {
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: "请在预约时间按时上线",
              type: "success"
            })
          }, 200)
        }
        if (this.notNil(obj["lng"])) {
          this.now_status.driver_place[0] = obj["lng"]
        }

        if (this.notNil(obj["lat"])) {
          this.now_status.driver_place[1] = obj["lat"]
          this.upDateDriverPlace()
          console.log("现在, 司机的位置: ")
          console.log(this.now_status.driver_place)
        }


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
        score_: this.my_score
      }, {}, () => {
        this.$message({
          message: "余额充足, 支付成功",
          type: "success",
          showClose: true
        })
        this.give_score_dialog_visible = false
      })
    },

    cancelDispute() {
      this.axiosGet_Config("running/cancel-dispute", "GET", {
        billId: this.dispute.check.billId
      }, {}, (res)=>{
        if ((res.status === 200) && (res.data === "success")) {
          this.successMsg("取消投诉成功.")
        } else if (res.status === 500) {
          this.serverErr()
        } else {
          this.errorMsg(res.data)
        }
      })
    },

    updateAllBillsOfMe2Visible() {
      this.visibleAllBillsOfMe = this.allBillsOfMe
      this.visibleAllBillsOfMe.forEach((el) => {
        // for each begin
        this.geocoder.getAddress(JSON.parse(el["fromPlace"]), (status, result) => {
          if (status === 'complete' && result.regeocode) {
            el["fromPlace"] = result.regeocode.formattedAddress
          } else {
            console.log('根据经纬度查询地址失败')
          }
        });

        this.geocoder.getAddress(JSON.parse(el["toPlace"]), (status, result) => {
          if (status === 'complete' && result.regeocode) {
            el["toPlace"] = result.regeocode.formattedAddress
          } else {
            console.log('根据经纬度查询地址失败')
          }
        });
        el["status"] = this.lookUpTable[el["status"]]
        let str_ = el["time"]
        str_ = str_.replace('.000+00:00', '')
        el["time"] = str_
        // TODO HERE: TIME FORMAT
        // for each end
      })
      /*
      *   {
    "id": "2022-08-24 23:23:43.668void-echo",
    "time": "2022-08-24T15:23:44.000+00:00",
    "money": null,
    "score": null,
    "driverId": "driver_123",
    "customerId": "void-echo",
    "status": "GOING",
    "duration": null,
    "fromPlace": "[105.592725, 37.076636]",
    "toPlace": "[107.654650, 33.637012]"
  },
      * */

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
            this.customer.id = dt["id"]
            this.customer.mail = dt["mail"];
            this.customer.tel = dt["tel"];
            this.customer.name = dt["name"];

            this.axiosGet_Header("file/get-pic", "GET", {type: "customer", id: id}, {'Content-type': 'image/jpeg'},
                (response) => {
                  if (response.data === "") {

                  } else {
                    this.customer.haveImg = false;
                    this.customer.image = 'data:image/jpg;base64,'.concat(response.data);
                    this.customer.haveImg = true;

                  }
                  this.layOut_.WoDeVisible = true
                });

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