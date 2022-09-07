<template>
  <div id="productionPlanList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/productionPlan/list?page=&keyword=&client_id=&user_id=&group_id=&order_type=&status=&date=&limit=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shengchanjihua2'></use>
        </svg>
        <span class="text">生产计划</span>
      </div>
      <div class="tag"
        @click="$router.push('/productionPlan/progressList?page=1')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shengchanjindu'></use>
        </svg>
        <span class="text">生产进度</span>
      </div>
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shengchanjindu'></use>
        </svg>
        <span class="text">生产流转码</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产流转码列表</div>
      </div>
      <div class="listCtn"
        v-loaing="loading">
        <div class="filterCtn"></div>
        <zh-list :list="list"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"></zh-list>
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
import { productionPlan } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      loading: false,
      page: 1,
      total: 1,
      limit: 10,
      listKey: [
        {
          key: 'code',
          name: '流转卡编号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'num',
          name: '流转卡序号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '订单下单客户',
          ifShow: true,
          index: 2
        },
        {
          key: 'group_name',
          name: '所属负责小组',
          ifShow: true,
          index: 3
        },
        {
          key: 'user_name',
          name: '订单创建人',
          ifShow: true,
          index: 4
        },
        {
          key: 'product_code',
          name: '产品编号品类',
          ifShow: true,
          index: 5
        },
        {
          key: 'product_image',
          name: '产品图片',
          ifShow: true,
          ifImage: true,
          index: 6
        },
        {
          key: 'size_color',
          name: '尺码颜色',
          ifShow: true,
          index: 7
        },
        {
          key: 'order_number',
          name: '下单数量',
          ifShow: true,
          index: 8
        },
        {
          key: 'plan_number',
          name: '计划生产数量',
          ifShow: true,
          index: 9
        },
        {
          key: 'number',
          name: '每包装件数',
          ifShow: true,
          index: 10
        },
        {
          key: 'weight',
          name: '每件回厂克重',
          ifShow: true,
          index: 11
        },
        {
          key: 'total_weight',
          name: '每袋回厂克重',
          ifShow: true,
          index: 12
        },
        {
          key: 'real_weight',
          name: '工厂实际每袋克重',
          ifShow: true,
          index: 13
        },
        {
          key: 'real_number',
          name: '工厂实际收件数量',
          ifShow: true,
          index: 14
        }
      ],
      oprList: [
        {
          name: '收件',
          class: 'hoverOrange',
          fn: (item: any) => {}
        },
        {
          name: '完成',
          class: 'hoverGreen',
          fn: (item: any) => {}
        },
        {
          name: '发件',
          class: 'hoverBlue',
          fn: (item: any) => {}
        }
      ],
      list: []
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
    },
    changeRouter(ev: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push('/productionPlan/codeList?page=' + this.page)
    },
    getList() {
      this.loading = true
      productionPlan
        .listCode({
          limit: this.limit,
          page: this.page
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items.map((item: any) => {
              item.product_image = item.product_image.map((itemChild: any) => itemChild.image_url)
              return item
            })
            this.total = res.data.data.total
          }
          this.loading = false
        })
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/codeList.less';
</style>