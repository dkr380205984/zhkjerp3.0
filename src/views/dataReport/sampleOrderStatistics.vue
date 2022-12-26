<template>
  <div id="sampleOrderStatistics" class="bodyContainer" v-loading="loading">
    <div class="topTagCtn">
      <div class="tag" @click="$router.push('/dataReport/orderStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-dingdanshujutubiao"></use>
        </svg>
        <span class="text">订单数据图表</span>
      </div>
      <div class="tag active">
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
      <div class="cardCtn">
        <div class="card noBackColor noPad" style="width: 106%">
          <div class="screenCtn">
            <div class="screen" style="width: 100%">
              <el-date-picker
                v-model="filterData.start_time"
                type="year"
                @change="changeDate"
                placeholder="筛选下单年份"
              >
              </el-date-picker>
            </div>
            <div class="screen" style="margin-bottom: 0">
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
            <div class="screen" style="margin-bottom: 0">
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
              <el-select @change="changePeople" v-model="filterData.user_id" placeholder="筛选创建人" clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
              下单小组：<span class="blue">{{ groupName || '所有' }}</span>
            </div>
            <div>
              下单公司：<span class="blue">{{ alias || '所有' }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>打样数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.number }}</h2>
            </span>
            <h2 class="unit">件</h2>
          </div>
        </div>
        <div class="card">
          <h3>确认数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.real_number }}</h2>
            </span>
            <h2 class="unit">件</h2>
          </div>
        </div>
        <div class="card">
          <h3>确认比例</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.proportion }}</h2>
            </span>
            <h2 class="unit">%</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>原料采购成本</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.purchase }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>原料加工成本</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.process }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>生产成本</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.weave_plan }}</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card" style="padding-top: 60px">
          <div style="display: flex; justify-content: end; padding-right: 50px">
            <div style="width: 150px">
              <el-select v-model="sortWay" @change="changeRouter">
                <el-option label="打样数量排序" :value="1"> </el-option>
                <el-option label="打样成本排序" :value="2"> </el-option>
              </el-select>
            </div>
          </div>
          <zh-charts :option="option1"></zh-charts>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <zh-charts :option="groupOption"></zh-charts>
        </div>
        <div class="card">
          <zh-charts :option="categoryOption"></zh-charts>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client } from '@/assets/js/api'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
