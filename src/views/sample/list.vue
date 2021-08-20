<template>
  <div id="sampleList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">样单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue fr"
            @click="$router.push('/sample/create')">添加样单</div>
          <div class="btn backHoverOrange fr"
            @click="showSetting=true">列表设置</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [porpName: string]: any
  } {
    return {
      showSetting: false
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sample/list.less';
</style>