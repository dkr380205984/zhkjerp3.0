<template>
  <div id="rawMaterialPurchaseOrder" v-loading="loading" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">系统单据管理</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialPlan')">原料计划单</div>
        <div class="tab" @click="$router.push('/billingManagement/rawMaterialSupplement')">原料补充单</div>
        <div class="tab active">原料订购单</div>
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
        <div class="tab" @click="$router.push('/billingManagement/fabricWarehousing')">面料出入库单据</div>
        <div class="tab" @click="$router.push('/billingManagement/auxiliaryInOutList')">辅料出入库单据</div>
        <div class="tab" @click="$router.push('/billingManagement/productStoreLogList')">产品出入库单据</div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="筛选订购单号/订单号"
              @keydown.enter.native="changeRouter"
              @clear="changeRouter"
              clearable
            ></el-input>
          </div>
          <div class="elCtn">
            <el-input
              v-model="material_name"
              placeholder="筛选原料名称"
              @keydown.enter.native="changeRouter"
              @clear="changeRouter"
              clearable
            ></el-input>
          </div>
          <div class="elCtn">
            <el-cascader
              @change="
                getContacts($event)
                changeRouter()
              "
              placeholder="筛选订购公司"
              v-model="client_id"
              filterable
              :options="clientList"
              clearable
            >
            </el-cascader>
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
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
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
            <el-select @change="changeRouter" v-model="status" placeholder="筛选审核状态">
              <el-option value="null" label="全部"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="待审核"></el-option>
              <el-option value="3" label="状态异常"></el-option>
            </el-select>
          </div>
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
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="orderTypes" placeholder="筛选订购类型" clearable>
              <el-option value="" label="全部"></el-option>
              <el-option value="plan" label="计划订购"></el-option>
              <el-option value="sup" label="补纱订购"></el-option>
              <el-option value="reserve" label="预订购"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn backHoverBlue" style="color: white" @click="oneShowAll">全部展开</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col" style="flex: 0.05">
              <el-checkbox v-model="checkAllPlan" @change="checkAll"></el-checkbox>
            </div>
            <div class="col" style="flex: 1.2">订购单号</div>
            <div class="col">关联订单号</div>
            <div class="col">订购类型</div>
            <div class="col">订购单位</div>
            <div class="col">合计订购数量</div>
            <div class="col">合计订购金额</div>
            <div class="col">合计入库数量</div>
            <div class="col">合计入库金额</div>
            <div class="col">审核状态</div>
            <div class="col" style="flex: 0.7">创建人</div>
            <div class="col">创建时间</div>
            <div class="col" style="flex: 2">操作</div>
          </div>
          <div v-for="(item, index) in list" :key="index">
            <div class="row">
              <div class="col" style="flex: 0.05">
                <el-checkbox v-model="item.checked" @change="$forceUpdate()"></el-checkbox>
              </div>
              <div
                v-if="item.plan_id"
                class="col hoverBlue"
                style="flex: 1.2; cursor: pointer"
                @click="$router.push('/materialManage/detail?id=' + item.plan_id)"
              >
                {{ item.code }}
              </div>
              <div
                v-if="item.reserve_id"
                class="col hoverBlue"
                style="flex: 1.2; cursor: pointer"
                @click="$router.push('/materialPlanOrder/detail?id=' + item.reserve_id)"
              >
                {{ item.code }}
              </div>
              <div
                v-if="item.sup_id"
                class="col hoverBlue"
                style="flex: 1.2; cursor: pointer"
                @click="$router.push('/materialManage/detail?id=' + item.sup_id)"
              >
                {{ item.code }}
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
                <div v-if="item.plan_id">计划订购</div>
                <div v-if="item.reserve_id">预订购</div>
                <div v-if="item.sup_id">补纱订购</div>
              </div>
              <div class="col">{{ item.client_name }}</div>
              <div class="col">{{ $toFixed(item.total_number, 3, true) }}</div>
              <div class="col">{{ $toFixed(item.total_price, 3, true) }}</div>
              <div class="col" :style="item.total_push_number > item.total_number ? 'color:red' : ''">
                {{ $toFixed(item.total_push_number, 3, true) }}
              </div>
              <div class="col">{{ $toFixed(item.total_push_price, 3, true) }}</div>
              <div class="col">
                <div v-if="item.is_check === 0" class="orange">未审核</div>
                <div v-else-if="item.is_check === 1" class="blue">已通过</div>
                <div v-else-if="item.is_check === 2" class="red">已驳回</div>
                <div v-else class="red">状态异常</div>
              </div>
              <div class="col" style="flex: 0.7">{{ item.user_name }}</div>
              <div class="col">{{ item.created_at }}</div>
              <div class="col" style="flex: 2">
                <span class="opr hoverBlue" @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                <span class="opr hoverBlue" @click="openPrint(item)">打印</span>
                <span class="opr hoverBlue" @click="changeStatus(item)">审核</span>
              </div>
            </div>
            <div v-show="item.isShow" style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
              <div class="tableCtn" style="padding-top: 0">
                <div class="row">
                  <div class="col">
                    <div class="label">关联计划单：</div>
                    <div
                      :class="item.detail.plan_code ? 'hoverBlue text' : 'text'"
                      :style="item.detail.plan_code ? { cursor: 'pointer' } : {}"
                      @click="
                        item.detail.plan_code ? $router.push('/materialManage/detail?id=' + item.detail.plan_id) : ''
                      "
                    >
                      {{ item.detail.plan_code || '无' }}
                    </div>
                  </div>
                  <div class="col">
                    <div class="label">额外费用：</div>
                    <div class="text">
                      <others-fee-data :data="item.others_fee_data"></others-fee-data>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label">备注信息：</div>
                    <div>
                      {{ item.detail.desc || '无' }}
                    </div>
                  </div>
                </div>
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">原料名称</div>
                    <div class="tcol">订购颜色</div>
                    <div class="tcol">{{ $route.query.supFlag ? '补纱单' : '计划单' }}颜色</div>
                    <div class="tcol">订购属性</div>
                    <div class="tcol">订购数量</div>
                    <div class="tcol">入库数量</div>
                    <div class="tcol">订购单价</div>
                    <div class="tcol">结算单价</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow" v-for="(itemChild, indexChild) in item.detail.info_data" :key="indexChild">
                    <div class="tcol">{{ itemChild.material_name }}</div>
                    <div class="tcol">{{ itemChild.material_color }}</div>
                    <div class="tcol">{{ $route.query.supFlag ? itemChild.sup_color : itemChild.plan_color }}</div>
                    <div class="tcol">{{ itemChild.attribute }}</div>
                    <div class="tcol">{{ $toFixed(itemChild.number, 3, true) }}{{ itemChild.unit }}</div>
                    <div class="tcol">{{ $toFixed(itemChild.final_push_number, 3, true) }}</div>
                    <div class="tcol">{{ itemChild.price }}元</div>
                    <div class="tcol">
                      {{ itemChild.settle_price ? $toFixed(itemChild.settle_price, 3, true) + '元' : '未填写' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <span style="line-height: 35px; margin-left: 40px">
            合计订购数量：
            <span class="green" style="font-weight: bold">
              {{ $toFixed(additional.total_order_number / 1000, 3, true) }} 吨或千米
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计订购金额：
            <span class="green" style="font-weight: bold">
              {{ $toFixed(additional.total_order_price / 10000, 3, true) }} 万元
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计入库数量：
            <span class="green" style="font-weight: bold">
              {{ $toFixed(additional.total_push_number / 1000, 3, true) }} 吨或千米
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计入库金额：
            <span class="green" style="font-weight: bold">
              {{ $toFixed(additional.total_push_price / 10000, 3, true) }} 万元
            </span>
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
            <div class="btn backHoverBlue" @click="showExportPopup = true">
              <span class="text" style="margin-left: 0">导出报表</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="checkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">原料订购单审核</span>
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
    <div class="popup" v-show="showExportPopup">
      <div class="main">
        <div class="titleCtn">
          <span class="text"
            >请选择需要导出的时间段<el-tooltip class="item" effect="dark" content="均为创建时间" placement="top">
              <i class="el-icon-info"></i> </el-tooltip
          ></span>
          <div class="closeCtn" @click="showExportPopup = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">年份：</div>
            <div class="info" style="line-height: 32px">
              <el-date-picker v-model="exportYear" type="year" placeholder="选择年"> </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">季度：</div>
            <div class="info" style="min-height: 32px; height: auto">
              <el-select v-model="exportJiDu" placeholder="请选择" @change="changeJiDu">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="第一季度" :value="1"></el-option>
                <el-option label="第二季度" :value="2"></el-option>
                <el-option label="第三季度" :value="3"></el-option>
                <el-option label="第四季度" :value="4"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row" v-if="exportJiDu != ''">
            <div class="label">月份：</div>
            <div class="info">
              <el-select v-model="exportMonth" placeholder="请选择">
                <el-option
                  v-for="item in monthList"
                  :key="item.label + item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">单位：</div>
            <div class="info">
              <el-cascader placeholder="筛选单位 " v-model="exportClient" filterable :options="clientList" clearable>
              </el-cascader>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="showExportPopup = false">取消</span>
          <span class="btn backHoverBlue" @click="exportExcel">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, listSetting, client, materialOrder, check } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { ListSetting } from '@/types/list'
import { limitArr } from '@/assets/js/dictionary'
import zhExportSetting from '@/components/zhExportSetting/zhExportSetting.vue'
import othersFeeData from '@/components/othersFeeData/othersFeeData.vue'
import zhDropDown from '@/components/zhDropDown/zhDropDown.vue'
export default Vue.extend({
  components: { zhExportSetting, zhDropDown, othersFeeData },
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
      exportClient: [],
      checkFlag: false,
      showExportPopup: false,
      checkAllPlan: false,
      reviewerParams: {
        pid: '',
        check_type: 2,
        check_desc: '',
        is_check: 1, // 1通过 2没通过
        desc: ''
      },
      list: [],
      limitList: limitArr,
      showExport: false,
      checkedCount: [],
      exportKey: [],
      keyword: '',
      contacts_id: '',
      contactsList: [],
      exportYear: new Date(),
      exportJiDu: '',
      exportMonth: '',
      monthList: [],
      client_id: [],
      single_client_id: '', // 别的页面跳转进来的筛选
      checked: false,
      additional: {},
      group_id: '',
      ordertypes: '',
      material_name: '',
      user_id: '',
      order_type: '',
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
    getContacts(ev: any) {
      if (ev) {
        this.single_client_id = ''
        client
          .detail({
            id: ev
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
      this.$openUrl('/materialManage/orderPrint?id=' + items.id)
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
    changeStatus(row: any) {
      this.checkFlag = true
      this.reviewerParams.pid = row.id
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
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.order_type = query.order_type || ''
      this.status = query.status || 'null'
      this.material_name = query.material_name || ''
      this.orderTypes = query.orderTypes || ''
      this.type = Number(query.type) || 'null'
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.single_client_id = query.single_client_id ? query.single_client_id : ''
      this.limit = Number(query.limit) || 10
    },
    changeJiDu(e: any) {
      this.exportMonth = ''
      if (e != '') {
        this.monthList = this.$forJiDuGetMonth(e, true)
      } else {
        this.monthList = []
      }
    },
    exportExcel() {
      this.mainLoading = true

      let start_time = ''
      let end_time = ''

      if (this.exportJiDu !== '') {
        if (this.exportMonth !== '') {
          start_time = new Date(this.exportYear.getFullYear(), this.exportMonth - 1, 1)
            .toLocaleDateString()
            .replaceAll('/', '-')
          end_time = new Date(this.exportYear.getFullYear(), this.exportMonth, 0)
            .toLocaleDateString()
            .replaceAll('/', '-')
        } else {
          start_time = new Date(this.exportYear.getFullYear(), (this.exportJiDu - 1) * 3, 1)
            .toLocaleDateString()
            .replaceAll('/', '-')
          end_time = new Date(this.exportYear.getFullYear(), this.exportJiDu * 3, 0)
            .toLocaleDateString()
            .replaceAll('/', '-')
        }
      } else {
        start_time = this.exportYear.getFullYear() + '-01-01'
        end_time = this.exportYear.getFullYear() + '-12-31'
      }

      materialOrder
        .list({
          client_id: this.exportClient.length > 0 ? this.exportClient[2] : this.$route.query.single_client_id || '',
          start_time: start_time,
          end_time: end_time,
          export_excel: 1,
          material_type: 1
        })
        .then((res) => {
          window.location.href = res.data.data
          this.mainLoading = false
          this.showExportPopup = false
        })
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/billingManagement/rawMaterialPurchaseOrder?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&material_name=' +
          encodeURIComponent(this.material_name) +
          '&group_id=' +
          this.group_id +
          '&order_type=' +
          this.order_type +
          '&status=' +
          this.status +
          '&orderTypes=' +
          this.orderTypes +
          '&type=' +
          this.type +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit +
          '&contacts_id=' +
          this.contacts_id +
          '&single_client_id=' +
          this.single_client_id
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.client_id = ''
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.material_name = ''
          this.order_type = ''
          this.date = []
          this.type = 'null'
          this.status = 'null'
          this.orderTypes = 'null'
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
      let obj: any = {
        is_check: this.status,
        code: this.keyword,
        material_type: 1,
        order_type: this.order_type,
        user_id: this.user_id,
        material_name: this.material_name,
        group_id: this.group_id,
        client_id: this.client_id.length > 0 ? this.client_id[2] : this.$route.query.single_client_id || '',
        start_time: this.date[0],
        end_time: this.date[1],
        limit: this.limit,
        page: this.page
      }

      if (this.orderTypes) {
        obj[this.orderTypes] = 1
      }

      materialOrder
        // @ts-ignore
        .list(obj)
        .then((res) => {
          if (res.data.status) {
            res.data.data.items.forEach((item: any) => {
              item.detail = {
                process_info: []
              }
            })
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.additional = res.data.data.additional
          }
          this.loading = false
        })
    },
    changeShow(item: any) {
      this.loading = true
      if (!item.detail.code) {
        materialOrder
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
      this.list.forEach((item: any, index: number) => {
        item.isShow = false
        this.changeShow(item)
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
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    clientList() {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) => item.label === '纱线原料单位' || item.label === '面料原料单位'
      )
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
@import '~@/assets/css/billingManagement/rawMaterialPurchaseOrder.less';
</style>    