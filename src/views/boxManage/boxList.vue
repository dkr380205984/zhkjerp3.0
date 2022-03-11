<template>
  <div id="boxListList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/boxManage/list?page=1')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">装箱计划出库</span>
      </div>
      <div class="tag"
        @click="$router.push('/boxManage/orderList?page=1')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">订单直接出库</span>
      </div>
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">发货单列表</span>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="titleCtn">
        <div class="title">发货单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn"></div>
        <div class="list">
          <div class="row title">
            <div class="col">出库单号</div>
            <div class="col">运输单位</div>
            <div class="col">运输城市</div>
            <div class="col">合计箱数</div>
            <div class="col">合计毛重</div>
            <div class="col">合计体积</div>
            <div class="col">创建人</div>
            <div class="col">创建时间</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.client_id}}</div>
            <div class="col">{{item.city}}</div>
            <div class="col">{{item.total_box}}箱</div>
            <div class="col">{{item.total_gross_weight}}kg</div>
            <div class="col">{{item.total_net_weight}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">创建时间</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/boxManage/boxDetail?id='+item.id)">详情</span>
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
import { boxManage } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      list: [],
      page: 1,
      total: 1,
      limit: 10
    }
  },
  methods: {
    changeRouter() {
      this.getList()
    },
    getList() {
      this.loading = true
      boxManage
        .list({
          page: this.page,
          limit: this.limit
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    }
  },
  mounted() {
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/boxList.less';
</style>