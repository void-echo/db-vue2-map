<template>
  <div class="root">
    <el-container shadow="always" >
      <el-aside  width="14%"
                 style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                 height:auto; border-radius: 30px">
        <div class="left_menu">
          <el-row class="my_row">
            <el-col>
              <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  style="height: 100vh"
                  >

                <!--  TODO HERE            -->

                <el-menu-item index="1" @click="updateDateAndChangeView(1)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">用户</span>
                </el-menu-item>
                <el-menu-item index="2" @click="updateDateAndChangeView(2)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">司机</span>
                </el-menu-item>
                <el-menu-item index="3" @click="updateDateAndChangeView(3)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">订单</span>
                </el-menu-item>
                <el-menu-item index="4" @click="updateDateAndChangeView(4)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">争执</span>
                </el-menu-item>
                <el-menu-item index="5" @click="updateDateAndChangeView(5)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">统计</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </el-aside>


      <el-main shadow="always" style="height: 100%; ">
        <div class="adminDashBoard" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px"
             v-if="this.loggedIn">
          <div v-if="view.visibleContentIndex === 1">
            <el-table
                :data="customers.contents"
                border
                :default-sort="{prop: 'id', order: 'descending'}"
                style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; margin-top: -18px"
            >
              <el-table-column sortable prop="id" label="ID" ></el-table-column>
              <el-table-column sortable prop="name" label="昵称" ></el-table-column>
              <el-table-column sortable prop="tel" label="电话" ></el-table-column>
              <el-table-column sortable prop="mail" label="邮箱" ></el-table-column>
            </el-table>
          </div>

          <!--    Driver      -->
          <div v-if="view.visibleContentIndex === 2">
            <el-table
                :data="drivers.contents"
                border
                :default-sort="{prop: 'id', order: 'descending'}"
                style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; margin-top: -18px"
            >
              <el-table-column sortable prop="id" label="ID" ></el-table-column>
              <el-table-column sortable prop="name" label="昵称" ></el-table-column>
              <el-table-column sortable prop="tel" label="电话" ></el-table-column>
              <el-table-column sortable prop="mail" label="邮箱" ></el-table-column>
            </el-table>
          </div>

          <!--    Bill      -->
          <div v-if="view.visibleContentIndex === 3">
            <el-table
                :data="bills.contents"
                border
                :default-sort="{prop: 'id', order: 'descending'}"
                style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; margin-top: -18px"
            >
              <el-table-column sortable prop="id" label="编号" width="180">

              </el-table-column>
              <el-table-column sortable prop="time" label="时间" width="180">

              </el-table-column>
              <el-table-column sortable prop="money" label="金额">

              </el-table-column>
              <el-table-column sortable prop="score" label="评分">

              </el-table-column>
              <el-table-column sortable prop="driverId" label="司机">

              </el-table-column>
              <el-table-column sortable prop="status" label="状态">

              </el-table-column>
              <el-table-column sortable prop="duration" label="持续">

              </el-table-column>
              <el-table-column sortable prop="fromPlace" label="从">

              </el-table-column>
              <el-table-column sortable prop="toPlace" label="到">

              </el-table-column>
            </el-table>
          </div>

          <div v-if="view.visibleContentIndex === 4">
            <el-table
                :data="disputes.contents"
                border
                :default-sort="{prop: 'billId', order: 'descending'}"
                style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; margin-top: -18px"
            >
              <el-table-column sortable prop="id" label="ID" ></el-table-column>
              <el-table-column sortable prop="driverId" label="司机" ></el-table-column>
              <el-table-column sortable prop="customerId" label="用户" ></el-table-column>
              <el-table-column sortable prop="billId" label="有关订单" ></el-table-column>
              <el-table-column sortable prop="type" label="类型" ></el-table-column>
              <el-table-column sortable prop="status" label="状态" ></el-table-column>
              <el-table-column sortable prop="contents" label="投诉信息" ></el-table-column>
              <el-table-column sortable prop="judgeResult" label="仲裁结果" ></el-table-column>
              <el-table-column sortable label="操作">
                <template v-slot="scope">
<!--                  scope.$index, scope.row -->
                  <el-button type="primary" round @click="processJudge(scope.row)"
                             v-if="scope.row['status'] === '未处理'">
                    处理
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>

          <!--     Chart     -->
          <div v-if="view.visibleContentIndex === 5" style=" border-radius: 30px; margin-top: -18px">
            <div style="height: 300px; width: 100%; margin-bottom: 3%">
              <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; height: 100%">
                <div id="billNumPerDay" style="height: 300px; width: 100%">

                </div>
              </el-card>
            </div>

            <div style="height: 300px; width: 100%; margin-bottom: 3%">
              <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; height: 100%">
                <div id="billAmountPerDay" style="height: 300px; width: 100%">

                </div>
              </el-card>
            </div>

            <div style="height: 300px; width: 100%; margin-bottom: 3%">
              <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; height: 100%">
                <div id="billAmountPerCustomer" style="height: 300px; width: 100%">

                </div>
              </el-card>
            </div>

            <div style="height: 300px; width: 100%; margin-bottom: 3%">
              <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px; height: 100%">
                <div id="billAmountPerDriver" style="height: 300px; width: 100%">

                </div>
              </el-card>
            </div>
          </div>
        </div>

        <div v-else>
          你尚未登陆!
          <div>
            <el-button @click="try2login">登录</el-button>
          </div>
        </div>
      </el-main>
    </el-container>

    <el-dialog title="处理争议" :visible.sync="view.disputeProcessing" width="90%" fullscreen
               style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 30px;margin: 12%;">

      <div>
        <el-input
            type="textarea"
            placeholder="处理意见"
            v-model="p_dis.judge"
            maxlength="100"
            show-word-limit
        >
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="view.disputeProcessing = false">取 消</el-button>
          <el-button type="primary" @click="_processJudge">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';

