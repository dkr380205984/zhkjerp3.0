<template>
  <div id="materialsStockStatistics" class="bodyContainer" v-loading="loading">
    <div class="topTagCtn">
      <div class="tag" @click="$router.push('/dataReport/orderStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-dingdanshujutubiao"></use>
        </svg>
        <span class="text">订单数据图表</span>
      </div>
      <div class="tag" @click="$router.push('/dataReport/sampleOrderStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdanshujutubiao"></use>
        </svg>
        <span class="text">样单数据图表</span>
      </div>
      <div class="tag active">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yuanliaoshiyongtubiao"></use>
        </svg>
        <span class="text">原料使用图表</span>
      </div>
      <div class="tag" @click="$router.push('/dataReport/accessoriesDecorationOrderStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-fuliaoshiyongtubiao"></use>
        </svg>
        <span class="text">辅料使用图表</span>
      </div>
      <div class="tag" @click="$router.push('/dataReport/productionPlanChartStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-shengchanshujutubiao"></use>
        </svg>
        <span class="text">生产数据图表</span>
      </div>
      <div class="tag" @click="$router.push('/dataReport/transportationOutboundStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-qitafeiyongtubiao"></use>
        </svg>
        <span class="text">其它费用图表</span>
      </div>
    </div>
    <div class="module noBackColor">
      <div style="display: flex; width: 49%; justify-content: space-between">
        <div class="tab" @click="$router.push('/dataReport/materialsUsePlanDataStatistics')">计划数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsOrderingStatistics')">订购数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsTransferStatistics')">调取数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsMachiningStatistics')">加工数据统计</div>
        <div class="tab active">原料库存数据统计</div>
      </div>
      <div class="cardCtn">
        <div class="card noBackColor noPad" style="width: 106%">
          <div class="screenCtn">
            <div class="screen" style="width: 100%">
              <el-select
                @change="
                  getStoreDetail($event)
                  changeRouter()
                "
                v-model="filterData.store_id"
                placeholder="筛选调取仓库"
                clearable
              >
                <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0; width: 65.5%">
              <el-input v-model="filterData.yuanliaomingcheng" placeholder="输入原料名称查询" clearable></el-input>
            </div>
            <div class="screen" style="margin-bottom: 0">
              <el-button style="width: 100%; height: 52px" @click="reset">重置</el-button>
            </div>
          </div>
        </div>
        <div class="card" style="margin-left: 4px">
          <div class="contentGrid">
            <h3>当前统计默认值</h3>
            <div class="item2">
              订单下单时间：<span class="blue"
                >{{ formatDate2(filterData.start_time) }}-{{ formatDate2(filterData.end_time) }}</span
              >
            </div>
          </div>
          <div class="contentGrid">
            <div>
              原料名称：<span class="blue">{{ filterData.yuanliaomingcheng || '所有' }}</span>
            </div>
            <div>
              仓库名称：<span class="blue">{{ alias || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>合计库存数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.order.total_price }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>合计结余数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.order.total_number }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card" style="padding-top: 60px">
          <zh-charts v-if="activeName === 'first'" :option="option1"></zh-charts>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue">查看库存数量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client, store } from '@/assets/js/api'
