<template>
  <div class="printContainer" @click="showMenu = false" @click.right="handleClickRight">
    <div class="printTag">
      <div class="pbody">
        <div class="module" v-for="(item,index) in productInfo" :key="index">
          <div v-if="item.isCheck" id="printTag">
            <div class="tag_item">
              <span class="tag_label">公司：</span>
              <span class="tag_info">{{ item.client_name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">编号：</span>
              <span class="tag_info">{{ item.product_code}}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">名称：</span>
              <span class="tag_info">{{ item.name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">色组：</span>
              <span class="tag_info">{{ item.color_data.name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">成分：</span>
              <span class="tag_info">{{ item.component_data }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">规格：</span>
              <span class="tag_info">{{ item.size_data.name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">尺寸：</span>
              <span class="tag_info">{{ item.size_data.size_info }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">克重：</span>
              <span class="tag_info">{{ item.size_data.weight }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">描述：</span>
              <span class="tag_info">{{ item.product_desc || '无'}}</span>
            </div>
            <div class="tag_item col">
              <img
                :src="qrCodeUrl"
                class="tag_qrCode"
              />
              <div class="tag_text">打印时间：{{ new Date().getFullYear() +'-'+ ((new Date().getMonth()+1) &lt; 10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1)) +'-'+ ((new Date().getDate()) &lt; 10?'0'+(new Date().getDate()):(new Date().getDate())) }}</div>
              <div class="tag_text">打印员工：{{ user_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop
    >
      <div class="setting_item" @click="windowMethod(1)">刷新</div>
      <div class="setting_item" @click="windowMethod(2)">打印</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    quotedPriceInfo: QuotedPriceInfo
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      user_name:window.sessionStorage.user_name,
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      productInfo:[],
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
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        }
      })
    }
  },
  computed: {},
  mounted() {
    this.productInfo = JSON.parse(sessionStorage[`editTag_${this.$route.query.id}`])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        // console.log(res.data.data)
        this.quotedPriceInfo = res.data.data

        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL(`${this.quotedPriceInfo.code}`)
          .then((url: any) => {
            this.qrCodeUrl = url
            // console.log(this.qrCodeUrl)
          })
          .catch((err: any) => {
            console.error(err)
          })
      })
    
    
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/tagEditPrint/tagPrint.less';
</style>