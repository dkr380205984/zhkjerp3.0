<template>
  <div id="fabricWarehousing" v-loading="loading" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">系统单据管理</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialPlan')">原料计划单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialSupplement')">原料补充单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialPurchaseOrder')">原料订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialTransferOrder')">原料调取单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialProcessingOrder')">原料加工单</div>
        <div class="tab" @click="$router.push('/billingManagement/productionPlan')">生产计划单</div>
        <div class="tab" @click="$router.push('/billingManagement/inspectionReceiptDocument')">检验入库单据</div>
        <div class="tab" @click="$router.push('/billingManagement/workshopSettlementLog')">车间结算日志</div>
        <div class="tab" @click="$router.push('/billingManagement/auxiliaryMaterialPurchaseOrder')">辅料订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/packingOrder')">包装订购单</div>
        <div class="tab" @click="$router.push('/billingManagement/transportationDeliveryOrder')">运输出库单</div>
        <div class="tab" @click="$router.push('/billingManagement/deductionForm')">我方扣款单据</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab" @click="$router.push('/billingManagement/ourInvoiceList')">我方发票单据</div>
        <div class="tab" @click="$router.push('/billingManagement/oppositeInvoicing')">对方发票单据</div>
        <div class="tab" @click="$router.push('/billingManagement/collectionList')">收款单据</div>
        <div class="tab" @click="$router.push('/billingManagement/paymentDocument')">付款单据</div>
        <!-- <div class="tab" @click="$router.push('/billingManagement/orderQuotationComparison')">订单报价单对比单据</div> -->
        <div class="tab" @click="$router.push('/billingManagement/shaXianInOutList')">纱线出入库单据</div>
        <div class="tab active">面料出入库单据</div>
        <div class="tab" @click="$router.push('/billingManagement/auxiliaryInOutList')">辅料出入库单据</div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="筛选计划单号/订单号"
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
              <el-option value="0" label="待审核"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="已驳回"></el-option>
              <el-option value="3" label="状态异常"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="order_type" placeholder="筛选单据类型" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="订单" value="1"></el-option>
              <el-option label="样单" value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="group_id" placeholder="筛选负责小组" clearable>
              <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn backHoverBlue" style="color: white" @click="oneShowAll">全部展开</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col" style="flex: 0.05">
              <el-checkbox v-model="checkAllPlan" @change="checkAll"></el-checkbox>
            </div>
            <div class="col" style="flex: 1.3">单据编号</div>
            <div class="col">出入库类型</div>
            <div class="col">库存转移</div>
            <div class="col">关联订单号</div>
            <div class="col">关联单据</div>
            <div class="col">单据类型</div>
            <div class="col">审核状态</div>
            <div class="col">创建时间</div>
            <div class="col">创建人</div>
            <div class="col" style="flex: 1.4">操作</div>
          </div>
          <div v-for="(item, index) in list" :key="index">
            <div class="row">
              <div class="col" style="flex: 0.05">
                <el-checkbox v-model="item.checked" @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col" style="flex: 1.3">{{ item.code }}</div>
              <div class="col">{{ stockTypeList[item.action_type].name }}</div>
              <div class="col">
                <template v-if="item.action_type === 1">
                  <div class="changeCtn">
                    <span>{{ item.client_name }}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type === 2 || item.action_type === 4">
                  <div class="changeCtn">
                    <span>{{ item.client_name }}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type === 3 || item.action_type === 5 || item.action_type === 10">
                  <div class="changeCtn">
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                    <span class="el-icon-s-unfold orange"></span>
                    <span>{{ item.client_name }}</span>
                  </div>
                </template>
                <template
                  v-else-if="
                    item.action_type === 6 ||
                    item.action_type === 9 ||
                    item.action_type === 11 ||
                    item.action_type === 12
                  "
                >
                  <div class="changeCtn">
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type === 7">
                  <div class="changeCtn">
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                    <span class="el-icon-s-unfold orange"></span>
                    <span>{{ item.move_store }}/{{ item.move_secondary_store }}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type === 8">
                  <div class="changeCtn">
                    <span>{{ item.store }}/{{ item.secondary_store }}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{ item.move_store }}/{{ item.move_secondary_store }}</span>
                  </div>
                </template>
              </div>
              <div
                class="col hoverBlue"
                style="
                  cursor: pointer;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  width:100px
                  flex:unset;
                  display:block;
                "
                :title="item.order_code || '无编号，点击查看详情'"
                @click="
                  $router.push(
                    (item.order_type === 1 || item.order_type === null || item.order_type === undefined
                      ? '/order/detail?id='
                      : '/sampleOrder/detail?id=') + item.top_order_id
                  )
                "
              >
                <span v-if="item.order_type === 1" class="circle backOrange">订</span>
                <span v-if="item.order_type === 2" class="circle backBlue">样</span>
                {{ item.order_code || '无编号，点击查看详情' }}
              </div>
              <div class="col">
                {{ item.rel_doc_code || '无' }}
              </div>
              <div class="col">222</div>
              <div class="col">
                <div v-if="item.is_check === 0" class="orange">待审核</div>
                <div v-else-if="item.is_check === 1" class="blue">已审核</div>
                <div v-else-if="item.is_check === 2" class="red">已驳回</div>
                <div v-else class="red">状态异常</div>
              </div>
              <div class="col">{{ item.created_at }}</div>
              <div class="col">{{ item.user_name }}</div>
              <div class="col" style="flex: 1.4">
                <span class="opr hoverBlue" @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                <span class="opr hoverBlue" @click="openPrint(item)">打印</span>
                <span class="opr hoverBlue" @click="changeStatus(item)">审核</span>
              </div>
            </div>
            <div v-show="item.isShow" style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">面料名称</div>
                    <div class="tcol">面料颜色</div>
                    <div class="tcol">批/缸/色号</div>
                    <div class="tcol">数量</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow" v-for="itemSon in item.detail.info_data" :key="itemSon.id+'itemSon'">
                    <div class="tcol">
                      {{itemSon.material_name || '无'}}
                    </div>
                    <div class="tcol">
                      {{itemSon.material_color || '无'}}
                    </div>
                    <div class="tcol">
                      {{itemSon.batch_code}}/{{itemSon.vat_code}}/{{itemSon.color_code}}
                    </div>
                    <div class="tcol">
                      {{itemSon.number}}{{itemSon.unit}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <span style="line-height: 35px; margin-left: 40px"
            >合计计划生产数量：
            <span style="font-weight: bold" class="green">
              {{ (additional.total_production_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px"
            >合计计划原料数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_material_number / 1000).toFixed(2) }} 吨或千米
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            平均损耗：
            <span class="green" style="font-weight: bold"> {{ additional.pre_loss }} % </span>
          </span>
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
          <div class="btn backHoverBlue" @click="lostCheck">
            <span class="text">批量审核</span>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="buttonList" style="margin-left: 12px">
            <!-- <div class="btn backHoverBlue">
              <span class="text">导出月度报表</span>
            </div>
            <div class="btn backHoverBlue">
              <span class="text">导出季度报表</span>
            </div>
            <div class="btn backHoverBlue">
              <span class="text">导出年度报表</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <product-detail
      :id="productDetailId"
      :show="productShow"
      :noOpr="true"
      @close="productShow = false"
    ></product-detail>
    <div class="popup" v-show="checkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">原料计划单审核</span>
          <div class="closeCtn" @click="checkFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">是否通过：</div>
            <div class="info" style="line-height: 32px">
              <el-radio v-model="reviewerParams.is_check" :label="1">通过</el-radio>
              <el-radio v-model="reviewerParams.is_check" :label="2">驳回</el-radio>
            </div>
          </div>
          <div class="row" v-if="reviewerParams.is_check === 2">
            <div class="label">驳回理由：</div>
            <div class="info" style="min-height: 32px; height: auto">
              <el-input placeholder="请输入驳回理由" v-model="reviewerParams.check_desc"></el-input>
            </div>
          </div>
          <div class="row" v-else></div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息" v-model="reviewerParams.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="checkFlag = false">取消</span>
          <span class="btn backHoverBlue" @click="agreeCheck">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { exportExcel, client, materialStock, check } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { limitArr, stockType } from '@/assets/js/dictionary'
import zhExportSetting from '@/components/zhExportSetting/zhExportSetting.vue'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
import zhDropDown from '@/components/zhDropDown/zhDropDown.vue'
export default Vue.extend({
  components: { zhExportSetting, zhCharts, zhDropDown },
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      mainLoading: false,
      mainLoading1: false,
      productShow: false,
      productDetailId: '',
      additional: {},
      loading: true,
      showCharts: false,
      list: [],
      checkFlag: false,
      checkAllPlan: false,
      reviewerParams: {
        pid: '',
        check_type: 9,
        check_desc: '',
        is_check: 1, // 1通过 2没通过
        desc: ''
      },
      stockTypeList: stockType,
      limitList: limitArr,
      exportKey: [],
      keyword: '',
      contacts_id: '',
      contactsList: [],
      client_id: [],
      group_id: '',
      user_id: '',
      order_type: '',
      type: 'null',
      status: 'null',
      date: [],
      limit: 10,
      total: 1,
      page: 1,
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
    changeShow(item: any) {
      this.loading = true
      if (!item.detail.code) {
        materialStock
          .detail({
            id: item.id
          })
          .then((ress) => {
            if (ress.status) {
              item.detail = ress.data.data
              item.isShow = true
            }
            this.loading = false
          })
      } else {
        item.isShow = !item.isShow
        this.loading = false
      }

      this.$forceUpdate()
    },
    oneShowAll() {
      this.list.forEach((item: any) => {
        item.isShow = false
        this.changeShow(item)
      })
    },
    checkAll(res: Boolean) {
      this.list.forEach((item: any) => {
        item.checked = res
      })
      this.$forceUpdate()
    },
    agreeCheck(item: any) {
      if (this.reviewerParams.is_check === 1) {
        this.reviewerParams.check_desc = ''
      }
      check.create(this.reviewerParams).then((res) => {
        if (res.data.status) {
          this.$message.success('审核成功')
          this.checkFlag = false
          this.checkAllPlan = false
          this.getList()
        }
      })
    },
    lostCheck() {
      let idArrs = this.list.filter(function (value: any) {
        if (value.checked) return value.id
      })

      if (idArrs.length === 0) {
        this.$message.error('至少选择一条数据')
        return
      }

      this.reviewerParams.pid = idArrs.map(function (value: any) {
        if (value.checked) return value.id
      })

      this.checkFlag = true
    },
    getLocalStorage(ev: any, type: string) {
      if (!ev) {
        this.$setLocalStorage(type, '')
      }
      this.changeRouter()
    },
    openPrint(items: any) {
      materialStock
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
      this.checkFlag = true
      this.reviewerParams.pid = row.id
    },
    showProduct(item: any) {
      this.productShow = true
      this.productDetailId = item.product_id
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
      this.order_type = query.order_type || ''
      this.status = query.status || 'null'
      this.type = Number(query.type) || 'null'
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
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
          '&order_type=' +
          this.order_type +
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
          this.order_type = ''
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
      let _this = this
      materialStock
        .list({
          material_type: 2,
          limit: this.limit,
          page: this.page
        })
        .then((res) => {
          if (res.data.status) {
            this.total = res.data.data.total
            res.data.data.items.forEach((item: any) => {
              item.detail = {}
            })
            this.list = res.data.data.items
            this.additional = res.data.data.additional
          }
          this.loading = false
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
@import '~@/assets/css/billingManagement/fabricWarehousing.less';
</style>    