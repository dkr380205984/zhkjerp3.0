<template>
  <div id="tutorialSystemDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">{{tutorialSystemInfo.title}}</div>
      </div>
      <div class="stepsCtn">
        <div class="step_item"
          v-for="(item,index) in tutorialSystemInfo.content"
          :key="index">
          <div class="lineCtn">
            <div class="step_num">{{index+1}}</div>
            <div class="step_line"></div>
          </div>
          <div class="contentCtn">
            <div class="textCtn">{{item.describe}}</div>
            <div class="imageCtn">
              <template v-if="item.file_data.length>0">
                <el-image v-for="(itemImg,indexImg) in item.file_data"
                  :key="indexImg"
                  :src="item.file_data[indexImg]"
                  :preview-src-list="[item.file_data[indexImg]]">
                </el-image>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverOrange"
            @click="$router.push('/tutorialSystem/list')">不是我想要的，返回重新搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { tutorialSystem } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      loading: true,
      tutorialSystemInfo: {
        content: '',
        title: ''
      }
    }
  },
  mounted() {
    tutorialSystem
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        console.log(res)
        this.tutorialSystemInfo = res.data.data
        this.tutorialSystemInfo.content = JSON.parse(this.tutorialSystemInfo.content)
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/tutorialSystem/detail.less';
</style>