<template>
  <div class="popup zhOrderSend"
    v-show="show">
    <div class="main"
      style="width:1000px">
      <div class="titleCtn">
        <span class="text">编辑寄送要求</span>
        <div class="closeCtn"
          @click="$emit('close')">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="editCtn">
          <div class="row"
            v-for="(item,index) in sendInfo.info"
            :key="index">
            <div class="col">
              <div class="label"
                v-if="index===0">样品类型</div>
              <div class="info elCtn">
                <el-select placeholder="请选择类型"
                  v-model="item.order_type">
                  <el-option label="确认样"
                    value="确认样"></el-option>
                  <el-option label="测试样"
                    value="测试样"></el-option>
                  <el-option label="大货样"
                    value="大货样"></el-option>
                </el-select>
              </div>
            </div>
            <div class="col">
              <div class="label"
                v-if="index===0">寄送数量</div>
              <div class="info elCtn">
                <el-input placeholder="请输入寄送数量"
                  v-model="item.number"></el-input>
              </div>
            </div>
            <div class="col">
              <div class="label"
                v-if="index===0">寄送日期</div>
              <div class="info elCtn">
                <el-date-picker placeholder="请选择日期"
                  v-model="item.send_time"
                  value-format="yyyy-mm-dd"></el-date-picker>
              </div>
            </div>
            <span class="opr hoverBlue"
              @click="$addItem(sendInfo.info,{
                order_type: '',
                send_time: '',
                number: ''
              })"
              v-if="index===0">添加</span>
            <span class="opr hoverRed"
              v-if="index>0"
              @click="$deleteItem(sendInfo.info,index)">删除</span>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">其他备注</div>
              <div class="info elCtn">
                <el-input placeholder="请输入其他备注"
                  v-model="sendInfo.other_desc"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">修改意见</div>
              <div class="info elCtn">
                <el-input placeholder="请输入其他备注"
                  v-model="sendInfo.client_confirm_idea"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="$emit('close')">取消</span>
        <span class="btn backHoverBlue"
          @click="saveSendInfo">{{editFlag?'修改':'保存'}}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { order } from '@/assets/js/api'
import { SendInfo } from '@/types/order'
import Vue from 'vue'
export default Vue.extend({
  props: {
    show: {
      default: false
    },
    data: {
      default: null
    },
    editFlag: {
      default: false
    },
    time_id: {
      default: ''
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.data) {
          // @ts-ignore
          this.sendInfo = this.data
        }
      }
    }
  },
  data(): {
    sendInfo: SendInfo
  } {
    return {
      sendInfo: {
        client_confirm_idea: '',
        other_desc: '',
        info: [
          {
            order_type: '',
            send_time: '',
            number: ''
          }
        ]
      }
    }
  },
  methods: {
    saveSendInfo() {
      if (this.editFlag) {
        order
          .updateSendInfo({
            send_info: this.sendInfo,
            order_time_id: this.time_id
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('修改成功')
              this.$emit('close')
            }
          })
      } else {
        this.$emit('saveInfo', this.sendInfo)
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhOrderSend.less';
</style>