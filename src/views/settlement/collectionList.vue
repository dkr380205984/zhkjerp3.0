<template>
  <div id="collectionList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">应收款客户</span>
      </div>
      <div class="tag">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">应付款单位</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索公司名称"
              v-model="keyword"
              @change="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select placeholder="选择年份"
              v-model="keyword"
              @change="changeRouter"></el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="合作状态"
              v-model="keyword"
              @change="changeRouter"></el-select>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">公司简称</div>
            <div class="col">公司全称</div>
            <div class="col">客户类型</div>
            <div class="col">已下单总额</div>
            <div class="col">已下单总数</div>
            <div class="col">已发货总额</div>
            <div class="col">已发货总数</div>
            <div class="col">已开票总额</div>
            <div class="col">已收款总额</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col">已下单总额</div>
            <div class="col">已下单总数</div>
            <div class="col">已发货总额</div>
            <div class="col">已发货总数</div>
            <div class="col">已开票总额</div>
            <div class="col">已收款总额</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/settlement/collectionDetail?id='+item.id)">详情</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
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
import { client } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      keyword: '',
      page: 1,
      total: 1,
      limit: 10,
      list: []
    }
  },
  methods: {
    getList() {
      client
        .financialList({
          order_id: '',
          client_id: '',
          order_code: '',
          code: '',
          start_time: '',
          end_time: '',
          user_id: '',
          page: this.page,
          limit: this.limit
        })
        .then((res) => {
          console.log(res)
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
        })
    },
    changeRouter() {}
  },
  created() {
    this.getList()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/settlement/collectionList.less';
</style>

