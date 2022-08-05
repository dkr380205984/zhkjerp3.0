<template>
  <div>
    <div v-if="position !== 'bottom'"
      class="blue clickButton"
      @click="showFn"
      :style="buttonStyle">
      {{ isShow ? showTitle : hideTitle }}
    </div>
    <div class="zhDropDown"
      :style="{ height: isShow ? height + 'px' : '0' }">
      <div ref="aa">
        <slot></slot>
      </div>
    </div>
    <div v-if="position === 'bottom'"
      class="blue clickButton"
      @click="showFn"
      :style="buttonStyle">
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
      default: 'top'
    },
    hideTitle: {
      type: String,
      default: '点击查看'
    },
    show: {
      type: Boolean,
      default: true
    },
    // 展开之前先确认是否是异步数据渲染，默认不是
    showAsync: {
      type: Boolean,
      default: false
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
  methods: {
    showFn() {
      if (!this.isShow) {
        // 判断数据是否异步获取渲染
        if (!this.showAsync) {
          this.isShow = true
        } else {
          this.$emit('beforeShow')
        }
      } else {
        this.isShow = false
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhDropDown.less';
</style>
