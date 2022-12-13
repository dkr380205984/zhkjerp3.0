<template>
  <div id="rawMaterialTransferOrder"
    v-loading="loading"
    class="bodyContainer">
    <div class="module"
      v-loading="mainLoading"
      element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">系统单据管理</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab"
          @click="$router.push('/billingManagement/rawMaterialPlan')">原料计划单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/rawMaterialSupplement')">原料补充单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/rawMaterialPurchaseOrder')">原料订购单</div>
        <div class="tab active">原料调取单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/rawMaterialProcessingOrder')">原料加工单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/productionPlan')">生产计划单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/inspectionReceiptDocument')">检验入库单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/workshopSettlementLog')">车间结算日志</div>
        <div class="tab"
          @click="$router.push('/billingManagement/auxiliaryMaterialPurchaseOrder')">辅料订购单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/packingOrder')">包装订购单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/transportationDeliveryOrder')">运输出库单</div>
        <div class="tab"
          @click="$router.push('/billingManagement/deductionForm')">我方扣款单据</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 15px 35px 0">
        <div class="tab"
          @click="$router.push('/billingManagement/ourInvoiceList')">我方发票单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/oppositeInvoicing')">对方发票单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/collectionList')">收款单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/paymentDocument')">付款单据</div>
        <!-- <div class="tab" @click="$router.push('/billingManagement/orderQuotationComparison')">订单报价单对比单据</div> -->
        <div class="tab"
          @click="$router.push('/billingManagement/shaXianInOutList')">纱线出入库单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/fabricWarehousing')">面料出入库单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/auxiliaryInOutList')">辅料出入库单据</div>
        <div class="tab"
          @click="$router.push('/billingManagement/productStoreLogList')">产品出入库单据</div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
        <div style="width: 100px"></div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="筛选调取单号/订单号"
              @keydown.enter.native="changeRouter"
              @clear="changeRouter"
              clearable></el-input>
          </div>
          <div class="elCtn">
            <el-cascader placeholder="筛选原料名称"
              v-model="material_name"
              :options="yarnTypeList"
              clearable
              filterable
              @change="changeRouter"></el-cascader>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="store_id"
              placeholder="筛选仓库"
              clearable>
              <el-option v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changeRouter"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="(ev) => getLocalStorage(ev, 'create_user')"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="status"
              placeholder="筛选审核状态">
              <el-option value="null"
                label="全部"></el-option>
              <el-option value="1"
                label="已审核"></el-option>
              <el-option value="2"
                label="待审核"></el-option>
              <el-option value="3"
                label="状态异常"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="order_type"
              placeholder="筛选单据类型"
              clearable>
              <el-option label="全部"
                value=""></el-option>
              <el-option label="订单"
                value="1"></el-option>
              <el-option label="样单"
                value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="group_id"
              placeholder="筛选负责小组"
              clearable>
              <el-option v-for="item in groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn backHoverBlue"
            style="color: white;padding: 1px 8px"
            @click="oneShowAll">全部展开</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col"
              style="flex: 0.05">
              <el-checkbox v-model="checkAllPlan"
                @change="checkAll"></el-checkbox>
            </div>
            <div class="col"
              style="flex: 1.2">调取单号</div>
            <div class="col">关联订单号</div>
            <div class="col">调取仓库</div>
            <div class="col">合计调取数量</div>
            <div class="col">合计调取金额</div>
            <div class="col">合计入库数量</div>
            <div class="col">合计入库金额</div>
            <div class="col">审核状态</div>
            <div class="col">创建人</div>
            <div class="col">创建时间</div>
            <div class="col"
              style="flex: 0.94">操作</div>
          </div>
          <div v-for="(item, index) in list"
            :key="index">
            <div class="row">
              <div class="col"
                style="flex: 0.05">
                <el-checkbox v-model="item.checked"
                  @change="$forceUpdate()"></el-checkbox>
              </div>
              <div class="col hoverBlue"
                style="flex: 1.2; cursor: pointer"
                @click="$router.push('/materialManage/detail?id=' + item.rel_doc_id)">
                {{ item.code }}
              </div>
              <div class="col hoverBlue"
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
                ">
                <span v-if="item.order_type === 1"
                  class="circle backOrange">订</span>
                <span v-if="item.order_type === 2"
                  class="circle backBlue">样</span>
                {{ item.order_code || '无编号，点击查看详情' }}
              </div>
              <div class="col">{{ item.store }}</div>
              <div class="col">{{ $toFixed(item.total_number, 3, true) }}</div>
              <div class="col">{{ $toFixed(item.total_price, 3, true) }}</div>
              <div class="col"
                :style="item.total_push_number > item.total_number ? 'color:red' : ''">
                {{ $toFixed(item.total_push_number, 3, true) }}
              </div>
              <div class="col">{{ $toFixed(item.total_push_price, 3, true) }}</div>
              <div class="col">
                <div v-if="item.is_check === 0"
                  class="orange">未审核</div>
                <div v-else-if="item.is_check === 1"
                  class="blue">已通过</div>
                <div v-else-if="item.is_check === 2"
                  class="red">已驳回</div>
                <div v-else
                  class="red">状态异常</div>
              </div>
              <div class="col">{{ item.user_name }}</div>
              <div class="col">{{ item.created_at }}</div>
              <div class="col"
                style="flex: 0.94">
                <span class="opr hoverBlue"
                  @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                <span class="opr hoverBlue"
                  @click="changeStatus(item)">审核</span>
              </div>
            </div>
            <div v-show="item.isShow"
              style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">原料名称</div>
                    <div class="tcol">调取颜色</div>
                    <div class="tcol">调取属性</div>
                    <div class="tcol">批号/缸号/色号</div>
                    <div class="tcol">调取数量</div>
                    <div class="tcol">入库数量</div>
                    <div class="tcol">调取单价</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemChild, indexChild) in item.detail.info_data"
                    :key="indexChild">
                    <div class="tcol">{{ itemChild.material_name }}</div>
                    <div class="tcol">{{ itemChild.material_color }}</div>
                    <div class="tcol">{{ itemChild.attribute }}</div>
                    <div class="tcol">
                      {{ itemChild.batch_code }}/{{ itemChild.vat_code }}/{{ itemChild.color_code }}
                    </div>
                    <div class="tcol">{{ $toFixed(itemChild.number, 3, true) }}{{ itemChild.unit }}</div>
                    <div class="tcol">{{ $toFixed(itemChild.final_push_number, 3, true) }}</div>
                    <div class="tcol">{{ itemChild.price || 0 }}元</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <span style="line-height: 35px; margin-left: 40px">
            合计调取数量：
            <span class="green"
              style="font-weight: bold">
              {{ $toFixed(additional.total_number / 1000, 3, true) }} 吨或千米
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计调取金额：
            <span class="green"
              style="font-weight: bold">
              {{ $toFixed(additional.total_price / 10000, 3, true) }} 万元
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计入库数量：
            <span class="green"
              style="font-weight: bold">
              {{ $toFixed(additional.total_push_number / 1000, 3, true) }} 吨或千米
            </span>
          </span>
          <span style="line-height: 35px; margin-left: 40px">
            合计入库金额：
            <span class="green"
              style="font-weight: bold">
              {{ $toFixed(additional.total_push_price / 10000, 3, true) }} 万元
            </span>
          </span>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="fl"
          style="line-height: 56px; margin-left: 24px">
          <div class="btn backHoverOrange"
            @click="getMatStsList">
            <span class="text">修改调取单价</span>
          </div>
        </div>
        <div class="fl"
          style="line-height: 56px; margin-left: 24px">
          <div class="btn backHoverBlue"
            @click="lostCheck">
            <span class="text">批量审核</span>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left: 12px">
            <div class="btn backHoverBlue"
              @click="showExportPopup = true">
              <span class="text"
                style="margin-left: 0">导出报表</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="checkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">原料调取单审核</span>
          <div class="closeCtn"
            @click="checkFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">是否通过：</div>
            <div class="info"
              style="line-height: 32px">
              <el-radio v-model="reviewerParams.is_check"
                :label="1">通过</el-radio>
              <el-radio v-model="reviewerParams.is_check"
                :label="2">驳回</el-radio>
            </div>
          </div>
          <div class="row"
            v-if="reviewerParams.is_check === 2">
            <div class="label">驳回理由：</div>
            <div class="info"
              style="min-height: 32px; height: auto">
              <el-input placeholder="请输入驳回理由"
                v-model="reviewerParams.check_desc"></el-input>
            </div>
          </div>
          <div class="row"
            v-else></div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息"
                v-model="reviewerParams.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="checkFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="agreeCheck">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showExportPopup">
      <div class="main">
        <div class="titleCtn">
          <span class="text">请选择需要导出的时间段<el-tooltip class="item"
              effect="dark"
              content="均为创建时间"
              placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip></span>
          <div class="closeCtn"
            @click="showExportPopup = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">年份：</div>
            <div class="info"
              style="line-height: 32px">
              <el-date-picker v-model="exportYear"
                type="year"
                placeholder="选择年"> </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">季度：</div>
            <div class="info"
              style="min-height: 32px; height: auto">
              <el-select v-model="exportJiDu"
                placeholder="请选择"
                @change="changeJiDu">
                <el-option label="全部"
                  :value="''"></el-option>
                <el-option label="第一季度"
                  :value="1"></el-option>
                <el-option label="第二季度"
                  :value="2"></el-option>
                <el-option label="第三季度"
                  :value="3"></el-option>
                <el-option label="第四季度"
                  :value="4"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row"
            v-if="exportJiDu != ''">
            <div class="label">月份：</div>
            <div class="info">
              <el-select v-model="exportMonth"
                placeholder="请选择">
                <el-option v-for="item in monthList"
                  :key="item.label + item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="showExportPopup = false">取消</span>
          <span class="btn backHoverBlue"
            @click="exportExcel">确认</span>
        </div>
      </div>
    </div>
    <!-- 批量修改调取单价功能 -->
    <div class="popup"
      id="updatePrice"
      v-show="updatePriceFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">批量修改调取单价</span>
          <div class="closeCtn"
            @click="updatePriceFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn">
            <p>1.必须筛选日期跨度尽量不要超过一年</p>
            <p>2.点击提交后只会更新重新填写的调取单价</p>
          </div>
          <div class="listCtn">
            <div class="filterCtn">
              <div class="elCtn">
                <el-autocomplete v-model="updatePriceInfo.material_name"
                  :fetch-suggestions="searchMaterialNew"
                  placeholder="物料名称搜索"
                  @keydown.native.enter="getMatShowList"
                  @select="getMatShowList"
                  @clear="getMatShowList"
                  clearable></el-autocomplete>
              </div>
              <div class="elCtn">
                <el-autocomplete :fetch-suggestions="searchAttribute"
                  v-model="updatePriceInfo.attribute"
                  placeholder="物料属性"
                  @keydown.native.enter="getMatShowList"
                  @change="getMatShowList"
                  clearable></el-autocomplete>
              </div>
              <div class="elCtn">
                <el-select v-model="updatePriceInfo.material_color"
                  placeholder="请选择种类"
                  clearable
                  @keydown.native.enter="getMatShowList"
                  @change="getMatShowList">
                  <el-option label="色纱"
                    value="色纱"></el-option>
                  <el-option label="白胚"
                    value="白胚"></el-option>
                </el-select>
              </div>
              <div class="elCtn"
                style="width: 250px">
                <el-date-picker v-model="updatePriceInfo.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  @change="getMatStsList">
                </el-date-picker>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">日期</div>
                  <div class="tcol noPad"
                    style="flex: 9">
                    <div class="trow">
                      <div class="tcol">原料名称</div>
                      <div class="tcol">颜色</div>
                      <div class="tcol">属性</div>
                      <div class="tcol">调取单价</div>
                      <div class="tcol">调取总数</div>
                      <div class="tcol">已结算单价</div>
                      <div class="tcol">修改结算单价</div>
                      <div class="tcol"
                        v-if="$route.query.type === '纱线原料单位' || $route.query.type === '面料原料单位'">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="tbody">
                <div class="trow"
                  v-if="this.updatePriceOriginList.length === 0">
                  <div class="tcol red"
                    style="text-align: center">请筛选日期后搜索纱线数据</div>
                </div>
                <div class="trow"
                  v-for="(item, index) in updatePriceShowList"
                  :key="index">
                  <div class="tcol">{{ item.created_at }}</div>
                  <div class="tcol noPad"
                    style="flex: 9">
                    <div class="trow"
                      v-for="(itemChild, indexChild) in item.realChildren"
                      :key="indexChild">
                      <div class="tcol">{{ itemChild.material_name }}</div>
                      <div class="tcol">{{ itemChild.material_color }}</div>
                      <div class="tcol">{{ itemChild.attribute }}</div>
                      <div class="tcol blue">{{ itemChild.price }}元/kg</div>
                      <div class="tcol">{{ itemChild.number }}kg</div>
                      <div class="tcol"
                        :class="{ blue: itemChild.settle_price, gray: !itemChild.settle_price }">
                        {{ itemChild.settle_price === 0 ? '未填写' : itemChild.settle_price + '元' }}
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input placeholder="单价"
                            v-model="itemChild.new_settle_price"></el-input>
                        </div>
                      </div>
                      <div class="tcol"
                        v-if="$route.query.type === '纱线原料单位' || $route.query.type === '面料原料单位'">
                        <span class="btn backHoverBlue"
                          style="padding: 0 8px;"
                          @click="updatePriceFlag = false
                        searchAboutList(item.created_at,itemChild.material_name)">查询关联单据</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updatePriceFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveUpdatePrice">提交更新</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, listSetting, client, check, store, materialStock } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { ListSetting } from '@/types/list'
