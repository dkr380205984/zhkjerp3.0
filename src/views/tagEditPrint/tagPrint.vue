<template>
  <div class="printContainer" @click="showMenu = false" @click.right="handleClickRight">
    <div class="printTag">
      <div class="pbody">
        <div class="module" v-for="(item, index) in productInfo" :key="index">
          <div v-if="item.isCheck" id="printTag">
            <div class="tag_item">
              <span
                class="tag_info"
                style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; height: 15px; font-weight: bold"
                >{{ item.client_name }}</span
              >
            </div>
            <div class="tag_item">
              <span class="tag_label">编号：</span>
              <span class="tag_info">{{ item.product_code || item.system_code }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">名称：</span>
              <span class="tag_info">{{ item.name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">色组：</span>
              <span class="tag_info">{{ item.size_data.name + ' / ' + item.color_data.name }}</span>
            </div>
            <div class="tag_item">
              <span class="tag_label">成分：</span>
              <span class="tag_info">{{ item.component_data }}</span>
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
              <span class="tag_info" style="line-height: 15px">{{ item.product_desc || '无' }}</span>
            </div>
            <div class="tag_item col">
              <img :src="qrCodeUrl" class="tag_qrCode" />
              <div class="tag_text">
                {{ new Date().getFullYear() +'-'+ ((new Date().getMonth()+1) &lt; 10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1)) +'-'+ ((new Date().getDate()) &lt; 10?'0'+(new Date().getDate()):(new Date().getDate())) }}
              </div>
              <div class="tag_text">{{ user_name }}</div>
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
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.user_name,
      type: this.$route.query.type,
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      productInfo: []
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
    console.log(this.productInfo)
    // 生成二维码
    const QRCode = require('qrcode')
    QRCode.toDataURL(`q`)
      .then((url: any) => {
        this.qrCodeUrl = url
      })
      .catch((err: any) => {
        console.error(err)
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/tagEditPrint/tagPrint.less';
</style>