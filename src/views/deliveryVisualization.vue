<template>
  <!-- 大屏发货 ,这个页面的CSS是完全按照背景图写死的,不做适配,1920*1080-->
  <div id="deliveryVisualization"
    class="visualizationCtn"
    @click.left="showMenu = false"
    @click.right="handleClickRight">
    <div class="leftCtn">
      <div class="title">{{ $getsessionStorage('company_name')}}数据中控台</div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">发货时间</div>
            <div class="tcol">订单号</div>
            <div class="tcol">下单客户</div>
            <div class="tcol">下单时间</div>
            <div class="tcol">订单状态</div>
            <div class="tcol">创建人</div>
            <div class="tcol noPad"
              style="flex:6">
              <div class="trow">
                <div class="tcol">产品编号</div>
                <div class="tcol">产品图片</div>
                <div class="tcol">下单数量</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">生产工序</div>
                    <div class="tcol">完成数量</div>
                    <div class="tcol">更新时间</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbodyCtn">
          <div class="tbody">
            <transition-group @leave="leave">
              <div class="trow"
                v-for="item in list"
                :key="item.id">
                <div class="tcol">{{item.delivery_time}}</div>
                <div class="tcol">{{item.order_code}}</div>
                <div class="tcol">{{item.client_name}}</div>
                <div class="tcol">{{item.order_time}}</div>
                <div class="tcol"
                  :class="item.status|orderStatusClassFilter">{{item.status|orderStatusFilter}}</div>
                <div class="tcol">{{item.user_name}}</div>
                <div class="tcol noPad"
                  style="flex:6">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in item.product_info"
                    :key="indexPro">
                    <div class="tcol">{{itemPro.product_code}}</div>
                    <div class="tcol">
                      <div class="imageCtn">
                        <el-image style="width:100%;height:100%"
                          :src="itemPro.image_data.length>0?itemPro.image_data[0]:''"
                          :preview-src-list="itemPro.image_data">
                          <div slot="error"
                            class="image-slot">
                            <i class="el-icon-picture-outline"
                              style="font-size:42px"></i>
                          </div>
                        </el-image>
                      </div>
                    </div>
                    <div class="tcol">{{itemPro.number}}</div>
                    <div class="tcol noPad"
                      style="flex:3">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in itemPro.weave_info"
                        :key="indexChild">
                        <div class="tcol">{{itemChild.process_name}}</div>
                        <div class="tcol middle">
                          <div>{{itemChild.real_number}}
                            (<span :class="{'green':itemChild.real_number>=itemChild.number,'red':itemChild.real_number<itemChild.number}">
                              <template v-if="itemChild.real_number>itemChild.number">+{{itemChild.real_number-itemChild.number}}</template>
                              <template v-else-if="itemChild.real_number===itemChild.number">0</template>
                              <template v-else>-{{itemChild.number - itemChild.real_number}}</template>
                            </span>)</div>
                        </div>
                        <div class="tcol">{{itemChild.update_time}}</div>
                      </div>
                      <div class="trow"
                        v-if="itemPro.weave_info.length===0">
                        <div class="tcol">暂无生产信息</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <div class="rightCtn">
      <div class="top">
        <div class="title">当前时间：{{time}}</div>
        <div ref="charts"
          class="charts"></div>
      </div>
      <div class="bottom">
        <div class="title">小程序实时更新数量</div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">更新时间</div>
              <div class="tcol">姓名</div>
              <div class="tcol">工序</div>
              <div class="tcol">产品编号</div>
              <div class="tcol">产品图片</div>
              <div class="tcol">尺码颜色</div>
              <div class="tcol">完成数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in appListShow"
              :key="index">
              <div class="tcol">{{item.update_time}}</div>
              <div class="tcol">{{item.user_name}}</div>
              <div class="tcol">{{item.process_name}}</div>
              <div class="tcol">{{item.product_code}}</div>
              <div class="tcol">
                <div class="imageCtn">
                  <el-image style="width:100%;height:100%"
                    :src="item.image_data.length>0?item.image_data[0]:''"
                    :preview-src-list="item.image_data">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
              <div class="tcol">{{item.number}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右键菜单 -->
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      style="width:350px"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item"
        @click="windowMethod(2)">订单筛选</div>
      <!-- <div class="setting_item"
        @click="windowMethod(3)">小程序更新筛选</div> -->
    </div>
    <!-- 筛选订单 -->
    <div class="popup"
      v-show="showOrder">
      <div class="main">
        <div class="titleCtn">
          <span class="text">筛选订单条件</span>
          <div class="closeCtn"
            @click="showOrder=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">筛选小组：</div>
            <div class="info elCtn">
              <el-select v-model="group_id"
                placeholder="请选择小组"
                multiple>
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">筛选负责人：</div>
            <div class="info elCtn">
              <el-select v-model="user_id"
                placeholder="请选择负责人"
                multiple>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="showOrder=false">取消</span>
          <span class="btn backHoverBlue"
            @click="filterList">确认筛选</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { chartsApi, order } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      X_position: 0,
      Y_position: 0,
      showMenu: false,
      showPrintSetting: false,
      showOrder: false,
      group_id: [],
      user_id: [],
      totalOrderNum: 0,
      orderPage: 1,
      getOrderCompleteFlag: false,
      appList: [],
      appListPage: 1,
      list: [], // 滚动区
      listNew: [], // 新增区
      listStore: [], // 缓冲区
      show: true,
      timer: null,
      appTimer: null,
      appPage: 1,
      totalAppNum: 0,
      showCharts: false,
      option: {
        backgroundColor: '',
        tooltip: {
          position: 'top',
          formatter: function (params: any) {
            return '发货量: ' + params.value[1]
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 3000,
          inRange: {
            color: ['#00C1FF', '#0098C9'],
            opacity: 0.3
          },
          borderColor: '#fff'
        },
        calendar: {
          orient: 'vertical',
          range: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
          left: 120,
          top: 80,
          yearLabel: {
            margin: 40,
            show: false
          },
          dayLabel: {
            show: true,
            firstDay: 1,
            nameMap: 'cn',
            color: '#fff',
            fontSize: 18
          },
          monthLabel: {
            show: true,
            nameMap: 'cn',
            margin: 20,
            color: '#fff',
            fontSize: 18
          },
          itemStyle: {
            opacity: 1,
            borderColor: '#000',
            color: '#214673'
          },
          cellSize: 50
        },
        series: {
          type: 'effectScatter',
          coordinateSystem: 'calendar',
          symbolSize: function (val: any) {
            return val[1] === 0 ? 10 : val[1] / 80
          },

          data: []
        }
      },
      time: '',
      chart: null
    }
  },
  watch: {
    'listStore.length'(val) {
      if (this.getOrderCompleteFlag) {
        if (val === 5) {
          this.list = this.list.concat(this.listStore.slice(0, val - 1))
          this.listStore = this.listStore.slice(val - 1)
        }
      } else {
        this.list = this.list.concat(this.listNew)
        this.listNew = []
      }
    }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    appListShow(): any[] {
      if (this.appList.length > 0) {
        return this.appList.slice((this.appListPage - 1) * 5, this.appListPage * 5)
      } else {
        return []
      }
    }
  },
  methods: {
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: 1 | 2 | 3) {
      this.showMenu = false
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          this.showOrder = true
          this.user_id = []
          this.group_id = []
        } else if (type === 3) {
        }
      })
    },
    leave(el: any, done: any) {
      done()
    },
    getOrderList() {
      order
        .deliveryList({
          user_id: this.user_id,
          group_id: this.group_id,
          page: this.orderPage,
          limit: 20
        })
        .then((res) => {
          if (res.data.status) {
            this.totalOrderNum = res.data.data.total
            if (this.totalOrderNum > this.orderPage * 20) {
              this.orderPage++
              if (this.list.length === 0) {
                this.list = res.data.data.items
              } else {
                this.listNew = res.data.data.items
              }
              this.getOrderList()
            } else {
              this.getOrderCompleteFlag = true
            }
            if (!this.timer && Number(this.totalOrderNum) > 10) {
              this.timer = setInterval(() => {
                this.listStore.push(this.list[0])
                this.list.shift()
              }, 12000)
            }
          }
        })
    },
    filterList() {
      this.list = [] // 滚动区
      this.listNew = [] // 新增区
      this.listStore = [] // 缓冲区
      this.appList = []
      this.getOrderList()
      this.getAppList()
      this.getBatchLog()
    },
    getAppList() {
      chartsApi
        .appLog({
          user_id: this.user_id,
          group_id: this.group_id,
          limit: 20,
          page: this.appPage
        })
        .then((res) => {
          if (res.data.status) {
            this.totalAppNum = res.data.data.total
            if (this.totalAppNum > this.appPage * 20) {
              this.appPage++
              this.getAppList()
            }
            this.appList = this.appList.concat(res.data.data.items)
            if (!this.appTimer && this.totalAppNum > 5) {
              this.appTimer = setInterval(() => {
                if (this.appListPage * 5 < this.totalAppNum) {
                  this.appListPage++
                } else {
                  this.appListPage = 1
                  this.appList = []
                  this.appTimer = null
                  this.getAppList()
                }
              }, 20000)
            }
          }
        })
    },
    getVirtulData(data: any) {
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      const day = new Date(year, month - 1, 0).getDate() // 获取当前月份有多少天
      const returnData = []
      for (let i = 1; i < day; i++) {
        const today = year + '-' + (month < 10 ? '0' + month : month) + '-' + (i < 10 ? '0' + i : i)
        const finded = data.find((item: any) => item.delivery_time === today)
        if (finded) {
          returnData.push([today, finded.number])
        } else {
          returnData.push([today, 0])
        }
      }
      return returnData
    },
    getBatchLog() {
      chartsApi
        .batchLog({
          user_id: this.user_id,
          group_id: this.group_id,
          start_time: '',
          end_time: ''
        })
        .then((res) => {
          if (res.data.status) {
            this.option.series.data = this.getVirtulData(res.data.data)
            this.option.visualMap.max = Math.max(...res.data.data.map((item: any) => item.number))
            this.option.series.symbolSize = (val: any) => {
              return (val[1] / this.option.visualMap.max) * 40 < 2 ? 2 : (val[1] / this.option.visualMap.max) * 40
            }
            let echarts = require('echarts')
            this.chart = echarts.init(this.$refs.charts)
            this.chart.setOption(this.option)
          }
        })
    },
    getTime() {
      const dt = new Date()
      const y = dt.getFullYear()
      const mt = dt.getMonth() + 1
      const day = dt.getDate()
      const h = dt.getHours() //获取时
      const m = dt.getMinutes() //获取分
      // const s = dt.getSeconds() //获取秒
      return y + '年' + mt + '月' + day + '日' + h + ':' + (m > 9 ? m : '0' + m)
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    this.getOrderList()
    // this.getAppList()
    this.getBatchLog()
    setInterval(() => {
      this.time = this.getTime()
    }, 1000)
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/deliveryVisualization.less';
</style>