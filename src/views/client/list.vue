<template>
  <div id="clientList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        :class="{'active':type===1}"
        @click="type=1;changeRouter()">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">客户管理</span>
      </div>
      <div class="tag"
        :class="{'active':type===2}"
        @click="type=2;changeRouter()">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">合作单位管理</span>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索公司名称"
              v-model="keyword"
              @change="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select placeholder="筛选客户状态"
              v-model="status"
              @change="changeRouter">
              <el-option label="全部"
                :value="null"></el-option>
              <el-option label="合作中"
                :value="1"></el-option>
              <el-option label="暂停合作"
                :value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="客户类型筛选"
              v-model="clientType"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in clientTypeArr"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/client/create?type='+$route.query.type)">{{type===1?'添加客户':'添加合作商'}}</div>
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
              :class="{'green':item.status===1,'red':item.status===0}">{{item.status===1?'合作中':'终止合作'}}</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="checkClient(item.id,item.status)">{{item.status===1?'终止合作':'继续合作'}}</span>
              <span class="opr hoverOrange"
                @click="$router.push('/client/update?id='+item.id + '&type='+$route.query.type)">修改</span>
              <span class="opr hoverRed"
                @click="deleteClient(item.id)">删除</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, clientCheck, clientType } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      keyword: '',
      list: [],
      page: 1,
      total: 1,
      type: 1,
      status: 1,
      clientTypeList: [],
      clientType: ''
    }
  },
  computed: {
    clientTypeArr(): any {
      return this.clientTypeList.filter((item: { type: string }) => Number(item.type) === Number(this.type))
    }
  },
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
      this.status = query.status === 'null' ? null : Number(query.status)
      this.keyword = query.keyword
      this.clientType = Number(query.clientType) || ''
    },
    changeRouter() {
      this.$router.push(
        '/client/list?page=' +
          this.page +
          '&type=' +
          this.type +
          '&keyword=' +
          this.keyword +
          '&status=' +
          this.status +
          '&clientType=' +
          this.clientType
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.status = 1
          this.keyword = ''
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    getList() {
      this.loading = true
      client
        .list({
          limit: 5,
          page: this.page,
          name: this.keyword,
          status: this.status,
          tag_id: null, // 筛选标签用的，暂时没用到
          client_type_id: this.clientType ? [this.clientType] : this.clientTypeArr.map((item: any) => item.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    checkClient(id: number, status: 1 | 2) {
      this.$confirm(status === 1 ? '是否终止合作?' : '是否重新合作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          client
            .check({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    deleteClient(id: number) {
      this.$confirm('是否删除该客户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          client
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    }
  },
  created() {
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