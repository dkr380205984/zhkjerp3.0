<template>
  <div id="workshopSalaryStatistics" class="bodyContainer" v-loading="loading">
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
      <div class="tag" @click="$router.push('/dataReport/materialsUsePlanDataStatistics')">
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
      <div class="tag active">
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
      <div style="display: flex; width: 27%; justify-content: space-between">
        <div class="tab" @click="$router.push('/dataReport/productionPlanChartStatistics')">生产计划图表</div>
        <div class="tab" @click="$router.push('/dataReport/inspectionReceivingDispatchingStatistic')">检验收发图表</div>
        <div class="tab active">车间工资图表</div>
      </div>
      <div class="cardCtn">
        <div class="card noBackColor noPad" style="width: 106%">
          <div class="screenCtn">
            <div class="screen" style="margin-bottom: 0">
              <el-select
                @change="
                  changeStaff()
                  changeRouter()
                "
                v-model="filterData.staff_id"
                placeholder="人员姓名筛选"
                clearable
              >
                <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="screen">
              <el-cascader
                v-model="filterData.process_name"
                :options="processList"
                @change="
                  getWorkList()
                  changeRouter()
                "
                :show-all-levels="false"
                clearable
                placeholder="工序类型筛选"
              ></el-cascader>
            </div>
            <div class="screen" style="margin-bottom: 0">
              <el-select @change="changePeople" v-model="filterData.user_id" placeholder="筛选创建人" clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0; width: 65.5%">
              <el-date-picker
                v-model="filterData.start_time"
                type="year"
                @change="changeDate"
                placeholder="筛选下单年份"
              >
              </el-date-picker>
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
              所选人员：<span class="blue">{{ staffName || '所有' }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
            <div>
              加工工序：<span class="blue">{{ processName || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>完成数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (reportData.total_number / 10000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">万</h2>
          </div>
        </div>
        <div class="card">
          <h3>完成总额</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (reportData.total_price / 10000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>平均结算单价</h3>
          <div class="content">
            <span class="green">
              <h2>
                {{ (reportData.total_price / (reportData.total_number || 1)).toFixed(2) }}
              </h2>
            </span>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card" style="padding-top: 50px">
          <zh-charts :option="option1"></zh-charts>
        </div>
      </div>
    </div>
    <!-- <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue" @click="$router.push('/billingManagement/workshopSettlementLog')">查看车间结算日志</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client, process, staff } from '@/assets/js/api'
import { moneyArr } from '@/assets/js/dictionary'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
export default Vue.extend({
  components: { zhCharts },
  data(): {
    [porpName: string]: any
  } {
    return {
      loading: false,
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
                (index === 1 ? '万元' : '万')

              htmlStr += '</div>'
            })

            return htmlStr
          }
        },
        dataZoom: [
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '5%', //组件高度
            left: 65,
            right: 85,
            bottom: 20,
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            xAxisIndex: [0] //控制的 x轴
          }
        ],
        legend: {
          data: ['完成数量', '完成总额']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '完成数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 万'
            }
          },
          {
            type: 'value',
            name: '完成总额',
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
            name: '完成数量',
            data: []
          },
          {
            type: 'line',
            name: '完成总额',
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
        user_id: '',
        group_id: '',
        staff_id: '',
        process_name: ['', '']
      },
      reportData: {
        enter: {
          shoddy_number: '',
          number: ''
        },
        out: {
          number: '',
          shoddy_number: ''
        }
      },
      filterCondition: {
        contactsList: [],
        currency: moneyArr
      },
      processList: [],
      staffList: [],
      alias: '',
      processName: '',
      staffName: ''
    }
  },
  methods: {
    getWorkList() {
      this.processName = this.filterData.process_name[1]
    },
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
    changeStaff() {
      let obj = this.staffList.find((item: any) => {
        return item.id === this.filterData.staff_id
      })

      if (obj) {
        this.staffName = obj.name
      } else {
        this.staffName = ''
      }
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
      this.filterData.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.createPeople = this.$getLocalStorage('create_user_name')
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
        '/dataReport/workshopSalaryStatistics?' +
          '&user_id=' +
          (this.filterData.user_id || '') +
          '&staff_id=' +
          (this.filterData.staff_id || '') +
          '&order_type=' +
          (this.filterData.order_type || '') +
          '&process_name=' +
          (this.filterData.process_name[1] || '') +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&sortWay=' +
          (this.sortWay || 1) +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
    },
    reset() {
      this.filterData = {
        start_time: '',
        end_time: '',
        user_id: '',
        group_id: '',
        order_type: '',
        client_id: [],
        name: '',
        process_name: []
      }
      localStorage.create_user_name = ''
      this.alias = ''
      this.staffName = ''
      this.processName = ''
      this.filterData.start_time = new Date().getFullYear() + '-01-01'
      this.filterData.end_time = this.formatDate(new Date())
      this.changeRouter()
    },
    getData(arr: any, n1: any, n2: any, n3: any, n4: any) {
      n1 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_number > +num2.total_number ? num1 : num2
      })
      n2 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_number < +num2.total_number ? num1 : num2
      })
      n3 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_price > +num2.total_price ? num1 : num2
      })
      n4 = arr.reduce((num1: any, num2: any) => {
        return +num1.total_price < +num2.total_price ? num1 : num2
      })

      n1 = +n1.total_number
      n2 = +n2.total_number
      n3 = +n3.total_price
      n4 = +n4.total_price
      return [n1, n2, n3, n4]
    },
    getList() {
      this.loading = true
      statistics
        .productionInspection({
          start_time: this.filterData.start_time,
          end_time: this.filterData.end_time,
          user_id: this.filterData.user_id,
          process_name: this.filterData.process_name[1],
          staff_id: this.filterData.staff_id
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }

          let data = res.data.data
          this.reportData = data

          data.report.sort(function (a: any, b: any) {
            return b.total_number - a.total_number
          })

          this.option1.series[0].data = []
          this.option1.series[1].data = []
          this.option1.xAxis[0].data = []

          let numberMax: any,
            numberMin: any,
            priceMax: any,
            priceMin: any = 0

          if (data.report.length !== 0) {
            let arr = this.getData(data.report, numberMax, numberMin, priceMax, priceMin)
            numberMax = arr[0]
            numberMin = arr[1]
            priceMax = arr[2]
            priceMin = arr[3]
          }

          // 查看所有 图表更新
          this.option1.yAxis[0].max = Math.ceil(Math.ceil(numberMax / 10000 / 5)) * 5 || 10
          this.option1.yAxis[0].min = numberMin && numberMin < 0 ? Math.ceil(numberMin / 10000 ) : 0
          this.option1.yAxis[0].interval = Math.ceil(numberMax / 10000 / 5) || 10

          this.option1.yAxis[1].max = Math.ceil(Math.ceil(priceMax / 10000 / 5)) * 5 || 10
          this.option1.yAxis[1].min = priceMin && priceMin < 0 ? Math.ceil(priceMin) : 0
          this.option1.yAxis[1].interval = Math.ceil(Math.ceil(priceMax / 10000 / 5)) || 10

          data.report.forEach((item: any) => {
            this.option1.xAxis[0].data.push(item.name)
            this.option1.series[0].data.push((item.total_number / 10000).toFixed(2))
            this.option1.series[1].data.push((item.total_price / 10000).toFixed(2))
          })

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
    process.list({ type: 2 }).then((res) => {
      let arr: any = []
      res.data.data.forEach((item: any) => {
        arr.push({
          label: item.name,
          value: item.name
        })
      })
      this.processList.push({
        label: '半成品加工工序',
        value: 2,
        children: arr
      })
      process.list({ type: 3 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.name,
            value: item.name
          })
        })
        this.processList.push({
          label: '成品加工工序',
          value: 3,
          children: arr
        })
      })
    })
    staff.list('').then((res) => {
      this.staffList = res.data.data
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
@import '~@/assets/css/dataReport/workshopSalaryStatistics.less';
</style>

<style lang="less">
#workshopSalaryStatistics {
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