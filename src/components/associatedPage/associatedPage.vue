<template>
  <div class="associatedPage popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">关联页面跳转</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="tag"
          v-for="item in urlArr"
          :key="item.name"
          :class="{'backHoverBlue':item.name===checkUrl.name}"
          @click="checkUrl=item">{{item.name}}</div>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="goRouter">确认跳转</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['data', 'show'],
  data() {
    return {
      checkUrl: {
        name: '',
        url: ''
      },
      urlArr: []
    }
  },
  watch: {
    data(newVal) {
      this.urlArr = newVal
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    goRouter() {
      if (this.checkUrl.url) {
        this.$openUrl(this.checkUrl.url)
      } else {
        this.$message.error('请选择要跳转的页面')
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './associatedPage.less';
</style>