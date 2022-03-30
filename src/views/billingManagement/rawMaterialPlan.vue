<template>
  <div id="rawMaterialPlan" v-loading="mainLoading1" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">系统单据管理</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab active">原料计划单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialSupplement')">原料补充单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialPurchaseOrder')">原料订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialTransferOrder')">原料调取单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialProcessingOrder')">原料加工单</div>
        <div class="tab" @click="$router.push('/billingManagement/productionPlan')">生产计划单</div>
        <div class="tab" @click="$router.push('/billingManagement/workshopSettlementLog')">车间结算日志</div>
        <div class="tab" @click="$router.push('/billingManagement/auxiliaryMaterialPurchaseOrder')">辅料订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/packingOrder')">包装订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/transportationDeliveryOrder')">运输出库单</div>
        <div class="tab" @click="$router.push('/billingManagement/deductionForm')">扣款单</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="筛选报价/产品/样品编号"
              @keydown.enter.native="changeRouter"
            ></el-input>
          </div>
          <div class="elCtn">
            <el-select
              @change="(ev) => getLocalStorage(ev, 'create_user')"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable
            >
              <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
            <el-select @change="changeRouter" v-model="status" placeholder="筛选审核状态">
              <el-option value="null" label="全部"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="待审核"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="list">
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            :row-key="rowKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="30" :reserve-selection="true"></el-table-column>
            <el-table-column label="计划单号" width="140">
              <template slot-scope="scope">
                <div>{{ scope.row.code }}</div>
              </template>
            </el-table-column>
            <el-table-column label="关联订单号" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.order_code }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="total_production_number" label="合计计划生产数量" width="90"></el-table-column>
            <el-table-column prop="total_plan_number" label="合计计划原料数量" width="90"></el-table-column>
            <el-table-column label="平均损耗" width="100">
              <template slot-scope="scope"> {{ +(+scope.row.pre_loss).toFixed(2) }}% </template>
            </el-table-column>
            <el-table-column label="采购状态">
              <template slot-scope="scope">
                <div
                  class="green"
                  v-if="scope.row.material_order_progress > 0 && scope.row.material_order_progress < 100"
                >
                  采购中
                </div>
                <div class="orange" v-if="scope.row.material_order_progress === 0">未进行</div>
                <div class="blue" v-if="scope.row.material_order_progress >= 100">已完成</div>
              </template>
            </el-table-column>
            <el-table-column label="审核状态">
              <template slot-scope="scope">
                <div :class="scope.row.status === 1 ? 'blue' : scope.row.status === 2 ? 'orange' : 'red'">
                  {{ scope.row.status === 1 ? '在职' : scope.row.status === 2 ? '离职' : '状态有误' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="user_name" label="创建人"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>materialManage
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <span class="opr hoverBlue" @click="$router.push('/materialManage/detail?id=' + scope.row.id)"
                  >详情</span
                >
                <span class="opr hoverBlue" @click="openPrint(scope.row)">打印</span>
                <span class="opr hoverBlue" @click="changeStatus(scope.row)">审核</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="fl blue green" style="line-height: 56px; margin-left: 24px">
          <div class="btn backHoverBlue">
            <span class="text">批量审核</span>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="buttonList" style="margin-left: 12px">
            <div class="btn backHoverBlue">
              <span class="text">导出月度报表</span>
            </div>
            <div class="btn backHoverBlue" @click="$router.push('/quotedPrice/update?id=' + quotedList[quotedIndex])">
              <span class="text">导出季度报表</span>
            </div>
            <div class="btn backHoverBlue" @click="checkFlag = true">
              <span class="text">导出年度报表</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, listSetting, exportExcel, client, statistics, materialPlan } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { ListSetting } from '@/types/list'
import { limitArr } from '@/assets/js/dictionary'
import zhExportSetting from '@/components/zhExportSetting/zhExportSetting.vue'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
import zhDropDown from '@/components/zhDropDown/zhDropDown.vue'
export default Vue.extend({
  components: { zhExportSetting, zhCharts, zhDropDown },
  data(): {
    originalSetting: ListSetting[]
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      mainLoading: false,
      mainLoading1: false,
      loading: true,
      showCharts: false,
      list: [],
      limitList: limitArr,
      showExport: false,
      checkedCount: [],
      exportKey: [],
      keyword: '',
      contacts_id: '',
      contactsList: [],
      client_id: [],
      checked: false,
      exportExcelParam: {
        show_row: [],
        start_time: '',
        end_time: ''
      },
      option: {
        color: ['#229CFB', '#2DD59A', '#FCCA24', '#000000'],
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
            let number = 0
            params.forEach((param: any) => {
              if (param.data && param.seriesName !== '订单数') {
                number += param.data
              }
            })
            htmlStr += `发货数量：${number}<br/>`
            params.forEach((param: any) => {
              if (param.data) {
                htmlStr +=
                  param.marker +
                  `<span style="margin-left:10px">${param.seriesName}</span><span style="margin-left:10px">${param.data}</span></br>`
              }
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
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            show: false
          },
          {
            type: 'value',
            name: '订单数',
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
            type: 'line',
            yAxisIndex: 1,
            name: '订单数',
            data: []
          }
        ]
      },
      group_id: '',
      user_id: '',
      type: 'null',
      status: 'null',
      date: [],
      limit: 10,
      total: 1,
      page: 1,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      originalExport: [
        {
          key: 'code',
          name: '订单号',
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
          ifCaogao: 'is_draft',
          caogaoArr: ['稿', '整'],
          index: 0
        },
        {
          key: 'code',
          name: '订单号',
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
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
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
          specialForOrderPrcess: 'order'
        },
        {
          key: 'status',
          name: '订单状态',
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
            if (item.is_draft === 1) {
              this.$router.push('/order/update?id=' + item.id)
            } else {
              this.$router.push('/order/detail?id=' + item.id)
            }
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            this.$router.push('/order/update?id=' + item.id)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            this.$confirm('是否删除订单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                order
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
    openPrint(items: any) {
      materialPlan
        .detail({
          id: items.id
        })
        .then((res) => {
          let idArr: any = []
          res.data.data.material_plan_data.forEach((item: any) => {
            idArr.push(item.id)
          })
          this.$openUrl('/materialPlan/print?id=' + items.id + '&proId=' + JSON.stringify(idArr))
        })
    },
    changeStatus(row: any) {
      console.log(row)
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
      this.status = query.status || 'null'
      this.type = Number(query.type) || 'null'
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
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
      setTimeout(() => {
        this.mainLoading = false
      }, 10000)
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/billingManagement/rawMaterialPlan?page=' +
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
          '&type=' +
          this.type +
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
          this.type = 'null'
          this.status = 'null'
          this.contacts_id = ''
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
    getList() {
      materialPlan
        .list({
          is_check: this.status,
          code: this.keyword,
          user_id: this.user_id,
          start_time: this.date[0],
          end_time: this.date[1],
          limit: this.limit,
          page: this.page
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 3
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
          this.exportKey = this.$clone(this.originalExport)
        })
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
    groupList() {
      return this.$store.state.api.group.arr
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

<style lang="less">
@import '~@/assets/css/billingManagement/rawMaterialPlan.less';
</style>    