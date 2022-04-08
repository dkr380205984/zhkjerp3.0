<template>
  <div class="zhSideNav">
    <div class="sideCtn">
      <a v-for="(item,index) in data"
        :key="index"
        class="side"
        :href="item.mark">{{item.name}}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['data']
})
</script>
<style lang="less" scoped>
@import './zhSideNav.less';
</style>