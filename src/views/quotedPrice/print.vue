<template>
  <div></div>
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
            ]
          }
        ]
      }
    }
  },
  methods: {
    init() {
      quotedPrice
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          console.log(res)
        })
    }
  },
  mounted() {
    this.init()
  }
})
</script>
<style>
</style>