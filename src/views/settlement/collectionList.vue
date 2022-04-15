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
            <el-select placeholder="筛选客户状态"
              v-model="status"
              @change="changeRouter">
              <el-option label="全部"
                :value="null"></el-option>
              <el-option label="合作中"
                :value="1"></el-option>
              <el-option label="暂停合作"
                :value="0"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="客户类型筛选"
              v-model="clientType"
              @change="tag_id='';getClientTag($event)"
              clearable>
              <el-option v-for="item in clientTypeArr"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="year"
              @change="changeRouter"
              value-format="yyyy"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select placeholder="客户标签筛选"
              v-model="tag_id"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in clientTagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
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
          <div class="elCtn">
            <el-checkbox v-model="only_delete"
              @change="changeRouter"
              :true-label="1">查询已删除的数据</el-checkbox>
          </div>
        </div>
        <div class="list"
          v-loading="loading">
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
            <div class="col">已扣款总额</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col">{{item.total_order_price}}</div>
            <div class="col">{{item.total_order_number}}</div>
            <div class="col">{{item.total_transport_price}}</div>
            <div class="col">{{item.total_transport_number}}</div>
            <div class="col">{{item.total_invoice_price}}元</div>
            <div class="col">{{item.total_collect_price}}元</div>
            <div class="col">{{item.total_deduct_price}}元</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/settlement/collectionDetail?id='+item.id)">详情</span>
            </div>
          </div>
          <div class="row">
            <div class="col green">合计：</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col green">{{totalData.total_order_price}}</div>
            <div class="col green">{{totalData.total_order_number}}</div>
            <div class="col green">{{totalData.total_transport_price}}</div>
            <div class="col green">{{totalData.total_transport_number}}</div>
            <div class="col green">{{totalData.total_invoice_price}}元</div>
            <div class="col green">{{totalData.total_collect_price}}元</div>
            <div class="col green">{{totalData.total_deduct_price}}元</div>
            <div class="col"></div>
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
import { limitArr } from '@/assets/js/dictionary'
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
      limit: 10,
      type: 1,
      status: 1,
      clientTypeList: [],
      clientType: '',
      clientBindList: [],
      unBindClient: [],
      tag_id: '',
      bindFlag: false,
      clientTagList: [],
      limitList: limitArr,
      only_delete: 0,
      year: new Date().getFullYear().toString(),
      totalData: {
        total_collect_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_order_number: 0,
        total_order_price: 0,
        total_transport_number: 0,
        total_transport_price: 0
      }
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
    getList() {
      this.loading = true
      client
        .financialList({
          limit: this.limit,
          page: this.page,
          name: this.keyword,
          status: this.status,
          only_delete: this.only_delete,
          tag_id: this.tag_id ? [this.tag_id] : null, // 筛选标签用的，暂时没用到
          client_type_id: this.clientType ? [this.clientType] : this.clientTypeArr.map((item: any) => item.id),
          year: this.year
        })
        .then((res) => {
          console.log(res)
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.totalData = res.data.data.additional
          }
          this.loading = false
        })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.limit = Number(query.limit) || 10
      this.type = Number(query.type)
      this.tag_id = Number(query.tag_id) || ''
      this.status = query.status === 'null' ? null : Number(query.status)
      this.keyword = query.keyword
      this.clientType = Number(query.clientType) || ''
      this.only_delete = Number(query.only_delete) || 0
      this.year = query.year || '' + new Date().getFullYear().toString()
      this.clientTagList = this.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(query.clientType)).public_tag
        : []
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }

      this.$router.push(
        '/settlement/collectionList?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&type=' +
          this.type +
          '&keyword=' +
          this.keyword +
          '&status=' +
          this.status +
          '&clientType=' +
          this.clientType +
          '&tag_id=' +
          this.tag_id +
          '&only_delete=' +
          this.only_delete +
          '&year=' +
          this.year
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
          this.clientType = ''
          this.tag_id = ''
          this.only_delete = 0
          this.keyword = ''
          this.changeRouter()
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
    this.getList()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/settlement/collectionList.less';
</style>

