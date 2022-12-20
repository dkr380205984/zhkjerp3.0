<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
@import '~@/assets/css/element.less';
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  font-family: Source Han Sans CN;
}
#app {
  height: 100%;
  width: 100%;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0);
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 4px;
  background-color: transparent;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  height: 4px;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.1);
}

.el-pagination span:not([class*=suffix]){
  line-height: 32px!important;
  height: 32px!important;
}

// 统一placeholder
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(0, 0, 0, 0.25) !important;
}
::-moz-placeholder {
  /* Firefox 19+ */
  color: rgba(0, 0, 0, 0.25) !important;
}
:-ms-input-placeholder {
  /* IE 10+ */
  color: rgba(0, 0, 0, 0.25) !important;
}
:-moz-placeholder {
  /* Firefox 18- */
  color: rgba(0, 0, 0, 0.25) !important;
}
</style>