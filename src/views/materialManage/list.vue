<template>
  <div id="orderList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-yuanliaoguanli"></use>
          </svg>
        </div>
        <span class="text">原料管理</span>
      </div>
      <div class="tag"
        @click="$router.push('/accessoriesManage/list?page=1&code=&date=')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-fuliaoguanli"></use>
          </svg>
        </div>
        <span class="text">辅料管理</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料管理列表</div>
      </div>
      <div class="listCtn"
        v-loading="loading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索计划单号"
              v-model="code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="搜索订单号"
              v-model="order_code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changeRouter"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="changeRouter">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">计划单号</div>
            <div class="col">关联订单</div>
            <div class="col">创建人</div>
            <div class="col">创建日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at.slice(0,10)}}</div>
            <div class="col">
              <span class="opr hoverBlue"
                @click="$router.push('/materialManage/detail?id='+item.id)">订购加工</span>
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
import { materialPlan, listSetting } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { limitArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      loading: false,
      list: [],
      limitList: limitArr,
      total: 1,
      page: 1,
      limit: 10,
      code: '',
      order_code: '',
      date: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.code = query.code
      this.order_code = query.order_code
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    changeRouter() {
      this.$router.push(
        '/materialManage/list?page=' +
          this.page +
          '&code=' +
          this.code +
          '&order_code=' +
          this.order_code +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.code = ''
          this.order_code = ''
          this.date = []
          this.limit = 10
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
      materialPlan
        .list({
          limit: this.limit,
          page: this.page,
          keyword: this.code,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
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
  created() {
    this.getFilters()
    this.getList()
    this.getListSetting()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/list.less';
</style>