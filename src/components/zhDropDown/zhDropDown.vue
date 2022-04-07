<template>
  <div>
    <div class="zhDropDown"
      ref="aa"
      :style="{ height: isShow ? height + 'px' : '0' }">
      <slot></slot>
    </div>
    <div class="blue clickButton"
      :style="buttonStyle"
      @click="isShow = !isShow">{{ isShow ? showTitle : hideTitle }}</div>
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
      required: false
    }
  },
  data(): {
    [propName: string]: any
  } {
    return { isShow: true, height: undefined }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    }
  },
  watch: {
    show(res: any) {
      this.isShow = res
    }
  },
  methods: {},
  mounted() {
    this.isShow = this.show
    this.height = this.$el.scrollHeight
  }
})
</script>

<style lang="less" scoped>
@import './zhDropDown.less';
</style>
