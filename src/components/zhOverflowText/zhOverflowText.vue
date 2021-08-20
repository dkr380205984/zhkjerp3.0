<template>
  <!-- 专门用来一行两行的多出部分省略号 -->
  <div class="zhOverflowText">
    <el-popover placement="top-start"
      width="200"
      trigger="hover"
      :content="content">
      <div slot="reference"
        :class="line===1?'oneLine':'twoLine'">{{content}}</div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    content: {
      type: String
    },
    line: {
      type: Number,
      default: 1
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhOverflowText.less';
</style>