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
      <div class="tag" @click="$message.info('功能正在开发中，即将上线')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-fuliaoshiyongtubiao"></use>
        </svg>
        <span class="text">辅料使用图表</span>
      </div>
      <div class="tag" @click="$message.info('功能正在开发中，即将上线')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-shengchanshujutubiao"></use>
        </svg>
        <span class="text">生产数据图表</span>
      </div>
      <div class="tag" @click="$message.info('功能正在开发中，即将上线')">
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
        <div class="tab" @click="$message.info('功能正在开发中，即将上线')">调取数据统计</div>
        <div class="tab" @click="$message.info('功能正在开发中，即将上线')">加工数据统计</div>
        <div class="tab" @click="$message.info('功能正在开发中，即将上线')">原料库存数据统计</div>
        <!-- <div class="tab" @click="$router.push('/dataReport/materialsTransferStatistics')">调取数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsMachiningStatistics')">加工数据统计</div>
        <div class="tab" @click="$router.push('/dataReport/materialsStockStatistics')">原料库存数据统计</div> -->
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
              <el-select @change="changePeople" v-model="filterData.contacts_id" placeholder="筛选创建人" clearable>
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
              原料名称：<span class="blue">{{ filterData.yuanliaomingcheng || '所有' }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
            <div>
              负责小组：<span class="blue">{{ groupName || '所有' }}</span>
            </div>
            <div>
              下单公司：<span class="blue">{{ alias || '所有' }}</span>
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
              placeholder="筛选下单公司"
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
            <el-button style="width: 100%; height: 63px">重置</el-button>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>合计订购数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.total_number }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>合计订购金额</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.total_number }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>最终入库数量</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.total_number }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>最终入库金额</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.total_number }}</h2>
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
            <el-tab-pane label="实际订购" name="second">
              <div style="display: flex; justify-content: end; padding-right: 50px">
                <div style="width: 150px">
                  <el-select v-model="sortWay" @change="changeRouter">
                    <el-option label="按数量排序" :value="1"> </el-option>
                    <el-option label="按损耗排序%" :value="2"> </el-option>
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
          <div class="btn backHoverBlue">查看原料订购单</div>
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
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 万元'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万件'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: []
          },
          {
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      groupOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      },
      companyOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },

        dataZoom: [
          //给y轴设置滚动条
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '70%', //组件高度
            left: 650,
            right: 15,
            top: 50,
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            yAxisIndex: [0, 1] //控制的 y轴
          }
        ],
        yAxis: {
          type: 'category',
          inverse: true,
          data: []
        },
        xAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar'
          }
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
        order_type: '',
        user_id: ''
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
              this.alias = res.data.data.alias
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
    changeUnit() {
      this.option1.tooltip.formatter = (params: any) => {
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
            (index === 1 ? '万件' : '万' + (this.filterData.settle_unit || '元'))

          htmlStr += '</div>'
        })

        return htmlStr
      }
      this.option1.yAxis[0].axisLabel.formatter = '{value} 万' + (this.filterData.settle_unit || '元')
      this.groupOption.tooltip.formatter = (params: any) => {
        return `
                <div>
                    ${params.marker}<span style="margin-left:10px;color:black;font-weight:bold">${
          params.data.name
        }：<span style="color:${params.color};font-weight:normal">${params.data.value}万${
          this.filterData.settle_unit || '元'
        }</span></span>
                </div>
              `
      }
      this.companyOption.tooltip.formatter = (params: any) => {
        return `
                <h4 style='color:#000000;margin:5px 0'>${params[0].axisValue}</h4>
                <span style='color:#A3A3A3;font-size:10px'>CNY：</span>
                <span style='color:#229CFB;font-size:14px;'>${this.filterData.settle_unit === '美元' ? '$' : '￥'}${
          params[0].value
        }</span>
            `
      }
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
      this.changeUnit()
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
          '&contacts_id=' +
          (this.filterData.contacts_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
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

          // data.order.total_number = this.$formatNum(+(data.order.total_number / 10000).toFixed(2))
          // data.order.total_price = this.$formatNum(+(data.order.total_price / 10000).toFixed(2))
          // data.transport.price = this.$formatNum(+(data.transport.price / 10000).toFixed(2))
          // data.transport.transport_number = this.$formatNum(+(data.transport.transport_number / 10000).toFixed(2))

          // this.option1.series[0].data = []
          // this.option1.series[1].data = []
          // this.groupOption.series[0].data = []
          // this.companyOption.yAxis.data = []
          // this.companyOption.series[0].data = []

          // let orderPriceMax: any,
          //   orderPriceMin: any,
          //   orderNumberMax: any,
          //   orderNumberMin: any,
          //   outPriceMax: any,
          //   outPriceMin: any,
          //   outNumberMax: any,
          //   outNumberMin: any = 0

          // if (data.order.report.month.length !== 0) {
          //   //  每月下单总额
          //   orderPriceMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.total_price > +num2.total_price ? num1 : num2
          //   })
          //   orderPriceMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.total_price < +num2.total_price ? num1 : num2
          //   })

          //   // 每月下单总数
          //   orderNumberMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.total_number > +num2.total_number ? num1 : num2
          //   })
          //   orderNumberMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.total_number < +num2.total_number ? num1 : num2
          //   })

          //   // 拿到每月下单总额的最大值和最小值
          //   orderPriceMax = +orderPriceMax.total_price
          //   orderPriceMin = +orderPriceMin.total_price

          //   // 拿到每月下单总数的最大值和最小值
          //   orderNumberMax = +orderNumberMax.total_number
          //   orderNumberMin = +orderNumberMin.total_number
          // }

          // if (data.transport.report.month.length !== 0) {
          //   //  每月出库总额
          //   outPriceMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.price > +num2.price ? num1 : num2
          //   })
          //   outPriceMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.price < +num2.price ? num1 : num2
          //   })

          //   // 每月出库总数
          //   outNumberMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.transport_number > +num2.transport_number ? num1 : num2
          //   })
          //   outNumberMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
          //     return +num1.transport_number < +num2.transport_number ? num1 : num2
          //   })

          //   // 拿到每月出库总额的最大值和最小值
          //   outPriceMax = +outPriceMax.price
          //   outPriceMin = +outPriceMin.price

          //   // 拿到出库下单总数的最大值和最小值
          //   outNumberMax = +outNumberMax.transport_number
          //   outNumberMin = +outNumberMin.transport_number
          // }

          // if (this.activeName === 'first') {
          //   this.option1.series[0].name = '每月下单总额'
          //   this.option1.series[1].name = '每月下单总数'
          //   this.option1.legend.data = ['每月下单总额', '每月下单总数']
          //   this.option1.yAxis[0].name = '下单总额'
          //   this.option1.yAxis[1].name = '下单总数'

          //   // 每月下单总数 图表更新
          //   this.option1.yAxis[0].max = Math.ceil(Math.ceil(orderPriceMax / 10000 / 5)) * 5 || 10
          //   this.option1.yAxis[0].min = orderPriceMin && orderPriceMin < 0 ? Math.ceil(orderPriceMin / 10000) : 0
          //   this.option1.yAxis[0].interval = Math.ceil(orderPriceMax / 10000 / 5) || 10

          //   // 每月下单总额 图表更新
          //   this.option1.yAxis[1].max = Math.ceil(Math.ceil(orderNumberMax / 10000 / 5)) * 5 || 10
          //   this.option1.yAxis[1].min = orderNumberMin && orderNumberMin < 0 ? Math.ceil(orderNumberMin / 10000) : 0
          //   this.option1.yAxis[1].interval = Math.ceil(orderNumberMax / 10000 / 5) || 10

          //   this.option1.xAxis[0].data.forEach((itemMouth: any) => {
          //     let mouth = this.reportData.order.report.month.find((item: any) => {
          //       return item.mouth === itemMouth
          //     })
          //     if (mouth) {
          //       this.option1.series[0].data.push(+(+mouth.total_price / 10000).toFixed(2))
          //       this.option1.series[1].data.push(+(+mouth.total_number / 10000).toFixed(2))
          //     } else {
          //       this.option1.series[0].data.push(0)
          //       this.option1.series[1].data.push(0)
          //     }
          //   })
          // } else if (this.activeName === 'second') {
          //   this.option1.series[0].name = '每月出库总额'
          //   this.option1.series[1].name = '每月出库总数'
          //   this.option1.legend.data = ['每月出库总额', '每月出库总数']
          //   this.option1.yAxis[0].name = '出库总额'
          //   this.option1.yAxis[1].name = '出库总数'

          //   // 每月出库总数 图表更新
          //   this.option1.yAxis[0].max = Math.ceil(Math.ceil(outPriceMax / 10000 / 5)) * 5 || 10
          //   this.option1.yAxis[0].min = outPriceMin && outPriceMin < 0 ? Math.ceil(outPriceMin / 10000) : 0
          //   this.option1.yAxis[0].interval = Math.ceil(outPriceMax / 10000 / 5) || 10

          //   // 每月出库总额 图表更新
          //   this.option1.yAxis[1].max = Math.ceil(Math.ceil(outNumberMax / 10000 / 5)) * 5 || 10
          //   this.option1.yAxis[1].min = outNumberMin && outNumberMin < 0 ? Math.ceil(outNumberMin / 10000) : 0
          //   this.option1.yAxis[1].interval = Math.ceil(outNumberMax / 10000 / 5) || 10

          //   this.option1.xAxis[0].data.forEach((itemMouth: any) => {
          //     let mouth = this.reportData.transport.report.month.find((item: any) => {
          //       return item.mouth === itemMouth
          //     })
          //     if (mouth) {
          //       this.option1.series[0].data.push(+(+mouth.price / 10000).toFixed(2))
          //       this.option1.series[1].data.push(+(+mouth.transport_number / 10000).toFixed(2))
          //     } else {
          //       this.option1.series[0].data.push(0)
          //       this.option1.series[1].data.push(0)
          //     }
          //   })
          // }
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