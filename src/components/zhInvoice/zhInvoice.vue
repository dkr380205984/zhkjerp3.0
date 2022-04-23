<template>
  <div class="zhInvoice popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{type|filterType}}开票{{update?'修改':''}}</div>
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
        <div v-for="(item,index) in invoiceInfo.data"
          :key="index">
          <div class="blue"
            style="margin-left:6px">开票单据{{index+1}}</div>
          <div class="row">
            <div class="info">
              <el-input disabled
                placeholder="无单据开票"
                v-model="item.doc_code">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="开票号码"
                v-model="item.invoice_code">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="开票金额(必填)"
                v-model="item.price">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="备注信息"
                v-model="item.desc">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn"
          :class="{'backHoverBlue':!update,'backHoverOrange':update}"
          @click="saveInvoice">{{update?'修改':'确认'}}</span>
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
  data: Array<{
    order_id: number | string
    doc_code: string
    rel_doc_id: number | string
    desc: string
    invoice_code: string
    price: string
  }>
}
export default Vue.extend({
  props: {
    id: {
      default: ''
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
      invoiceInfo: {
        doc_type: 0,
        client_id: '',
        data: [{ order_id: '', doc_code: '', rel_doc_id: '', price: '', desc: '', invoice_code: '' }]
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
              invoice_code: this.update ? item.invoice_code : ''
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
              invoice_code: ''
            }
          ]
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    reset() {
      this.invoiceInfo = {
        doc_type: 0,
        client_id: '',
        data: [{ order_id: '', doc_code: '', rel_doc_id: '', price: '', desc: '', invoice_code: '' }]
      }
    },
    saveInvoice() {
      const formCheck = this.invoiceInfo.data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'price',
            errMsg: '请输入开票金额'
          }
        ])
      })
      if (!formCheck) {
        invoice.create(this.invoiceInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.update ? '修改成功' : '开票成功')
            this.$emit('afterInvoice')
            this.$emit('close')
          }
        })
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhInvoice.less';
</style>
