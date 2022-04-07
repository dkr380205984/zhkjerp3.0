<template>
  <div id="materialsOrderingStatistics" class="bodyContainer" v-loading="loading">
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
        <div class="tab active">订购数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsTransferStatistics')">调取数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsMachiningStatistics')">加工数据统计</div>
        <div class="tab" @click="$message.info('功能正在开发中，即将上线')">原料库存数据统计</div>
        <!-- <div class="tab" @click="$router.push('/dataReport/materialsStockStatistics')">原料库存数据统计</div> -->
      </div>
      <div class="cardCtn">
        <div class="card noBackColor noPad" style="width: 106%">
          <div class="screenCtn">
            <div class="screen" style="width: 100%">
              <el-select
                @change="changeRouter"
                filterable
                v-model="filterData.order_type"
                placeholder="筛选原料"
                clearable
              >
                <el-option label="订单/样单" :value="''"></el-option>
                <el-option label="订单" :value="1"></el-option>
                <el-option label="样单" :value="2"></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0; width: 48.5%">
              <el-select @change="changePeople" v-model="filterData.user_id" placeholder="筛选创建人" clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0; width: 48.5%">
              <el-select
                @change="(ev) => getLocalStorage(ev, 'group_id')"
                v-model="filterData.group_id"
                placeholder="筛选负责小组"
                clearable
              >
                <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
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
              订单类型：<span class="blue">{{
                filterData.order_type === '' ? '订单/样单' : filterData.order_type === 1 ? '订单' : '样单'
              }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
            <div>
              负责小组：<span class="blue">{{ groupName || '所有' }}</span>
            </div>
            <div>
              订购单位：<span class="blue">{{ alias || '所有' }}</span>
            </div>
            <div>
              原材名称：<span class="blue">{{ filterData.name || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card noPad" style="overflow: hidden">
          <div class="screen">
            <el-cascader
              @change="
                getContacts($event)
                changeRouter()
              "
              placeholder="筛选订购单位"
              v-model="filterData.client_id"
              :show-all-levels="false"
              filterable
              :options="clientList"
              clearable
            >
            </el-cascader>
          </div>
        </div>
        <div class="card noPad" style="overflow: hidden">
          <div class="screen">
            <el-input
              v-model="filterData.name"
              placeholder="输入原料名称查询"
              clearable
              @keydown.enter.native="changeRouter"
              @blur="changeRouter"
              @clear="changeRouter"
            ></el-input>
          </div>
        </div>
        <div class="cardCtn" style="width: 206%; margin-top: 0">
          <div class="card noPad" style="overflow: hidden">
            <div class="screen">
              <el-date-picker
                v-model="filterData.start_time"
                type="year"
                @change="changeDate"
                placeholder="筛选下单年份"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="card noPad" style="overflow: hidden">
            <el-button style="width: 100%; height: 63px" @click="reset">重置</el-button>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>合计订购数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.plan.total_number / 1000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>合计订购金额</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.plan.total_price / 10000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>最终入库数量</h3>
          <div class="content">
            <span class="green">
              <h2>{{ (this.reportData.real.total_number / 1000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>最终入库金额</h3>
          <div class="content">
            <span class="green">
              <h2>{{ (this.reportData.real.total_price / 10000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <el-tabs v-model="activeName" @tab-click="getList">
            <el-tab-pane label="计划订购" name="first">
              <div style="display: flex; justify-content: end; padding-right: 50px">
                <div style="width: 150px">
                  <el-select v-model="sortWay" @change="changeRouter">
                    <el-option label="按数量排序" :value="1"> </el-option>
                    <el-option label="按金额排序" :value="2"> </el-option>
                  </el-select>
                </div>
              </div>
              <zh-charts v-if="activeName === 'first'" :option="option1"></zh-charts>
            </el-tab-pane>
            <el-tab-pane label="最终入库" name="second">
              <div style="display: flex; justify-content: end; padding-right: 50px">
                <div style="width: 150px">
                  <el-select v-model="sortWay" @change="changeRouter">
                    <el-option label="按数量排序" :value="1"> </el-option>
                    <el-option label="按金额排序" :value="2"> </el-option>
                  </el-select>
                </div>
              </div>
              <zh-charts v-if="activeName === 'second'" :option="option1"></zh-charts
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue" @click="$openUrl('/billingManagement/rawMaterialPurchaseOrder')">查看原料订购单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client } from '@/assets/js/api'
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
          },
          formatter: (params: any) => {
            var htmlStr = '<div>'
            htmlStr += params[0].name + '<br/>' //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>'

              //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
              htmlStr +=
                param.seriesName +
                '：' +
                '<span style="color:' +
                color +
                ';margin-right:10px">' +
                param.value +
                '</span>' +
                (index === 1 ? '万元' : '吨或千米')

              htmlStr += '</div>'
            })

            return htmlStr
          }
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 吨或千米'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万元'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '',
            data: []
          },
          {
            type: 'line',
            name: '',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      groupName: '',
      createPeople: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        user_id: '',
        group_id: '',
        order_type: '',
        name: ''
      },
      reportData: {
        plan: {
          total_price: '',
          total_number: '',
          name: ''
        },
        real: {
          total_number: '',
          total_price: '',
          name: ''
        }
      },
      filterCondition: {
        contactsList: [],
        currency: moneyArr
      },
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
      this.filterData.name = query.name ? query.name : ''
      this.filterData.client_id = query.client_id
        ? (query.client_id as string).split(',').map((item) => Number(item))
        : []
      this.filterData.order_type = query.order_type ? +query.order_type : ''
      this.filterData.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.filterData.settle_unit = query.settle_unit
      this.createPeople = this.$getLocalStorage('create_user_name')
      this.getContacts(this.filterData.client_id)
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
    reset() {
      this.filterData = {
        start_time: '',
        end_time: '',
        user_id: '',
        group_id: '',
        order_type: '',
        name: '',
      }
      localStorage.create_user_name = ''
      this.filterData.start_time = new Date().getFullYear() + '-01-01'
      this.filterData.end_time = this.formatDate(new Date())
      this.changeRouter()
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
        '/dataReport/materialsOrderingStatistics?' +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&user_id=' +
          (this.filterData.user_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
          '&name=' +
          (this.filterData.name || '') +
          '&order_type=' +
          (this.filterData.order_type || '') +
          '&sortWay=' +
          (this.sortWay || 1) +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
    },
    getData(arr: any, n1: any, n2: any, n3: any, n4: any) {
      n1 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_price > +num2.total_price ? num1 : num2
      })
      n2 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_price < +num2.total_price ? num1 : num2
      })
      n3 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_number > +num2.total_number ? num1 : num2
      })
      n4 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_number < +num2.total_number ? num1 : num2
      })

      n1 = +n1.total_price
      n2 = +n2.total_price
      n3 = +n3.total_number
      n4 = +n4.total_number
      return [n1, n2, n3, n4]
    },
    getList() {
      this.loading = true
      statistics
        .rawMaterialOrder({
          start_time: this.filterData.start_time,
          client_id: this.filterData.client_id.length > 0 ? this.filterData.client_id[2] : '',
          user_id: this.filterData.user_id,
          group_id: this.filterData.group_id,
          order_type: this.filterData.order_type,
          name: this.filterData.name,
          end_time: this.filterData.end_time,
          contacts_id: ''
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }
          let data = res.data.data
          this.reportData = data

          if (this.sortWay === 1) {
            data.plan.report.sort(function (a: any, b: any) {
              return b.total_number - a.total_number
            })
            data.real.report.sort(function (a: any, b: any) {
              return b.total_number - a.total_number
            })
          } else if (this.sortWay === 2) {
            data.plan.report.sort(function (a: any, b: any) {
              return b.total_price - a.total_price
            })
            data.real.report.sort(function (a: any, b: any) {
              return b.total_price - a.total_price
            })
          }

          this.option1.series[0].data = []
          this.option1.series[1].data = []
          this.option1.xAxis[0].data = []
          this.option1.legend.data = []

          let planPriceMax: any,
            planPriceMin: any,
            planNumberMax: any,
            planNumberMin: any,
            realPriceMax: any,
            realPriceMin: any,
            realNumberMax: any,
            realNumberMin: any = 0

          if (data.plan.report.length !== 0) {
            let arr = this.getData(data.plan.report, planPriceMax, planPriceMin, planNumberMax, planNumberMin)
            planPriceMax = arr[0]
            planPriceMin = arr[1]
            planNumberMax = arr[2]
            planNumberMin = arr[3]
          }

          if (data.real.report.length !== 0) {
            let arr = this.getData(data.real.report, realPriceMax, realPriceMin, realNumberMax, realNumberMin)
            realPriceMax = arr[0]
            realPriceMin = arr[1]
            realNumberMax = arr[2]
            realNumberMin = arr[3]
          }

          if (this.activeName === 'first') {
            this.option1.legend.data = ['采购数量', '订购金额']
            this.option1.series[0].name = '采购数量'
            this.option1.series[1].name = '订购金额'
            this.option1.yAxis[0].name = '采购数量'
            this.option1.yAxis[1].name = '订购金额'

            //   采购数量 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(planNumberMax / 1000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = planNumberMin && planNumberMin < 0 ? Math.ceil(planNumberMin / 1000) : 0
            this.option1.yAxis[0].interval = Math.ceil(planNumberMax / 1000 / 5) || 10

            //   采购金额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(planPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = planPriceMin && planPriceMin < 0 ? Math.ceil(planPriceMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(planPriceMax / 10000 / 5) || 10

            data.plan.report.forEach((item: any) => {
              this.option1.xAxis[0].data.push(item.name)
              this.option1.series[0].data.push((item.total_number / 1000).toFixed(2))
              this.option1.series[1].data.push((item.total_price / 10000).toFixed(2))
            })
          } else if (this.activeName === 'second') {
            this.option1.legend.data = ['入库数量','入库金额']
            this.option1.series[0].name = '入库数量'
            this.option1.series[1].name = '入库金额'
            this.option1.yAxis[0].name = '入库数量'
            this.option1.yAxis[1].name = '入库金额'

            //   采购数量 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(realNumberMax / 1000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = realNumberMin && realNumberMin < 0 ? Math.ceil(realNumberMin / 1000) : 0
            this.option1.yAxis[0].interval = Math.ceil(realNumberMax / 1000 / 5) || 10

            //   采购金额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(realPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = realPriceMin && realPriceMin < 0 ? Math.ceil(realPriceMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(realPriceMax / 10000 / 5) || 10

            data.real.report.forEach((item: any) => {
              this.option1.xAxis[0].data.push(item.name)
              this.option1.series[0].data.push((item.total_number / 1000).toFixed(2))
              this.option1.series[1].data.push((item.total_price / 10000).toFixed(2))
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
@import '~@/assets/css/dataReport/materialsOrderingStatistics.less';
</style>

<style lang="less">
#materialsOrderingStatistics {
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