export default {
  name: "AdminMain",
  computed: {
    id_() {
      return this.$route.params.id_;
    },
    loggedIn() {
      return this.notNil(this.id_)
    },
  },

  mounted() {
    this.updateAllContents()
  },
  data() {
    return {
      spring_boot_url_base: "http://localhost:17747/",
      p_dis: {
        judge: '',
        dis_id: '',
      },
      view: {
        visibleContentIndex: 1,
        disputeProcessing: false,
        lookingDispute: false,
      },
      bills: {
        contents: []
      },
      customers: {
        contents: []
      },
      drivers: {
        contents: []
      },
      cars: {
        contents: []
      },
      disputes: {
        contents: []
      },
      reserved_bills: {
        contents: []
      },
      driver_cards: {
        contents: []
      },
      customer_pay_approaches: {
        contents: []
      },
      credit_cards: {
        contents: []
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
    }
  },

  methods: {
    _processJudge() {
      this.axiosGet_Header("running/give-judge", "GET", {
        disputeId: this.p_dis.dis_id,
        judge: this.p_dis.judge
      }, {}, (res) => {
        if (res.status === 500) {
          this.serverErr()
        } else {
          this.successMsg("处理争议成功")
          this.view.disputeProcessing = false
          this.updateDisputes()
        }
      })
    },
    processJudge(row) {
      this.p_dis.dis_id = row['id']
      this.view.disputeProcessing = true
    },
    updateAllContents() {
      this.updateCustomers()
      this.updateBills()
      this.updateDrivers()
      this.updateDisputes()

    },
    updateBills() {
      this.axiosGet_Header("bill/get-all", "GET", {}, {},
          (res) => {
            if (res.status === 500) {
              this.serverErr()
            } else {
              this.bills.contents = res.data
              this.bills.contents.forEach((el) => {
                el["status"] = this.lookUpTable[el["status"]]
                let str_ = el["time"]
                str_ = str_.replace('.000+00:00', '')
                el["time"] = str_
              })
            }
          })
    },

    updateDisputes() {
      this.axiosGet_Header("dispute/get-all", "GET", {}, {},
          (res) => {
            if (res.status === 500) {
              this.serverErr()
            } else {
              this.disputes.contents = res.data
              this.disputes.contents.forEach((el) => {
                let lookUpTable = {
                  "HANGING": '未处理',
                  "FINISHED": '已处理',
                  "CANCELED": '已撤销'
                }
                el["status"] = lookUpTable[el['status']]
              })
            }
          })
    },


    updateDrivers() {
      this.axiosGet_Header("driver/get-all", "GET", {}, {},
          (res) => {
            if (res.status === 500) {
              this.serverErr()
            } else {
              this.drivers.contents = res.data
            }
          })
    },

    updateCustomers() {
      this.axiosGet_Header("customer/get-all", "GET", {}, {},
        (res) => {
          if (res.status === 500) {
            this.serverErr()
          } else {
            this.customers.contents = res.data
          }
        })
    },
    notNil(obj) {
      return !(obj === null || obj === undefined)
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


    axiosGet_Header(url, httpType, params, _header, lambdaThen) {
      axios({
        url: url,
        method: httpType,
        headers: _header,
        baseURL: this.spring_boot_url_base,
        params: params
      }).then(lambdaThen);
    },

    try2login() {
      this.$router.push({
        name: 'AdminLogin',
        params: {}
      })
    },

    /*
    var myChart = echarts.init(document.querySelector("#myChart__"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    *
    * */
    updateCharts() {
      var ch1 = echarts.init(document.querySelector("#billNumPerDay"));
      this.axiosGet_Header("running/status/get-bill-num-by-day", "GET", {

      }, {}, (res) => {
        if (res.status === 200) {
          let dt = res.data
          /*
            {
              "2022-09-05": 5,
              "2022-09-06": 3
            }
          * */
          ch1.setOption({
            title: {
              text: '总订单数 / 天'
            },
            tooltip: {},
            xAxis: {
              data: Object.keys(dt)
            },
            yAxis: {},
            series: [
              {
                name: '订单数',
                type: 'bar',
                data: [2, 4, 6, 8, 10, 12]
              }
            ]
          })
        } else this.serverErr()
      })
    },


    updateDateAndChangeView(num) {
      if (num === 1) {
        this.updateCustomers()
      } else if (num === 2) {
        this.updateDrivers()
      } else if (num === 3) {
        this.updateBills()
      } else if (num === 4) {
        this.updateDisputes()
      } else {
        setTimeout(() => {
          this.updateCharts()
        }, 100)
      }
      this.view.visibleContentIndex = num
    }
  }
}
</script>

<style scoped>

</style>