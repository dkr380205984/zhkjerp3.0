<template>
  <div class="usingTutorials">
    <!-- 入口插槽 -->
    <slot></slot>
    <div class="popup"
      v-show="show">
      <div class="main">
        <div class="titleCtn">
          <span class="text">{{title}}</span>
          <div class="closeCtn">
            <span class="el-icon-close"
              @click="close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="leftCtn">
            <div class="content">
              <div class="out_item"
                v-for="(item,index) in list"
                :key="index">
                <div class="label">{{item.title}}</div>
                <div :class="`inner_item ${itemInner.title === nowInfo.title && 'active' || ''}`"
                  v-for="(itemInner,indexInner) in item.content"
                  :key="indexInner"
                  :number='indexInner + 1'
                  @click="nowInfo = itemInner">{{itemInner.title}}</div>
              </div>
            </div>
          </div>
          <div class="rightCtn">
            <div class="center"
              v-if="!nowInfo.title">
              请选择要查看的教程
            </div>
            <div class="content"
              v-else>
              <el-image v-for="(item,index) in nowInfo.content"
                :key="index"
                :src="item"
                class="content_el_image"
                :preview-src-list="nowInfo.content"></el-image>
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
  props: {
    title: {
      type: String,
      default: '使用教程'
    },
    show: {
      type: Boolean,
      required: true
    },
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      nowInfo: {
        title: '',
        content: []
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
})
</script>

<style lang="less" scoped>
@import './usingTutorials.less';
</style>