export default Vue.extend({
  components: { zhCharts },
  data(): {
    [porpName: string]: any
  } {
    return {
      loading: false,
      optionData: {
        toolbox: {
          right: '15%',
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        }
      },
      alias: '',
      createPeople: '',
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
          formatter: function (params: any) {
            var htmlStr = '<div style="color:black">'
            htmlStr += '<span style="font-weight:bold">' + params[0].name + '</span>' + '<br/>' //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>'

              //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
              htmlStr +=
                '<span style="color:black">' +
                param.seriesName +
                '：' +
                '<span style="color:' +
                color +
                ';">' +
                param.value +
                (index === 0 ? '件' : '万元')
              ;('</span></span>')

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
          data: ['打样数量', '打样成本']
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
            name: '打样数量',
            min: 0,
            max: 25,
            interval: 5
          },
          {
            type: 'value',
            name: '打样成本',
            min: 0,
            max: 500,
            interval: 100
          }
        ],
        series: [
          {
            type: 'bar',
            name: '打样数量',
            data: []
          },
          {
            type: 'line',
            name: '打样成本',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      groupOption: {
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            return `
                <div>
                    ${params.marker}<span style="margin-left:10px;color:black;font-weight:bold">${params.data.name}：<span style="color:${params.color};font-weight:normal">${params.data.value}件</span></span>
                </div>
              `
          }
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
      categoryOption: {
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            return `
                <div>
                    ${params.marker}<span style="margin-left:10px;color:black;font-weight:bold">${params.data.name}：<span style="color:${params.color};font-weight:normal">${params.data.value}件</span></span>
                </div>
              `
          }
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
      groupName: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        user_id: '',
        group_id: ''
      },
      reportData: {
        number: 0,
        real_number: 0,
        proportion: 0,
        purchase: 0,
        process: 0,
        weave_plan: 0,
        client: [],
        group: []
      },
      filterCondition: {
        contactsList: []
      }
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
      this.filterData.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.sortWay = Number(query.sortWay) || 1
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
        '/dataReport/sampleOrderStatistics?' +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
          '&user_id=' +
          (this.filterData.user_id || '') +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '') +
          '&sortWay=' +
          (this.sortWay || 1)
      )
    },
    getList() {
      this.loading = true

      statistics
        .sampleOrder({
          start_time: this.filterData.start_time,
          client_id: this.filterData.client_id.length > 0 ? this.filterData.client_id[2] : '',
          group_id: this.filterData.group_id,
          end_time: this.filterData.end_time,
          user_id: this.filterData.user_id
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }

          this.categoryOption.series[0].data = []
          this.groupOption.series[0].data = []
          this.option1.xAxis[0].data = []
          this.option1.series[0].data = []
          this.option1.series[1].data = []

          let data = res.data.data
          data.number = this.$formatNum(data.number)
          data.real_number = this.$formatNum(data.real_number)
          data.process = this.$formatNum((data.process / 10000).toFixed(2))
          data.purchase = this.$formatNum((data.purchase / 10000).toFixed(2))
          data.weave_plan = this.$formatNum((data.weave_plan / 10000).toFixed(2))
          data.proportion = this.$formatNum(data.proportion.toFixed(2))
          this.reportData = data

          data.category.forEach((category: any) => {
            this.categoryOption.series[0].data.push({
              name: category.name || '其它',
              value: category.number
            })
          })

          data.group.forEach((group: any) => {
            this.groupOption.series[0].data.push({
              name: group.name || '其它',
              value: group.number
            })
          })

          if (this.sortWay === 1) {
            data.client.sort(function (a: any, b: any) {
              return b.number - a.number
            })
          } else if (this.sortWay === 2) {
            data.client.sort(function (a: any, b: any) {
              return b.price - a.price
            })
          }

          data.client.forEach((client: any) => {
            this.option1.xAxis[0].data.push(client.name)
            this.option1.series[0].data.push(client.number)
            this.option1.series[1].data.push((client.price / 10000).toFixed(2))
          })

          let simpleNumberMax: any,
            simpleNumberMin: any,
            simplePriceMax: any,
            simplePriceMin: any = 0

          if (data.client.length !== 0) {
            //  打样数量
            simpleNumberMax = Object.values(data.client).reduce((num1: any, num2: any) => {
              return +num1.number > +num2.number ? num1 : num2
            })
            simpleNumberMin = Object.values(data.client).reduce((num1: any, num2: any) => {
              return +num1.number < +num2.number ? num1 : num2
            })

            // 打样成本
            simplePriceMax = Object.values(data.client).reduce((num1: any, num2: any) => {
              return +num1.price > +num2.price ? num1 : num2
            })
            simplePriceMin = Object.values(data.client).reduce((num1: any, num2: any) => {
              return +num1.price < +num2.price ? num1 : num2
            })

            // 拿到打样数量的最大值和最小值
            simpleNumberMax = +simpleNumberMax.number
            simpleNumberMin = +simpleNumberMin.number

            // 拿到打样成本的最大值和最小值
            simplePriceMax = +simplePriceMax.price
            simplePriceMin = +simplePriceMin.price
          }

          // 打样总数 图表更新
          this.option1.yAxis[0].max = Math.ceil(Math.ceil(simpleNumberMax / 5)) * 5 || 10
          this.option1.yAxis[0].min = simpleNumberMax && simpleNumberMax < 0 ? Math.ceil(simpleNumberMax) : 0
          this.option1.yAxis[0].interval = Math.ceil(simpleNumberMax / 5) || 10

          // 打样总额 图表更新
          this.option1.yAxis[1].max = Math.ceil(Math.ceil(simplePriceMax / 10000 / 5)) * 5 || 10
          this.option1.yAxis[1].min = simplePriceMin && simplePriceMin < 0 ? Math.ceil(simplePriceMin / 10000) : 0
          this.option1.yAxis[1].interval = Math.ceil(simplePriceMax / 10000 / 5) || 10
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
@import '~@/assets/css/dataReport/sampleOrderStatistics.less';
</style>

<style lang="less">
#sampleOrderStatistics {
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
}
</style>