import { moneyArr } from '@/assets/js/dictionary'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
export default Vue.extend({
  components: { zhCharts },
  data(): {
    [porpName: string]: any
  } {
    return {
      loading: false,
      alias: '',
      sortWay: 1,
      option1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '库存数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 吨或千米'
            }
          },
        ],
        series: [
          {
            type: 'bar',
            data: []
          },
        ]
      },
      groupName: '',
      createPeople: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        contacts_id: '',
        group_id: '',
        orderOrSimpleOrder: '',
        store_id: ''
      },
      reportData: {
        order: {
          total_price: '',
          total_number: ''
        },
        transport: {
          price: ''
        }
      },
      filterCondition: {
        contactsList: [],
        currency: moneyArr
      },
      storeList: [],
      activeName: 'first'
    }
  },
  methods: {
    getContacts(ev: number[]) {
      if (ev && ev.length) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.alias = res.data.data.alias || res.data.data.name
            }
          })
      } else {
        this.alias = '所有'
      }
    },

    getStoreDetail(ev: number) {
      if (ev) {
        store
          .detail({
            id: ev
          })
          .then((res) => {
            if (res.data.status) {
              this.alias = res.data.data.alias || res.data.data.name
            }
          })
      } else {
        this.alias = '所有'
      }
    },
    getLocalStorage(ev: any, type: string) {
      let groupInfo = this.groupList.find((item: any) => {
        return this.filterData.group_id === item.id
      })
      this.groupName = '所有'
      if (groupInfo) {
        this.groupName = groupInfo.name
      }
      this.changeRouter()
    },
    changePeople(user_id: any) {
      this.createPeople = '所有'

      let obj = this.userList.find((item: any) => {
        return item.value === user_id
      })

      localStorage.create_user_name = ''

      if (obj) {
        localStorage.create_user_name = obj.label
        this.createPeople = obj.label
      }
      this.changeRouter()
    },
    getFilters() {
      const query = this.$route.query
      if (query.start_time === '' || query.start_time === undefined) {
        let date = new Date()
        let nowYear = date.getFullYear() + '-01-01'
        this.filterData.start_time = nowYear
        this.filterData.end_time = this.formatDate(new Date())
      } else {
        this.filterData.start_time = query.start_time
        this.filterData.end_time = query.end_time
      }
      this.filterData.client_id = query.client_id
        ? (query.client_id as string).split(',').map((item) => Number(item))
        : []
      this.filterData.name = query.name ? query.name : ''
      this.filterData.order_type = query.order_type ? +query.order_type : ''
      this.filterData.contacts_id = query.contacts_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.filterData.settle_unit = query.settle_unit
      this.createPeople = this.$getLocalStorage('create_user_name')
      this.getStoreDetail(this.filterData.store_id)
    },
    reset() {
      this.filterData = {
        start_time: '',
        end_time: '',
        user_id: '',
        store_id: '',
        group_id: '',
        order_type: '',
        name: ''
      }
      localStorage.create_user_name = ''
      this.filterData.start_time = new Date().getFullYear() + '-01-01'
      this.filterData.end_time = this.formatDate(new Date())
      this.changeRouter()
    },
    formatDate(date: Date) {
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      )
    },
    formatDate2(date: string | Date) {
      if (typeof date === 'object') {
        this.formatDate(date)
      } else {
        return date.split('-')[0] + '年' + date.split('-')[1] + '月' + date.split('-')[2] + '日'
      }
    },
    changeDate(res: any) {
      if (res !== null) {
        this.filterData.start_time = res.getFullYear() + '-01-01'
        if (res.getFullYear() === new Date().getFullYear()) {
          this.filterData.end_time = this.formatDate(new Date())
        } else {
          this.filterData.end_time = res.getFullYear() + '-12-31'
        }
      } else {
        this.filterData.start_time = new Date().getFullYear() + '-01-01'
        this.filterData.end_time = this.formatDate(new Date())
      }
      this.changeRouter()
    },
    changeRouter() {
      this.$router.push(
        '/dataReport/materialsStockStatistics?' +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&contacts_id=' +
          (this.filterData.contacts_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
          '&store_id=' +
          (this.filterData.store_id || '') +
          '&settle_unit=' +
          (this.filterData.settle_unit || '') +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
    },
    getList() {
      this.loading = true
      statistics
        .storeTotal({
          start_time: this.filterData.start_time,
          store_id: this.filterData.store_id,
          name: this.filterData.name,
          end_time: this.filterData.end_time
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }
          let data = res.data.data
          data.order.total_number = this.$formatNum(+(data.order.total_number / 10000).toFixed(2))
          data.order.total_price = this.$formatNum(+(data.order.total_price / 10000).toFixed(2))
          data.transport.price = this.$formatNum(+(data.transport.price / 10000).toFixed(2))
          data.transport.transport_number = this.$formatNum(+(data.transport.transport_number / 10000).toFixed(2))

          this.reportData = data
          this.option1.series[0].data = []
          this.option1.series[1].data = []
          this.groupOption.series[0].data = []
          this.companyOption.yAxis.data = []
          this.companyOption.series[0].data = []

          let orderPriceMax: any,
            orderPriceMin: any,
            orderNumberMax: any,
            orderNumberMin: any,
            outPriceMax: any,
            outPriceMin: any,
            outNumberMax: any,
            outNumberMin: any = 0

          if (data.order.report.month.length !== 0) {
            //  每月下单总额
            orderPriceMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_price > +num2.total_price ? num1 : num2
            })
            orderPriceMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_price < +num2.total_price ? num1 : num2
            })

            // 每月下单总数
            orderNumberMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_number > +num2.total_number ? num1 : num2
            })
            orderNumberMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_number < +num2.total_number ? num1 : num2
            })

            // 拿到每月下单总额的最大值和最小值
            orderPriceMax = +orderPriceMax.total_price
            orderPriceMin = +orderPriceMin.total_price

            // 拿到每月下单总数的最大值和最小值
            orderNumberMax = +orderNumberMax.total_number
            orderNumberMin = +orderNumberMin.total_number
          }

          if (data.transport.report.month.length !== 0) {
            //  每月出库总额
            outPriceMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.price > +num2.price ? num1 : num2
            })
            outPriceMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.price < +num2.price ? num1 : num2
            })

            // 每月出库总数
            outNumberMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.transport_number > +num2.transport_number ? num1 : num2
            })
            outNumberMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.transport_number < +num2.transport_number ? num1 : num2
            })

            // 拿到每月出库总额的最大值和最小值
            outPriceMax = +outPriceMax.price
            outPriceMin = +outPriceMin.price

            // 拿到出库下单总数的最大值和最小值
            outNumberMax = +outNumberMax.transport_number
            outNumberMin = +outNumberMin.transport_number
          }

          if (this.activeName === 'first') {
            this.option1.series[0].name = '每月下单总额'
            this.option1.series[1].name = '每月下单总数'
            this.option1.legend.data = ['每月下单总额', '每月下单总数']
            this.option1.yAxis[0].name = '下单总额'
            this.option1.yAxis[1].name = '下单总数'

            // 每月下单总数 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(orderPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = orderPriceMin && orderPriceMin < 0 ? Math.ceil(orderPriceMin / 10000) : 0
            this.option1.yAxis[0].interval = Math.ceil(orderPriceMax / 10000 / 5) || 10

            // 每月下单总额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(orderNumberMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = orderNumberMin && orderNumberMin < 0 ? Math.ceil(orderNumberMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(orderNumberMax / 10000 / 5) || 10

            this.option1.xAxis[0].data.forEach((itemMouth: any) => {
              let mouth = this.reportData.order.report.month.find((item: any) => {
                return item.mouth === itemMouth
              })
              if (mouth) {
                this.option1.series[0].data.push(+(+mouth.total_price / 10000).toFixed(2))
                this.option1.series[1].data.push(+(+mouth.total_number / 10000).toFixed(2))
              } else {
                this.option1.series[0].data.push(0)
                this.option1.series[1].data.push(0)
              }
            })

            // 饼图
            data.order.report.group.forEach((group: any) => {
              this.groupOption.series[0].data.push({
                name: group.group_name || '其它',
                value: group.total_price
              })
            })

            // 横向柱状图
            data.order.report.client.forEach((client: any) => {
              this.companyOption.yAxis.data.push(client.client_name)
              this.companyOption.series[0].data.push(client.total_price)
            })
          } else if (this.activeName === 'second') {
            this.option1.series[0].name = '每月出库总额'
            this.option1.series[1].name = '每月出库总数'
            this.option1.legend.data = ['每月出库总额', '每月出库总数']
            this.option1.yAxis[0].name = '出库总额'
            this.option1.yAxis[1].name = '出库总数'

            // 每月出库总数 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(outPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = outPriceMin && outPriceMin < 0 ? Math.ceil(outPriceMin / 10000) : 0
            this.option1.yAxis[0].interval = Math.ceil(outPriceMax / 10000 / 5) || 10

            // 每月出库总额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(outNumberMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = outNumberMin && outNumberMin < 0 ? Math.ceil(outNumberMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(outNumberMax / 10000 / 5) || 10

            this.option1.xAxis[0].data.forEach((itemMouth: any) => {
              let mouth = this.reportData.transport.report.month.find((item: any) => {
                return item.mouth === itemMouth
              })
              if (mouth) {
                this.option1.series[0].data.push(+(+mouth.price / 10000).toFixed(2))
                this.option1.series[1].data.push(+(+mouth.transport_number / 10000).toFixed(2))
              } else {
                this.option1.series[0].data.push(0)
                this.option1.series[1].data.push(0)
              }
            })
          }
          this.loading = false
        })
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    groupList() {
      let groupInfo = this.$store.state.api.group.arr.find((item: any) => {
        return this.filterData.group_id === item.id
      })
      if (groupInfo) {
        this.groupName = groupInfo.name
      }
      return this.$store.state.api.group.arr
    },
    userList() {
      return this.$store.state.api.user.arr
    }
  },
  created() {
    store.list().then((res) => {
      this.storeList = res.data.data
    })
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  },
  beforeDestroy() {
    localStorage.create_user_name = ''
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/dataReport/materialsStockStatistics.less';
</style>

<style lang="less">
#materialsStockStatistics {
  .screen {
    overflow: hidden;
  }
  .el-input__inner {
    height: 100% !important;
    line-height: 30px;
    border: 0px;
  }
  .el-tabs__nav-wrap::after {
    background-color: white;
  }
  .el-button {
    border: none;
  }
}
</style>