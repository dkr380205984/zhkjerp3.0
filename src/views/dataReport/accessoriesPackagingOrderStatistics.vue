<template>
  <div id="accessoriesPackagingOrderStatistics" class="bodyContainer" v-loading="loading">
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
      <div class="tag active">
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
      <div style="display: flex; width: 22%; justify-content: space-between">
        <div class="tab" @click="$router.push('/dataReport/accessoriesDecorationOrderStatistics')">
          装饰辅料订购图表
        </div>
        <div class="tab active">包装辅料订购图表</div>
      </div>
      <div class="cardCtn">
        <div class="card noBackColor noPad" style="width: 106%">
          <div class="screenCtn">
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
            <div class="screen">
              <el-select
                @change="
                  changePackName()
                  changeRouter()
                "
                filterable
                v-model="filterData.name"
                placeholder="包装名称筛选"
                clearable
              >
                <el-option v-for="item in packList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="screen">
              <el-select
                @change="(ev) => getLocalStorage(ev, 'group_id')"
                v-model="filterData.group_id"
                placeholder="筛选负责小组"
                clearable
              >
                <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0">
              <el-select @change="changePeople" v-model="filterData.contacts_id" placeholder="筛选创建人" clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="screen" style="margin-bottom: 0">
              <el-date-picker
                v-model="filterData.start_time"
                type="year"
                @change="changeDate"
                placeholder="筛选下单年份"
              >
              </el-date-picker>
            </div>
            <div class="screen" style="margin-bottom: 0">
              <el-button style="width: 100%; height: 63px" @click="reset">重置</el-button>
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
              订购单位：<span class="blue">{{ alias || '所有' }}</span>
            </div>
            <div>
              包装名称：<span class="blue">{{ packName || '所有' }}</span>
            </div>
            <div>
              负责小组：<span class="blue">{{ groupName || '所有' }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>合计订购数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.total_number / 1000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">千个</h2>
          </div>
        </div>
        <div class="card">
          <h3>合计订购金额</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.total_price / 10000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <div style="display: flex; justify-content: end; padding-right: 50px; margin-top: 30px">
            <div style="width: 150px">
              <el-select v-model="sortWay" @change="changeRouter">
                <el-option label="按数量排序" :value="1"> </el-option>
                <el-option label="按金额排序" :value="2"> </el-option>
              </el-select>
            </div>
          </div>
          <zh-charts :option="option1"></zh-charts>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue" @click="$openUrl('/billingManagement/packingOrder')">查看包装订购单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client, packMaterial } from '@/assets/js/api'
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
      packName: '',
      sortWay: 2,
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
                (index === 1 ? '千个' : '万元')

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
            backgroundColor: 'rgba(43,48,67,.3)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            xAxisIndex: [0] //控制的 x轴
          }
        ],
        legend: {
          data: ['订购金额', '订购数量']
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
            name: '订购金额',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万元'
            }
          },
          {
            type: 'value',
            name: '订购数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 千个'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '订购金额',
            data: []
          },
          {
            type: 'line',
            name: '订购数量',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      packList: [],
      groupName: '',
      createPeople: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        contacts_id: '',
        group_id: '',
        orderOrSimpleOrder: '',
        shaxianmianliao: ''
      },
      reportData: {
        total_price: '',
        total_number: ''
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
    changePackName(res: any) {
      let obj: any = {}
      if (res) {
        this.packList.find((item: any) => {
          return item.id === res
        })
      } else {
        this.packList.find((item: any) => {
          return item.id == this.filterData.name
        })
      }

      this.packName = obj.name
    },
    reset() {
      this.filterData = {
        start_time: '',
        end_time: '',
        user_id: '',
        group_id: '',
        order_type: '',
        client_id: '',
        name: ''
      }
      localStorage.create_user_name = ''
      this.filterData.start_time = new Date().getFullYear() + '-01-01'
      this.filterData.end_time = this.formatDate(new Date())
      this.changeRouter()
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
      this.filterData.contacts_id = query.contacts_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.filterData.settle_unit = query.settle_unit
      this.createPeople = this.$getLocalStorage('create_user_name')
      this.filterData.name = query.name ? +query.name : ''
      this.getContacts(this.filterData.client_id)
      this.changePackName(this.filterData.name)
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
        '/dataReport/accessoriesPackagingOrderStatistics?' +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&user_id=' +
          (this.filterData.user_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
          '&name=' +
          (this.filterData.name || '') +
          '&sortWay=' +
          (this.sortWay || '') +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
    },
    getList() {
      this.loading = true
      statistics
        .auxmaterialPack({
          start_time: this.filterData.start_time,
          client_id: this.filterData.client_id.length > 0 ? this.filterData.client_id[2] : '',
          user_id: this.filterData.user_id,
          group_id: this.filterData.group_id,
          pack_material_id: this.filterData.name,
          end_time: this.filterData.end_time
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }
          let data = res.data.data
          this.reportData = data

          this.option1.series[0].data = []
          this.option1.series[1].data = []
          this.option1.xAxis[0].data = []

          let orderPriceMax: any,
            orderPriceMin: any,
            orderNumberMax: any,
            orderNumberMin: any = 0

          if (data.report.length !== 0) {
            //  订购数量
            orderPriceMax = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.total_price > +num2.total_price ? num1 : num2
            })
            orderPriceMin = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.total_price < +num2.total_price ? num1 : num2
            })

            // 每月下单总数
            orderNumberMax = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.total_number > +num2.total_number ? num1 : num2
            })
            orderNumberMin = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.total_number < +num2.total_number ? num1 : num2
            })

            // 拿到每月下单总额的最大值和最小值
            orderPriceMax = +orderPriceMax.total_price
            orderPriceMin = +orderPriceMin.total_price

            // 拿到每月下单总数的最大值和最小值
            orderNumberMax = +orderNumberMax.total_number
            orderNumberMin = +orderNumberMin.total_number
          }

          if (this.sortWay === 1) {
            data.report.sort(function (a: any, b: any) {
              return b.total_number - a.total_number
            })
          } else if (this.sortWay === 2) {
            data.report.sort(function (a: any, b: any) {
              return b.total_price - a.total_price
            })
          }

          // 每月下单总数 图表更新
          this.option1.yAxis[0].max = Math.ceil(Math.ceil(orderPriceMax / 10000 / 5)) * 5 || 10
          this.option1.yAxis[0].min = orderPriceMin && orderPriceMin < 0 ? Math.ceil(orderPriceMin / 10000) : 0
          this.option1.yAxis[0].interval = Math.ceil(orderPriceMax / 10000 / 5) || 10

          // 每月下单总额 图表更新
          this.option1.yAxis[1].max = Math.ceil(Math.ceil(orderNumberMax / 1000 / 5)) * 5 || 10
          this.option1.yAxis[1].min = orderNumberMin && orderNumberMin < 0 ? Math.ceil(orderNumberMin / 1000) : 0
          this.option1.yAxis[1].interval = Math.ceil(orderNumberMax / 1000 / 5) || 10

          data.report.forEach((item: any) => {
            this.option1.xAxis[0].data.push(item.name)
            this.option1.series[1].data.push((item.total_number / 1000).toFixed(2))
            this.option1.series[0].data.push((item.total_price / 10000).toFixed(2))
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
    packMaterial.list().then((res) => {
      this.packList = res.data.data
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
@import '~@/assets/css/dataReport/accessoriesPackagingOrderStatistics.less';
</style>

<style lang="less">
#accessoriesPackagingOrderStatistics {
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