import { limitArr } from '@/assets/js/dictionary'
import zhExportSetting from '@/components/zhExportSetting/zhExportSetting.vue'
import othersFeeData from '@/components/zhExportSetting/zhExportSetting.vue'
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
      checkFlag: false,
      checkAllPlan: false,
      showExportPopup: false,
      exportYear: new Date(),
      exportJiDu: '',
      exportMonth: '',
      material_name: [],
      monthList: [],
      additional: {},
      reviewerParams: {
        pid: '',
        check_type: 6,
        check_desc: '',
        is_check: 1, // 1通过 2没通过
        desc: ''
      },
      updatePriceFlag: false,
      updatePriceInfo: {
        material_name: '',
        material_color: '',
        settle_price: '',
        attribute: '',
        start_time: '',
        end_time: '',
        date: [],
        client_id: null
      },
      updatePriceShowList: [],
      list: [],
      limitList: limitArr,
      showExport: false,
      checkedCount: [],
      exportKey: [],
      keyword: '',
      contacts_id: '',
      contactsList: [],
      client_id: [],
      storeList: [],
      store_id: '',
      checked: false,
      group_id: '',
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
    searchMaterialNew(str: string, cb: any) {
      let results = str ? this.updatePriceYarnList.filter(this.createFilter(str)) : this.updatePriceYarnList
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value && restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    getMatStsList() {
      this.updatePriceFlag = true
    },
    saveUpdatePrice() {},
    // 前端做筛选
    getMatShowList() {
      this.updatePriceShowList = this.$clone(this.updatePriceOriginList).filter((item: any) => {
        item.realChildren = item.realChildren.filter((itemChild: any) => {
          let nameFlag = this.updatePriceInfo.material_name
            ? itemChild.material_name.toLowerCase().indexOf(this.updatePriceInfo.material_name.toLowerCase()) === 0
            : true
          let attrFlag = this.updatePriceInfo.attribute
            ? itemChild.attribute.toLowerCase().indexOf(this.updatePriceInfo.attribute.toLowerCase()) === 0
            : true
          let colorFlag = this.updatePriceInfo.material_color
            ? itemChild.material_color.toLowerCase().indexOf(this.updatePriceInfo.material_color.toLowerCase()) === 0
            : true
          return nameFlag && attrFlag && colorFlag
        })
        return item.realChildren.length > 0
      })
    },
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
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.contacts_id = Number(query.contacts_id) || ''
      if (this.client_id && this.client_id.length) {
        this.getContacts(this.client_id)
      }
      this.material_name = query.material_name ? (query.material_name as string).split(',') : []
      this.keyword = query.keyword || ''
      this.order_type = query.order_type || ''
      this.status = query.status || 'null'
      this.type = Number(query.type) || 'null'
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
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

      materialStock
        .list({
          start_time: start_time,
          end_time: end_time,
          export_excel: 1,
          action_type: [10, 12]
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
        '/billingManagement/rawMaterialTransferOrder?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&store_id=' +
          this.store_id +
          '&user_id=' +
          this.user_id +
          '&group_id=' +
          this.group_id +
          '&order_type=' +
          this.order_type +
          '&status=' +
          this.status +
          '&type=' +
          this.type +
          '&date=' +
          this.date +
          '&material_name=' +
          encodeURIComponent(this.material_name) +
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
          this.material_name = []
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
      this.loading = true

      materialStock
        .list({
          is_check: this.status,
          code: this.keyword,
          store_id: this.store_id,
          user_id: this.user_id,
          group_id: this.group_id,
          order_type: this.order_type,
          material_name: this.material_name.length ? this.material_name[2] : '',
          start_time: this.date[0],
          end_time: this.date[1],
          action_type: [10, 12],
          limit: this.limit,
          page: this.page
        })
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
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
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
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less">
@import '~@/assets/css/billingManagement/rawMaterialTransferOrder.less';
</style>    