<template>
  <div class="bodyContainer"
    id="tutorialSystemList">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统教程列表</div>
      </div>
      <div class="contentCtn">
        <div class="elCtn">
          <el-autocomplete v-model="keyword"
            class="searchInput"
            :fetch-suggestions="querySearch"
            placeholder="请输入搜索内容"
            @select="handleSelect">
          </el-autocomplete>
        </div>
        <div class="tutorialCtn">
          <el-collapse v-model="activeName"
            accordion>
            <el-collapse-item v-for="(item,index) in systemModule"
              :key="index"
              :name="item.id">
              <template slot="title">{{item.module}}({{item.module_info ? item.module_info.length : 0}}) </template>
              <div class="collapse__inner_item"
                v-for="(value,key) in item.module_info || []"
                :key="key">
                <span class="text hoverBlue"
                  @click="$openUrl('/tutorialSystem/detail?id=' + value.id)">{{key+1}}<strong>、</strong>{{value.title}}</span>
              </div>
              <div class="collapse__inner_item"
                v-if="!item.module_info || item.module_info.length === 0">
                <span class="text orange">该模块暂无教程</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { tutorialSystem } from '@/assets/js/api'
import { systemModule } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      list: [],
      keyword: '',
      activeName: '',
      systemModule: [
        {
          id: 99,
          module: '常见问题'
        },
        ...systemModule
      ]
    }
  },
  methods: {
    querySearch(queryString: string, cb: Function) {
      let beforeReturnInfo = this.systemModule
        .map((item: any) => item.module_info || [])
        .reduce((a: any, b: any) => {
          return a.concat(b)
        })
        .map((item: any) => {
          return {
            value: item.title,
            id: item.id
          }
        })
      cb(
        queryString ? beforeReturnInfo.filter((item: any) => item.value.indexOf(queryString) !== -1) : beforeReturnInfo
      )
    },
    handleSelect(event: any) {
      this.$openUrl('/tutorialSystem/detail?id=' + event.id)
    }
  },
  mounted() {
    tutorialSystem.list({ type: 1 }).then((res) => {
      if (res.data.status) {
        this.list = res.data.data
        this.list.forEach((item: any) => {
          let finded = this.systemModule.find((val: any) => val.id === item.module_id)
          if (finded) {
            console.log(finded)
            if (!finded.module_info) {
              finded.module_info = [item]
            } else {
              finded.module_info.push(item)
            }
          }
        })
        this.$forceUpdate()
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/tutorialSystem/list.less';
</style>
<style lang="less">
.collapse__inner_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  .text {
    cursor: pointer;
  }
}
</style>