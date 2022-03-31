<template>
  <div class="deduct popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{type|filterType}}收款</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="info">
            <el-input disabled
              placeholder="收款单位"
              v-model="client_name">
              <template slot="prepend">收款单位</template>
            </el-input>
          </div>
        </div>
        <div v-for="(item,index) in collectionInfo.data"
          :key="index">
          <div class="blue"
            style="margin-left:6px">收款单据{{index+1}}</div>
          <div class="row">
            <div class="info">
              <el-input disabled
                placeholder="无单据收款"
                v-model="item.doc_code">
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-date-picker placeholder="收款日期"
                v-model="item.complete_time">
                <template slot="prepend">收款日期</template>
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-input placeholder="收款金额"
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
        <span class="btn backHoverBlue"
          @click="saveCollection">确认</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { collection } from '@/assets/js/api'
interface CollectionInfo {
  id?: string
  order_id: number | string
  doc_type: number
  client_id: number | string
  data: Array<{
    doc_code: string
    rel_doc_id: number | string
    desc: string
    complete_time: string
    price: string
  }>
}
export default Vue.extend({
  props: {
    id: {
      default: ''
    },
    order_id: {
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
    }
  },
  data(): {
    collectionInfo: CollectionInfo
    [propName: string]: any
  } {
    return {
      collectionInfo: {
        order_id: '',
        doc_type: 0,
        client_id: '',
        data: [
          {
            doc_code: '',
            rel_doc_id: '',
            price: '',
            desc: '',
            complete_time: this.$getDate(new Date())
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
        '物料补充单'
      ]
      return arr[val]
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.reset()
        this.collectionInfo.doc_type = this.type
        this.collectionInfo.order_id = this.order_id
        this.collectionInfo.client_id = this.client_id
        if (this.data && this.data.length > 0) {
          this.collectionInfo.data = this.data.map((item: any) => {
            return {
              doc_code: item.code,
              rel_doc_id: item.id,
              price: '',
              desc: '',
              complete_time: this.$getDate(new Date())
            }
          })
        } else {
          this.collectionInfo.data = [
            {
              doc_code: '',
              rel_doc_id: '',
              price: '',
              desc: '',
              complete_time: this.$getDate(new Date())
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
      this.collectionInfo = {
        order_id: '',
        doc_type: 0,
        client_id: '',
        data: [
          {
            doc_code: '',
            rel_doc_id: '',
            price: '',
            desc: '',
            complete_time: ''
          }
        ]
      }
    },
    saveCollection() {
      const formCheck = this.collectionInfo.data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'price',
            errMsg: '请输入收款金额'
          }
        ])
      })
      if (!formCheck) {
        collection.create(this.collectionInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('收款成功')
            this.$emit('afterCollection')
            this.$emit('close')
          }
        })
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhCollection.less';
</style>
