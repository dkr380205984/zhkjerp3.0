<template>
  <div class="zhCollection popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{type|filterType}}收款{{update?'修改':''}}
        </div>
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
              <el-input placeholder="收款金额(必填)"
                v-model="item.price"
                @input="changeNumToPrice($event,index)">
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
          @click="saveCollection">{{update?'修改':'确认'}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { collection } from '@/assets/js/api'
interface CollectionInfo {
  id?: string
  doc_type: number
  client_id: number | string
  data: Array<{
    order_id: number | string
    doc_code: string
    rel_doc_id: number | string
    desc: string
    complete_time: string
    price: string
    hanPrice?: string // 前端用，数字转汉字
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
    // 11 包装采购单
    // 13 运输单
    // 14 车间管理单
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
    collectionInfo: CollectionInfo
    [propName: string]: any
  } {
    return {
      collectionInfo: {
        doc_type: 0,
        client_id: '',
        data: [
          { order_id: '', doc_code: '', rel_doc_id: '', price: '', desc: '', complete_time: this.$getDate(new Date()) }
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
        this.collectionInfo.doc_type = this.type
        if (this.update) {
          // @ts-ignore
          this.collectionInfo.client_id = this.client_id || this.data[0].client_id
        } else {
          this.collectionInfo.client_id = this.client_id
        }
        if (this.data && this.data.length > 0) {
          this.collectionInfo.data = this.data.map((item: any) => {
            return {
              id: this.update ? item.id : '',
              doc_code: this.update ? item.rel_doc_code : item.code,
              rel_doc_id: this.update ? item.rel_doc_id : item.id,
              order_id: this.update ? item.order_id : this.type === 1 ? item.id : item.top_order_id,
              price: this.update ? item.price : '',
              desc: this.update ? item.desc : '',
              complete_time: this.update ? item.complete_time : this.$getDate(new Date())
            }
          })
        } else {
          this.collectionInfo.data = [
            {
              order_id: '',
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
    // 把数字改成金额
    changeNumToPrice(val: string, index: number) {
      const realNumStr = val.replace(/[^0-9]/gi, '')
      const numStrArr = realNumStr.split('')
      this.collectionInfo.data[index].hanPrice = this.$changeNumToHan(Number(realNumStr))
      const length = Number(numStrArr.length)
      for (let i = length, j = 0; i > 0; i--) {
        j++
        if (j % 3 === 0 && i !== 1) {
          numStrArr.splice(i - 1, 0, '，')
        }
      }
      this.collectionInfo.data[index].price = numStrArr.join('')
    },
    close() {
      this.$emit('close')
    },
    reset() {
      this.collectionInfo = {
        doc_type: 0,
        client_id: '',
        data: [
          {
            order_id: '',
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
        // 把提交金额替换回来
        this.collectionInfo.data.forEach((item) => {
          item.price = item.price.replace(/[^0-9]/gi, '')
        })
        collection.create(this.collectionInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.update ? '修改成功' : '收款成功')
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
