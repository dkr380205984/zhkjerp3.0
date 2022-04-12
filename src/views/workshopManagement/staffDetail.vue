<template>
  <div id="workshopStaffDetail" class="bodyContainer" v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">下单信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">员工姓名：</div>
            <div class="text">{{ staffInfo.name }}</div>
          </div>
          <div class="col">
            <div class="label">员工编号：</div>
            <div class="text">{{ staffInfo.code }}</div>
          </div>
        </div>
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
    <div class="module" v-for="(item, index) in settlementLogList" :key="'process' + index">
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">负责工序：</div>
            <div class="text">
              <el-select v-model="item.process" filterable placeholder="加工工序" @change="getProcessDesc(item)">
                <el-option v-for="item in processList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">工序说明：</div>
            <div class="text">
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
          </div>
          <div class="col">
            <div class="label">结算单价：</div>
            <div class="text" style="height: 38px">
              <zh-input v-model="item.price" placeholder="请输入结算单价" :keyBoard="keyBoard" type="number"></zh-input>
            </div>
          </div>
        </div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol" style="flex: 0.2; text-align: center">
              <el-checkbox v-model="isCheckAllSizeColor" @change="chooseAllSizeColor"></el-checkbox>
            </div>
            <div class="tcol">订单号</div>
            <div class="tcol noPad" style="flex: 8.7">
              <div class="trow">
                <div class="tcol">产品编号</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">完成数量</div>
                <div class="tcol">额外数量</div>
                <div class="tcol">次品数量</div>
                <div class="tcol">次品原因</div>
              </div>
            </div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow" v-for="(itemPro, itemProIndex) in item.product_info" :key="itemProIndex">
            <div class="tcol" style="flex: 0.2; text-align: center">
              <el-checkbox v-model="isCheckAllSizeColor" @change="chooseAllSizeColor"></el-checkbox>
            </div>
            <div class="tcol">
              <el-autocomplete
                v-model="itemPro.order_code"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入订单号"
                @select="handleSelect(item, itemProIndex, index)"
              ></el-autocomplete>
            </div>
            <div class="tcol noPad" style="flex: 8.7">
              <div
                class="trow"
                v-for="(itemDetail, indexDetail) in itemPro.product_detail_info"
                :key="indexDetail + 'indexDetail'"
              >
                <div class="tcol">
                  <el-input v-model="itemDetail.code" placeholder="请输入产品编号"></el-input>
                </div>
                <div class="tcol noPad" style="flex: 5.7">
                  <div
                    class="trow"
                    v-for="(itemSizeColor, indexSizeColor) in itemDetail.sizeColorInfo"
                    :key="indexSizeColor + 'indexSizeColor'"
                  >
                    <div class="tcol" style="display: block; line-height: 2.9">
                      {{ itemSizeColor.size_name || '无数据' }}/{{ itemSizeColor.color_name || '无数据' }}
                      <i
                        class="el-icon-circle-plus-outline"
                        style="cursor: pointer"
                        @click="
                          $addItem(itemDetail.sizeColorInfo, {
                            size_name: '',
                            color_name: '',
                            number: '',
                            extra_number: '',
                            shoddy_number: '',
                            shoddy_reason: []
                          })
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
            <div
              class="tcol hoverBlue"
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
              添加下一组
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="overflow: hidden">
      <div
        class="btn backHoverBlue fr"
        @click="
          $addItem(settlementLogList, {
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
                  <div class="tcol bgGray">系统编号</div>
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
          <div class="btn backHoverBlue fr">确认提交</div>
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
      addOrder: false,
      showPrice: false,
      priceProcessList: [] // 报价单报价信息
    }
  },
  methods: {
    init() {
      this.loading = true
      this.processList = ['针织织造', '梭织织造', '制版费']
      this.order_id = this.$route.query.id

      process.list({ type: 2 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList.push(item.name)
        })
        process.list({ type: 3 }).then((res) => {
          res.data.data.forEach((item: any) => {
            this.processList.push(item.name)
          })

          this.processList = [...new Set(this.processList)]
          this.processList.forEach((item: any, index: any) => {
            this.processList[index] = { label: item, value: item }
          })
        })
      })

      this.loading = false
    },
    getProcessDesc(item: any) {
      process.list({ name: item.process }).then((res) => {
        if (res.data.status) {
          item.processDesc = []
          if (!res.data.data.length) return
          res.data.data[0].process_desc.split(',').forEach((process_desc: any) => {
            item.processDesc.push({ label: process_desc, value: process_desc })
          })
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
    chooseWorkerProcess(bol: any) {
      this.processWorkerList.forEach((processWorkerItem: any) => {
        if (processWorkerItem.process_name === this.tabChoose) {
          processWorkerItem.info.forEach((staffNameItem: any) => {
            staffNameItem.info.forEach((productCodeItem: any) => {
              productCodeItem.info.forEach((process_desc: any) => {
                process_desc.process_desc = process_desc.process_desc.split(',')
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
    handleSelect(item: any, index: number, orderIndex: number) {
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
                code: data.code,
                checkAll: false,
                indexPro: index,
                indexOrder: orderIndex,
                system_code: data.system_code,
                product_info: []
              }
            ]
            data.time_data[0].batch_data[0].product_data.forEach((item: any) => {
              this.productionScheduleUpdate[0].product_info.push({
                product_code: item.product_code,
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
    querySearchAsync(str: string, cb: any) {
      if (str === '' || str === undefined) {
        cb([])
        return
      }
      order
        .simpleList({
          keyword: str
        })
        .then((res) => {
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              arr.push({ value: item.code, id: item.id })
            })
            cb(arr)
          } else {
            cb([])
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
          product_detail_info: []
        }
      ]

      this.productionScheduleUpdate[0].product_info.forEach((product_info: any) => {
        if (!product_info.check) return
        arr[0].product_detail_info.push({
          code: product_info.product_code,
          sizeColorInfo: []
        })

        product_info.colorSizeInfo.forEach((color: any) => {
          if (!color.check) return
          color.number = ''
          arr[0].product_detail_info[arr[0].product_detail_info.length - 1].sizeColorInfo.push(color)
        })
      })

      if (this.productionScheduleUpdate[0].indexPro === 0) {
        this.settlementLogList[this.productionScheduleUpdate[0].indexOrder].product_info = arr
      } else {
        this.settlementLogList[this.productionScheduleUpdate[0].indexOrder].product_info[this.productionScheduleUpdate[0].indexPro] = arr[0]
      }

      this.addOrder = false
      this.$forceUpdate()
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
    this.settlementLogList = []
    staff.detail({ id: this.$route.query.id + '' }).then((res) => {
      this.staffInfo = res.data.data
      this.settlementLogList.push({
        process: this.staffInfo.process,
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
      this.getProcessDesc(this.settlementLogList[0])
      this.init()
    })
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
}
</style>