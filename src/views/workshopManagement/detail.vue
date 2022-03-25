<template>
  <div id="workshopManagementDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">下单信息</div>
      </div>
      <div class="tableCtn">
        <div class="filterCtn"
          style="height: 50px">
          <div class="btn backHoverBlue fr"
            @click="dataChange()">数量更新</div>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品信息</div>
            <div class="tcol noPad"
              style="flex: 8.7">
              <div class="trow">
                <div class="tcol"
                  style="flex: 0.2; text-align: center">
                  <el-checkbox v-model="isCheckAllSizeColor"
                    @change="chooseAllSizeColor"></el-checkbox>
                </div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">下机数量</div>
                <div class="tcol noPad"
                  style="flex: 3">
                  <div class="trow">
                    <!-- <div class="tcol" style="flex: 0.3; text-align: center">
                      <el-checkbox v-model="isCheckAllProcess" @change="chooseAllProcess"></el-checkbox>
                    </div> -->
                    <div class="tcol">工序</div>
                    <div class="tcol">合计完成数量</div>
                    <div class="tcol">差值</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(itemPro, itemProIndex) in product_arr"
            :key="itemProIndex">
            <div class="tcol">
              <span>{{ itemPro.product_code }}</span>
              <span>（{{ itemPro.category + '/' + itemPro.secondary_category }}）</span>
            </div>
            <div class="tcol noPad"
              style="flex: 8.7">
              <div class="trow"
                v-for="(itemColorSize, itemColorSizeIndex) in itemPro.product_info"
                :key="itemColorSizeIndex">
                <div class="tcol"
                  style="flex: 0.2; text-align: center">
                  <el-checkbox v-model="itemColorSize.checkSizeColor"
                    @change="forceUpdate(itemColorSize.checkSizeColor, itemPro)"></el-checkbox>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.size_name + '/' + itemColorSize.color_name || '无' }}</span>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.number }}</span>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.inspection_number }}</span>
                </div>
                <div class="tcol noPad"
                  style="flex: 3">
                  <div class="trow"
                    v-for="(itemChild, indexChild) in itemColorSize.product_inspection_info"
                    :key="indexChild">
                    <!-- <div class="tcol" style="flex: 0.3; text-align: center">
                      <el-checkbox
                        v-model="itemChild.checkProcess"
                        @change="chooseProcess(itemPro, itemChild.checkProcess, itemProIndex)"
                      ></el-checkbox>
                    </div> -->
                    <div class="tcol">
                      {{ itemChild.process_name }}
                    </div>
                    <div class="tcol">
                      {{ itemChild.number }}
                    </div>
                    <div :class="itemChild.number - itemColorSize.number > 0 ? 'green tcol' : 'red tcol'">
                      {{ itemChild.number - itemColorSize.number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module clearfix"
      v-show="processWorkerList.length !== 0">
      <el-tabs v-model="tabChoose"
        type="border-card">
        <el-tab-pane v-for="(item, index) in processWorkerList"
          :key="index"
          :label="item.process_name"
          :name="item.process_name">
          <div class="titleCtn">
            <div class="title">完成报表</div>
          </div>
          <div class="tableCtn">
            <div class="filterCtn"
              style="height: 50px">
              <span>工序说明：{{ item.allProcessDesc }}</span>
              <div class="btn backHoverBlue fr"
                @click="secondDataChance()">数量更新</div>
            </div>
            <div class="thead">
              <div class="trow">
                <div class="tcol">人员</div>
                <div class="tcol"
                  style="flex: 1.5">产品编号</div>
                <div class="tcol noPad"
                  style="flex: 8.7">
                  <div class="trow">
                    <div class="tcol">结算工序</div>
                    <div class="tcol">结算单价(元/件)</div>
                    <div class="tcol noPad"
                      style="flex: 8.7">
                      <div class="trow">
                        <div class="tcol"
                          style="text-align: center; flex: 0.2">
                          <el-checkbox v-model="processWorkerListCheck"
                            @change="chooseWorkerProcess"></el-checkbox>
                        </div>
                        <div class="tcol">尺码颜色</div>
                        <div class="tcol">完成数量</div>
                        <div class="tcol">额外数量</div>
                        <div class="tcol">次品数量</div>
                        <div class="tcol">结算小计(元)</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tcol">结算合计(元)</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trowContainer"
                v-for="(itemInfo, itemInfoIndex) in item.info"
                :key="itemInfoIndex">
                <div class="trow"
                  v-for="(itemInfoChild, itemInfoChildIndex) in itemInfo.info"
                  :key="itemInfoChildIndex">
                  <div class="tcol">
                    <div>{{ itemInfo.staff_code.substring(itemInfo.staff_code.length - 4) }}</div>
                    <div>{{ itemInfo.staff_name }}</div>
                  </div>
                  <div class="tcol"
                    style="flex: 1.5">{{ itemInfoChild.product_code }}</div>
                  <div class="tcol noPad"
                    style="flex: 8.7">
                    <div class="trowContainer"
                      v-for="(itemGrandSon, itemGrandSonIndex) in itemInfoChild.info"
                      :key="itemGrandSonIndex">
                      <div class="trowContainer"
                        v-for="(itemProcessDesc, itemProcessDescIndex) in itemGrandSon.info"
                        :key="itemProcessDescIndex">
                        <div class="trow"
                          v-for="(itemPrice, itemPriceIndex) in itemProcessDesc.info"
                          :key="itemPriceIndex">
                          <div class="tcol">
                            {{ item.process_name }}
                          </div>
                          <div class="tcol">
                            {{ itemProcessDesc.price }}
                          </div>
                          <div class="tcol noPad"
                            style="flex: 8.7">
                            <div class="trowContainer"
                              v-for="(itemSize, sizeIndex) in itemPrice.info"
                              :key="sizeIndex + 'sizeIndex'">
                              <div class="trow">
                                <div class="tcol"
                                  style="text-align: center; flex: 0.2">
                                  <el-checkbox v-model="itemSize.checked"
                                    @change="completeTable(itemSize.checked, item, itemProcessDesc)"></el-checkbox>
                                </div>
                                <div class="tcol">
                                  {{ itemPrice.size_name + '/' + itemSize.color_name || '无' }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.extra_number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.shoddy_number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.total_price }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcol">{{ itemInfoChild.allColorSizePrice }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module clearfix"
      v-show="processWorkerList.length !== 0">
      <div class="titleCtn">
        <div class="title">结算日志</div>
      </div>
      <div class="tableCtn">
        <el-table ref="chooseSettlementLogList"
          @selection-change="handleSelectionChange"
          :data="settlementLogList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column type="selection"
            width="55"
            fixed> </el-table-column>
          <el-table-column prop="id"
            label="序号"
            width="70"
            fixed></el-table-column>
          <el-table-column prop="created_at"
            label="添加时间"
            width="110"
            fixed> </el-table-column>
          <el-table-column prop="user_name"
            label="操作人"
            width="110"
            fixed> </el-table-column>
          <el-table-column label="审核状态"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 1"
                class="orange">审核中</div>
              <div v-if="scope.row.is_check === 2"
                class="blue">通过</div>
              <div v-if="scope.row.is_check === 3"
                class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="process_name"
            label="工序"> </el-table-column>
          <el-table-column label="工序说明"
            width="120">
            <template slot-scope="scope">
              <el-tooltip class="item"
                effect="dark"
                :content="scope.row.process_desc || '无工序说明'"
                placement="top-start">
                <span class="blue"
                  style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="staff_name"
            label="人员"
            width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.staff_code.substring(scope.row.staff_code.length - 4) }}</div>
              <div>{{ scope.row.staff_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="product_code"
            label="产品编号"
            width="120"> </el-table-column>
          <el-table-column label="颜色尺码"
            width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="number"
            label="完成数量"
            width="120"> </el-table-column>
          <el-table-column prop="extra_number"
            label="额外数量"
            width="120"> </el-table-column>
          <el-table-column prop="shoddy_number"
            label="次品数量"
            width="120"> </el-table-column>
          <el-table-column label="次品原因"
            width="120">
            <template slot-scope="scope">
              <el-tooltip class="item"
                effect="dark"
                :content="scope.row.shoddy_reason || '无次品原因'"
                placement="top-start">
                <span class="blue"
                  style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="price"
            label="结算单价(元/件)"
            width="150"> </el-table-column>
          <el-table-column prop="total_price"
            label="结算总价(元)"
            fixed="right"
            width="120"> </el-table-column>
        </el-table>
        <div class="buttonList"
          style="margin-bottom: 20px">
          <div style="margin-top: 20px; margin-left: 32px"
            class="btn backHoverBlue"
            @click="lostAgree">批量通过</div>
          <div style="margin-top: 20px; margin-left: 32px"
            class="btn backHoverRed"
            @click="lostDelete">批量删除</div>
        </div>
      </div>
    </div>
    <!-- 生产进度 -->
    <div class="popup"
      v-show="numberUpdate"
      v-loading="showPopupLoading"
      element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产进度更新</span>
          <div class="closeCtn">
            <span class="el-icon-close"
              @click="numberUpdate = false"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="padding-top: 15px">
          <el-checkbox v-model="outCiPin">结算工资去除次品数量
            <el-tooltip class="item"
              effect="dark"
              placement="top">
              <div slot="content">
                勾选前，工资计算公式 = 结算单价 * （完成数量 + 额外数量）<br />勾选后，工资计算公式 = 结算单价 *
                （完成数量 + 额外数量 - 次品数量）
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox v-model="keyBoard"
            @change="changeKeyBoard">打开页面键盘</el-checkbox>
          <!-- <el-checkbox v-model="autoAssignSizeColor">自动分配尺码颜色</el-checkbox> -->
          <div class="editCtn packOrder"
            v-for="(item, index) in productionScheduleUpdate"
            :key="index">
            <div class="deleteIcon"
              @click="
                productionScheduleUpdate.length > 1
                  ? $deleteItem(productionScheduleUpdate, index)
                  : $message.error('至少有一个产品')
              ">
              <i class="el-icon-close"></i>
            </div>
            <div class="tableCtn">
              <div class="tbody hasTop">
                <div class="trow">
                  <div class="tcol bgGray">加工产品</div>
                  <div class="tcol">
                    <el-select v-model="item.productNameId"
                      @change="getColorList(item)"
                      filterable
                      placeholder="请选择加工产品">
                      <el-option v-for="item in product_arr"
                        :key="item.id"
                        :label="item.product_code + ' ' + item.category + '/' + item.secondary_category"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="tcol bgGray">加工工序</div>
                  <div class="tcol" style="flex:0.6">
                    <el-cascader v-model="item.process"
                      :options="processList"
                      @change="getWorkList(item)"
                      :show-all-levels="false"
                      placeholder="加工工序"></el-cascader>
                  </div>
                  <div class="tcol bgGray">工序说明</div>
                  <div class="tcol" style="flex:1.9">
                    <el-autocomplete class="inline-input"
                      v-model="item.process_desc"
                      :fetch-suggestions="querySearch"
                      placeholder="请选择工序"></el-autocomplete>
                  </div>
                  <div class="tcol bgGray">结算单价</div>
                  <div class="tcol" style="flex:0.5">
                    <zh-input class="inputs"
                      :keyBoard="keyBoard"
                      v-model="item.unitPrice"
                      placeholder="请输入结算单价"
                      type="number">
                    </zh-input>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray">员工</div>
                  <div class="tcol bgGray">尺码颜色</div>
                  <div class="tcol bgGray">完成数量</div>
                  <div class="tcol bgGray">额外数量</div>
                  <div class="tcol bgGray">次品数量</div>
                  <div class="tcol bgGray">次品原因</div>
                  <div class="tcol bgGray">日期</div>
                  <div class="tcol bgGray">操作</div>
                </div>
                <div class="trow"
                  v-for="(itemSizeColor, indexColorSize) in item.infoData"
                  :key="indexColorSize">
                  <div class="tcol">
                    <!-- <el-select v-model="itemSizeColor.worker" filterable placeholder="请选择员工">
                      <el-option v-for="item in workList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select> -->
                    <el-cascader :options="allWorkList"
                      v-model="itemSizeColor.worker"
                      placeholder="请选择员工"
                      filterable
                      :show-all-levels="false"></el-cascader>
                  </div>
                  <div class="tcol noPad"
                    :style="{ flex: productionScheduleUpdate.length === 1 ? 7 : 7.03 }">
                    <div class="trow"
                      v-for="(el, i) in itemSizeColor.sizeColorList"
                      :key="i">
                      <div class="tcol">
                        <el-select v-model="el.chooseId"
                          allow-create
                          default-first-option
                          placeholder="请选择尺码颜色"
                          @change="$forceUpdate()">
                          <el-option v-for="(sizeColor, sizeColorIndex) in itemSizeColor.sizeColorList"
                            :key="sizeColorIndex + 'cmys'"
                            :label="
                              (sizeColor.size_name || '无尺码数据') + '/' + (sizeColor.color_name || '无颜色数据')
                            "
                            :value="sizeColor.size_id + ',' + sizeColor.color_id">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="tcol">
                        <zh-input class="inputs"
                          :keyBoard="keyBoard"
                          v-model="el.complete_number"
                          placeholder="请输入完成数量"
                          type="number">
                        </zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input class="inputs"
                          :keyBoard="keyBoard"
                          v-model="el.extra_number"
                          placeholder="请输入额外数量"
                          type="number">
                        </zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input class="inputs"
                          :keyBoard="keyBoard"
                          v-model="el.shoddy_number"
                          placeholder="请输入次品数量"
                          type="number">
                        </zh-input>
                      </div>
                      <div class="tcol"
                        style="overflow-y: scroll">
                        <el-select v-model="el.shoddy_reason"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          collapse-tags
                          placeholder="请选择次品原因">
                          <el-option v-for="item in substandardReason"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="tcol">
                        <el-date-picker v-model="el.complete_time"
                          style="padding-left: 28px"
                          clearable
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                  <div class="tcol">
                    <div>
                      <span class="opr hoverBlue"
                        @click="copyWorkerInfo(item, itemSizeColor)">复制</span>
                      <span class="opr hoverRed"
                        @click="
                          item.infoData.length > 1
                            ? $deleteItem(item.infoData, indexColorSize)
                            : $message.error('至少有一个员工')
                        ">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom: 16px"
            @click="
              $addItem(productionScheduleUpdate, {
                productNameId: '',
                productId: '',
                process: '',
                process_desc: '',
                unitPrice: 0,
                infoData: [
                  {
                    date: '',
                    worker: '',
                    sizeColorList: [{}],
                    substandardReason: []
                  }
                ]
              })
            ">
            添加下一组
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="numberUpdate = false">取消</span>
          <span class="btn backHoverBlue"
            @click="confirmSubmit">确认提交</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, process, quotedPrice, staff, workshop } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import zhInput from '@/components/zhInput/zhInput.vue'
export default Vue.extend({
  components: { zhInput },
  data(): {
    orderInfo: OrderInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
      showPopupLoading: false,
      orderIndex: '0',
      openWindowKey: false,
      autoAssignSizeColor: false,
      product_arr: [],
      outCiPin: false,
      tabChoose: '',
      // 颜色尺码是否全选
      isCheckAllSizeColor: false,
      isCheckAllProcess: false,
      processWorkerListCheck: false,
      substandardReason: [
        {
          value: '织造原因',
          label: '织造原因'
        },
        {
          value: '捻须原因',
          label: '捻须原因'
        },
        {
          value: '拉毛原因',
          label: '拉毛原因'
        },
        {
          value: '刺毛原因',
          label: '刺毛原因'
        },
        {
          value: '水洗原因',
          label: '水洗原因'
        },
        {
          value: '车缝原因',
          label: '车缝原因'
        },
        {
          value: '套口原因',
          label: '套口原因'
        },
        {
          value: '整烫原因',
          label: '整烫原因'
        },
        {
          value: '手工原因',
          label: '手工原因'
        },
        {
          value: '其它原因',
          label: '其它原因'
        }
      ],
      allWorkList: [
        {
          value: 3,
          label: '工序负责人员',
          children: []
        },
        {
          value: '',
          label: '所有人员',
          children: []
        }
      ],
      productionScheduleUpdate: [
        {
          productNameId: '',
          productId: '',
          process: '',
          process_desc: '',
          unitPrice: 0,
          infoData: [
            {
              date: '',
              worker: '',
              sizeColorList: [{}],
              substandardReason: []
            }
          ]
        }
      ],
      settlementLogList: [],
      chooseSettlementLogList: [],
      processWorkerList: [],
      processList: [],
      processDescList: [],
      workList: [],
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [],
                    image_data: [],
                    product_info: [
                      {
                        size_color: '',
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      numberUpdate: false,
      showPrice: false,
      priceProcessList: [] // 报价单报价信息
    }
  },
  methods: {
    init() {
      this.loading = true
      this.processList = []
      this.order_id = this.$route.query.id
      workshop.detail({ order_id: this.order_id }).then((res) => {
        res.data.data.forEach((items: any) => {
          items.allProcessDesc = []
          items.info.forEach((item: any) => {
            item.info.forEach((itemSon: any) => {
              let number = 0
              itemSon.info.forEach((itemGrandSon: any) => {
                items.allProcessDesc.push(itemGrandSon.process_desc)
                itemGrandSon.info.forEach((itemProcessDesc: any) => {
                  itemProcessDesc.info.forEach((itemPrice: any) => {
                    itemPrice.info.forEach((itemSize: any) => {
                      number += itemSize.info.total_price
                    })
                  })
                })
              })
              itemSon.allColorSizePrice = number
            })
          })
          items.allProcessDesc = items.allProcessDesc.toString().replace(/^,+/, '').replace(/,+$/, '')
        })
        this.processWorkerList = res.data.data
        this.tabChoose = res.data.data[0]?.process_name
      })

      workshop.list({ order_id: this.order_id }).then((res) => {
        this.settlementLogList = res.data.data
      })

      process.list({ type: 2 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.name,
            value: item.name
          })
        })
        this.processList.push({
          label: '半成品加工工序',
          value: 2,
          children: arr
        })
      })

      process.list({ type: 3 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.name,
            value: item.name
          })
        })
        this.processList.push({
          label: '成品加工工序',
          value: 3,
          children: arr
        })
      })

      this.getWorkList('')
      this.loading = false
    },
    querySearch(queryString: string, cb: any) {
      if (this.processDescList === undefined || this.processDescList.length === 0) {
        cb([])
        return
      }

      cb(this.processDescList)
    },
    copyWorkerInfo(item: any, itemSizeColor: any) {
      if (item.productId === '') {
        this.$message.error('请先选择产品')
        return
      }
      this.$addItem(item.infoData, {
        date: '',
        worker: '',
        sizeColorList: JSON.parse(JSON.stringify(itemSizeColor.sizeColorList)),
        substandardReason: []
      })
    },
    completeTable(checked: any, item: any, itemRoot: any) {
      if (checked) {
        if (item.checked === undefined) {
          item.checked = []
        }
        if (itemRoot.checked === undefined) {
          itemRoot.checked = []
        }
        item.checked.push(checked)
        itemRoot.checked.push(checked)
      } else {
        this.$deleteItem(item.checked, 0)
        this.$deleteItem(itemRoot.checked, 0)
      }
      this.$forceUpdate()
    },
    chooseWorkerProcess(bol: any) {
      this.processWorkerList.forEach((processWorkerItem: any) => {
        if (processWorkerItem.process_name === this.tabChoose) {
          processWorkerItem.info.forEach((staffNameItem: any) => {
            staffNameItem.info.forEach((productCodeItem: any) => {
              productCodeItem.info.forEach((process_desc: any) => {
                process_desc.info.forEach((item: any) => {
                  item.info.forEach((itemPrice: any) => {
                    itemPrice.info.forEach((itemSize: any) => {
                      itemSize.checked = bol
                      if (bol) {
                        if (processWorkerItem.checked === undefined) {
                          processWorkerItem.checked = []
                        }
                        if (item.checked === undefined) {
                          item.checked = []
                        }
                        processWorkerItem.checked.push(bol)
                        item.checked.push(bol)
                      } else {
                        this.$deleteItem(processWorkerItem.checked, 0)
                        this.$deleteItem(item.checked, 0)
                      }
                    })
                  })
                })
              })
            })
          })
        }
      })
    },
    confirmSubmit() {
      let params: {
        order_id: any
        data: Array<{
          staff_id: number | string
          process_name: number | string
          process_type: number | string
          process_desc: string
          extra_number: number | string
          order_product_id: number | string
          product_id: number | string
          size_id: number | string
          color_id: number | string
          number: number | string
          price: number | string
          total_price: number | string
          shoddy_number: number | string
          shoddy_reason: string
          complete_time: string
        }>
      } = {
        order_id: this.order_id,
        data: []
      }
      const data: any = []

      this.productionScheduleUpdate.forEach((items: any) => {
        if (items.productId === '') {
          this.$message.error('请选择加工产品')
          throw Error()
        }
        if (items.process === '') {
          this.$message.error('请选择工序')
          throw Error()
        }
        items.infoData.forEach((item: any) => {
          if (item.worker === '') {
            this.$message.error('请选择员工')
            throw Error()
          }
          item.sizeColorList.forEach((itemChild: any) => {
            if (itemChild.complete_time === undefined) {
              this.$message.error('请选择日期')
              throw Error()
            }
            let obj: {
              id: number | string
              staff_id: number | string
              process_name: string | number
              process_desc: string
              process_type: string | number
              order_product_id: string | number
              extra_number: number | string
              product_id: number | string
              size_id: number | string
              color_id: number | string
              number: number | string
              price: number | string
              total_price: number | string
              shoddy_number: number | string
              shoddy_reason: string
              complete_time: string
            } = {
              id: '',
              process_name: items.process[1],
              process_type: items.process[0],
              process_desc: items.process_desc,
              order_product_id: items.productNameId,
              product_id: items.productId,
              price: items.unitPrice || 0,
              staff_id: item.worker[1],
              size_id: itemChild.chooseId.split(',')[0],
              extra_number: itemChild.extra_number || 0,
              color_id: itemChild.chooseId.split(',')[1],
              number: itemChild.complete_number || 0,
              total_price: this.outCiPin
                ? ((itemChild.complete_number || 0 + itemChild.extra_number || 0) - (itemChild.shoddy_number || 0)) *
                  (items.unitPrice || 0)
                : (itemChild.complete_number || 0 + itemChild.extra_number || 0) * (items.unitPrice || 0),
              shoddy_number: itemChild.shoddy_number || 0,
              shoddy_reason: itemChild.shoddy_reason ? itemChild.shoddy_reason.toString() : '',
              complete_time: itemChild.complete_time
            }
            data.push(obj)
            params.data = data
          })
        })
      })

      workshop.save(params).then((res) => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          location.reload()
        }
      })
    },
    dataChange() {
      if (
        !this.product_arr.some(
          (res: any) => res.checkSizeColor !== undefined && res.checkSizeColor.length !== 0 //||
          //(res.checkProcess !== undefined && res.checkProcess.length !== 0)
        )
      ) {
        this.resetProductionScheduleUpdate()
        this.numberUpdate = true
        return
      }
      let arr: any = []

      this.product_arr.forEach((item: any, index: any) => {
        if (
          item.checkSizeColor === undefined ||
          item.checkSizeColor.length === 0 //&&
          // (item.checkProcess === undefined || item.checkProcess.length === 0)
        ) {
          return
        }

        // item.product_info.forEach((itemColor: any) => {
        //   itemColor.product_inspection_info.forEach((itemProcess: any) => {
        //     if (itemProcess.checkProcess) {
        //       console.log(item, itemColor, itemProcess, this.productionScheduleUpdate)
        //       let obj: any = {
        //         infoData: []
        //       }
        //       obj.productNameId = item.id
        //       obj.productId = item.product_id
        //       obj.process = itemProcess.process_name
        //       obj.infoData.push({
        //         sizeColorList: [itemColor]
        //       })
        //       arr.push(obj)
        //     }
        //   })
        // })

        let obj: any = {}
        obj.infoData = []
        obj.productIndex = index
        obj.productNameId = item.id
        obj.productId = item.product_id

        item.product_info.forEach((itemColor: any, itemIndex: any) => {
          if (itemIndex === 0) {
            obj.infoData.push({
              sizeColorList: []
            })
          }

          if (itemColor.checkSizeColor) {
            itemColor.chooseId = itemColor.size_id + ',' + itemColor.color_id
            itemColor.complete_time = this.getNowFormatDate()
            obj.infoData[0].sizeColorList.push(itemColor)
          }
        })

        arr.push(obj)
      })

      this.productionScheduleUpdate = arr
      this.numberUpdate = true
    },
    secondDataChance() {
      this.showPopupLoading = true
      if (
        !this.processWorkerList.some(
          (res: any) => res.checked !== undefined && res.checked.length !== 0 //||
          //(res.checkProcess !== undefined && res.checkProcess.length !== 0)
        )
      ) {
        this.resetProductionScheduleUpdate()
        this.numberUpdate = true
        this.showPopupLoading = false
        return
      }

      let arr: any = []

      this.processWorkerList.forEach((processWorker: any) => {
        if (processWorker.process_name === this.tabChoose) {
          process
            .list({
              name: processWorker.process_name
            })
            .then((ress) => {
              if (ress.data.data[0]?.process_desc) {
                processWorker.processDescList = ress.data.data[0].process_desc.split(',')
              }
              let oldObj: any = {}
              processWorker.info.forEach((staffNameItem: any, staffIndex: number) => {
                staffNameItem.info.forEach((productCodeItem: any) => {
                  productCodeItem.info.forEach((process_desc: any) => {
                    process_desc.info.forEach((itemPrice: any, priceIndex: any) => {
                      itemPrice.info.forEach((itemSize: any) => {
                        let obj: any = {}
                        obj.infoData = [{ worker: '', sizeColorList: [] }]
                        itemSize.info.forEach((itemColor: any, colorIndex: number) => {
                          // console.log(itemColor)
                          if (itemColor.checked === undefined || itemColor.checked === false) return

                          if (staffIndex > 0) {
                            if (colorIndex === 0) {
                              oldObj.infoData.push({ worker: '', sizeColorList: [] })
                              oldObj.infoData[oldObj.infoData.length - 1].worker = ['', itemColor.info.staff_id]
                            }
                            itemColor.chooseId = itemColor.info.size_id + ',' + itemColor.info.color_id
                            itemColor.complete_time = this.getNowFormatDate()
                            itemColor.size_name = itemSize.size_name
                            itemColor.size_id = itemColor.info.size_id
                            itemColor.color_id = itemColor.info.color_id
                            oldObj.infoData[oldObj.infoData.length - 1].sizeColorList.push(itemColor)
                          } else {
                            obj.productNameId = itemColor.info.order_product_id
                            obj.process = [+itemColor.info.process_type, processWorker.process_name]
                            obj.process_desc = process_desc.process_desc
                            obj.processDescList = processWorker.processDescList
                            obj.productId = itemColor.info.product_id
                            obj.unitPrice = process_desc.info[priceIndex].price
                            itemColor.chooseId = itemColor.info.size_id + ',' + itemColor.info.color_id
                            itemColor.complete_time = this.getNowFormatDate()
                            itemColor.size_name = itemSize.size_name
                            itemColor.size_id = itemColor.info.size_id
                            itemColor.color_id = itemColor.info.color_id
                            obj.infoData[obj.infoData.length - 1].sizeColorList.push(itemColor)
                            obj.infoData[obj.infoData.length - 1].worker = ['', itemColor.info.staff_id]
                            oldObj = obj
                          }

                          // console.log(sizeColorItem)
                          // item.product_info.forEach((itemColor: any, itemIndex: any) => {
                          //   if (itemIndex === 0) {
                          //     obj.infoData.push({
                          //       sizeColorList: []
                          //     })
                          //   }
                          //   console.log(itemColor)
                          //   if (itemColor.checkSizeColor) {
                          //     itemColor.chooseId = itemColor.size_id + ',' + itemColor.color_id
                          //     obj.infoData[0].sizeColorList.push(itemColor)
                          //   }
                          // })
                        })
                        if (
                          itemPrice.checked === undefined ||
                          itemPrice.checked.length === 0 ||
                          !obj.productId ||
                          staffIndex > 0
                        ) {
                          return
                        }
                        arr.push(obj)
                      })
                      // arr.forEach((price:any) => {
                      //   console.log(price.unitPrice)
                      // });
                    })
                  })
                })
              })
              this.showPopupLoading = false
            })
        }
      })

      this.productionScheduleUpdate = arr
      this.numberUpdate = true
    },
    chooseProcess(item: any, check: any, itemProIndex: any) {
      if (item.checkProcess === undefined) {
        item.checkProcess = []
      }
      if (check) {
        item.checkProcess.push(check)
      } else {
        if (item.checkProcess.length !== 0) {
          this.$deleteItem(item.checkProcess, 0)
        }
      }
      item.product_info[itemProIndex].checkProcess = check
      this.$forceUpdate()
    },
    chooseAllProcess(bol: any) {
      // 判断是否全部选择
      this.isCheckAllProcess = bol

      this.product_arr.forEach((itemPro: any) => {
        itemPro.product_info.forEach((itemProcess: any) => {
          itemProcess.product_inspection_info.forEach((process: any) => {
            if (bol) {
              if (itemPro.checkProcess === undefined) {
                itemPro.checkProcess = []
              }
              itemPro.checkProcess.push(bol)
            } else {
              itemPro.checkProcess = []
            }
            process.checkProcess = bol
          })
        })
      })
    },
    getNowFormatDate() {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month: any = date.getMonth() + 1
      let strDate: any = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    getWorkList(res: any) {
      process
        .list({
          name: res === '' ? res : res.process[1]
        })
        .then((ress) => {
          if (res === '') {
            res = {}
          }
          res.processDescList = []
          if (ress.data.data[0]?.process_desc) {
            res.processDescList = ress.data.data[0].process_desc.split(',')
            let arr: Array<{ value: string }> = []
            res.processDescList.forEach((item: any) => {
              arr.push({
                value: item
              })
            })
            this.processDescList = arr
          }
          this.$forceUpdate()
        })
      // console.log(res[1])
      staff.list({ keyword: res === '' ? res : res.process[1], status: 1 }).then((ress: any) => {
        let arr: any = []
        ress.data.data.forEach((worker: any) => {
          arr.push({
            value: worker.id,
            label: worker.code.substring(worker.code.length - 4) + ' ' + worker.name
          })
        })
        this.allWorkList[0].children = arr
      })
      staff.list({ keyword: '' }).then((ress: any) => {
        let arr: any = []
        ress.data.data.forEach((worker: any) => {
          arr.push({
            value: worker.id,
            label: worker.code.substring(worker.code.length - 4) + ' ' + worker.name
          })
        })
        this.allWorkList[1].children = arr
      })
    },
    getColorList(res: any) {
      let product_info = this.product_arr.find((val: any) => {
        return val.id === res.productNameId
      })

      res.productId = product_info.product_id
      res.infoData.forEach((el: any) => {
        let arr: any = []

        product_info.product_info.forEach((item: any) => {
          arr.push(JSON.parse(JSON.stringify(item)))
        })

        el.sizeColorList = arr
      })
    },
    chooseAllSizeColor(bol: boolean) {
      // 判断是否全部选择
      this.isCheckAllSizeColor = bol

      this.product_arr.forEach((itemPro: any) => {
        itemPro.product_info.forEach((itemSizeColor: any) => {
          if (bol) {
            if (itemPro.checkSizeColor === undefined) {
              itemPro.checkSizeColor = []
            }
            itemPro.checkSizeColor.push(bol)
          } else {
            itemPro.checkSizeColor = []
          }
          itemSizeColor.checkSizeColor = bol
        })
      })
    },
    forceUpdate(checked: any, itemPro: any) {
      if (itemPro.checkSizeColor === undefined) {
        itemPro.checkSizeColor = []
      }
      if (checked) {
        itemPro.checkSizeColor.push(checked)
      } else {
        if (itemPro.checkSizeColor.length !== 0) {
          this.$deleteItem(itemPro.checkSizeColor, 0)
        }
      }
      this.$forceUpdate()
    },
    resetProductionScheduleUpdate() {
      this.productionScheduleUpdate = [
        {
          productName: '',
          process: '',
          unitPrice: 0,
          process_desc: '',
          infoData: [
            {
              date: '',
              worker: '',
              sizeColorList: [{}],
              substandardReason: []
            }
          ]
        }
      ]
    },
    lostDelete() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .delete({
          id: arr
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
            this.init()
          }
        })
    },
    lostAgree() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .check({
          id: arr,
          is_check: 2
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('审核成功')
            this.init()
          }
        })
    },
    handleSelectionChange(val: any) {
      this.chooseSettlementLogList = val
    },
    changeKeyBoard(val: boolean) {
      localStorage.showWorkShopKeyBoard = val + ''
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.order_id = res.data.data.time_data[this.orderIndex].id
        this.orderInfo = res.data.data
        res.data.data.time_data[0].batch_data.forEach((item: any) => {
          item.product_data.forEach((itemPro: any) => {
            this.product_arr.push(itemPro)
          })
        })
        this.init()
      })
    // 优化报价信息
    quotedPrice
      .detailByOrder({
        order_id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((item: QuotedPriceInfo) => {
              item.product_data.forEach((itemPro) => {
                itemPro.semi_product_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '半成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.process_name!.join(','),
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
                itemPro.production_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name!.join(','),
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
              })
            })
            this.priceProcessList = this.$mergeData(this.priceProcessList, {
              mainRule: 'productInfo'
            })
          }
        }
      })
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/detail.less';
</style>
<style lang="less">
#workshopManagementDetail {
  .el-tabs__content {
    padding: 0;
  }
  .el-input input {
    padding: 3px 0;
    border: none;
  }
  .el-input__suffix {
    display: none;
  }
  .zhInputCtn {
    border: none;
    .zhInputBox {
      .zhInput {
        padding: 0;
        border: 0;
      }
    }
    .zhInputAppend {
      border-left: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
}
</style>