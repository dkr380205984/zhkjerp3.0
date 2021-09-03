<template>
  <div id="clientList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        :class="{'active':type===1}"
        @click="type=1;changeRouter()">
        <i class="icon">图标</i>
        <span class="text">客户管理</span>
      </div>
      <div class="tag"
        :class="{'active':type===2}"
        @click="type=2;changeRouter()">
        <i class="icon">图标</i>
        <span class="text">合作单位管理</span>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/client/create?type='+$route.query.type)">添加客户</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">客户名称</div>
            <div class="col">客户简称</div>
            <div class="col">客户类型</div>
            <div class="col">客户标签</div>
            <div class="col">客户状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col">{{item.rel_tag_data.map((item)=>item.name).join('/')}}</div>
            <div class="col"
              :class="{'green':item.status===1,'red':item.status===2}">{{item.status===1?'合作中':'终止合作'}}</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue">终止合作</span>
              <span class="opr hoverRed">删除</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, clientType } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      loading: true,
      list: [],
      page: 1,
      total: 1,
      type: 1,
      clientTypeList: []
    }
  },
  computed: {},
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.type = Number(query.type)
    },
    changeRouter() {
      this.$router.push('/client/list?page=' + this.page + '&type=' + this.type)
    },
    getList() {
      this.loading = true
      client
        .list({
          limit: 5,
          page: this.page,
          type_id: this.clientTypeList
            .filter((item: { type: string }) => Number(item.type) === Number(this.type))
            .map((item: any) => item.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    }
  },
  mounted() {
    // 由于列表需要用到type数据，所以这里不用checkCommonInfo
    clientType.list().then((res) => {
      this.clientTypeList = res.data.data
      this.getFilters()
      this.getList()
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/client/list.less';
</style>