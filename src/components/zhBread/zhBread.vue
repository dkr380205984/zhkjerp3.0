<template>
  <div class="zh-bread">
    <div class="zh-bread-once"
      :class="{'active':activeUrl==='主页'}">
      <div class="zh-bread-label"
        @click="$router.push('/homePage')">首页</div>
    </div>
    <div class="zh-bread-once"
      :class="{'active':activeUrl===item.name}"
      v-for="item in breadList"
      :key="item.name">
      <div class="zh-bread-label"
        @click="$router.push(item.fullPath)">{{item.name}}</div>
      <div class="el-icon-close"
        @click="closeTag(item)"></div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    breadList () {
      return this.$store.state.status.breadUrl
    },
    activeUrl () {
      return this.$route.name
    }
  },
  methods: {
    closeTag (item) {
      if (this.activeUrl === item.name) {
        let findIndex = 0
        let finded = this.breadList.find((itemFind, index) => {
          findIndex = index
          return itemFind.name === item.name
        })
        if (finded) {
          if (findIndex > 0) {
            this.$router.push(this.breadList[findIndex - 1].fullPath)
          } else {
            this.$router.push('/index')
          }
        } else {
          this.$router.push('/index')
        }
      }
      this.$store.commit('status/deleteRoute', item)
    }
  }
}
</script>

<style scoped lang="less">
@import './zhBread.less';
</style>
