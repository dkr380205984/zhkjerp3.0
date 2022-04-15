<template>
  <div id="sampleOrderList" v-loading="mainLoading1" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">样单列表</div>
      </div>
      <zh-drop-down :show="showCharts" position="bottom" hideTitle="点击查看图表" style="padding-top: 10px">
        <div style="height: 200px; width: 1580px; transform: translateX(-111px); padding-top: 50px">
          <zh-charts :option="option" style="height: 200px" v-on:chartsData="chartsData"></zh-charts>
        </div>
      </zh-drop-down>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="筛选样单/样品/样品编号"
              @keydown.enter.native="changeRouter"
            ></el-input>
          </div>
          <div class="elCtn">
            <el-cascader
              @change="
                getContacts($event)
                changeRouter()
              "
              placeholder="筛选下单公司"
              v-model="client_id"
              :options="clientList"
              filterable
              clearable
            >
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select
              placeholder="请选择公司联系人"
              v-model="contacts_id"
              no-data-text="请先选择下单公司"
              filterable
              clearable
              @change="changeRouter"
            >
              <el-option v-for="item in contactsList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="status" placeholder="筛选样单状态">
              <el-option :value="null" label="全部"></el-option>
              <el-option value="0" label="待审核"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="已驳回"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn hasIcon">
            <el-select
              @change="(ev) => getLocalStorage(ev, 'create_user')"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable
            >
              <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存创建人筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('create_user', user_id)"></i>
            </el-tooltip>
          </div>
          <div class="elCtn hasIcon">
            <el-select
              @change="(ev) => getLocalStorage(ev, 'group_id')"
              v-model="group_id"
              placeholder="筛选负责小组"
              clearable
            >
              <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存负责小组筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('group_id', group_id)"></i>
            </el-tooltip>
          </div>
          <div class="elCtn">
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changeRouter"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select v-model="limit" placeholder="每页展示条数" @change="changeRouter">
              <el-option v-for="item in limitList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn" style="height: 33px">
          <div class="btn backHoverBlue fr" @click="$router.push('/sampleOrder/create')">添加样单</div>
          <div class="btn backHoverOrange fl" @click="showSetting = true" style="margin-left: 0">列表设置</div>
          <div
            class="btn backHoverGreen fl"
            @click="
              getFilters()
              getList()
            "
          >
            刷新列表
          </div>
          <div :class="checked ? 'btn backHoverBlue fl' : 'btn backHoverBlue fl noCheck'" @click="exportExcelClick">
            导出Excel
          </div>
        </div>
        <zh-list
          :list="list"
          :listKey="listKey"
          :loading="loading"
          :checkedCount="checkedCount"
          :check="true"
          :oprList="oprList"
        ></zh-list>
        <div class="pageCtn">
          <el-pagination
            background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="2"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>

    <!-- 导出Excel -->
    <zhExportSetting
      @close="showExport = false"
      @afterSave="exportExcel"
      :show="showExport"
      :data.sync="exportKey"
      :originalData="originalExport"
    ></zhExportSetting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleOrder, listSetting, exportExcel, client, statistics } from '@/assets/js/api'
