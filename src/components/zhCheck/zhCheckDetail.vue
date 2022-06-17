<template>
  <div class="zhCheckDetail popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">{{is_check>=3?'单据异常处理':'单据审核详情'}}</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="listCtn"
          v-if="is_check<3&&!errMsg">
          <div class="list">
            <div class="row title">
              <div class="col">审核人</div>
              <div class="col">审核状态</div>
              <div class="col">审核时间</div>
              <div class="col">驳回理由</div>
              <div class="col">备注信息</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="col">{{item.check_user_name}}</div>
              <div class="col"
                :class="{'red':item.is_chekc===2,'green':item.is_check===1}">{{item.is_check===1?'通过':'驳回'}}</div>
              <div class="col">{{item.check_time}}</div>
              <div class="col">{{item.check_desc}}</div>
              <div class="col">{{item.desc}}</div>
            </div>
          </div>
        </div>
        <div class="errorMsgCtn"
          v-if="is_check>=3&&errMsg&&errMsg.length>0">
          <div class="errorMsg"
            v-for="item,index in errMsg"
            :key="index">{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { check } from '@/assets/js/api'
export default Vue.extend({
  props: {
    pid: {
      type: [Number, String],
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
    check_type: {
      type: Number,
      required: true
    },
    //
    is_check: {
      type: Number
    },
    errMsg: {
      type: Array
    }
  },
  data() {
    return {
      list: [],
      loading: true
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.is_check === 3) {
        } else {
          check
            .list({
              pid: this.pid,
              check_type: this.check_type
            })
            .then((res) => {
              if (res.data.status) {
                this.list = res.data.data
              }
              this.loading = false
            })
        }
      }
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
@import './zhCheckDetail.less';
</style>