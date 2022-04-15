<template>
  <div id="workshopStaffDetail" class="bodyContainer" v-loading="loading">
    <div class="module clearfix">
      <div class="detailCtn">
        <el-checkbox v-model="outCiPin"
          >结算工资去除次品数量
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              勾选前，工资计算公式 = 结算单价 * （完成数量 + 额外数量）<br />勾选后，工资计算公式 = 结算单价 *
              （完成数量 + 额外数量 - 次品数量）
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-checkbox>
        <el-checkbox v-model="keyBoard" @change="changeKeyBoard">打开页面键盘</el-checkbox>
      </div>
    </div>
    <div v-for="(settlementLog, settlementLogIndex) in settlementLogList" :key="'process' + settlementLogIndex">
      <div class="module">
        <div class="detailCtn" style="margin-bottom: 0; padding-bottom: 0">
          <div class="row">
            <div class="col">
              <div class="label" style="width: unset; margin-right: 10px">{{ settlementLogIndex + 1 }}</div>
              <div class="label">员工姓名：</div>
              <div class="text">
                <el-select v-model="settlementLog.staffId" filterable placeholder="请选择员工" @change="selectStaff">
                  <el-option
                    v-for="(staff, StaffIndex) in staffList"
                    :key="StaffIndex + 'StaffIndex'"
                    :label="staff.code.substr(staff.code.length - 4, staff.code.length) + ' ' + staff.name"
                    :value="staff.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div
                class="btn backHoverRed"
                style="margin-left: 20px; display: flex; align-items: center"
                @click="
                  settlementLogList.length > 1
                    ? $deleteItem(settlementLogList, settlementLogIndex)
                    : $message.error('至少有一个员工')
                "
              >
                <!-- <div class="closeCtn">
                  <span class="el-icon-close" style="cursor: pointer"></span>
                </div> -->
                删除员工
              </div>
              <div
                class="btn backHoverBlue"
                style="margin-left: 20px; display: flex; align-items: center"
                @click="
                  $addItem(settlementLog.processInfo, {
                    process: '',
                    product_info: [
                      {
                        code: '',
                        product_detail_info: [
                          {
                            order_code: '',
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
                "
              >
                添加下个工序
              </div>
            </div>
          </div>
        </div>
        <div class="tableCtn" v-for="(item, index) in settlementLog.processInfo" :key="'process' + index">
          <div class="tbody" style="border-top: 1px solid #e9e9e9">
            <div class="trow">
              <div class="tcol bgGray">负责工序</div>
              <div class="tcol">
                <el-cascader
                  v-model="item.process"
                  filterable
                  :options="processList"
                  :show-all-levels="false"
                  clearable
                  @change="getProcessDesc(item)"
                ></el-cascader>
                <!-- <el-select v-model="item.process" filterable placeholder="加工工序" @change="getProcessDesc(item)">
                  <el-option v-for="item in processList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select> -->
              </div>
              <div class="tcol bgGray">工序说明</div>
              <div class="tcol">
                <el-select
                  v-model="item.process_desc"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  collapse-tags
                  placeholder="请选择填写工序说明"
                >
                  <el-option
                    v-for="itemSon in item.processDesc"
                    :key="itemSon.value"
                    :label="itemSon.label"
                    :value="itemSon.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="tcol bgGray">结算单价</div>
              <div class="tcol">
                <zh-input
                  v-model="item.price"
                  placeholder="请输入结算单价"
                  :keyBoard="keyBoard"
                  type="number"
                ></zh-input>
              </div>
              <div class="tcol" style="flex: 0.1">
                <div class="closeCtn backHoverRed">
                  <span
                    class="el-icon-close"
                    style="cursor: pointer"
                    @click="
                      settlementLog.processInfo.length > 1
                        ? $deleteItem(settlementLog.processInfo, index)
                        : $message.error('至少有一道工序')
                    "
                  ></span>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray" style="flex: 0.3; text-align: center">序号</div>
              <div class="tcol bgGray">
                <div>
                  订单号
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">也可以通过产品编号进行搜索</div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="tcol noPad" style="flex: 8.7">
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
            <div class="trow" v-for="(itemPro, itemProIndex) in item.product_info" :key="itemProIndex">
              <div class="tcol" style="flex: 0.3; text-align: center">
                {{ itemProIndex + 1 }}
              </div>
              <div class="tcol">
                <!-- <el-autocomplete
                  style="width: 200px"
                  v-model="itemPro.order_code"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="订单号/产品编号"
                  :debounce="3000"
                  @select="handleSelect(item, itemProIndex, index, settlementLogIndex)"
                >
                  <template slot-scope="{ item }">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                      订单名称：{{ item.value }}
                    </div>
                    <span>创建时间：{{ item.created_at }}</span>
                  </template>
                </el-autocomplete> -->
                <el-select
                  v-model="itemPro.order_code"
                  filterable
                  remote
                  placeholder="订单号/产品编号"
                  :remote-method="querySearchAsync"
                >
                  <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                      订单名称：{{ item.value }}
                    </div>
                    <div>创建时间：{{ item.created_at }}</div>
                  </el-option>
                </el-select>
              </div>
              <div class="tcol noPad" style="flex: 8.7">
                <div
                  class="trow"
                  v-for="(itemDetail, indexDetail) in itemPro.product_detail_info"
                  :key="indexDetail + 'indexDetail'"
                >
                  <div class="tcol">
                    <!-- <el-input v-model="itemDetail.code" placeholder="请输入产品编号"></el-input> -->
                    {{ itemDetail.code || '暂无产品编号' }}
                  </div>
                  <div class="tcol noPad" style="flex: 5.7">
                    <div
                      class="trow"
                      v-for="(itemSizeColor, indexSizeColor) in itemDetail.sizeColorInfo"
                      :key="indexSizeColor + 'indexSizeColor'"
                    >
                      <div class="tcol" style="display: block; position: relative">
                        <el-select
                          v-model="itemSizeColor.chooseId"
                          placeholder="请选择尺码颜色"
                          @change="$forceUpdate()"
                        >
                          <el-option
                            v-for="(colorItem, colorIndex) in itemSizeColor.colorList"
                            :key="colorItem.size_id + ',' + colorItem.color_id + colorIndex"
                            :label="colorItem.name"
                            :value="colorItem.value"
                          >
                          </el-option>
                        </el-select>
                        <!-- {{ itemSizeColor.size_name || '无数据' }}/{{ itemSizeColor.color_name || '无数据' }} -->
                        <i
                          class="el-icon-circle-plus-outline"
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
                          "
                        ></i>
                        <i
                          class="el-icon-remove-outline"
                          style="cursor: pointer; position: absolute; right: 5%; top: 30%"
                          @click="
                            itemDetail.sizeColorInfo.length > 1
                              ? $deleteItem(itemDetail.sizeColorInfo, indexSizeColor)
                              : $message.error('至少有一个产品颜色')
                          "
                        ></i>
                      </div>
                      <div class="tcol">
                        <zh-input
                          v-model="itemSizeColor.number"
                          placeholder="请输入完成数量"
                          :keyBoard="keyBoard"
                          type="number"
                        ></zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input
                          v-model="itemSizeColor.extra_number"
                          placeholder="请输入额外数量"
                          :keyBoard="keyBoard"
                          type="number"
                        ></zh-input>
                      </div>
                      <div class="tcol">
                        <zh-input
                          v-model="itemSizeColor.shoddy_number"
                          placeholder="请输入结算单价"
                          :keyBoard="keyBoard"
                          type="number"
                        ></zh-input>
                      </div>
                      <div class="tcol cpyy" style="overflow-y: scroll">
                        <el-select
                          v-model="itemSizeColor.shoddy_reason"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          collapse-tags
                          placeholder="请选择次品原因"
                        >
                          <el-option
                            v-for="item in substandardReason"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tcol">
                <div>
                  <span
                    class="hoverBlue"
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
                    "
                  >
                    添加
                  </span>
                  <span
                    class="hoverRed"
                    style="cursor: pointer"
                    @click="
                      item.product_info.length > 1
                        ? $deleteItem(item.product_info, itemProIndex)
                        : $message.error('至少有一个订单')
                    "
                  >
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
      <div
        class="btn backHoverBlue fr"
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
                    code: '',
                    product_detail_info: [
                      {
                        order_code: '',
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
        "
      >
        添加下个员工
      </div>
    </div>
    <!-- 生产进度 -->
    <div class="popup" v-show="addOrder" v-loading="showPopupLoading" element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加订单</span>
          <div class="closeCtn">
            <span class="el-icon-close" @click="addOrder = false"></span>
          </div>
        </div>
        <div class="contentCtn" style="padding-top: 15px">
          <div class="editCtn packOrder" v-for="(item, index) in productionScheduleUpdate" :key="index">
            <div class="tableCtn">
              <div class="tbody hasTop">
                <div class="trow">
                  <div class="tcol">系统编号</div>
                  <div class="tcol bgGray">订单号</div>
                  <div class="tcol bgGray">产品编号</div>
                  <div class="tcol bgGray">产品品类</div>
                  <div class="tcol bgGray">产品名称</div>
                  <div class="tcol bgGray">产品图片</div>
                  <div class="tcol bgGray">尺码颜色</div>
                  <div class="tcol bgGray">计划生产数量</div>
                  <div class="tcol bgGray">检验入库数量</div>
                  <div class="tcol bgGray" style="flex: 0.2">
                    <el-checkbox v-model="item.checkAll" @change="checkAllOrder(item)"></el-checkbox>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">{{ item.system_code }}</div>
                  <div class="tcol">{{ item.code }}</div>
                  <div class="tcol noPad" style="flex: 8.82">
                    <div class="trow" v-for="(itemPro, indexPro) in item.product_info" :key="indexPro + 'pro'">
                      <div class="tcol">{{ itemPro.product_code }}</div>
                      <div class="tcol">
                        {{ itemPro.category }}
                      </div>
                      <div class="tcol">{{ itemPro.name }}</div>
                      <div class="tcol">
                        <el-image
                          :src="itemPro.img ? itemPro.img : require('@/assets/image/common/noPic.png')"
                        ></el-image>
                      </div>
                      <div class="tcol noPad" style="flex: 4.005">
                        <div
                          class="trow"
                          v-for="(itemSizeColor, indexSizeColor) in itemPro.colorSizeInfo"
                          :key="itemSizeColor.size_id + 'color' + indexSizeColor"
                        >
                          <div class="tcol">
                            {{ (itemSizeColor.size_name || '无数据') + '/' + (itemSizeColor.color_name || '无数据') }}
                          </div>
                          <div class="tcol">{{ itemSizeColor.number }}</div>
                          <div class="tcol">{{ itemSizeColor.inspection_number }}</div>
                          <div class="tcol" style="flex: 0.2">
                            <el-checkbox v-model="itemSizeColor.check" @change="$forceUpdate()"></el-checkbox>
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
        <div class="oprCtn">
          <span class="btn borderBtn" @click="addOrder = false">取消</span>
          <span class="btn backHoverBlue" @click="confirmSubmit">确认提交</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue fr" @click="workSave">确认提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff, process, workshop, order } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
export default Vue.extend({
  components: { zhInput },
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
      product_arr: [],
      staffList: [],
      orderList: [],
      outCiPin: false,
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
      priceProcessList: [] // 报价单报价信息
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
    handleSelect(item: any, index: number, orderIndex: number, staffIndex: number) {
      this.loading = true
      order
        .simpleList({
          keyword: item.product_info[index].order_code
        })
        .then((res) => {
          order.detail({ id: res.data.data[0].id }).then((ress) => {
            let data = ress.data.data
            this.productionScheduleUpdate = [
              {
                id: data.id,
                code: data.code,
                checkAll: false,
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
                product_id: item.product_id,
                name: item.name,
                img: item.image_data.length > 0 ? item.image_data[0] : '',
                category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
                colorSizeInfo: item.product_info
              })
            })
            this.addOrder = true
            this.loading = false
          })
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

            arr = arr.concat(res.data.data.process.split('/'))
            arr = [...new Set(arr)]

            this.processList[0].children = arr.map((item: any) => {
              return { value: item, label: item }
            })
          }

          this.loading = false
        })
      // this.settlementLogList[index].staffId = this.settlementLogList[index].staffInfo.id
      // this.settlementLogList[index].staffCode = this.settlementLogList[index].staffInfo.code
      // this.settlementLogList[index].staffName = this.settlementLogList[index].staffInfo.name
    },
    querySearchAsync(str: string) {
      if (str === '' || str === undefined) {
        this.orderList = []
        return
      }
      order
        .simpleList({
          keyword: str
        })
        .then((res) => {
          if (res.data.status) {
            console.log()
            if (new Date(res.headers.date) > new Date(this.reqTime) || this.reqTime === '') {
              this.reqTime = res.headers.date
              let arr: any = []
              res.data.data.forEach((item: any) => {
                arr.push({ value: item.code, id: item.id, created_at: item.created_at })
              })
              this.orderList = arr
            }
          } else {
            this.orderList = []
          }
        })
    },
    checkAllOrder(items: any) {
      items.product_info.forEach((item: any) => {
        item.colorSizeInfo.forEach((sizeColor: any) => {
          sizeColor.check = items.checkAll
        })
      })
      this.$forceUpdate()
    },
    confirmSubmit() {
      let haveTrue = false

      this.productionScheduleUpdate[0].product_info.forEach((product_info: any) => {
        product_info.colorSizeInfo.forEach((color: any) => {
          if (color.check) product_info.check = true
          if (haveTrue || color.check) {
            haveTrue = true
          }
        })
      })

      if (!haveTrue) return

      let arr: any = [
        {
          order_code: this.productionScheduleUpdate[0].code,
          order_id: this.productionScheduleUpdate[0].id,
          product_detail_info: []
        }
      ]

      this.productionScheduleUpdate[0].product_info.forEach((product_info: any) => {
        let colorList: any = []

        if (!product_info.check) return
        arr[0].product_detail_info.push({
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
          arr[0].product_detail_info[arr[0].product_detail_info.length - 1].sizeColorInfo.push(color)
        })
      })

      if (this.productionScheduleUpdate[0].indexPro === 0) {
        this.settlementLogList[this.productionScheduleUpdate[0].indexStaff].processInfo[
          this.productionScheduleUpdate[0].indexOrder
        ].product_info = arr
      } else {
        this.settlementLogList[this.productionScheduleUpdate[0].indexStaff].processInfo[
          this.productionScheduleUpdate[0].indexOrder
        ].product_info[this.productionScheduleUpdate[0].indexPro] = arr[0]
      }

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
        console.log(settlementLog, 'settlementLog')
        settlementLog.processInfo.forEach((staffInfo: any) => {
          console.log(staffInfo, 'staffInfo')
          staffInfo.product_info.forEach((product_info: any) => {
            if (product_info.order_code === '') return

            product_info.product_detail_info.forEach((product_detail_info: any) => {
              console.log(product_detail_info, 'product_detail_info')
              product_detail_info.sizeColorInfo.forEach((sizeColorInfo: any) => {
                console.log(sizeColorInfo, 'sizeColorInfo')
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
                    : ((sizeColorInfo.complete_number || 0) + (sizeColorInfo.extra_number || 0)) *
                      (staffInfo.price || 0),
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
          location.reload()
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
      .list({
        status: 1
      })
      .then((res) => {
        this.staffList = res.data.data
        // this.loading = false
      })

    this.loading = true
    this.settlementLogList = []
    let _this = this
    let staffArr = JSON.parse(_this.$route.query.staffInfo + '')
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