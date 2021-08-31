<template>
  <div id="craftCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img :src="null|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品编号：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品名称：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品品类：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品编号：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品名称：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品品类：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品成分：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品配色：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品规格：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text blue"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料经向</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">配色信息</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn colourCtn">
              <el-select class="colour"
                placeholder="请选择产品配色组"
                v-model="testValue"></el-select>
              <span class="btn hoverBlue">添加色组</span>
              <span class="btn hoverRed">删除色组</span>
              <zh-color-picker class="color"
                v-model="testColor"
                :content="filterIndex(0)"
                :colorArr="yarnColorList"></zh-color-picker>
              <div class="borderBtn">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">主要原料</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择主要原料"
                v-model="testValue"></el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">次要原料</span>
            </div>
            <div class="elCtn colourCtn">
              <el-select class="colour noBottom"
                placeholder="请选择次要原料"
                v-model="testValue"></el-select>
              <span class="btn hoverBlue">添加原料</span>
              <span class="btn hoverRed">删除原料</span>
              <el-select placeholder="夹"
                class="jia"></el-select>
              <el-select placeholder="夹"
                class="jia"></el-select>
              <div class="borderBtn">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">辅助原料</span>
            </div>
            <div class="elCtn colourCtn">
              <el-select class="colour"
                placeholder="请选择辅助原料"
                v-model="testValue"></el-select>
              <span class="btn hoverBlue">添加原料</span>
              <span class="btn hoverRed">删除原料</span>
              <el-select placeholder="夹"
                class="jia"></el-select>
              <el-select placeholder="夹"
                class="jia"></el-select>
              <div class="borderBtn">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">经向排列</span>
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
  data() {
    return {
      testValue: '',
      testColor: {
        color: '',
        name: ''
      }
    }
  },
  computed: {
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr
    }
  },
  methods: {
    // 匹配主/夹名称
    filterIndex(index: number): string {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/create.less';
</style>