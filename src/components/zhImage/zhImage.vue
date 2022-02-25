<template>
  <div class="zhImageCtn">
    <div class="leftJT"
      @click="changeIndex(2)">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="hoverText">
      <div>
        <span>({{index+1}}</span>
        <span>/</span>
        <span>{{data.length>0?data.length:1}})</span>
      </div>
      <div style="cursor:pointer"
        class="hoverBlue"
        @click="isClickFlag=true">(查看大图)</div>
    </div>
    <div class="rightJT"
      @click="changeIndex(1)">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="realImage">
      <img :src="data[index]?data[index]:require('@/assets/image/common/noPic.png')" />
    </div>
    <div class="zh_img_screen"
      v-show="isClickFlag">
      <!--此处click事件是为了防止冒泡，prevent修饰符不知为何没用了-->
      <div class="close"
        @click.stop="isClickFlag = !isClickFlag">点此退出预览</div>
      <div class="zh_img_box">
        <img :src="data[index] || require('@/assets/image/common/noPic.png')"
          class="screen_img">
        <div class="left handle_btn_item el-icon-arrow-left"
          @click.stop="changeIndex(2)"></div>
        <div class="right handle_btn_item el-icon-arrow-right"
          @click.stop="changeIndex(1)"></div>
        <ul class="handle_indicator">
          <li v-for="(item,key) in data"
            :class="index === key ? 'active' : ''"
            :key="key"
            @click="index = key"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['data'],
  data() {
    return {
      image_data: [],
      index: 0,
      isClickFlag: false
    }
  },
  methods: {
    changeIndex(type: 1 | 2) {
      if (this.data.length === 1 || this.data.length === 0) {
        return
      }
      if (type === 1) {
        if (this.index < this.data.length - 1) {
          this.index++
        } else {
          this.index = 0
        }
      } else {
        if (this.index === 0) {
          this.index = this.data.length - 1
        } else {
          this.index--
        }
      }
      this.$forceUpdate()
    }
  }
})
</script>
<style lang="less" scoped>
@import './zhImage.less';
</style>