<template>
  <div class="printContainer" id="reimbursementManagePrint" @click="showMenu = false" @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{ company_name + '报销单' }}</div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">报销单号：</div>
              <div class="info" style="white-space: nowrap">{{ receiptInfo.code }}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">创建信息：</div>
              <div class="info">
                {{ receiptInfo.created_at ? receiptInfo.created_at.slice(0, 10) : ''
                }}{{ receiptInfo.user.name ? ' - ' + receiptInfo.user.name : ''
}}{{ receiptInfo.user.phone ? ' - ' + receiptInfo.user.phone : '' }}
              </div>
            </div>
          </div>
        </div>
        <div class="fr">
          <!-- <div class="remark">打开微信扫一扫 更新每日生产进度</div> -->
          <div class="pImage">
            <img :src="receiptInfo.url" width="100%" alt="" />
          </div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn pageOne">
          <div class="module">
            <div class="tbody hasTop" style="text-align: left">
              <div class="trow">
                <div class="tcol bgGray">报销人</div>
                <div class="tcol">{{ receiptInfo.name }}</div>
                <div class="tcol bgGray">审核人</div>
                <div class="tcol">{{ receiptInfo.reviewer.name }}</div>
              </div>
              <div class="trow" v-for="(item, index) in receiptInfo.receipt_contents" :key="index">
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol bgGray" style="flex: 0.349">报销内容{{ index + 1 }}</div>
                    <div class="tcol" style="flex: 1.5">{{ item.name }}</div>
                  </div>
                  <div class="trow">
                    <div class="tcol bgGray" style="flex: 0.349">申请报销金额（元）</div>
                    <div class="tcol" style="flex: 1.5">{{ item.amount }}</div>
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcol bgGray" style="flex: 0.349">合计</div>
                <div class="tcol" style="flex: 1.5">{{ receiptInfo.amount }} 元</div>
              </div>
            </div>
            <span v-if="receiptInfo.certificate">
              <div v-for="(item, index) in receiptInfo.certificate.split(',')" :key="item + index" class="elImageCtn">
                <el-image style="width: 100px; height: 100px" :src="item" fit="content"></el-image>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="setting_sign_style" v-if="showMenu" :style="`left:${X_position || 0}px;top:${Y_position}px`" @click.stop>
      <div class="setting_item" @click="windowMethod(1)">刷新</div>
      <div class="setting_item" @click="windowMethod(2)">打印</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { receipt } from '@/assets/js/api'
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
      receiptInfo: {
        user: {
          name: '',
          phone: ''
        },
        reviewer: {
          name: ''
        }
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
  mounted() {
    receipt
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.receiptInfo = res.data.data
        Object.prototype.toString.call(this.receiptInfo.reviewer) === '[object Object]'
          ? this.receiptInfo.reviewer
          : (this.receiptInfo.reviewer = { name: '' })

        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL(`${this.receiptInfo.code}`)
          .then((url: any) => {
            this.receiptInfo.url = url
            this.$forceUpdate()
          })
          .catch((err: any) => {
            console.error(err)
          })
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/reimbursementManage/print.less';
</style>