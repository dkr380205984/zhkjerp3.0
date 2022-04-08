<template>
  <div>
    <div class="zhDropDown"
      ref="aa"
      :style="{ height: isShow ? 'auto' : '0' }">
      <slot></slot>
    </div>
    <div class="blue clickButton"
      @click="isShow = !isShow"
      :style="buttonStyle">{{ isShow ? showTitle : hideTitle }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    showTitle: {
      type: String,
      default: '收起'
    },
    hideTitle: {
      type: String,
      default: '点击查看'
    },
    show: {
      type: Boolean,
      default: true
    },
    buttonStyle: {
      type: String,
      default: ''
    }
  },
  data(): {
    [propName: string]: any
  } {
    return { isShow: true, height: undefined }
  },
  methods: {},
  mounted() {
    this.isShow = this.show
  }
})
</script>

<style lang="less" scoped>
@import './zhDropDown.less';
</style>
