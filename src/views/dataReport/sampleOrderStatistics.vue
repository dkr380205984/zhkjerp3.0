<template>
  <div id="sampleOrderStatistics" class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag" @click="$router.push('/dataReport/orderStatistics')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-dingdancaiwutongji"></use>
        </svg>
        <span class="text">订单财务统计</span>
      </div>
      <div class="tag active">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="text">样单财务统计</span>
      </div>
      <!-- <div class="tag">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="text">原料使用统计</span>
      </div>
      <div class="tag">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="text">原料使用统计</span>
      </div>
      <div class="tag">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="text">生产数据统计</span>
      </div>
      <div class="tag">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-yangdancaiwutongji"></use>
        </svg>
        <span class="text">其它费用统计</span>
      </div> -->
    </div>
    <div class="module noBackColor">
      <div class="cardCtn">
        <div class="card noBackColor noPad">
          <div class="screenCtn">
            <div class="screen">
              <el-date-picker v-model="filterData.start_time" type="year" placeholder="筛选下单年份"> </el-date-picker>
            </div>
            <div class="screen">
              <el-select v-model="filterData.client_id" filterable placeholder="筛选下单公司">
                <el-option
                  v-for="item in filterCondition.companyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="screen">
              <el-select v-model="filterData.group_id" placeholder="筛选组">
                <el-option
                  v-for="item in filterCondition.groupList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="screen"></div>
          </div>
        </div>
        <div class="card">
          <div class="contentGrid">
            <h3>当前统计默认值</h3>
            <div class="item2">订单下单时间：<span class="blue">2021年1月1日-2021年12月31日</span></div>
          </div>
          <div class="contentGrid">
            <div>下单小组：<span class="blue">所有</span></div>
            <div>下单公司：<span class="blue">所有</span></div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>打样数量</h3>
          <div class="content">
            <span class="blue">
              <h2>937</h2>
            </span>
            <h2 class="unit">件</h2>
          </div>
        </div>
        <div class="card">
          <h3>确认数量</h3>
          <div class="content">
            <span class="blue">
              <h2>50</h2>
            </span>
            <h2 class="unit">件</h2>
          </div>
        </div>
        <div class="card">
          <h3>确认比例</h3>
          <div class="content">
            <span class="green">
              <h2>5</h2>
            </span>
            <h2 class="unit">%</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>原料采购成本</h3>
          <div class="content">
            <span class="blue">
              <h2>0.44</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>原料加工成本</h3>
          <div class="content">
            <span class="blue">
              <h2>0</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
        <div class="card">
          <h3>生产成本</h3>
          <div class="content">
            <span class="green">
              <h2>0.15</h2>
            </span>
            <h2 class="unit">万元</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户管理" name="first">
              <zh-charts
                v-if="activeName === 'first'"
                :option="{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'cross',
                      crossStyle: {
                        color: '#999'
                      }
                    }
                  },
                  toolbox: optionData.toolbox,
                  legend: {
                    data: ['每月下单总额', '每月下单总数']
                  },
                  xAxis: [
                    {
                      type: 'category',
                      data: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                      ],
                      axisPointer: {
                        type: 'shadow'
                      }
                    }
                  ],
                  yAxis: [
                    {
                      type: 'value',
                      name: '下单总额',
                      min: 0,
                      max: 250,
                      interval: 50,
                      axisLabel: {
                        formatter: '{value} 万元'
                      }
                    },
                    {
                      type: 'value',
                      name: '下单总数',
                      min: 0,
                      max: 25,
                      interval: 5,
                      axisLabel: {
                        formatter: '{value} 万件'
                      }
                    }
                  ],
                  series: [
                    {
                      name: '每月下单总额',
                      type: 'bar',
                      tooltip: {
                        valueFormatter: function (value) {
                          return value + ' 万元'
                        }
                      },
                      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                      name: '每月下单总数',
                      type: 'line',
                      yAxisIndex: 1,
                      tooltip: {
                        valueFormatter: function (value) {
                          return value + '万件'
                        }
                      },
                      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                  ]
                }"
              ></zh-charts>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="second"
              ><zh-charts
                v-if="activeName === 'second'"
                :option="{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'cross',
                      crossStyle: {
                        color: '#999'
                      }
                    }
                  },
                  toolbox: optionData.toolbox,
                  legend: {
                    data: ['每月下单总额', '每月下单总数']
                  },
                  xAxis: [
                    {
                      type: 'category',
                      data: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                      ],
                      axisPointer: {
                        type: 'shadow'
                      }
                    }
                  ],
                  yAxis: [
                    {
                      type: 'value',
                      name: '下单总额',
                      min: 0,
                      max: 250,
                      interval: 50,
                      axisLabel: {
                        formatter: '{value} 万元'
                      }
                    },
                    {
                      type: 'value',
                      name: '下单总数',
                      min: 0,
                      max: 25,
                      interval: 5,
                      axisLabel: {
                        formatter: '{value} 万件'
                      }
                    }
                  ],
                  series: [
                    {
                      name: '每月下单总额',
                      type: 'bar',
                      tooltip: {
                        valueFormatter: function (value) {
                          return value + ' 万元'
                        }
                      },
                      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 55555, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                      name: '每月下单总数',
                      type: 'line',
                      yAxisIndex: 1,
                      tooltip: {
                        valueFormatter: function (value) {
                          return value + '万件'
                        }
                      },
                      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                  ]
                }"
              ></zh-charts
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <div style="transform: translateY(5%)">
            <zh-charts
              :option="{
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  top: '5%',
                  left: 'center'
                },
                series: [
                  {
                    name: 'Access From',
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
                    data: [
                      { value: 1048, name: '一组' },
                      { value: 735, name: '二组' },
                      { value: 580, name: '三组' }
                    ]
                  }
                ]
              }"
            ></zh-charts>
          </div>
        </div>
        <div class="card">
          <div style="transform: translateY(5%)">
            <zh-charts
              :option="{
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  top: '5%',
                  left: 'center'
                },
                series: [
                  {
                    name: 'Access From',
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
                    data: [
                      { value: 1048, name: '1' },
                      { value: 735, name: '2' },
                      { value: 580, name: '3' },
                      { value: 580, name: '4' },
                      { value: 580, name: '5' },
                      { value: 580, name: '6' },
                      { value: 580, name: '7' },
                      { value: 580, name: '8' }
                    ]
                  }
                ]
              }"
            ></zh-charts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
