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
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in list"
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
              <div class="tcol oprCtn">
                <div class="opr hoverRed"
                  @click="deleteDeduct(item.id,index)">删除</div>
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
import { deduct } from '@/assets/js/api'
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
  data() {
    return {
      list: []
    }
  },
  watch: {
    data(newVal: any) {
      this.list = newVal
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    deleteDeduct(id: number, index: number) {
      this.$confirm('是否删除该扣款单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deduct.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.list.splice(index, 1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhDeductDetail.less';
</style>