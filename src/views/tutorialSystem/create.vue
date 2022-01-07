<template>
  <div class="bodyContainer"
    id="tutorialSystemCreate">
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加系统教程</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">管理模块</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择管理模块">
                <el-option v-for="item in moduleArr"
                  :key="item.name"
                  :value="item.name"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">教程标题</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请填写教程标题"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">步骤1文字描述</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请填写描述"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">步骤1图片</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请填写描述"></el-select>
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
            @click="saveTutorialSystem">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { systemModule } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      moduleArr: systemModule
    }
  },
  methods: {
    saveTutorialSystem() {}
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/tutorialSystem/create.less';
</style>