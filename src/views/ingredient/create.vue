<template>
  <div id="ingredientCreate"
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
        <div class="title">大身信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">物料选择：</div>
            <div class="btnList">
              <div class="button active">原料</div>
              <div class="button">辅料</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">配色尺码：</div>
            <div class="selectBtnList">
              <div class="selectButton selected">尺码/颜色</div>
              <div class="selectButton success">尺码/颜色</div>
              <div class="selectButton error">尺码/颜色</div>
            </div>
          </div>
        </div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">物料名称</div>
            <div class="tcol">物料属性</div>
            <div class="tcol">物料数量</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="testValue"
                  placeholder="请输入物料名称"></el-input>
              </div>
            </div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="testValue"
                  placeholder="请输入物料属性"></el-input>
              </div>
            </div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="testValue"
                  placeholder="请输入物料数量"></el-input>
              </div>
            </div>
            <div class="tcol oprCtn">
              <div class="opr hoverBlue">复制</div>
              <div class="opr hoverRed">删除</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">配件信息</div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="saveIngredient(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveIngredient(false)">提交</div>
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
    saveIngredient(ifCaogao: boolean) {}
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/ingredient/create.less';
</style>