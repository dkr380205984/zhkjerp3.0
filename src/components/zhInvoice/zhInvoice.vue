<template>
  <div class="zhInvoice popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{ type | filterType }}开票{{ update ? '修改' : '' }}</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="info">
            <el-input disabled
              placeholder="开票单位"
              v-model="client_name">
              <template slot="prepend">开票单位</template>
            </el-input>
          </div>
        </div>
        <div v-for="(item, index) in invoiceInfo.data"
          :key="index">
          <div class="blue"
            style="margin-left: 6px">
            开票单据{{ index + 1 }}
            <i class="el-icon-close hoverRed fr"
              style="font-size: 20px; cursor: pointer"
              @click="
                invoiceInfo.data.length === 1 ? $message.error('至少有一项') : $deleteItem(invoiceInfo.data, index)
              "></i>
          </div>
          <div class="row">
            <div class="info">
              <el-input disabled
                placeholder="无单据开票"
                v-model="item.doc_code"> </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="发票代码"
                v-model="item.invoice_number"
                @input="changeType($event, index)">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="发票号码"
                v-model="item.invoice_code"> </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-select v-model="item.order_or_other"
                placeholder="开票类型">
                <el-option label="订单开票"
                  :value="1"> </el-option>
                <el-option label="其它开票"
                  :value="2"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="row" style="justify-content: space-around;">
            <div class="info" style="flex:0.49">
              <el-autocomplete class="inline-input"
                v-model="item.tax_rate"
                :fetch-suggestions="querySearch"
                placeholder="税率（必填）"
                @input="getAboutTaxPrice(index)">
                <template slot="append">%</template>
              </el-autocomplete>
            </div>
            <div class="info" style="flex:0.49">
              <el-select v-model="item.type"
                placeholder="发票类型">
                <el-option label="专票"
                  value="专票"> </el-option>
                <el-option label="普票"
                  value="普票"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="开票金额（税价合计，必填）"
                v-model="item.price"
                @input="
                  changeNumToPrice($event, index)
                  getAboutTaxPrice(index)
                ">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="数字金额(默认)"
                v-model="item.hanPrice"
                disabled>
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="税额"
                v-model="item.price_tax"
                disabled><template slot="append">元</template></el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="不含税金额"
                v-model="item.price_no_tax"
                disabled><template slot="append">元</template></el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="备注信息"
                v-model="item.desc"> </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverOrange"
          v-if="!update"
          @click="
            $addItem(invoiceInfo.data, {
              order_id: '',
              doc_code: '',
              rel_doc_id: '',
              reason: '',
              file_url: '',
              price: ''
            })
          ">添加</span>
        <span class="btn"
          :class="{ backHoverBlue: !update, backHoverOrange: update }"
          @click="saveInvoice">{{
          update ? '修改' : '确认'
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { invoice } from '@/assets/js/api'
interface invoiceInfo {
  id?: string
  doc_type: number
  client_id: number | string
  invoice_type: number
  data: Array<{
    order_id: number | string
    doc_code: string
    rel_doc_id: number | string
    desc: string
    invoice_code: string
    invoice_number: string
    tax_rate: number | string
    type: string
    order_or_other: string | number
    price_tax: number | string
    price_no_tax: number | string
    price: string
    hanPrice?: string
  }>
}
export default Vue.extend({
  props: {
    id: {
      default: ''
    },
    invoice_type: {
      type: Number
    },
    client_name: {
      type: String
    },
    client_id: {
      default: '',
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    // const SCARF_DOC_ORDER=1;//订单
    // const SCARF_DOC_MATERIAL_ORDER = 2; //物料订购单
    // const SCARF_DOC_MATERIAL_PROCESS = 3; //物料加工单
    // const SCARF_DOC_WEAVE_PLAN = 4; //织造计划单
    // const SCARF_DOC_QUOTE=5;//报价单
    // const SCARF_DOC_MATERIAL_STORE_LOG=6;//原料出入库单
    // const SCARF_DOC_MATERIAL_RESERVE=7;//原料预订购单
    // const SCARF_DOC_PRODUCT_STORE_LOG=8;//产品出入库单
    // const SCARF_DOC_MATERIAL_PLAN=9;//物料计划单
    // const SCARF_DOC_MATERIAL_SUP=10;//物料计划单
    type: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
      required: false
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  data(): {
    invoiceInfo: invoiceInfo
    [propName: string]: any
  } {
    return {
      saveLock: false,
      invoiceInfo: {
        invoice_type: 1,
        doc_type: 0,
        client_id: '',
        data: [
          {
            order_id: '',
            doc_code: '',
            rel_doc_id: '',
            price: '',
            desc: '',
            invoice_code: '',
            invoice_number: '',
            tax_rate: '',
            type: '专票',
            order_or_other: 1,
            price_tax: '',
            price_no_tax: ''
          }
        ]
      }
    }
  },
  filters: {
    filterType(val: number) {
      const arr = [
        '',
        '订单',
        '物料订购单',
        '物料加工单',
        '织造计划单',
        '报价单',
        '原料出入库单',
        '原料预订购单',
        '产品出入库单',
        '物料计划单',
        '物料补充单',
        '包装采购单',
        '',
        '运输单',
        '车间管理单'
      ]
      return arr[val]
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.reset()
        this.invoiceInfo.doc_type = this.type
        if (this.update) {
          // @ts-ignore
          this.invoiceInfo.client_id = this.client_id || this.data[0].client_id
        } else {
          this.invoiceInfo.client_id = this.client_id
        }
        if (this.data && this.data.length > 0) {
          this.invoiceInfo.data = this.data.map((item: any) => {
            return {
              id: this.update ? item.id : '',
              doc_code: this.update ? item.code : item.code,
              rel_doc_id: this.update ? item.rel_doc_id : item.id,
              order_id: this.update ? item.order_id : this.type === 1 ? item.id : item.top_order_id,
              price: this.update ? item.price : '',
              desc: this.update ? item.desc : '',
              invoice_code: this.update ? item.invoice_code : '',
              invoice_number: this.update ? item.invoice_number : '',
              tax_rate: this.update ? item.tax_rate : '',
              type: this.update ? item.type : 1,
              order_or_other: this.update ? item.order_or_other : 1,
              price_tax: this.update ? item.price_tax : '',
              price_no_tax: this.update ? item.price_no_tax : ''
            }
          })
        } else {
          this.invoiceInfo.data = [
            {
              order_id: '',
              doc_code: '',
              rel_doc_id: '',
              price: '',
              desc: '',
              invoice_code: '',
              invoice_number: '',
              tax_rate: '',
              type: '专票',
              order_or_other: 1,
              price_tax: '',
              price_no_tax: ''
            }
          ]
        }
      }
    }
  },
  methods: {
    // 把数字改成金额
    changeNumToPrice(val: string, index: number) {
      const realNumStr = val.replace(/[^0-9|.]/gi, '')
      this.invoiceInfo.data[index].hanPrice = this.$changeNumToHan(Number(realNumStr))
      const numArr = realNumStr.split('.')
      const numStrArr = numArr[0].split('')
      const length = Number(numStrArr.length)
      for (let i = length, j = 0; i > 0; i--) {
        j++
        if (j % 3 === 0 && i !== 1) {
          numStrArr.splice(i - 1, 0, ',')
        }
      }
      if (numArr.length === 2) {
        this.invoiceInfo.data[index].price = numStrArr.join('') + '.' + numArr[1]
      } else {
        this.invoiceInfo.data[index].price = numStrArr.join('')
      }
    },
    changeType(val: string, index: number) {
      if (val.length === 12) {
        this.invoiceInfo.data[index].type = '普票'
      } else {
        this.invoiceInfo.data[index].type = '专票'
      }
    },
    querySearch(e: any, cb: any) {
      cb([{ value: '0' }, { value: '3' }, { value: '6' }, { value: '9' }, { value: '13' }, { value: '17' }])
    },
    // 计算不含税金额 和 税额
    getAboutTaxPrice(index: number) {
      // 税额 = 税价合计 * 税率
      // price_tax = price * tax_rate
      // 不含税金额 =  税价合计 - 税额
      // price_no_tax = price - price_tax
      const item = this.invoiceInfo.data[index]
      item.price_tax = (Number(item.price.replace(/[^0-9|.]/gi, '')) || 0) * (Number(item.tax_rate) / 100 || 0)
      item.price_no_tax = (Number(item.price.replace(/[^0-9|.]/gi, '')) || 0) - (Number(item.price_tax) || 0)
      console.log(item.price_tax, item.price_no_tax)
    },
    close() {
      this.$emit('close')
    },
    reset() {
      this.invoiceInfo = {
        invoice_type: this.invoice_type,
        doc_type: 0,
        client_id: '',
        data: [
          {
            order_id: '',
            doc_code: '',
            rel_doc_id: '',
            price: '',
            desc: '',
            invoice_code: '',
            invoice_number: '',
            tax_rate: '',
            type: '专票',
            order_or_other: 1,
            price_tax: '',
            price_no_tax: ''
          }
        ]
      }
    },
    saveInvoice() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.invoiceInfo.data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'tax_rate',
            errMsg: '请输入税率'
          },
          {
            key: 'price',
            errMsg: '请输入开票金额'
          }
        ])
      })
      if (!formCheck) {
        this.saveLock = true
        this.invoiceInfo.invoice_type = this.invoice_type
        this.invoiceInfo.data.forEach((item) => {
          item.price = item.price.replace(/[^0-9|.]/gi, '')
        })
        invoice.create(this.invoiceInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.update ? '修改成功' : '开票成功')
            this.$emit('afterInvoice')
            this.$emit('close')
          }
          this.saveLock = false
        })
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhInvoice.less';
</style>
