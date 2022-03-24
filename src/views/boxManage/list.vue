<template>
  <div id="boxList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag active">
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
      <div class="tag"
        @click="$router.push('/boxManage/boxList?page=1')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">发货单列表</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">单据列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn"></div>
        <div class="filterCtn clearfix">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check"
            v-for="item in checkList"
            :key="item.id">
            <el-input v-model="item.code"
              disabled></el-input>
          </div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/boxManage/detail?id='+JSON.stringify(checkList.map((item)=>item.id)))">去发货</div>
        </div>
        <div class="list"
          v-loading="loading">
          <div class="row title">
            <div class="col check"
              style="max-width: 20px!important;min-width: 20px!important;"></div>
            <div class="col">计划单号</div>
            <div class="col">发货时间</div>
            <div class="col">关联订单</div>
            <div class="col">负责小组/人</div>
            <div class="col">合计计划数量</div>
            <div class="col">合计发货数量</div>
            <div class="col">发货比例</div>
            <div class="col">创建人</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col check"
              style="max-width: 20px!important;min-width: 20px!important;">
              <el-checkbox v-model="item.check"
                @change="(ev)=>{getPlan(ev,item)}"></el-checkbox>
            </div>
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.delivery_time}}</div>
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.group_name}}</div>
            <div class="col">{{item.total_delivery_number}}</div>
            <div class="col">{{item.total_delivery_number}}</div>
            <div class="col">{{item.delivery_pre}}%</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">
              <div class="opr hoverBlue"
                @click="$router.push('/boxManage/detail?id='+JSON.stringify([item.id]))">去发货</div>
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
import { packManage } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      list: [],
      checkList: [],
      page: 1,
      total: 1,
      limit: 10,
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
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.status = query.status || '0'
      this.user_id = query.user_id || ''
      this.group_id = Number(query.group_id) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/packManage/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&group_id=' +
          this.group_id +
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
          this.client_id = []
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.date = []
          this.status = '0'
          this.order_type = null
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
      packManage
        .planList({
          is_draft: 2,
          keyword: this.keyword,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: this.limit,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          group_id: this.group_id
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    getPlan(ev: boolean, info: any) {
      let deleteIndex = 0
      const finded = this.checkList.find((item: any, index: number) => {
        if (item.id === info.id) {
          deleteIndex = index
          return true
        }
      })
      if (finded) {
        if (!ev) {
          this.checkList.splice(deleteIndex, 1)
        }
      } else {
        if (ev) {
          this.checkList.push(info)
        }
      }
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/list.less';
</style>