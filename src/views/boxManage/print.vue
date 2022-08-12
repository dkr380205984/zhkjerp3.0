<template>
  <div class="printContainer"
    id="packPrintOrder">
    <div class="printContainer"
      @click="showMenu = false"
      @click.right="handleClickRight">
      <div class="pmain crosswise">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title: company_name + '装箱出库单'}}</div>
            <div class="prow">
              <div class="pcol wa">
                <div class="label">单据编号：</div>
                <div class="info"
                  style="white-space: nowrap;">{{boxInfo.code}}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol wa"
                style="width:auto">
                <div class="label">创建信息：</div>
                <div class="info"
                  style="white-space: nowrap;">{{ boxInfo.created_at?boxInfo.created_at.slice(0, 10):'' }}{{boxInfo.user_name?'，' + boxInfo.user_name:''}}{{boxInfo.user_phone?'，' + boxInfo.user_phone:''}}</div>
              </div>
            </div>
          </div>
          <div class="fr">
            <div class="pImage">
              <img :src="qrCodePCUrl"
                alt="" />
              <span class="imgText">扫一扫打开电脑端系统</span>
            </div>
            <div class="pImage">
              <img :src="qrCodeWXUrl"
                alt="" />
              <span class="imgText">使用织为云工厂小程序扫一扫</span>
            </div>
          </div>
        </div>
        <div class="pbody">
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol bgGray headTitle">单据编号</div>
                <div class="tcol">{{boxInfo.code}}</div>
                <div class="tcol bgGray headTitle">运输城市</div>
                <div class="tcol">{{boxInfo.city}}</div>
                <div class="tcol bgGray headTitle">运输地址</div>
                <div class="tcol">{{boxInfo.address}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">运输单位</div>
                <div class="tcol">{{boxInfo.client_name}}</div>
                <div class="tcol bgGray headTitle">总毛重</div>
                <div class="tcol">{{boxInfo.total_gross_weight}}kg</div>
                <div class="tcol bgGray headTitle">总净重</div>
                <div class="tcol">{{boxInfo.total_net_weight}}kg</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">总体积</div>
                <div class="tcol">{{boxInfo.code}}m³</div>
                <div class="tcol bgGray headTitle">总箱数</div>
                <div class="tcol">{{boxInfo.total_box}}箱</div>
                <div class="tcol bgGray headTitle">额外费用</div>
                <div class="tcol">{{boxInfo.others_fee}}元</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">运输单价</div>
                <div class="tcol">{{boxInfo.price}}元/m³</div>
                <div class="tcol bgGray headTitle">运输体积价</div>
                <div class="tcol">{{boxInfo.price_bulk}}元</div>
                <div class="tcol bgGray headTitle">运输总价</div>
                <div class="tcol">{{boxInfo.total_price}}元</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            v-for="item in packPlanLogCopy"
            :key="item.id">
            <div class="thead">
              <div class="trow">
                <div class="tcol">计划单号</div>
                <div class="tcol">订单号</div>
                <div class="tcol noPad"
                  style="flex:8">
                  <div class="trow">
                    <div class="tcol noPad"
                      style="flex:4">
                      <div class="trow">
                        <div class="tcol">产品</div>
                        <div class="tcol">尺码颜色</div>
                        <div class="tcol">计划装箱数量</div>
                        <div class="tcol">实际装箱数量</div>
                      </div>
                    </div>
                    <div class="tcol"
                      style="flex:0.5">总箱数</div>
                    <div class="tcol"
                      style="flex:0.5">总毛重</div>
                    <div class="tcol"
                      style="flex:0.5">总净重</div>
                    <div class="tcol"
                      style="flex:0.5">总体积</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcol">{{item.code}}</div>
                <div class="tcol">{{item.order_code}}</div>
                <div class="tcol noPad"
                  style="flex:8">
                  <div class="trow"
                    v-for="(itemData,indexData) in item.data"
                    :key="indexData">
                    <div class="tcol noPad"
                      style="flex:4">
                      <div class="trow"
                        v-for="(itemPro,indexPro) in itemData.product_info"
                        :key="indexPro">
                        <div class="tcol">
                          <span>{{itemPro.product_code}}</span>
                          <span>{{itemPro.category}}/{{itemPro.secondary_category}}</span>
                        </div>
                        <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                        <div class="tcol">{{itemPro.pack_number_all}}</div>
                        <div class="tcol">{{itemPro.transport_number}}</div>
                      </div>
                    </div>
                    <div class="tcol"
                      style="flex:0.5">{{itemData.total_box_count}}箱</div>
                    <div class="tcol"
                      style="flex:0.5">{{itemData.total_gross_weight}}kg</div>
                    <div class="tcol"
                      style="flex:0.5">{{itemData.total_net_weight}}kg</div>
                    <div class="tcol"
                      style="flex:0.5">{{itemData.total_bulk}}m³</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-for="itemOrder in orderInfoCopy"
            :key="itemOrder.id">
            <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
              v-for="(itemBatch,itemBatchIndex) in itemOrder.time_data[0].batch_data"
              :key="itemBatch.id">
              <div class="tableCtn noPadBtm"
                style="padding-left:0;padding-right:0">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">订单/批次</div>
                    <div class="tcol">发货时间</div>
                    <div class="tcol noPad"
                      style="flex:4.7">
                      <div class="trow">
                        <div class="tcol">产品品类</div>
                        <div class="tcol noPad"
                          style="flex:3">
                          <div class="trow">
                            <div class="tcol">尺码颜色</div>
                            <div class="tcol">计划发货数量</div>
                            <div class="tcol">实际发货数量</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tcol">箱数</div>
                    <div class="tcol">总毛重kg</div>
                    <div class="tcol">总净重kg</div>
                    <div class="tcol">总体积m³</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow">
                    <div class="tcol">
                      <span>{{itemOrder.code}}</span>
                      <span>第{{itemBatch.batch_number}}批</span>
                    </div>
                    <div class="tcol">
                      <span>{{itemBatch.delivery_time}}</span>
                    </div>
                    <div class="tcol noPad"
                      style="flex:4.7">
                      <div class="trow"
                        v-for="itemPro in itemBatch.product_data"
                        :key="itemPro.id">
                        <div class="tcol">
                          <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                          <span>({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                        </div>
                        <div class="tcol noPad"
                          style="flex:3">
                          <div class="trow"
                            v-for="(itemChild,indexChild) in itemPro.product_info"
                            :key="indexChild">
                            <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                            <div class="tcol">{{itemChild.number}}</div>
                            <div class="tcol">
                              {{itemChild.real_number}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tcol">
                      {{itemBatch.total_box_count}}
                    </div>
                    <div class="tcol">
                      {{itemBatch.total_gross_weight}}
                    </div>
                    <div class="tcol">
                      {{itemBatch.total_net_weight}}
                    </div>
                    <div class="tcol">
                      {{itemBatch.total_bulk}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting_sign_style"
        v-if="showMenu"
        :style="`left:${X_position || 0}px;top:${Y_position}px`"
        @click.stop>
        <div class="setting_item"
          @click="windowMethod(1)">刷新页面</div>
        <div class="setting_item"
          @click="windowMethod(2)">打印</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { boxManage } from '@/assets/js/api'
import { BoxInfo } from '@/types/boxManage'
import { PackPlanInfo } from '@/types/packManage'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    boxInfo: BoxInfo
    packPlanLog: Array<{
      transport_info: string // 记录一个字符串保存N多信息
      plan_id: number | string
      plan_info: PackPlanInfo
    }>
    packPlanLogCopy: PackPlanInfo[]
    [propName: string]: any
  } {
    return {
      packPlanLogCopy: [], // 前端保存的发货单具体信息，只能看，不能做任何操作
      packPlanLog: [],
      batchInfo: [],
      orderBatchCopy: [], // 前端保存的订单发货具体信息，只能看，不能做任何操作
      boxInfo: {
        id: '',
        code: '',
        user_name: '',
        created_at: '',
        rel_plan: [],
        client_id: '',
        tree_data: [],
        city: '',
        address: '',
        total_box: '',
        total_gross_weight: '',
        total_net_weight: '',
        total_bulk: '',
        price: '',
        others_fee: '',
        total_price: '',
        price_bulk: '',
        transport_number_data: [
          {
            order_product_info_id: '',
            transport_number: ''
          }
        ]
      },
      loading: true,
      showMenu: false,
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      settingFlag: false,
      title: '',
      descArr: [''] // 注意事项
    }
  },
  methods: {
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: number) {
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          this.showMenu = false
          setTimeout(() => {
            window.print()
          }, 100)
        }
      })
    }
  },
  mounted() {
    boxManage
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.boxInfo = res.data.data
          // @ts-ignore
          this.packPlanLog = this.boxInfo.rel_plan
          this.packPlanLog.forEach((itemPack) => {
            itemPack.transport_info = JSON.parse(itemPack.transport_info)
            itemPack.plan_info.data.forEach((itemData) => {
              itemData.total_box_count = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.box_count)
              }, 0)
              itemData.total_bulk = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_bulk)
              }, 0)
              itemData.total_gross_weight = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_gross_weight)
              }, 0)
              itemData.total_net_weight = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_net_weight)
              }, 0)
              itemData.product_info.forEach((itemPro) => {
                itemPro.pack_number_all = 0
                itemData.info_data.forEach((itemInfo) => {
                  itemInfo.product_info.forEach((itemChild) => {
                    if (
                      itemChild.product_id === itemPro.product_id &&
                      itemChild.size_id === itemPro.size_id &&
                      itemChild.color_id === itemPro.color_id
                    ) {
                      itemPro.pack_number_all =
                        Number(itemPro.pack_number_all) + Number(itemChild.pack_number) * Number(itemInfo.box_count)
                    }
                  })
                })
              })
            })
          })
          // @ts-ignore
          this.packPlanLogCopy = this.packPlanLog.map((item) => item.transport_info)
          // @ts-ignore
          this.batchInfo = this.boxInfo.rel_batch
          this.orderInfoCopy = this.boxInfo.order_transport_info ? JSON.parse(this.boxInfo.order_transport_info) : []
          const QRCode = require('qrcode')
          QRCode.toDataURL(`/boxManage/boxDetai?id=${this.boxInfo.id}`)
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(
            `/pages/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail?id==${this.boxInfo.id}`
          )
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/print.less';
</style>