<template>
  <div class='tableCtn'
    id='PLPrint'>
    <div class="headerCtn">
      <div class="top">
        <div class="title">公司名称</div>
        <div class="title2">公司地址</div>
        <div class="title3">Tel:电话&nbsp;&nbsp;Fax:传真</div>
        <div class="title">COMMERICAL INVOICE</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    documentInfo() {
      // @ts-ignore
      return this.$parent.documentInfo
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/PL/print.less';
</style>