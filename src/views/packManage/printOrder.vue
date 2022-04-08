<template>
  <div class="printContainer"
    id="packPrintOrder">
    <div class="printContainer"
      @click="showMenu = false"
      @click.right="handleClickRight">
    </div>
  </div>
</template>

<script lang="ts">
import { PackOrderInfo } from '@/types/packManage'
import Vue from 'vue'
import { packManage } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    packOrderInfo: PackOrderInfo
  } {
    return {
      packOrderInfo: {
        order_id: '',
        client_id: '',
        tree_data: [],
        client_name: '',
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        desc: '',
        total_price: '',
        total_number: '',
        others_fee_data: [
          {
            desc: '', // 额外费用备注
            name: '',
            price: ''
          }
        ],
        info_data: [
          {
            file_url: '',
            price_type: 1,
            pack_material_id: '',
            length: '',
            width: '',
            height: '',
            desc: '',
            bulk_price: '',
            count_price: '',
            number: ''
          }
        ]
      }
    }
  },
  mounted() {
    packManage
      .orderListDetail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.packOrderInfo = res.data.data
        }
      })
  }
})
</script>

<style>
</style>