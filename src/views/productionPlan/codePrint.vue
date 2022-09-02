<template>
  <div id="codePrint">
    <div class="codeContainer"
      v-for="(item,index) in list"
      :key="index">
      <div class="titleCtn">{{company_name}}生产流转卡</div>
      <div class="contentCtn">
        <div class="imgCtn">
          <img :src="qrCodeUrl" />
          <span class="text">打开微信小程序织为云外协订单管理扫一扫</span>
        </div>
        <div class="otherInfo">
          <div class="info">
            <span class="label">流转卡编号：</span>
            <span class="text">{{item.code}}</span>
          </div>
          <div class="info">
            <span class="label">流转卡序号：</span>
            <span class="text">{{item.num}}</span>
          </div>
          <div class="info">
            <span class="label">产品信息：</span>
            <span class="text">{{item.product_code}}</span>
          </div>
          <div class="info">
            <span class="label">部位/尺码/颜色：</span>
            <span class="text">{{item.size_color}}</span>
          </div>
          <div class="info"
            v-if="item.number">
            <span class="label">每包装袋件数：</span>
            <span class="text">{{item.number}}件</span>
          </div>
          <div class="info"
            v-if="item.number">
            <span class="label">每袋回厂克重：</span>
            <span class="text">{{item.total_weight}}克(+-5%)</span>
          </div>
          <div class="bottom"
            v-if="!item.number">
            <span class="label">请在下方填写实际数量：</span>
            <div class="elCtn">
              <el-input placeholder="请输入实际数量">
                <template slot="append">件/袋</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { productionPlan } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      list: []
    }
  },
  mounted() {
    const QRCode = require('qrcode')
    QRCode.toDataURL('hahaha')
      .then((url: any) => {
        this.qrCodeUrl = url
      })
      .catch((err: any) => {
        console.error(err)
      })
    productionPlan
      .listCode({
        pid: (this.$route.query.id as string).split(',')
      })
      .then((res) => {
        if (res.data.status) {
          this.list = res.data.data
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/codePrint.less';
</style>