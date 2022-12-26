<template>
  <div id="materialsStockStatistics"
    class="bodyContainer"
    v-loading="loading">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/dataReport/orderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdanshujutubiao"></use>
        </svg>
        <span class="text">订单数据图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/sampleOrderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdanshujutubiao"></use>
        </svg>
        <span class="text">样单数据图表</span>
      </div>
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yuanliaoshiyongtubiao"></use>
        </svg>
        <span class="text">原料使用图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/accessoriesDecorationOrderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-fuliaoshiyongtubiao"></use>
        </svg>
        <span class="text">辅料使用图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/productionPlanChartStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-shengchanshujutubiao"></use>
        </svg>
        <span class="text">生产数据图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/transportationOutboundStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-qitafeiyongtubiao"></use>
        </svg>
        <span class="text">其它费用图表</span>
      </div>
    </div>
    <div class="module noBackColor">
      <div style="display: flex; width: 49%; justify-content: space-between">
        <div class="tab"
          @click="$router.push('/dataReport/materialsUsePlanDataStatistics')">计划数据统计</div>
        <div class="tab"
          @click="$router.push('/dataReport/materialsOrderingStatistics')">订购数据统计</div>
        <div class="tab"
          @click="$router.push('/dataReport/materialsTransferStatistics')">调取数据统计</div>
        <div class="tab"
          @click="$router.push('/dataReport/materialsMachiningStatistics')">加工数据统计</div>
        <div class="tab active">库存数据统计</div>
      </div>
      <div class="cardCtn">
        <div class="card noBackColor noPad"
          style="width: 106%">
          <div class="screenCtn">
            <div class="screen"
              style="width: 48.5%">
              <el-select @change="
                  getStoreDetail($event)
                  changeRouter()
                "
                v-model="filterData.store_id"
                placeholder="筛选调取仓库"
                clearable>
                <el-option v-for="item in storeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="screen"
              style="width: 48.5%">
              <el-select @change="changeRouter"
                v-model="filterData.type"
                placeholder="筛选调取仓库"
                clearable>
                <el-option label="纱线/面料"
                  :value="''"></el-option>
                <el-option label="纱线"
                  :value="1"></el-option>
                <el-option label="面料"
                  :value="2"></el-option>
              </el-select>
            </div>
            <div class="screen"
              style="margin-bottom: 0; width: 65.5%">
              <el-cascader placeholder="筛选原料名称"
                v-model="filterData.name"
                :options="yarnTypeList"
                clearable
                filterable
                @change="changeRouter"></el-cascader>
            </div>
            <div class="screen"
              style="margin-bottom: 0">
              <el-button style="width: 100%; height: 52px"
                @click="reset">重置</el-button>
            </div>
          </div>
        </div>
        <div class="card"
          style="margin-left: 4px">
          <div class="contentGrid">
            <h3>当前统计默认值</h3>
            <div class="item2">
              订单下单时间：<span class="blue">{{ formatDate2(filterData.start_time) }}-{{ formatDate2(filterData.end_time) }}</span>
            </div>
          </div>
          <div class="contentGrid">
            <div>
              原料名称：<span class="blue">{{ filterData.name || '所有' }}</span>
            </div>
            <div>
              仓库名称：<span class="blue">{{ alias || '所有' }}</span>
            </div>
            <div>
              原材类型：<span class="blue">{{
                filterData.type === '' ? '纱线/面料' : filterData.type === 1 ? '纱线' : '面料'
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>合计库存数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.total_number / 1000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
        <div class="card">
          <h3>合计结余数量</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ (this.reportData.balance_number / 1000).toFixed(2) }}</h2>
            </span>
            <h2 class="unit">吨或千米</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card"
          style="padding-top: 60px">
          <zh-charts :option="option1"></zh-charts>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue"
            @click="$router.push('/store/list?page=1&keyword=&user_id=&store_type=1')">
            查看库存数量
          </div>
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
            name: '库存数量',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 吨或千米'
            }
          }
        ],
        series: []
      },
      groupName: '',
      createPeople: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        contacts_id: '',
        group_id: '',
        type: '',
        orderOrSimpleOrder: '',
        store_id: '',
        name: []
      },
      reportData: {
        balance_number: 0,
        total_number: 0
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
      this.filterData.store_id = Number(query.store_id) || ''
      this.filterData.name = query.name ? (query.name as string).split(',') : []
      this.filterData.order_type = query.order_type ? +query.order_type : ''
      this.filterData.type = query.type ? +query.type : ''
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
        type: '',
        name: []
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
          '&name=' +
          encodeURIComponent(this.filterData.name || '') +
          '&store_id=' +
          (this.filterData.store_id || '') +
          '&type=' +
          (this.filterData.type || '') +
          '&settle_unit=' +
          (this.filterData.settle_unit || '') +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
      // location.reload()
    },
    getList() {
      this.loading = true
      statistics
        .storeTotal({
          start_time: this.filterData.start_time,
          store_id: this.filterData.store_id,
          type: this.filterData.type,
          name: this.filterData.name.length ? this.filterData.name[2] : '',
          end_time: this.filterData.end_time
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }
          let data = res.data.data

          this.reportData = data
          let storeArr: any = []
          // this.option1.series = []
          // this.option1.xAxis[0].data = []
          // this.option1.legend.data = []
          this.option1 = {
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

                  if (param.value === '0.00') return

                  //为了保证和原来的效果一样，这里自己实现了一个点的效果
                  htmlStr +=
                    '<div><span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
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
                    '</span>吨或千米'

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
                name: '库存数量',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                  formatter: '{value} 吨或千米'
                }
              }
            ],
            series: []
          }

          let orderNumberMax: any, orderNumberMin: any

          data.report.sort(function (a: any, b: any) {
            return b.number - a.number
          })

          data.report.forEach((item: any) => {
            if (item.number > 5) {
              this.option1.xAxis[0].data.push(item.name)
            }

            storeArr = storeArr.concat(
              item.store.map((item: any) => {
                return item.name
              })
            )
          })

          this.option1.legend.data = [...new Set(storeArr)]

          this.option1.legend.data.forEach((item: any, index: number) => {
            this.option1.series.push({
              name: item,
              type: 'bar',
              data: [],
              stack: 1,
              //显示颜色
              itemStyle: {
                normal: {
                  color: ['#229CFB', '#1FB48C', '#8E44AD', '#696969', '#28AE60', '#F39C25', '#D3541A', '#21BC9C'][index]
                }
              }
            })

            data.report.forEach((itemReport: any) => {
              if (itemReport.number < 5) {
                console.log(this.option1.series)
                return
              }

              let arr = itemReport.store.map((el: any) => {
                return el.name
              })

              if (arr.indexOf(item) === -1) {
                itemReport.store.push({ name: item, number: '0.00' })
              }

              itemReport.store.forEach((itemStore: any) => {
                if (itemStore.name === item) {
                  this.option1.series[index].data.push((itemStore.number / 1000).toFixed(2))
                }
              })
            })
          })

          if (data.report.length !== 0) {
            // 每月下单总数
            orderNumberMax = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.number > +num2.number ? num1 : num2
            })
            orderNumberMin = Object.values(data.report).reduce((num1: any, num2: any) => {
              return +num1.number < +num2.number ? num1 : num2
            })

            // 拿到最大和最小值
            orderNumberMax = +orderNumberMax.number
            orderNumberMin = +orderNumberMin.number
          }

          this.option1.yAxis[0].name = '库存数量'

          // Y轴 图表更新
          this.option1.yAxis[0].max = Math.ceil(Math.ceil(orderNumberMax / 1000 / 5)) * 5 || 10
          this.option1.yAxis[0].min = orderNumberMin && orderNumberMin < 0 ? Math.ceil(orderNumberMin / 1000) : 0
          this.option1.yAxis[0].interval = Math.ceil(orderNumberMax / 1000 / 5) || 10
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
    },
    yarnTypeList() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          label: item.label,
          value: item.label,
          children: item.children.map((itemChild: any) => {
            return {
              label: itemChild.label,
              value: itemChild.label,
              children: itemChild.children.map((itemSon: any) => {
                return { label: itemSon.label, value: itemSon.label }
              })
            }
          })
        }
      })
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
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
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