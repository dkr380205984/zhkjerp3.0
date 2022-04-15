<template>
  <div>
    <div v-if="position === 'top'" class="blue clickButton" @click="isShow = !isShow" :style="buttonStyle">
      {{ isShow ? showTitle : hideTitle }}
    </div>
    <div class="zhDropDown" :style="{ height: isShow ? height + 'px' : '0' }">
      <div ref="aa">
        <slot></slot>
      </div>
    </div>
    <div v-if="position !== 'top'" class="blue clickButton" @click="isShow = !isShow" :style="buttonStyle">
      {{ isShow ? showTitle : hideTitle }}
    </div>
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
    position: {
      type: String,
      default: 'bottom'
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
    return { isShow: this.show, height: undefined }
  },
  watch: {
    show: function (val) {
      this.isShow = val
    },
    isShow: function (val) {
      let a: any = this.$refs.aa
      this.height = a.clientHeight
    }
  },
  methods: {}
})
</script>

<style lang="less" scoped>
@import './zhDropDown.less';
</style>
