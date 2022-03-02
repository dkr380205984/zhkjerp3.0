<template>
  <div class="popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">假期提醒</span>
        <div class="closeCtn"
          @click="show=false">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="explainCtn">检测到今天是节假日，是否修改打印日期？</div>
        <div class="row">
          <div class="label">修改日期：</div>
          <div class="info">
            <div class="elCtn">
              <el-date-picker v-model="date"
                placeholder="请选择日期"></el-date-picker>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="show=false">取消</span>
        <span class="btn backHoverOrange"
          @click="updateDate">确认修改</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      show: false,
      ifHoliday: false,
      date: this.$getDate(new Date())
    }
  },
  methods: {
    updateDate() {
      this.$emit('changeDate', this.date)
      this.show = false
    }
  },
  mounted() {
    const day = new Date().getDay()
    if (day === 0) {
      this.ifHoliday = true
      this.show = true
    }
  }
})
</script>

<style lang="less" scoped>
@import './todayIsHoliday.less';
</style>