<template>
  <div class="printContainer"
    id="quotedPricePrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain" style="text-align: center;">
      <div class="phead clearfix">
        <div class="ptitle">{{ company_name + '工厂注册码' }}</div>
      </div>
      <div class="pbody">
        <div class="tableCtn pageOne">
          <div class="module">
            <img :src="qrCodeUrl" width="1000px">
          </div>
          <div class="phead">
              <div class="ptitle">织为云外协生产小程序</div>
          </div>
          <div class="phead">
              <div class="ptitle">微信扫一扫，在线管理加工单进度</div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { quotedPrice } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    quotedPriceInfo: QuotedPriceInfo
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                id: '',
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      }
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
    windowMethod(type: 1 | 2) {
      this.showMenu = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        }
      })
    }
  },
  computed: {
    productTotalPrice(): string[] {
      return this.quotedPriceInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalPrice(): string {
      let quotedPriceInfo = this.quotedPriceInfo
      let total =
        Number(quotedPriceInfo.commission_price) +
        Number(quotedPriceInfo.rate_price) +
        Number(quotedPriceInfo.profit_price)
      return String(total.toFixed(2))
    }
  },
  mounted() {
    let _this = this
    let a = 'https://knit-m-beta.zwyknit.com/miniprogram?company_id=' + _this.$route.query.companyID

    // 生成二维码
    const QRCode = require('qrcode')
    QRCode.toDataURL(a)
    .then((url: any) => {
        _this.qrCodeUrl = url
    })
    .catch((err: any) => {
        console.error(err)
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/print.less';
</style>