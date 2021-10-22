<template>
  <div id="orderList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="type=1;changeRouter()">
        <i class="icon">图标</i>
        <span class="text">原料管理</span>
      </div>
      <div class="tag"
        @click="type=2;changeRouter()">
        <i class="icon">图标</i>
        <span class="text">辅料管理</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">物料管理列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverOrange fr"
            @click="showSetting=true">列表设置</div>
        </div>
        <div class="fixedTableCtn"
          v-loading="loading">
          <div class="original">
            <div class="row title">
              <div class="column"
                v-for="itemKey in listKey"
                :key="itemKey.index"
                v-show="itemKey.ifShow">{{itemKey.name}}</div>
              <div class="column w130">操作</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.list">
              <div class="column"
                v-for="itemKey in listKey"
                :key="itemKey.index"
                v-show="itemKey.ifShow">
                <template v-if="itemKey.index === 0">
                  <span class="mark backBlue">样</span>
                </template>
                {{item[itemKey.key]}}
              </div>
              <div class="column w130">
                <!-- 操作占位符 -->
              </div>
            </div>
          </div>
          <div class="cover">
            <div class="fixedLeft">
              <div class="row title">
                <div class="column"
                  v-for="itemKey in listKey"
                  :key="itemKey.index"
                  v-show="itemKey.ifShow && itemKey.ifLock">{{itemKey.name}}</div>
              </div>
              <div class="row"
                v-for="item in list"
                :key="item.list">
                <div class="column"
                  v-for="itemKey in listKey"
                  :key="itemKey.index"
                  v-show="itemKey.ifShow && itemKey.ifLock">
                  <template v-if="itemKey.index === 0">
                    <span class="mark backBlue">样</span>
                    <span class="overText">{{item[itemKey.key]}}</span>
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
                v-for="item in list"
                :key="item.list">
                <div class="column w130">
                  <div class="opr hoverBlue"
                    @click="$router.push('/materialManage/detail?id='+item.id + '&type=' + type)">订购加工</div>
                </div>
              </div>
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
    <!-- 列表设置 -->
    <zh-list-setting @close="showSetting=false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="5"
      :data.sync="listKey"
      :originalData="originalSetting"></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan, listSetting } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
export default Vue.extend({
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      loading: false,
      list: [],
      total: 1,
      page: 1,
      showSetting: false,
      listSettingId: null,
      type: 1,
      listKey: [],
      originalSetting: [
        {
          key: 'code',
          name: '计划单编号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'contact_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 4
        }
      ]
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.type = Number(query.type)
    },
    changeRouter() {
      this.$router.push('/materialManage/list?page=' + this.page + '&type=' + this.type)
    },
    getList() {
      materialPlan
        .list({
          limit: 5,
          page: this.page
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
        })
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 5
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
        })
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
    this.getListSetting()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/list.less';
</style>