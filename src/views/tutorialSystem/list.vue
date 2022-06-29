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
          module: '报价单管理',
          id: 1
        },
        {
          module: '样单管理',
          id: 2
        },
        {
          module: '订单管理',
          id: 3
        },
        {
          module: '原料计划',
          id: 4
        },
        {
          module: '原料管理',
          id: 5
        },
        {
          module: '原料出入库',
          id: 6
        },
        {
          module: '辅料管理',
          id: 7
        },
        {
          module: '生产计划',
          id: 8
        },
        {
          module: '检验收发',
          id: 9
        },
        {
          module: '车间管理',
          id: 10
        },
        {
          module: '发货管理',
          id: 11
        },
        {
          module: '数据报表',
          id: 12
        },
        {
          module: '单据管理',
          id: 13
        },
        {
          module: '仓库管理',
          id: 14
        },
        {
          module: '客户与合作商管理',
          id: 15
        },
        {
          module: '原料预定购管理',
          id: 16
        },
        {
          id: 17,
          module: '工艺单管理'
        },
        {
          id: 18,
          module: '员工管理'
        },
        {
          id: 19,
          module: '系统设置'
        },
        {
          id: 20,
          module: '报销单管理'
        },
        {
          id: 21,
          module: '财务结算'
        },
        {
          id: 22,
          module: '首页'
        }
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
    tutorialSystem.list({ type: 2 }).then((res) => {
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