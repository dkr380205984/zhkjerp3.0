<template>
  <div id="storeCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">仓库名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入公司全称"
                v-model="testValue"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">仓库类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择仓库类型"
                v-model="testValue"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">关联单位</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择关联单位"
                v-model="testValue"></el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">二级仓库名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入二级仓库名称"
                v-model="testValue"></el-input>
            </div>
          </div>
          <div class="opr hoverBlue">添加</div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">仓库管理员</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择仓库管理员"
                v-model="testValue"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="testValue"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue"
            @click="saveStore">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      testValue: ''
    }
  },
  methods: {
    saveStore() {}
  },
  mounted() {}
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/create.less';
</style>