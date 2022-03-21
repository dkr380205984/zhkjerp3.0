<template>
  <div class="deduct popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">单据扣款</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label isMust">扣款单位：</div>
          <div class="info">
            <el-input disabled
              placeholder="扣款单位"
              v-model="client_name"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="label isMust">扣款金额：</div>
          <div class="info">
            <el-input placeholder="请输入扣款金额"
              v-model="deductInfo.price">
              <template slot="append">元</template>
            </el-input>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in deductInfo.reason"
          :key="index">
          <div class="label"
            :style="{'visibility': index===0?'visible':'hidden'}">扣款原因：</div>
          <div class="info">
            <el-autocomplete class="inline-input"
              v-model="deductInfo.reason[index]"
              :fetch-suggestions="searchReason"
              placeholder="请输入扣款原因"></el-autocomplete>
            <div class="info_btn hoverBlue"
              v-if="index===0"
              @click="$addItem(deductInfo.reason,'')">添加</div>
            <div class="info_btn hoverRed"
              v-if="index>0"
              @click="$deleteItem(deductInfo.reason,index)">删除</div>
          </div>
        </div>
        <div class="row">
          <div class="label">图片上传：</div>
          <div class="info imgInfo">
            <el-upload class="upload"
              action="https://upload.qiniup.com/"
              accept="image/jpeg,image/gif,image/png,image/bmp"
              :before-upload="beforeAvatarUpload"
              :data="postData"
              :on-remove="removeFile"
              :on-success="successFile"
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
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="saveDeduct">确认</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { deduct } from '@/assets/js/api'
interface deductInfo {
  order_id: number | string
  rel_doc_id: number | string
  doc_type: number
  reason: string[]
  client_id: number | string
  file_url: string[]
  price: string
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
    }
  },
  data(): {
    deductInfo: deductInfo
    [propName: string]: any
  } {
    return {
      deductInfo: {
        order_id: '',
        rel_doc_id: '',
        doc_type: 0,
        reason: [''],
        client_id: '',
        file_url: [],
        price: ''
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
    successFile(response: { hash: string; key: string }) {
      this.deductInfo.file_url.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string }; url: string }) {
      this.$deleteItem(
        this.deductInfo.file_url,
        this.deductInfo.file_url.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
    },
    saveDeduct() {
      this.deductInfo.order_id = this.order_id
      this.deductInfo.rel_doc_id = this.id
      this.deductInfo.client_id = this.client_id
      this.deductInfo.doc_type = this.type
      const formCheck = this.$formCheck(this.deductInfo, [
        {
          key: 'price',
          errMsg: '请填写扣款金额'
        }
      ])
      if (!formCheck) {
        deduct.create(this.deductInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('扣款成功')
            this.$emit('afterDeduct')
            this.$emit('close')
          }
        })
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
