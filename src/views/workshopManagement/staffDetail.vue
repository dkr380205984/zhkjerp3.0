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
            <div class="text">{{ $route.query.name }}</div>
          </div>
          <div class="col">
            <div class="label">员工编号：</div>
            <div class="text">{{ $route.query.code }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" v-for="(item, index) in settlementLogList" :key="'process' + index">
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">负责工序：</div>
            <div class="text">
              <el-cascader
                v-model="item.chooseProcess"
                :options="processList"
                :show-all-levels="false"
                placeholder="加工工序"
              ></el-cascader>
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
                placeholder="请选择工序说明"
              >
                <el-option v-for="item in processDescList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">结算单价：</div>
            <div class="text">
                <el-input v-model="item.price"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 生产进度 -->
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
import { order, process, workshop } from '@/assets/js/api'
export default Vue.extend({
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
          let _this = this
          items.allProcessDesc.split(',').forEach((item: any) => {
            _this.processDescList.push({ value: item })
          })
        })
        this.processWorkerList = res.data.data
        this.tabChoose = res.data.data[0]?.process_name
      })

      workshop.list({ staff_id: this.$route.query.id + '' }).then((res) => {
        let processArr: any = []
        let processListArr: any = []
        res.data.data.forEach((item: any) => {
          processArr.push(item.process_name)
        })

        processArr = [...new Set(processArr)]

        res.data.data.forEach((item: any) => {
          processArr.forEach((processItem: any) => {
            if (item.process_name === processItem) {
              let a = processListArr.find((items: any) => {
                return items.process_name === processItem
              })
              if (a === undefined) {
                processListArr.push({
                  process_name: processItem,
                  process_type: item.process_type,
                  process_desc: '',
                  chooseProcess: [+item.process_type || 0, processItem],
                  info: [item]
                })
              } else {
                a.info.push(item)
              }
            }
          })
        })

        processListArr.forEach((items: any) => {
          items.info.forEach((item: any) => {
            if (!item.process_desc) return
            this.processDescList.push(item.process_desc)
          })
        })

        this.processDescList = [...new Set(this.processDescList)]

        this.processDescList.forEach((item: any, index: number) => {
          this.processDescList[index] = { value: item, label: item }
        })

        this.settlementLogList = processListArr
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
          this.processList.unshift({
            label: '织造工序',
            value: 0,
            children: [
              { label: '针织织造', value: '针织织造', process_desc: '' },
              { label: '梭织织造', value: '梭织织造', process_desc: '' },
              { label: '制版费', value: '制版费', process_desc: '' }
            ]
          })
        })
      })

      this.loading = false
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
              process_desc: items.process_desc ? items.process_desc.toString() : '',
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
  .el-select__input {
    margin-left: 0;
  }
}
</style>