import { SampleOrderInfo } from '@/types/sampleOrder'
import { limitArr } from '@/assets/js/dictionary'
import zhExportSetting from '@/components/zhExportSetting/zhExportSetting.vue'
import zhDropDown from '@/components/zhDropDown/zhDropDown.vue'
export default Vue.extend({
  components: { zhExportSetting, zhDropDown },
  data(): {
    list: SampleOrderInfo[]
    [porpName: string]: any
  } {
    return {
      mainLoading: false,
      mainLoading1: false,
      loading: false,
      showCharts: false,
      isClick: false,
      list: [],
      contacts_id: '',
      contactsList: [],
      limitList: limitArr,
      limit: 10,
      total: 1,
      page: 1,
      showExport: false,
      exportKey: [],
      keyword: '',
      client_id: [],
      user_id: '',
      group_id: '',
      complete_time: '',
      status: '0',
      date: [],
      showSetting: false,
      listSettingId: null,
      listKey: [],
      checkedCount: [],
      checked: false,
      exportExcelParam: {
        show_row: [],
        start_time: '',
        end_time: '',
        order_type: 2
      },
      option: {
        color: ['#2DD59A', '#229CFB', '#F5222D', '#FA9036', '#000000'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: (params: any) => {
            let htmlStr = `
              <div>
                ${params[0].axisValueLabel}</br>
            `

            // htmlStr += `发货数量：${params[3].data}<br/>`
            params.forEach((param: any) => {
              // if (param.seriesName === '发货数') return
              if (param.dataIndex < 3 && param.seriesIndex === 1) return
              if (param.dataIndex >= 3 && param.seriesIndex === 2) return

              htmlStr +=
                param.marker +
                `<span style="margin-left:10px">${param.seriesName}</span><span style="margin-left:10px">${param.data}</span></br>`
            })
            return htmlStr + '</div>'
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
            },
            axisLabel: {
              interval: 2
            }
          }
        ],
        yAxis: [
          {
            show: false
          }
        ],
        series: [
          {
            type: 'bar',
            name: '已完成',
            stack: '0',
            data: []
          },
          {
            type: 'bar',
            stack: '0',
            name: '进行中',
            data: []
          },
          {
            type: 'bar',
            name: '已延期',
            stack: '0',
            data: []
          },
          {
            type: 'bar',
            stack: '0',
            name: '未进行',
            data: []
          }
        ]
      },
      originalExport: [
        {
          key: 'code',
          name: '样单号',
          ifExport: true,
          index: 0
        },
        {
          key: 'client_name',
          name: '下单客户',
          ifExport: true,
          index: 1
        },
        {
          key: 'contacts',
          name: '客户联系人',
          ifExport: true,
          index: 2
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifExport: true,
          index: 3
        },
        {
          key: 'settle_unit',
          name: '结算单位',
          ifExport: true,
          index: 4
        },
        {
          key: 'settle_exchange',
          name: '结算货币',
          ifExport: true,
          index: 5
        },
        {
          key: 'order_time',
          name: '下单时间',
          ifExport: true,
          index: 6
        },
        {
          key: 'delivery_time',
          name: '完成时间',
          ifExport: true,
          index: 7
        },
        {
          key: 'batch_title',
          name: '批次标题',
          ifExport: true,
          index: 8
        },
        {
          key: 'batch_type',
          name: '批次类型',
          ifExport: true,
          index: 9
        },
        {
          key: 'batch_desc',
          name: '批次备注',
          ifExport: true,
          index: 10
        },
        {
          key: 'product_code',
          name: '产品编号',
          ifExport: true,
          index: 11
        },
        {
          key: 'product_name',
          name: '产品名称/品类',
          ifExport: true,
          index: 12
        },
        {
          key: 'size_color_name',
          name: '尺码/颜色',
          ifExport: true,
          index: 13
        },
        {
          key: 'price',
          name: '下单单价',
          ifExport: true,
          index: 14
        },
        {
          key: 'number',
          name: '下单数量',
          ifExport: true,
          index: 15
        },
        {
          key: 'is_send',
          name: '是否寄送产前样',
          ifExport: true,
          index: 16
        },
        {
          key: 'is_confirm',
          name: '是否产前确认',
          ifExport: true,
          index: 17
        },
        {
          key: 'is_urgent',
          name: '是否加急',
          ifExport: true,
          index: 18
        },
        {
          key: 'user_name',
          name: '创建人',
          ifExport: true,
          index: 19
        },
        {
          key: 'create_time',
          name: '创建时间',
          ifExport: true,
          index: 20
        }
      ],
      originalSetting: [
        {
          key: 'system_code',
          name: '系统编号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'code',
          name: '样单号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
          index: 2
        },
        {
          key: 'contacts_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'product_code',
          otherkey: 'system_code',
          name: '样品编号',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '样品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 5,
          from: 'product_data'
        },
        {
          key: '',
          name: '流程进度',
          ifShow: true,
          ifLock: false,
          index: 6,
          specialForOrderPrcess: 'sampleOrder'
        },
        {
          key: 'status',
          name: '样单状态',
          ifShow: true,
          ifLock: false,
          index: 7,
          filterArr: ['', '已创建', '进行中', '已完成', '已结算', '已逾期', '已取消'],
          classArr: ['', 'orange', 'blue', 'green', 'green', 'red', 'gray']
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 8,
          errVal: '0'
        },
        {
          key: 'total_price',
          name: '下单总额',
          ifShow: true,
          ifLock: false,
          index: 9,
          unit: '元',
          errVal: '0'
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 11
        }
      ],
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
      },
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            this.$router.push('/sampleOrder/detail?id=' + item.id)
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            this.$router.push('/sampleOrder/update?id=' + item.id)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            this.$confirm('是否删除样单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                sampleOrder
                  .delete({
                    id: item.id
                  })
                  .then((res) => {
                    if (res.data.status) {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      })
                      // @ts-ignore
                      this.getList()
                    }
                  })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    },
    checkedCount(newVal) {
      if (newVal.length > 0) {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList(): any[] {
      return this.$store.state.api.group.arr
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
              this.contactsList = res.data.data.contacts_data
            }
          })
      } else {
        this.contacts_id = ''
      }
    },
    getLocalStorage(ev: any, type: string) {
      if (!ev) {
        this.$setLocalStorage(type, '')
      }
      this.changeRouter()
    },
    exportExcelClick() {
      if (!this.checked) return
      this.showExport = true
    },
    exportExcel(data: any) {
      this.mainLoading = true
      data.sort(function (a: any, b: any) {
        return a.index - b.index
      })
      this.exportExcelParam.show_row = []
      data.forEach((item: any) => {
        if (item.ifExport) {
          this.exportExcelParam.show_row.push(item.key)
        }
      })

      let idArr: any = []

      this.list.forEach((item) => {
        idArr.push(item.id)
      })

      this.exportExcelParam['id'] = idArr
      exportExcel.orderInfo(this.exportExcelParam).then((res: any) => {
        if (res.data.status) {
          console.log(res.data.data)
          this.mainLoading = false
          window.location.href = res.data.data
        }
      })
      console.log(this.exportExcelParam)
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.contacts_id = Number(query.contacts_id) || ''
      if (this.client_id && this.client_id.length) {
        this.getContacts(this.client_id)
      }
      this.keyword = query.keyword || ''
      this.status = query.status === 'null' ? null : query.status
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    changeRouter(ev?: any) {
      this.complete_time = ''
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/sampleOrder/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&group_id=' +
          this.group_id +
          '&status=' +
          this.status +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit +
          '&contacts_id=' +
          this.contacts_id
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.client_id = []
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.date = []
          this.contacts_id = ''
          this.status = '0'
          this.limit = 10
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    chartsData(params: any) {
      if (this.isClick) return
      this.isClick = true
      this.complete_time = params.name
      this.getList()
    },
    getList() {
      this.loading = true
      this.mainLoading1 = true
      // this.option.xAxis[0].data = this.$getEveryDayDateByBetweenDate(
      //   this.$GetDateStr(-3, 'MM-DD'),
      //   this.$GetDateStr(14, 'MM-DD'),
      //   'MM-DD'
      // )

      this.option.series[0].data = []
      this.option.series[1].data = []
      this.option.series[2].data = []
      this.option.series[3].data = []
      this.option.xAxis[0].data = []
      statistics
        .sampleOrderProgressChart({
          order_type: 2,
          keyword: this.keyword,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          is_check: this.status,
          status: this.type,
          start_time: this.date.length > 1 ? this.date[0] : this.$GetDateStr(-3),
          end_time: this.date.length > 1 ? this.date[1] : this.$GetDateStr(14),
          user_id: this.user_id,
          group_id: this.group_id
        })
        .then((res) => {
          for (let key in res.data.data) {
            let hasNumber = Object.values(res.data.data[key]).find((res: any) => {
              return res > 0
            })
            this.showCharts = !!hasNumber || this.showCharts
            this.option.series[0].data.push(res.data.data[key].completed)
            this.option.series[3].data.push(res.data.data[key].number - res.data.data[key].postpone - res.data.data[key].completed)
            if (this.option.series[0].data.length < 4) {
              this.option.series[1].data.push(0)
              this.option.series[2].data.push(res.data.data[key].postpone)
            } else {
              this.option.series[2].data.push(0)
              this.option.series[1].data.push(res.data.data[key].postpone)
            }

            if (key === new Date().getMonth() + 1 + '-' + new Date().getDate()) {
              let obj = {
                value: res.data.data[key].date + '\n今日',
                textStyle: {
                  fontSize: 16,
                  color: '#1A95FF'
                }
              }
              this.option.xAxis[0].data.push(obj)
              continue
            }
            this.option.xAxis[0].data.push(res.data.data[key].date)
          }
          this.mainLoading1 = false
        })

      sampleOrder
        .list({
          keyword: this.keyword,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: this.limit,
          complete_time: this.complete_time.slice(0, 10),
          is_check: this.status,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          group_id: this.group_id,
          order_type: 2,
          contacts_id: this.contacts_id
        })
        .then((res) => {
          if (res.data.status) {
            res.data.data.items.map((item: any) => {
              this.$set(item, 'isCheck', false)
              return item
            })
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
          this.isClick = false
        })
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 2
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
          this.exportKey = this.$clone(this.originalExport)
        })
    }
  },
  created() {
    this.getFilters()
    this.getList()
    this.getListSetting()
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
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/list.less';
</style>