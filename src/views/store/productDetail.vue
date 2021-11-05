<template>
  <div class="bodyContainer"
    id="storeProductDetail">
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">库存信息</div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">出入库日志</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '@/assets/js/api'
export default Vue.extend({
  mounted() {
    store
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.data)
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/productDetail.less';
</style>