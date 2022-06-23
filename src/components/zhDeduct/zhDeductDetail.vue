<template>
  <div class="deductDetail popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">单据扣款详情</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">扣款单号</div>
              <div class="tcol">扣款单位</div>
              <div class="tcol">扣款金额</div>
              <div class="tcol">操作人</div>
              <div class="tcol">扣款原因</div>
              <div class="tcol">图片信息</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in data"
              :key="index">
              <div class="tcol">{{item.code}}</div>
              <div class="tcol">{{item.client_name}}</div>
              <div class="tcol">{{item.price}}元</div>
              <div class="tcol">{{item.user_name}}</div>
              <div class="tcol">{{typeof(item.reason)==='string'?item.reason:item.reason.join(';')}}</div>
              <div class="tcol">
                <div class="imageCtn"
                  style="width:auto">
                  <el-image style="height:100%"
                    :src="item.file_url&&item.file_url.length>0?item.file_url[0]:require('@/assets/image/common/noPic.png')"
                    :preview-src-list="item.file_url">
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">关闭</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
interface deductInfo {
  rel_doc_id: number | string
  doc_type: number
  reason: string[]
  client_id: number | string
  file_url: string[]
  price: string
}
export default Vue.extend({
  props: {
    data: {
      required: false
    },
    id: {
      default: ''
    },
    client_name: {
      type: String
    },
    client_id: {
      default: '',
      required: false
    },
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: Number,
      required: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhDeductDetail.less';
</style>