import { limitArr } from '@/assets/js/dictionary'
import { MaterialPlanInfo } from '@/types/materialPlan'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
export default Vue.extend({
  components: { zhCharts },
  data(): {
    list: MaterialPlanInfo[]
    [porpName: string]: any
  } {
    return {
      loading: false,
      list: [],
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
      filterData: {
        start_time: '',
        client_id: '',
        contacts_id: '',
        group_id: '',
        settle_unit: '',
        end_time: ''
      },
      filterCondition: {
        currency: [
          {
            label: '人民币',
            value: '人民币'
          },
          {
            label: '美元',
            value: '美元'
          }
        ],
        directorList: [
          {
            label: '人民币',
            value: '人民币'
          },
          {
            label: '美元',
            value: '美元'
          }
        ],
        groupList: [
          {
            label: '人民币',
            value: '人民币'
          },
          {
            label: '美元',
            value: '美元'
          }
        ],
        companyList: [
          {
            label: '人民币',
            value: '人民币'
          },
          {
            label: '美元',
            value: '美元'
          }
        ]
      },
      activeName: 'first',
      limitList: limitArr,
      total: 1,
      page: 1,
      limit: 10,
      code: '',
      order_code: '',
      date: [],
      user_id: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  filters: {
    filterCheck(type: 0 | 1 | 2) {
      return ['待审核', '已审核', '已驳回'][type]
    },
    filterCheckClass(type: 0 | 1 | 2) {
      return ['orange', 'green', 'red'][type]
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.code = query.code
      this.order_code = query.order_code
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
      this.user_id = query.user_id || ''
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/materialManage/list?page=' +
          this.page +
          '&code=' +
          this.code +
          '&order_code=' +
          this.order_code +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit +
          '&user_id' +
          this.user_id
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.code = ''
          this.order_code = ''
          this.date = []
          this.limit = 10
          this.user_id = ''
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    getList() {
      this.loading = true
      materialPlan
        .list({
          limit: this.limit,
          page: this.page,
          code: this.code,
          order_code: this.order_code,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    }
    // getListSetting() {
    //   this.listKey = []
    //   listSetting
    //     .detail({
    //       type: 5
    //     })
    //     .then((res) => {
    //       this.listSettingId = res.data.data ? res.data.data.id : null
    //       this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
    //     })
    // }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  created() {
    this.getFilters()
    this.getList()
    // this.getListSetting()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
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
  .el-input .el-input__inner {
    height: 100% !important;
    line-height: 30px;
    border: 0px;
  }
  .el-tabs__nav-wrap::after {
    background-color: white;
  }
}
</style>