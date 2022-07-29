<template>
  <div id="workshopStaffDetail"
    class="bodyContainer"
    style="min-height: 1000px"
    v-loading="loading">
    <div class="module clearfix">
      <div class="detailCtn">
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
        <div class="elCtn"
          style="margin-left: 20px">
          <el-select style="width: 95%"
            @change="changeDepartment()"
            v-model="department"
            placeholder="部门筛选"
            clearable>
            <el-option v-for="(item, index) in departmentList"
              :key="index + item.name"
              :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div v-for="(settlementLog, settlementLogIndex) in settlementLogList"
      :key="'process' + settlementLogIndex">
      <div class="module">
        <div class="detailCtn"
          style="margin-bottom: 0; padding-bottom: 0">
          <div class="row">
            <div class="col">
              <div class="label"
                style="width: unset; margin-right: 10px">{{ settlementLogIndex + 1 }}</div>
              <div class="label">员工姓名：</div>
              <div class="text">
                <el-select v-model="settlementLog.staffId"
                  filterable
                  placeholder="请选择员工"
                  @change="selectStaff">
                  <el-option v-for="(staff, StaffIndex) in staffList"
                    :key="StaffIndex + 'StaffIndex'"
                    :label="staff.code.substr(staff.code.length - 4, staff.code.length) + ' ' + staff.name"
                    :value="staff.id">
                  </el-option>
                </el-select>
              </div>
              <div class="btn backHoverRed"
                style="margin-left: 20px; display: flex; align-items: center"
                @click="deleteStaff(settlementLogList, settlementLogIndex)">
                <!-- <div class="closeCtn">
                  <span class="el-icon-close" style="cursor: pointer"></span>
                </div> -->
                删除员工
              </div>
              <div class="btn backHoverBlue"
                style="margin-left: 20px; display: flex; align-items: center"
                @click="
                  $addItem(settlementLog.processInfo, {
                    process: '',
                    product_info: [
                      {
                        order_code: '',
                        product_detail_info: [
                          {
                            code: '',
                            sizeColorInfo: [
                              {
                                size_name: '',
                                color_name: '',
                                number: '',
                                extra_number: '',
                                shoddy_number: '',
                                shoddy_reason: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  })
                ">
                添加下个工序
              </div>
            </div>
          </div>
        </div>
        <div class="tableCtn"
          v-for="(item, index) in settlementLog.processInfo"
          :key="'process' + index">
          <div class="tbody"
            style="border-top: 1px solid #e9e9e9">
            <div class="trow">
              <div class="tcol bgGray">负责工序</div>
              <div class="tcol">
                <el-cascader v-model="item.process"
                  filterable
                  :options="processList"
                  :show-all-levels="false"
                  clearable
                  @change="getProcessDesc(item)"></el-cascader>
                <!-- <el-select v-model="item.process" filterable placeholder="加工工序" @change="getProcessDesc(item)">
                  <el-option v-for="item in processList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select> -->
              </div>
              <div class="tcol bgGray">工序说明</div>
              <div class="tcol">
                <el-select v-model="item.process_desc"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  collapse-tags
                  placeholder="请选择填写工序说明">
                  <el-option v-for="(itemSon, indexSon) in item.processDesc"
                    :key="itemSon.value + indexSon"
                    :label="itemSon.label"
                    :value="itemSon.value">
                  </el-option>
                </el-select>
              </div>
              <div class="tcol bgGray">结算单价</div>
              <div class="tcol">
                <zh-input v-model="item.price"
                  placeholder="请输入结算单价"
                  :keyBoard="keyBoard"
                  type="number"></zh-input>
              </div>
              <div class="tcol"
                style="flex: 0.1">
                <div class="closeCtn backHoverRed">
                  <span class="el-icon-close"
                    style="cursor: pointer"
                    @click="deleteProcess(settlementLog, index)"></span>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray"
                style="flex: 0.3; text-align: center">序号</div>
              <div class="tcol bgGray">
                <div>订单号</div>
              </div>
              <div class="tcol noPad"
                style="flex: 8.7">
                <div class="trow">
                  <div class="tcol bgGray">产品编号</div>
                  <div class="tcol bgGray">尺码颜色</div>
                  <div class="tcol bgGray">完成数量</div>
                  <div class="tcol bgGray">额外数量</div>
                  <div class="tcol bgGray">次品数量</div>
                  <div class="tcol bgGray">次品原因</div>
                </div>
              </div>
              <div class="tcol bgGray">操作</div>
            </div>
            <div class="trow"
              v-for="(itemPro, itemProIndex) in item.product_info"
              :key="itemProIndex + 'itemProIndex'">
              <div class="tcol"
                style="flex: 0.3; text-align: center">
                {{ itemProIndex + 1 }}
              </div>
              <div class="tcol">
                <el-select v-model="itemPro.order_code"
                  filterable
                  remote
                  placeholder="请输入订单编号"
                  :loading="searchLoading"
                  :remote-method="
                    (ev) => {
                      return $debounce(ev, timer, querySearchAsync)
                    }
                  "
                  @change="handleSelect(item, settlementLogIndex, index, itemProIndex, index, settlementLogIndex)">
                  <div style="display: flex; padding: 0 10px; width: 500px">
                    <div style="flex: 1">订单号</div>
                    <div style="flex: 1">下单公司</div>
                    <div style="flex: 1">下单时间</div>
                  </div>
                  <el-option v-for="(item, index) in orderList"
                    :key="item.value + index + 'order'"
                    :label="item.label"
                    :value="item.value">
                    <div style="display: flex">
                      <span style="flex: 1">{{ item.value }}</span>
                      <span style="flex: 1"> {{ item.client_name }} </span>
                      <span style="flex: 1">{{ item.created_at }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
              <div class="tcol noPad"
                style="flex: 8.7">
                <div class="trow"
                  v-for="(itemDetail, indexDetail) in itemPro.product_detail_info"
                  :key="indexDetail + 'indexDetail'">
                  <div class="tcol">
                    <el-select v-model="itemDetail.code"
                      filterable
                      remote
                      placeholder="请输入产品编号"
                      :loading="searchLoading"
                      :remote-method="
                        (ev) => {
                          return $debounce(ev, timer, querySearchAsync1)
                        }
                      "
                      :ref="'input' + settlementLogIndex + index + itemProIndex + indexDetail"
                      @keyup.enter.native="
                        getChooseOrderList(item, settlementLogIndex, index, itemProIndex, indexDetail)
                      "
                      @change="handleSelect(item, settlementLogIndex, index, itemProIndex, index, settlementLogIndex)">
                      <div style="display: flex; padding: 0 10px; width: 800px">
                        <div style="flex: 1">产品编号</div>
                        <div style="flex: 1">所属订单号</div>
                        <div style="flex: 1">包含色组</div>
                        <div style="flex: 1">下单公司</div>
                        <div style="flex: 1">下单时间</div>
                      </div>
                      <el-option v-for="(item, i) in orderList"
                        :key="item.value + settlementLogIndex + indexDetail + index + i + 'orderList'"
                        :label="item.label"
                        :value="item.value">
                        <div style="display: flex; white-space: normal">
                          <span style="flex: 1">{{ item.product_name }}</span>
                          <span style="flex: 1">{{ item.value }}</span>
                          <span style="width: 150px; overflow: hidden; margin-right: 10px">{{ item.colorGroup }}</span>
                          <span style="flex: 1"> {{ item.client_name }} </span>
                          <span style="flex: 1">{{ item.created_at }}</span>
                        </div>
                      </el-option>
                    </el-select>
                  </div>
                  <div class="tcol noPad"
                    style="flex: 5.7">
                    <div class="trow"
                      v-for="(itemSizeColor, indexSizeColor) in itemDetail.sizeColorInfo"
                      :key="indexSizeColor + 'indexSizeColor'">
                      <div class="tcol"
                        style="display: block; position: relative">
                        <el-select v-model="itemSizeColor.chooseId"
                          placeholder="请选择尺码颜色"
                          @change="$forceUpdate()">
                          <el-option v-for="(colorItem, colorIndex) in itemSizeColor.colorList"
                            :key="colorItem.size_id + ',' + colorItem.color_id + colorIndex"
                            :label="colorItem.name"
                            :value="colorItem.value">
                          </el-option>
                        </el-select>
                        <!-- {{ itemSizeColor.size_name || '无数据' }}/{{ itemSizeColor.color_name || '无数据' }} -->
                        <i class="el-icon-circle-plus-outline"
                          style="cursor: pointer; position: absolute; right: 15%; top: 30%"
                          @click="
                            $addItem(itemDetail.sizeColorInfo, {
                              size_name: '',
                              color_name: '',
                              number: '',
                              colorList: itemDetail.sizeColorInfo[0].colorList,
                              extra_number: '',
                              shoddy_number: '',
                              shoddy_reason: []
                            })
                          "></i>
                        <i class="el-icon-remove-outline"
                          style="cursor: pointer; position: absolute; right: 5%; top: 30%"
                          @click="
                            itemDetail.sizeColorInfo.length > 1
                              ? $deleteItem(itemDetail.sizeColorInfo, indexSizeColor)
                              : $message.error('至少有一个产品颜色')
                          "></i>
                      </div>
                      <div class="tcol">
                        <zh-input v-model="itemSizeColor.number"
                          placeholder="请输入完成数量"
                          :keyBoard="keyBoard"
                          type="number"></zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input v-model="itemSizeColor.extra_number"
                          placeholder="请输入额外数量"
                          :keyBoard="keyBoard"
                          type="number"></zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input v-model="itemSizeColor.shoddy_number"
                          placeholder="请输入结算单价"
                          :keyBoard="keyBoard"
                          type="number"></zh-input>
                      </div>
                      <div class="tcol cpyy"
                        style="overflow-y: scroll">
                        <el-select v-model="itemSizeColor.shoddy_reason"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          collapse-tags
                          placeholder="请选择次品原因">
                          <el-option v-for="item in substandardReason"
                            :key="item.value + 'ciPinReason'"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tcol">
                <div>
                  <span class="hoverBlue"
                    style="cursor: pointer"
                    @click="
                      $addItem(item.product_info, {
                        order_code: '',
                        product_detail_info: [
                          {
                            code: '',
                            sizeColorInfo: [
                              {
                                size_name: '',
                                color_name: '',
                                number: '',
                                extra_number: '',
                                shoddy_number: '',
                                shoddy_reason: []
                              }
                            ]
                          }
                        ]
                      })
                    ">
                    添加
                  </span>
                  <span class="hoverRed"
                    style="cursor: pointer; margin-left: 20px"
                    @click="checkDelete(item, itemProIndex)">
                    删除
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="overflow: hidden; margin-top: 20px">
      <div class="btn backHoverBlue fr"
        @click="
          $addItem(settlementLogList, {
            staffName: '',
            staffCode: '',
            staffId: '',
            processInfo: [
              {
                process: '',
                product_info: [
                  {
                    order_code: '',
                    product_detail_info: [
                      {
                        code: '',
                        sizeColorInfo: [
                          {
                            size_name: '',
                            color_name: '',
                            number: '',
                            extra_number: '',
                            shoddy_number: '',
                            shoddy_reason: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          })
        ">
        添加下个员工
      </div>
      <div style="margin-right: 10px"
        class="btn backHoverBlue fr"
        @click="copyUp">复制上一组</div>
    </div>
    <!-- 生产进度 -->
    <div class="popup"
      v-show="addOrder"
      v-loading="showPopupLoading"
      element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加订单</span>
          <div class="closeCtn">
            <span class="el-icon-close"
              @click="closeAddOrder()"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="padding-top: 15px; max-height: 700px">
          <div class="editCtn packOrder">
            <div class="tableCtn">
              <div class="tbody hasTop">
                <div class="trow">
                  <div class="tcol bgGray">订单类型</div>
                  <div class="tcol bgGray">订单号</div>
                  <div class="tcol bgGray">产品编号</div>
                  <div class="tcol bgGray">产品名称</div>
                  <div class="tcol bgGray">产品描述</div>
                  <div class="tcol bgGray">产品图片</div>
                  <div class="tcol bgGray">尺码/颜色</div>
                  <div class="tcol bgGray">尺寸/克重</div>
                  <div class="tcol bgGray">计划生产数量</div>
                  <div class="tcol bgGray">检验入库数量</div>
                  <div class="tcol bgGray"
                    style="flex: 0.2">
                    <el-checkbox v-model="checkAll"
                      @change="checkAllOrder"></el-checkbox>
                  </div>
                </div>
                <div class="trow"
                  v-for="(item, index) in productionScheduleUpdate"
                  :key="index + 'productionScheduleUpdate'">
                  <div class="tcol">{{ item.order_type === 1 ? '订单' : '样单' }}</div>
                  <div class="tcol">{{ item.code }}</div>
                  <div class="tcol noPad"
                    style="flex: 10.3">
                    <div class="trow"
                      v-for="(itemPro, indexPro) in item.product_info"
                      :key="indexPro + 'pro'">
                      <div class="tcol">{{ itemPro.product_code }}<br />{{ itemPro.category }}</div>
                      <div class="tcol">{{ itemPro.name }}</div>
                      <div class="tcol">{{ contentHtml(itemPro.desc) }}</div>
                      <div class="tcol">
                        <el-image :src="itemPro.img.length > 0 ? itemPro.img[0] : require('@/assets/image/common/noPic.png')"
                          :preview-src-list="itemPro.img"
                          fit="cover"
                          style="width: 45px; height: 45px; padding: 10px 0"></el-image>
                      </div>
                      <div class="tcol noPad"
                        style="flex: 5.34">
                        <div class="trow"
                          v-for="(itemSizeColor, indexSizeColor) in itemPro.colorSizeInfo"
                          :key="itemSizeColor.size_id + 'color' + indexSizeColor">
                          <div class="tcol">
                            {{ (itemSizeColor.size_name || '无数据') + '/' + (itemSizeColor.color_name || '无数据') }}
                          </div>
                          <div class="tcol">
                            {{ (itemSizeColor.size_info || '无数据') + '/' + (itemSizeColor.weight || 0) }}
                          </div>
                          <div class="tcol">{{ itemSizeColor.number }}</div>
                          <div class="tcol">{{ itemSizeColor.inspection_number }}</div>
                          <div class="tcol"
                            style="flex: 0.2">
                            <el-checkbox v-model="itemSizeColor.check"></el-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 5px; margin-top: 5px; display: flex; justify-content: flex-end; padding-right: 25px">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeParams">
          </el-pagination>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeAddOrder()">取消</span>
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
          <div class="btn backHoverBlue fr"
            @click="workSave">确认提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff, process, workshop, order } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
import DeliveryVisualization from '../deliveryVisualization.vue'
export default Vue.extend({
  components: { zhInput, DeliveryVisualization },
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
      showPopupLoading: false,
      openWindowKey: false,
      autoAssignSizeColor: false,
      reqTime: '',
      page: 1,
      limit: 10,
      total: 0,
      product_arr: [],
      staffList: [],
      orderList: [],
      outCiPin: false,
      searchLoading: false,
      idDone: false,
      checkAll: false,
      tabChoose: '',
      // 颜色尺码是否全选
      isCheckAllSizeColor: false,
      isCheckAllProcess: false,
      staffInfo: {},
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
      paramsArr: [],
      settlementLogList: [],
      chooseSettlementLogList: [],
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
      addOrder: false,
      showPrice: false,
      staffArr: [],
      departmentList: [],
      department: Number(this.$getLocalStorage('department')) || '',
      departmentName: ''
    }
  },
  methods: {
    init() {
      this.loading = true

      process.list({ type: 2 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[1].children.push({ label: item.name, value: item.name })
        })
      })

      process.list({ type: 3 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[2].children.push({ label: item.name, value: item.name })
        })
      })

      this.loading = false
    },
    contentHtml(content: string) {
      if (content === null) return ''
      // 富文本编辑器的内容如何只获得文字去掉标签
      // content = content.replace(/<[^>]+>/g, '')
      // 在上面的基础上还去掉了换行<br/>
      content = content.replace(/<[^>]+>/g, '').replace(/(\n)/g, '')
      return content
    },
    changeDepartment() {
      if (this.department === '') {
        this.$setLocalStorage('department', '')
        return
      }
      staff
        .departmentDetail({
          id: this.department
        })
        .then((res) => {
          this.departmentName = res.data.data.name
          staff
            .list({
              status: 1,
              department: res.data.data.name
            })
            .then((res) => {
              let arr = this.$clone(this.staffArr)
              res.data.data.forEach((item: any) => {
                this.staffArr.forEach((staff: any, index: number) => {
                  if (item.id === staff.id) {
                    this.$deleteItem(arr, index)
                  }
                })
              })
              this.staffList = res.data.data.concat(arr)
            })
        })
    },
    getChooseOrderList(
      item: any,
      settlementLogIndex: number,
      index: number,
      itemProIndex: number,
      indexDetail: number
    ) {
      let myDOM: any = eval('this.$refs.input' + settlementLogIndex + index + itemProIndex + indexDetail)[0]
      let value = myDOM.$el.querySelector('input').value
      if (value === '') return

      this.handleSelect(item, settlementLogIndex, index, indexDetail, index, settlementLogIndex, 2, value, indexDetail)
      this.paramsArr = [item, settlementLogIndex, index, indexDetail, index, settlementLogIndex, 2, value, indexDetail]
      myDOM.popperElm.style.display = 'none'
    },
    changeParams(e: any) {
      // @ts-ignore
      this.handleSelect(...this.paramsArr)
    },
    getProcessDesc(item: any) {
      process
        .list({
          name: item.process[1]
        })
        .then((res) => {
          if (res.data.status) {
            let str = item.process[1]
            item.processDesc = []
            if (!res.data.data.length) return

            let detailData = res.data.data.find((item: any) => {
              return item.name === str
            })

            if (detailData.process_desc) {
              detailData.process_desc.split(',').forEach((process_desc: any) => {
                item.processDesc.push({ label: process_desc, value: process_desc })
              })
            }
          } else {
            item.processDesc = []
          }
          this.$forceUpdate()
        })
    },
    closeAddOrder() {
      this.addOrder = false
      this.settlementLogList[this.lastOneChoose.settlementLogIndex].processInfo[
        this.lastOneChoose.itemIndex
      ].product_info[this.lastOneChoose.itemProIndex].order_code = ''
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
    checkDelete(item: any, itemProIndex: number) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          item.product_info.length > 1
            ? this.$deleteItem(item.product_info, itemProIndex)
            : this.$message.error('至少有一个订单')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteProcess(settlementLog: any, index: number) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          settlementLog.processInfo.length > 1
            ? this.$deleteItem(settlementLog.processInfo, index)
            : this.$message.error('至少有一道工序')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteStaff(settlementLogList: any, settlementLogIndex: number) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          settlementLogList.length > 1
            ? this.$deleteItem(settlementLogList, settlementLogIndex)
            : this.$message.error('至少有一个员工')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelect(
      item: any,
      settlementLogIndex: number,
      itemIndex: number,
      index: number,
      orderIndex: number,
      staffIndex: number,
      type = 1,
      product_code = '',
      indexDetail: number
    ) {
      this.loading = true
      if (this.isDone) return

      this.idDone = true
      this.lastOneChoose = {
        settlementLogIndex,
        itemIndex,
        itemProIndex: index
      }

      let params = {}
      if (type === 1) {
        item.product_info[index].order_code = this.orderList[orderIndex].value
        params = { keyword: item.product_info[index].order_code, page: 1, limit: 10 }
      } else if (type === 2) {
        params = { product_code: product_code, page: this.page, limit: this.limit }
      }

      order.simpleList(params).then((res) => {
        if (type === 1) {
          order.detail({ id: res.data.data.items[0].id }).then((ress) => {
            let data = ress.data.data
            this.productionScheduleUpdate = [
              {
                id: data.id,
                code: data.code,
                indexPro: index,
                indexOrder: orderIndex,
                indexStaff: staffIndex,
                system_code: data.system_code,
                product_info: []
              }
            ]
            data.time_data[0].batch_data[0].product_data.forEach((item: any) => {
              this.productionScheduleUpdate[0].product_info.push({
                product_code: item.product_code,
                desc: item.desc,
                product_id: item.product_id,
                name: item.name,
                img: item.image_data,
                category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
                colorSizeInfo: item.product_info
              })
            })
          })
        } else if (type === 2) {
          let data = res.data.data.items
          this.productionScheduleUpdate = []
          this.total = res.data.data.total

          data.forEach((items: any, index: number) => {
            this.productionScheduleUpdate.push({
              id: items.id,
              code: items.code,
              indexPro: index,
              indexOrder: orderIndex,
              indexStaff: staffIndex,
              order_type: items.order_type,
              system_code: items.system_code,
              product_info: []
            })
            items.product_data.forEach((item: any) => {
              this.productionScheduleUpdate[index].product_info.push({
                product_code: item.product_code,
                desc: item.desc,
                product_id: item.product_id,
                name: item.name,
                img: item.image_data,
                category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
                colorSizeInfo: item.product_info
              })
            })
          })
        }

        this.addOrder = true
        this.loading = false
        this.idDone = false
      })
    },
    selectStaff(id: number) {
      this.loading = true
      staff
        .detail({
          id: id
        })
        .then((res) => {
          if (res.data.status) {
            let arr = this.processList[0].children.map((item: any) => {
              return item.value
            })

            if (res.data.data.process) {
              arr = arr.concat(res.data.data.process.split('/'))
              arr = [...new Set(arr)]

              this.processList[0].children = arr.map((item: any) => {
                return { value: item, label: item }
              })
            }

            this.settlementLogList.forEach((item: any) => {
              if (item.staffId === id) {
                if (res.data.data.process) {
                  if (res.data.data.process.split('/').length === 1) {
                    item.processInfo.forEach((itemProcess: any) => {
                      itemProcess.process = [0, res.data.data.process]
                    })
                  }
                }
              }
            })
          }

          this.loading = false
        })
    },
    querySearchAsync(str: string) {
      this.searchLoading = true
      if (str === '' || str === undefined) {
        this.orderList = []
        return
      }
      order
        .simpleList({
          order_code: str
        })
        .then((res) => {
          if (res.data.status) {
            if (new Date(res.headers.date) > new Date(this.reqTime) || this.reqTime === '') {
              this.reqTime = res.headers.date
              let arr: any = []
              res.data.data.forEach((item: any) => {
                arr.push({ value: item.code, id: item.id, created_at: item.created_at, client_name: item.client_name })
              })
              this.orderList = arr
            }
          } else {
            this.orderList = []
          }
          this.searchLoading = false
        })
    },
    querySearchAsync1(str: string) {
      this.searchLoading = true
      if (str === '' || str === undefined) {
        this.orderList = []
        return
      }
      order
        .simpleList({
          product_code: str
        })
        .then((res) => {
          if (res.data.status) {
            if (new Date(res.headers.date) > new Date(this.reqTime) || this.reqTime === '') {
              this.reqTime = res.headers.date
              let arr: any = []
              res.data.data.forEach((item: any) => {
                item.product_data.forEach((itemPro: any) => {
                  if (itemPro.product_code.indexOf(str) != -1) {
                    let colorGroup = ''
                    itemPro.product_info.forEach((itemColor: any, index: number) => {
                      colorGroup += index + 1 + '.' + itemColor.color_name + '；'
                    })

                    arr.push({
                      value: item.code,
                      id: item.id,
                      created_at: item.created_at,
                      client_name: item.client_name,
                      colorGroup: colorGroup.slice(0, colorGroup.length - 1),
                      product_name: itemPro.product_code
                    })
                  }
                })
              })
              this.orderList = arr
            }
          } else {
            this.orderList = []
          }
          this.searchLoading = false
        })
    },
    copyUp() {
      let obj = this.$clone(this.settlementLogList[this.settlementLogList.length - 1])
      obj.staffCode = ''
      obj.staffId = ''
      obj.staffName = ''
      obj.processInfo.forEach((item: any) => {
        item.product_info.forEach((itemPro: any) => {
          itemPro.product_detail_info.forEach((itemDetailPro: any) => {
            itemDetailPro.sizeColorInfo.forEach((itemColor: any) => {
              itemColor.extra_number = ''
              itemColor.shoddy_number = ''
              itemColor.number = ''
              itemColor.shoddy_reason = []
            })
          })
        })
      })

      this.settlementLogList.push(obj)
    },
    checkAllOrder(e: any) {
      this.productionScheduleUpdate.forEach((items: any) => {
        items.product_info.forEach((item: any) => {
          item.colorSizeInfo.forEach((sizeColor: any) => {
            sizeColor.check = e
          })
        })
        this.$forceUpdate()
      })
    },
    confirmSubmit() {
      let arr: any = []

      this.productionScheduleUpdate.forEach((items: any, index: number) => {
        let haveTrue = false

        items.product_info.forEach((product_info: any) => {
          product_info.colorSizeInfo.forEach((color: any) => {
            if (color.check) product_info.check = true
            if (haveTrue || color.check) {
              haveTrue = true
            }
          })
        })

        if (!haveTrue) return
        arr.push({
          order_code: items.code,
          order_id: items.id,
          product_detail_info: []
        })
        items.product_info.forEach((product_info: any) => {
          let colorList: any = []

          if (!product_info.check) return
          arr[arr.length - 1].product_detail_info.push({
            code: product_info.product_code,
            product_id: product_info.product_id,
            sizeColorInfo: []
          })

          product_info.colorSizeInfo.forEach((color: any) => {
            colorList.push({
              name: (color.size_name || '无数据') + '/' + (color.color_name || '无数据'),
              value: color.size_id + ',' + color.color_id
            })
            color.colorList = colorList
            if (!color.check) return
            color.number = ''
            color.chooseId = color.size_id + ',' + color.color_id
            arr[arr.length - 1].product_detail_info[
              arr[arr.length - 1].product_detail_info.length - 1
            ].sizeColorInfo.push(color)
          })
        })

        this.settlementLogList[items.indexStaff].processInfo[items.indexOrder].product_info = arr
      })

      this.addOrder = false
      this.$forceUpdate()
    },
    workSave() {
      this.loading = true

      let params: {
        data: Array<{
          id: number | string | null
          staff_id: number | string
          order_id: number | string
          process_name: number | string
          process_type: number | string
          process_desc: string
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
        }>
      } = {
        data: []
      }

      this.settlementLogList.forEach((settlementLog: any) => {
        // console.log(settlementLog, 'settlementLog')
        settlementLog.processInfo.forEach((staffInfo: any) => {
          // console.log(staffInfo, 'staffInfo')
          staffInfo.product_info.forEach((product_info: any) => {
            if (product_info.order_code === '') return

            product_info.product_detail_info.forEach((product_detail_info: any) => {
              // console.log(product_detail_info, 'product_detail_info')
              product_detail_info.sizeColorInfo.forEach((sizeColorInfo: any) => {
                // console.log(sizeColorInfo, 'sizeColorInfo')
                params.data.push({
                  id: null,
                  order_id: product_info.order_id,
                  staff_id: settlementLog.staffId,
                  process_name: staffInfo.process[1],
                  process_type: staffInfo.process[0],
                  process_desc: staffInfo.process_desc.toString(),
                  extra_number: sizeColorInfo.extra_number || 0,
                  size_id: sizeColorInfo.size_id || 0,
                  color_id: sizeColorInfo.color_id || 0,
                  number: sizeColorInfo.number || 0,
                  shoddy_number: sizeColorInfo.shoddy_number || 0,
                  shoddy_reason: sizeColorInfo.shoddy_reason ? sizeColorInfo.shoddy_reason.toString() : '',
                  product_id: product_detail_info.product_id,
                  price: staffInfo.price || 0,
                  total_price: this.outCiPin
                    ? ((sizeColorInfo.number || 0) +
                        (sizeColorInfo.extra_number || 0) -
                        (sizeColorInfo.shoddy_number || 0)) *
                      (staffInfo.price || 0)
                    : ((sizeColorInfo.number || 0) + (sizeColorInfo.extra_number || 0)) * (staffInfo.price || 0),
                  complete_time: this.$GetDateStr(0)
                })
              })
            })
          })
        })
      })

      workshop.save(params).then((res) => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          this.$router.push('/workshopManagement/staffInputDetail?isAll=true')
        }
      })
      this.loading = false
    },
    changeKeyBoard(val: boolean) {
      localStorage.showWorkShopKeyBoard = val + ''
    }
  },
  mounted() {
    staff
      .departmentList({
        keyword: '',
        limit: ''
      })
      .then((res) => {
        if (res.data.status) {
          this.departmentList = res.data.data
          this.departmentName = res.data.data.find((res: any) => {
            return res.id == this.department
          })
          this.departmentName = this.departmentName?.name || ''
        }

        staff
          .list({
            status: 1,
            department: this.departmentName
          })
          .then((res) => {
            this.staffList = res.data.data
            // this.loading = false
          })
      })

    this.loading = true
    this.settlementLogList = []
    let _this = this
    let staffArr = JSON.parse(_this.$route.query.staffInfo + '')
    this.staffArr = staffArr.map((item: any) => {
      item.id = Number(item.id)
      return item
    })
    let arr: any = [
      {
        value: 0,
        label: '推荐工序',
        children: []
      },
      {
        value: 2,
        label: '半成品加工工序',
        children: []
      },
      {
        value: 3,
        label: '成品加工工序',
        children: []
      }
    ]
    let arr1: any = []

    if (staffArr.length === 0) {
      this.settlementLogList.push({
        staffName: '',
        staffCode: '',
        staffId: '',
        processInfo: [
          {
            process: [0, ''],
            product_info: [
              {
                order_code: '',
                product_detail_info: [
                  {
                    code: '',
                    sizeColorInfo: [
                      {
                        size_name: '',
                        color_name: '',
                        number: '',
                        extra_number: '',
                        shoddy_number: '',
                        shoddy_reason: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
    }

    staffArr.forEach((staff: any) => {
      if (staff.process) {
        let processArr = staff.process.split('/')
        if (processArr.length === 1) {
          this.settlementLogList.push({
            staffName: staff.name,
            staffCode: staff.code,
            staffId: +staff.id,
            processInfo: [
              {
                process: [0, processArr[0]],
                product_info: [
                  {
                    order_code: '',
                    product_detail_info: [
                      {
                        code: '',
                        sizeColorInfo: [
                          {
                            size_name: '',
                            color_name: '',
                            number: '',
                            extra_number: '',
                            shoddy_number: '',
                            shoddy_reason: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          })
        } else {
          this.settlementLogList.push({
            staffName: staff.name,
            staffCode: staff.code,
            staffId: +staff.id,
            processInfo: [
              {
                process: [0, ''],
                product_info: [
                  {
                    order_code: '',
                    product_detail_info: [
                      {
                        code: '',
                        sizeColorInfo: [
                          {
                            size_name: '',
                            color_name: '',
                            number: '',
                            extra_number: '',
                            shoddy_number: '',
                            shoddy_reason: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          })
        }
      } else {
        this.settlementLogList.push({
          staffName: staff.name,
          staffCode: staff.code,
          staffId: +staff.id,
          processInfo: [
            {
              process: [0, ''],
              product_info: [
                {
                  order_code: '',
                  product_detail_info: [
                    {
                      code: '',
                      sizeColorInfo: [
                        {
                          size_name: '',
                          color_name: '',
                          number: '',
                          extra_number: '',
                          shoddy_number: '',
                          shoddy_reason: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        })
      }

      staff.process.split('/').forEach((processs: any) => {
        if (processs !== '') {
          arr1.push(processs)
        }
      })
    })

    arr1 = [...new Set(arr1)]
    arr1.forEach((processs: string) => {
      arr[0].children.push({ label: processs, value: processs })
    })

    this.processList = arr

    this.init()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/staffDetail.less';
</style>
<style lang="less">
#workshopStaffDetail {
  .el-input__suffix {
    display: none;
  }

  .zhInputCtn {
    .zhInputBox {
      height: 38px;
    }
  }

  .detailCtn {
    background: white;
    margin: 20px 0;
  }

  .tbody {
    .zhInputCtn {
      .zhInputBox {
        .zhInput {
          border: 0;
        }
      }
    }
  }

  .tbody {
    .el-input .el-input__inner {
      border: 0;
      padding: 0;
    }
  }
  .cpyy .el-input__inner {
    padding-right: 0;
    border: 0;
  }

  .closeCtn {
    cursor: pointer;
    width: 20px;
    height: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #2e394f;
    &:hover {
      background: #737375;
    }
  }

  .backHoverRed {
    color: #fff;
    background: #f5222d;
    &:hover {
      background: #fd5b63;
    }
  }

  .el-select__input {
    margin-left: 0;
  }
}

.el-select-dropdown__item {
  height: unset;
  overflow: unset;
}
</style>