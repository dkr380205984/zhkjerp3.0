<template>
  <div class="zhList fixedTableCtn"
    v-loading="loading">
    <div class="original">
      <div class="row title">
        <div class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index"
          v-show="itemKey.ifShow">{{itemKey.name}}</div>
        <div class="column w130">操作</div>
      </div>
      <div class="row"
        v-for="(item,index) in list"
        :key="index">
        <div class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index"
          v-show="itemKey.ifShow">
          <!-- 普通元素 -->
          <template v-if="!itemKey.from && !item.ifImage">
            <!-- 草稿标记 -->
            <span class="circle"
              v-if="itemKey.ifCaogao"
              :class="item[itemKey.ifCaogao]===1?'backOrange':'backBlue'">{{item[itemKey.ifCaogao]===1?'是':'否'}}</span>
            <span :class="itemKey.class || (itemKey.classArr?itemKey.classArr[item[itemKey.key]]:'')">
              {{itemKey.filterArr?itemKey.filterArr[item[itemKey.key]]:item[itemKey.key] || '未填写'}}{{itemKey.unit}}</span>
          </template>
          <!-- 图片元素 -->
          <template v-if="!itemKey.from && itemKey.ifImage">
            <div class="imageCtn">
              <el-image :src="item[itemKey.key].length>0?item[itemKey.key][0]:require('@/assets/image/common/noPic.png')"
                :preview-src-list="item[itemKey.key]">
              </el-image>
            </div>
          </template>
          <!-- 类似订单里包含多个产品信息的元素 -->
          <template v-if="itemKey.from && !itemKey.ifImage && itemKey.mark">
            <div class="sortCtn">
              <i class="el-icon-caret-top"
                @click="changeIndex(1,item[itemKey.from].length,item)"></i>
              <span class="number">{{((item.whichIndex||0)+1) + '/' + item[itemKey.from].length}}</span>
              <i class="el-icon-caret-bottom"
                @click="changeIndex(2,item[itemKey.from].length,item)"></i>
            </div>
            {{item[itemKey.from][item.whichIndex||0][itemKey.key] || '未填写'}}
          </template>
          <template v-if="itemKey.from && itemKey.ifImage">
            <div class="imageCtn">
              <el-image :src="item[itemKey.from][item.whichIndex||0][itemKey.key].length>0?item[itemKey.from][item.whichIndex||0][itemKey.key][0]:require('@/assets/image/common/noPic.png')"
                :preview-src-list="item[itemKey.from][item.whichIndex||0][itemKey.key]">
              </el-image>
            </div>
          </template>
        </div>
        <div class="column w130">
          <!-- 占位符 -->
        </div>
      </div>
    </div>
    <div class="cover">
      <div class="fixedLeft">
        <div class="row title">
          <div class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index"
            v-show="itemKey.ifShow && itemKey.ifLock">{{itemKey.name}}</div>
        </div>
        <div class="row"
          v-for="item,index in list"
          :key="index">
          <div class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index"
            v-show="itemKey.ifShow && itemKey.ifLock">
            <!-- 普通元素 -->
            <template v-if="!itemKey.from && !item.ifImage">
              <span class="circle"
                v-if="itemKey.ifCaogao"
                :class="item[itemKey.ifCaogao]===1?'backOrange':'backBlue'">{{item[itemKey.ifCaogao]===1?'草':'整'}}</span>
              <span :class="itemKey.class || (itemKey.classArr?itemKey.classArr[item[itemKey.key]]:'')">
                {{itemKey.filterArr?itemKey.filterArr[item[itemKey.key]]:item[itemKey.key] || '未填写'}}{{itemKey.unit}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="cover">
      <div class="fixedRight">
        <div class="row title">
          <div class="column w130">操作</div>
        </div>
        <div class="row"
          v-for="(item,index) in list"
          :key="index">
          <div class="column w130">
            <div class="opr"
              :class="typeof(itemOpr.class)==='function'?itemOpr.class(item):itemOpr.class"
              v-for="(itemOpr,indexOpr) in oprList"
              :key="indexOpr"
              @click="itemOpr.fn(item)">{{typeof(itemOpr.name)==='function'?itemOpr.name(item):itemOpr.name}}</div>
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
    // 列表数据
    list: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    // 需要渲染的key值
    listKey: {
      type: Array,
      required: true
    },
    // 操作列
    oprList: {
      type: Array,
      required: false
    }
  },
  methods: {
    changeIndex(type: 1 | 2, length: number, item: any) {
      if (length === 1) {
        return
      }
      if (type === 1) {
        if (item.whichIndex < length - 1) {
          item.whichIndex++
        } else {
          item.whichIndex = 0
        }
      } else {
        if (item.whichIndex === 0) {
          item.whichIndex = length - 1
        } else {
          item.whichIndex--
        }
      }
      this.$forceUpdate()
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhList.less';
</style>