<template>
  <div id="productList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">产品列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索产品/样品编号"
              v-model="code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="product_name"
              placeholder="搜索产品/样品名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select v-model="product_type"
              placeholder="请选择类型"
              @change="changeRouter">
              <el-option label="全部"
                :value="0"></el-option>
              <el-option label="产品"
                :value="1"></el-option>
              <el-option label="样品"
                :value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="user_id"
              placeholder="请选择创建人"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <!-- <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="库存数量筛选"
              v-model="code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
          </div>
          <div class="elCtn">
          </div>
        </div> -->
        <zh-list :list="list"
          :listKey="originalSetting"
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
import { product } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      code: '',
      product_name: '',
      user_id: '',
      product_type: 0,
      list: [],
      loading: false,
      page: 1,
      limit: 10,
      total: 1,
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {}
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {}
        }
      ],
      originalSetting: [
        {
          key: 'product_code',
          name: '系统编号',
          ifShow: true,
          ifLock: true,
          index: 0,
          ifCaogao: 'product_type',
          caogaoArr: ['样', '产']
        },
        {
          key: 'name',
          name: '名称',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'style_code',
          name: '客户款号',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          index: 3,
          ifImage: true
        },
        {
          key: 'order_code',
          name: '关联单号',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'order_number',
          name: '历史下单数量',
          ifShow: true,
          ifLock: false,
          index: 5,
          errVal: '0'
        },
        {
          key: 'store_number',
          name: '库存数量',
          ifShow: true,
          ifLock: false,
          index: 6,
          errVal: '0'
        },
        {
          key: 'has_craft',
          name: '工艺单',
          ifShow: true,
          ifLock: false,
          index: 7,
          filterArr: ['', '待创建', '已创建'],
          classArr: ['', 'orange', 'blue']
        },
        {
          key: 'has_quote',
          name: '报价单',
          ifShow: true,
          ifLock: false,
          index: 8,
          filterArr: ['', '待创建', '已创建'],
          classArr: ['', 'orange', 'blue']
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 9
        },
        {
          key: 'update_at',
          name: '创建时间',
          ifShow: true,
          ifLock: false,
          index: 10
        }
      ]
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.limit = Number(query.limit) || 10
      this.product_type = Number(query.product_type) || 0
      this.product_name = query.product_name || ''
      this.code = query.product_code || ''
    },
    changeRouter() {
      this.$router.push(
        '/product/list?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&product_code=' +
          this.code +
          '&product_name=' +
          this.product_name +
          '&user_id=' +
          this.user_id +
          '&product_type=' +
          this.product_type
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/product/list?page=&limit=&product_code=&product_name=&user_id=&product_type=')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    getList() {
      product
        .list({
          page: this.page,
          limit: this.limit,
          product_code: this.code,
          product_name: this.product_name,
          product_type: this.product_type,
          user_id: this.user_id
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
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
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/product/list.less';
</style>