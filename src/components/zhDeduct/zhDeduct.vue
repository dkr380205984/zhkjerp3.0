<template>
  <div class="deduct popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">{{type|filterType}}扣款{{update?'修改':''}}</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="info">
            <el-input disabled
              placeholder="扣款单位"
              v-model="client_name">
              <template slot="prepend">扣款单位</template>
            </el-input>
          </div>
        </div>
        <div v-for="(item,index) in deductInfo.data"
          :key="index">
          <div class="blue"
            style="margin-left:6px">扣款单据{{index+1}}</div>
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
              <el-input placeholder="请输入扣款金额(必填)"
                v-model="item.price">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="info">
              <el-autocomplete class="inline-input"
                v-model="item.reason"
                :fetch-suggestions="searchReason"
                placeholder="请输入扣款原因"></el-autocomplete>
            </div>
          </div>
          <div class="row"
            style="height:auto">
            <div class="info imgInfo"
              style="height:auto">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :file-list="item.file_url?[{'id':item.file_url,'url':item.file_url}]:[]"
                :on-remove="(ev)=>{return removeFile(ev,item)}"
                :on-success="(ev)=>{return successFile(ev,item)}"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传图片</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn"
          :class="{'backHoverBlue':!update,'backHoverOrange':update}"
          @click="saveDeduct">{{update?'修改':'确认'}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { deduct } from '@/assets/js/api'
interface deductInfo {
  id?: string
  doc_type: number
  client_id: number | string
  data: Array<{
    order_id: number | string
    doc_code: string
    rel_doc_id: number | string
    reason: string
    price: string
    file_url: string
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
    deductInfo: deductInfo
    [propName: string]: any
  } {
    return {
      deductInfo: {
        doc_type: 0,
        client_id: '',
        data: [{ order_id: '', doc_code: '', rel_doc_id: '', reason: '', file_url: '', price: '' }]
      },
      postData: {
        key: '',
        token: ''
      },
      reasonArr: [
        {
          value: '补纱或面料扣款 '
        },
        {
          value: '染色色差问题扣款  '
        },
        {
          value: '纱线质量问题扣款 '
        },
        {
          value: '单公司折扣扣款 '
        },
        {
          value: '生产次品过多扣款 '
        }
      ]
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
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
        this.deductInfo.doc_type = this.type
        if (this.update) {
          // @ts-ignore
          this.deductInfo.client_id = this.client_id || this.data[0].client_id
        } else {
          this.deductInfo.client_id = this.client_id
        }
        if (this.data && this.data.length > 0) {
          this.deductInfo.data = this.data.map((item: any) => {
            return {
              id: this.update ? item.id : '',
              doc_code: this.update ? item.rel_doc_code : item.code,
              rel_doc_id: this.update ? item.rel_doc_id : item.id,
              order_id: this.update ? item.order_id : this.type === 1 ? item.id : item.top_order_id,
              price: this.update ? item.price : '',
              reason: this.update ? item.reason : '',
              file_url: this.update ? item.file_url : ''
            }
          })
        } else {
          this.deductInfo.data = [
            {
              order_id: '',
              doc_code: '',
              rel_doc_id: '',
              price: '',
              reason: '',
              file_url: ''
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
    searchReason(str: string, cb: Function) {
      cb(
        str
          ? this.reasonArr.filter((item: any) => {
              return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
            })
          : this.reasonArr
      )
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }, item: any) {
      item.file_url = 'https://file.zwyknit.com/' + response.key
    },
    removeFile(file: { response: { hash: string; key: string } }, item: any) {
      item.file_url = ''
    },
    saveDeduct() {
      const formCheck = this.deductInfo.data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'price',
            errMsg: '请输入扣款金额'
          }
        ])
      })
      if (!formCheck) {
        deduct.create(this.deductInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('扣款成功')
            this.$emit('afterDeduct')
            this.$emit('close')
          }
        })
      }
    },
    reset() {
      this.deductInfo = {
        doc_type: 0,
        client_id: '',
        data: [{ order_id: '', doc_code: '', rel_doc_id: '', price: '', reason: '', file_url: '' }]
      }
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import './zhDeduct.less';
</style>
