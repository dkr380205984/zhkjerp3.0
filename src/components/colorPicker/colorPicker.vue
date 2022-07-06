<template>
  <div class="colorPickerCtn">
    <div class="colorPicker">
      <!-- 占位符 -->
      <span class="placeHolder">{{content}}</span>
      <!-- input输入框,用于获取鼠标blur事件 -->
      <input class="getFocus"
        @click="show"
        @blur="hide"
        :style="{'background':color}" />
      <!-- 实际显示的文字 设置点透-->
      <span class="realContent">{{content}}</span>
      <div class="selectList"
        v-show="flag||flag2">
        <div class="selectListCtn">
          <div class="searchOpt">
            <input ref="search"
              type="text"
              placeholder="可搜索潘通色号"
              v-model="search"
              @mousedown="flag3=true"
              @blur="flag2=false" />
          </div>
          <div class="selectListChild"
            v-for="(item,index) in colorArray"
            :key="index"
            @mousedown="getColor(item.color_code,item.name)"
            node="colorPick">
            <div class="bgColorBlock"
              :style="{'background':item.color_code}"></div>
            <span class="bgColorLabel">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="editTextCtn">
      <input class="editInput"
        v-model="tips"
        @change="getName"
        placeholder="选择颜色"
        :disabled="!color" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { pantongList } from '@/assets/js/api'
interface YarnColorInfo {
  color_code: string
  name: string
  id: number
}
export default Vue.extend({
  props: ['value', 'colorArr', 'content'],
  data(): {
    oldColorArr: YarnColorInfo[]
    colorArray: YarnColorInfo[]
    [propName: string]: any
  } {
    return {
      flag: false,
      flag2: false,
      flag3: false,
      color: this.value.color,
      oldColorArr: [], // 原始数据
      colorArray: [],
      search: '',
      tips: this.value.name
    }
  },
  watch: {
    // 颜色数据更新或初始化页面拿不到colorArr的时候需要监听父级传过来的值
    colorArr(newVal) {
      this.oldColorArr = newVal
      this.colorArray = newVal
    },
    search(newVal) {
      if (!newVal) {
        this.colorArray = this.oldColorArr.filter((item) => {
          return item.name.indexOf(newVal) !== -1
        })
      } else {
        pantongList({
          keyword: newVal
        }).then((res) => {
          this.colorArray = this.oldColorArr
            .filter((item) => {
              return item.name.indexOf(newVal) !== -1
            })
            .concat(res.data.data)
        })
      }
    },
    // 监听父级传过来的值,并修改background-color
    value(val) {
      this.color = val.color
      this.tips = val.name
    }
  },
  methods: {
    show() {
      this.flag = !this.flag
      this.flag2 = !this.flag2
    },
    hide() {
      this.flag = false
      if (!this.flag3) {
        this.flag2 = false
      }
    },
    getColor(color: string, name: string) {
      this.tips = name
      this.color = color
      this.$emit('input', {
        color: color,
        name: name
      })
      this.$emit('colorChange', {
        color: color,
        name: name
      })
    },
    getName() {
      this.$emit('input', {
        color: this.color,
        name: this.tips
      })
    }
  },
  mounted() {
    this.oldColorArr = this.colorArr
    this.colorArray = this.colorArr
  }
})
</script>
<style lang="less" scoped>
@import './colorPicker.less';
</style>
