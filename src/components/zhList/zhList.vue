<template>
  <div class="zhList fixedTableCtn"
    v-loading="loading">
    <div class="original">
      <div class="row title">
        <div class="column check"
          v-if="check">
          <span>全选</span>
        </div>
        <div class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index+Math.random(1)"
          v-show="itemKey.ifShow"
          :class="{'orderProcess':itemKey.specialForOrderPrcess==='order','sampleOrderProcess':itemKey.specialForOrderPrcess==='sampleOrder'}">{{itemKey.name}}</div>
        <div class="column w130">操作</div>
      </div>
      <div class="row"
        v-for="(item,index) in list"
        :key="index+Math.random(1)">
        <div class="column check"
          v-if="check">
          <el-checkbox></el-checkbox>
        </div>
        <div class="column"
          v-for="itemKey in listKey"
          :key="itemKey.index+Math.random(1)"
          v-show="itemKey.ifShow"
          :class="{'orderProcess':itemKey.specialForOrderPrcess==='order','sampleOrderProcess':itemKey.specialForOrderPrcess==='sampleOrder'}">
          <!-- 普通元素 -->
          <template v-if="!itemKey.from && !itemKey.ifImage && !itemKey.specialForOrderPrcess">
            <!-- 草稿标记 -->
            <span class="circle"
              v-if="itemKey.ifCaogao"
              :class="item[itemKey.ifCaogao]===1?'backOrange':'backBlue'">{{item[itemKey.ifCaogao]===1?'是':'否'}}</span>
            <span :class="itemKey.class || (itemKey.classArr?itemKey.classArr[item[itemKey.key]]:'')"
              class="text">
              {{itemKey.filterArr?itemKey.filterArr[item[itemKey.key]]:item[itemKey.key] ||item[itemKey.otherkey] || (itemKey.errVal||'未填写')}}{{itemKey.unit}}</span>
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
            {{item[itemKey.from][item.whichIndex||0][itemKey.key] || item[itemKey.from][item.whichIndex||0][itemKey.otherkey] || (itemKey.errVal||'未填写')}}
          </template>
          <template v-if="itemKey.from && itemKey.ifImage">
            <div class="imageCtn">
              <el-image :src="item[itemKey.from][item.whichIndex||0][itemKey.key].length>0?item[itemKey.from][item.whichIndex||0][itemKey.key][0]:require('@/assets/image/common/noPic.png')"
                :preview-src-list="item[itemKey.from][item.whichIndex||0][itemKey.key]">
              </el-image>
            </div>
          </template>
          <!-- 特殊元素，给订单流程搞得特殊值 -->
          <template v-if="itemKey.specialForOrderPrcess === 'order'">
            <div class="processCtn">
              <div class="process"
                :class="{'green':item.has_quote===1,'gray':item.has_quote===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'报价单'+(item.has_quote===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-baojiadan"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_material_plan===1,'gray':item.has_material_plan===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料计划'+(item.has_material_plan===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaojihua"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_material_order===1,'gray':item.has_material_order===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料采购'+(item.has_material_order===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaocaigou"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.push_progress===100||item.push_progress>100,'orange':item.push_progress>0 && item.push_progress<100,'gray':!item.push_progress}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料入库进度'+(item.push_progress||0)+'%'"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaoruku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.pop_progress===100||item.pop_progress>100,'orange':item.pop_progress>0 && item.pop_progress<100,'gray':!item.pop_progress}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料出库进度'+(item.pop_progress||0)+'%'"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaochuku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_weave_plan===1,'gray':item.has_weave_plan===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'生产计划'+(item.has_weave_plan===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shengchanjihua1"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.inspection_push_progress===100||item.inspection_push_progress>100,'orange':item.inspection_push_progress>0 && item.inspection_push_progress<100,'gray':!item.inspection_push_progress}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'生产检验进度'+(item.inspection_push_progress||0)+'%'"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-jianyanruku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_pack_order===1,'gray':item.has_pack_order===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'包装订购'+(item.has_pack_order===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-baozhuangcaigou"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process gray">
                <el-tooltip class="item"
                  effect="dark"
                  content="装箱出库暂不支持"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-zhuangxiangchuku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process gray">
                <el-tooltip class="item"
                  effect="dark"
                  content="财务结算暂不支持"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caiwukaipiao"></use>
                  </svg>
                </el-tooltip>
              </div>
            </div>
          </template>
          <template v-if="itemKey.specialForOrderPrcess === 'sampleOrder'">
            <div class="processCtn">
              <div class="process"
                :class="{'green':item.has_quote===1,'gray':item.has_quote===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'报价单'+(item.has_quote===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-baojiadan"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_material_plan===1,'gray':item.has_material_plan===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料计划'+(item.has_material_plan===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaojihua"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_material_order===1,'gray':item.has_material_order===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料采购'+(item.has_material_order===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaocaigou"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.push_progress===100||item.push_progress>100,'orange':item.push_progress>0 && item.push_progress<100,'gray':!item.push_progress}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料入库进度'+(item.push_progress||0)+'%'"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaoruku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.pop_progress===100||item.pop_progress>100,'orange':item.pop_progress>0 && item.pop_progress<100,'gray':!item.pop_progress}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'原料出库进度'+(item.pop_progress||0)+'%'"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-yuanliaochuku"></use>
                  </svg>
                </el-tooltip>
              </div>
              <div class="process"
                :class="{'green':item.has_weave_plan===1,'gray':item.has_weave_plan===2}">
                <el-tooltip class="item"
                  effect="dark"
                  :content="'生产计划'+(item.has_weave_plan===1?'已添加':'未添加')"
                  placement="top">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shengchanjihua1"></use>
                  </svg>
                </el-tooltip>
              </div>
            </div>
          </template>
        </div>
        <div class="column w130">
          <!-- 给操作栏留的占位符 -->
        </div>
      </div>
    </div>
    <div class="cover">
      <div class="fixedLeft">
        <div class="row title">
          <div class="column check"
            v-if="check">
            <el-checkbox :indeterminate="isIndeterminate"
              v-model="allCheck"
              @change="handleCheckAllChange"></el-checkbox>
          </div>
          <div class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index+Math.random(1)"
            v-show="itemKey.ifShow && itemKey.ifLock">{{itemKey.name}}</div>
        </div>
        <div class="row"
          v-for="item,index in list"
          :key="index+Math.random(1)">
          <div class="column check"
            v-if="check">
            <el-checkbox v-model="item.isCheck"
              @change="checkChange"></el-checkbox>
          </div>
          <div class="column"
            v-for="itemKey in listKey"
            :key="itemKey.index+Math.random(1)"
            v-show="itemKey.ifShow && itemKey.ifLock">
            <!-- 普通元素 -->
            <template v-if="!itemKey.from && !item.ifImage">
              <span class="circle"
                v-if="itemKey.ifCaogao"
                :class="item[itemKey.ifCaogao]===1?'backOrange':'backBlue'">{{item[itemKey.ifCaogao]===1?itemKey.caogaoArr[0]:itemKey.caogaoArr[1]}}</span>
              <span :class="itemKey.class || (itemKey.classArr?itemKey.classArr[item[itemKey.key]]:'')"
                class="text">
                {{itemKey.filterArr?itemKey.filterArr[item[itemKey.key]]:item[itemKey.key] || item[itemKey.otherkey] || (itemKey.errVal||'未填写')}}{{itemKey.unit}}</span>
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
          :key="index+Math.random(1)">
          <div class="column w130">
            <div class="opr"
              :class="typeof(itemOpr.class)==='function'?itemOpr.class(item):itemOpr.class"
              v-for="(itemOpr,indexOpr) in oprList"
              :key="indexOpr+Math.random(1)"
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
    check: {
      type: Boolean,
      required: false
    },
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
    checkedCount: {
      type: Array,
      required: false
    },
    // 操作列
    oprList: {
      type: Array,
      required: false
    }
  },
  data(): {
    isIndeterminate: boolean
    allCheck: boolean
  } {
    return {
      isIndeterminate: false,
      allCheck: false
    }
  },
  methods: {
    changeIndex(type: 1 | 2, length: number, item: any) {
      if (length === 1) {
        return
      }
      item.whichIndex = item.whichIndex || 0
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
    },
    handleCheckAllChange(val: any) {
      if (this.isIndeterminate || this.allCheck) {
        this.list.forEach((item: any) => {
          this.checkedCount.pop()
        })
        this.list.forEach((item: any) => {
          item.isCheck = true
          this.checkedCount.push(2)
        })
      } else {
        this.list.forEach((item: any) => {
          item.isCheck = false
          this.checkedCount.pop()
        })
      }

      // console.log(val)
      this.isIndeterminate = false
    },
    checkChange(val: any) {
      // console.log(val,this.checkedCount)
      if (val) {
        this.checkedCount.push(2)
      } else {
        this.checkedCount.pop()
        this.allCheck = false
      }
      if (this.checkedCount.length === 0) {
        this.isIndeterminate = false
      } else if (this.checkedCount.length === this.list.length) {
        this.isIndeterminate = false
        this.allCheck = true
      } else {
        this.isIndeterminate = true
      }
      // this.allCheck = this.checkedCount.length === this.list.length;
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhList.less';
</style>
<style lang="less">
.imageCtn {
  .el-image__inner {
    width: auto !important;
  }
}
</style>