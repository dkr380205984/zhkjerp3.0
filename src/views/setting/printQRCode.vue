<template>
  <div class="printContainer"
    id="companyLoginCodePrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain" style="text-align: center;">
      <div class="phead clearfix">
        <div class="ptitle">{{ company_name + '工厂注册码' }}</div>
      </div>
      <div class="pbody">
        <div class="tableCtn pageOne" style="margin-top:25px">
          <div class="module">
            <img :src="qrCodeUrl" style="width:750px">
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
import { clientBind } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
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
  mounted() {
    let _this = this
    clientBind.qrCode().then((res) => {
      _this.qrCodeUrl = res.data.data
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/setting/printQRCode.less';
</style>