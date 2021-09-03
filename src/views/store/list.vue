<template>
  <div id="storeList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">纱线原料仓库</span>
      </div>
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">面料原料仓库</span>
      </div>
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">毛料原料仓库</span>
      </div>
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">装饰辅料仓库</span>
      </div>
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">产品仓库</span>
      </div>
      <div class="tag">
        <i class="icon">图标</i>
        <span class="text">包装辅料仓库</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/store/create')">添加仓库</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">仓库名称</div>
            <div class="col">仓库类型</div>
            <div class="col">关联单位</div>
            <div class="col">当前库存总数量</div>
            <div class="col">仓库备注</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">仓库名称</div>
            <div class="col">仓库类型</div>
            <div class="col">关联单位</div>
            <div class="col">当前库存总数量</div>
            <div class="col">仓库备注</div>
            <div class="col oprCtn">
              <div class="opr hoverBlue"
                @click="$router.push('/store/detail?id=1')">详情</div>
              <div class="opr hoverRed">删除</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    getList() {}
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/store/list.less';
</style>