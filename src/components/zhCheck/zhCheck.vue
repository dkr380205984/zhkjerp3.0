<template>
  <div class="zhCheck popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">单据审核</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="row">
          <div class="label">是否通过：</div>
          <div class="info"
            style="line-height:32px">
            <el-radio v-model="checkInfo.is_check"
              :label="1">通过</el-radio>
            <el-radio v-model="checkInfo.is_check"
              :label="2">驳回</el-radio>
          </div>
        </div>
        <div class="row">
          <div class="label">驳回理由：</div>
          <div class="info"
            style="min-height:32px;height:auto">
            <el-checkbox-group v-model="checkInfo.check_desc">
              <el-checkbox style="line-height:32px"
                v-for="(item,index) in reason"
                :label="item"
                :key="index"
                :disabled="checkInfo.is_check===1"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div class="label">备注信息：</div>
          <div class="info">
            <el-input placeholder="请输入备注信息"
              v-model="checkInfo.desc"></el-input>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="saveCheck">确认</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { check } from '@/assets/js/api'
interface CheckInfo {
  pid: number | string
  check_type: number
  check_desc: string | string[]
  is_check: 1 | 2 // 1通过 2没通过
  desc: string
}
export default Vue.extend({
  props: {
    pid: {
      required: true
    },
    reason: {
      type: Array,
      required: true
    },
    check_type: {
      type: Number,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data(): {
    checkInfo: CheckInfo
  } {
    return {
      checkInfo: {
        pid: '',
        check_type: 0,
        check_desc: [],
        is_check: 1,
        desc: ''
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    saveCheck() {
      this.checkInfo.pid = this.pid as number
      this.checkInfo.check_type = this.check_type
      this.checkInfo.check_desc = (this.checkInfo.check_desc as string[]).join(';')
      check.create(this.checkInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('审核成功')
          this.checkInfo = {
            pid: '',
            check_type: 0,
            check_desc: [],
            is_check: 1,
            desc: ''
          }
          this.$emit('close')
          this.$emit('afterCheck')
        }
      })
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhCheck.less';
</style>