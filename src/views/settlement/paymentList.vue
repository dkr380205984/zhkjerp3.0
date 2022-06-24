<template>
  <div id="paymentList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/settlement/collectionList?page=&limit&type=&keyword=&status=&clientType=&tag_id=&only_delete=&year=&settle_unit=')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">应收款客户</span>
      </div>
      <div class="tag active">
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
              <el-option v-for="item in clientTypeList"
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
        <div class="description">当前统计默认值：下单年份：{{year}}年；下单客户：默认所有；币种：{{settle_unit||'所有'}}；合作状态：{{status===0?'暂停合作':status===1?'合作中':'全部'}}</div>
        <div class="list"
          v-loading="loading">
          <div class="row title">
            <div class="col">公司简称</div>
            <div class="col">公司全称</div>
            <div class="col">客户类型</div>
            <div class="col">计划总额
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_plan_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_plan_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">计划总数
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_plan_number';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_plan_number';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">实际总额
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_real_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_real_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">实际总数
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_real_number';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_real_number';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">已开票总额
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_invoice_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_invoice_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">已付款总额
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_pay_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_pay_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">已扣款总额
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  @click="sortCol='total_deduct_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  @click="sortCol='total_deduct_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col">{{$toFixed(item.total_plan_price/10000)}}万元</div>
            <div class="col">
              <template v-if="item.client_type_name==='纱线原料单位'||item.client_type_name==='原料加工单位'">
                {{$toFixed(item.total_plan_number/1000)}}吨
              </template>
              <template v-else-if="item.client_type_name==='面料原料单位'">
                {{$toFixed(item.total_plan_number/1000)}}千米
              </template>
              <template v-else-if="item.client_type_name==='装饰辅料单位'||item.client_type_name==='包装辅料单位'">
                {{$toFixed(item.total_plan_number/10000)}}万个
              </template>
              <template v-else-if="item.client_type_name==='生产织造单位' || item.client_type_name==='生产加工单位'">
                {{$toFixed(item.total_plan_number/10000)}}万件
              </template>
              <template v-else-if="item.client_type_name==='运输单位'">
                {{$toFixed(item.total_plan_number)}}立方
              </template>
            </div>
            <div class="col">{{$toFixed(item.total_real_price/10000)}}万元</div>
            <div class="col">
              <template v-if="item.client_type_name==='纱线原料单位'||item.client_type_name==='原料加工单位'">
                {{$toFixed(item.total_real_number/1000)}}吨
              </template>
              <template v-else-if="item.client_type_name==='面料原料单位'">
                {{$toFixed(item.total_real_number/1000)}}千米
              </template>
              <template v-else-if="item.client_type_name==='装饰辅料单位'||item.client_type_name==='包装辅料单位'">
                {{$toFixed(item.total_real_number/10000)}}万个
              </template>
              <template v-else-if="item.client_type_name==='生产织造单位' || item.client_type_name==='生产加工单位'">
                {{$toFixed(item.total_real_number/10000)}}万件
              </template>
              <template v-else-if="item.client_type_name==='运输单位'">
                {{$toFixed(item.total_real_number)}}立方
              </template>
            </div>
            <div class="col">{{$toFixed(item.total_invoice_price)}}万元</div>
            <div class="col">{{$toFixed(item.total_pay_price)}}万元</div>
            <div class="col">{{$toFixed(item.total_deduct_price)}}万元</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/settlement/paymentDetail?id='+item.id + '&type=' + item.client_type_name)">详情</span>
            </div>
          </div>
          <div class="row">
            <div class="col green">合计：</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col green bold">{{$toFixed(totalData.total_plan_price/10000)}}万元</div>
            <div class="col green bold">
              <template v-if="!clientTypeName">-</template>
              <template v-else-if="clientTypeName==='纱线原料单位'||clientTypeName==='原料加工单位'">
                {{$toFixed(totalData.total_plan_number/1000)}}吨
              </template>
              <template v-else-if="clientTypeName==='面料原料单位'">
                {{$toFixed(totalData.total_plan_number/1000)}}千米
              </template>
              <template v-else-if="clientTypeName==='装饰辅料单位'||clientTypeName==='包装辅料单位'">
                {{$toFixed(totalData.total_plan_number/10000)}}万个
              </template>
              <template v-else-if="clientTypeName==='生产织造单位' || clientTypeName==='生产加工单位'">
                {{$toFixed(totalData.total_plan_number/10000)}}万件
              </template>
              <template v-else-if="clientTypeName==='运输单位'">
                {{$toFixed(totalData.total_plan_number)}}立方
              </template>
            </div>
            <div class="col green bold">{{$toFixed(totalData.total_real_price/10000)}}万元</div>
            <div class="col green bold">
              <template v-if="!clientTypeName">-</template>
              <template v-else-if="clientTypeName==='纱线原料单位'||clientTypeName==='原料加工单位'">
                {{$toFixed(totalData.total_real_number/1000)}}吨
              </template>
              <template v-else-if="clientTypeName==='面料原料单位'">
                {{$toFixed(totalData.total_real_number/1000)}}千米
              </template>
              <template v-else-if="clientTypeName==='装饰辅料单位'||clientTypeName==='包装辅料单位'">
                {{$toFixed(totalData.total_real_number/10000)}}万个
              </template>
              <template v-else-if="clientTypeName==='生产织造单位' || clientTypeName==='生产加工单位'">
                {{$toFixed(totalData.total_real_number/10000)}}万件
              </template>
              <template v-else-if="clientTypeName==='运输单位'">
                {{$toFixed(totalData.total_real_number)}}立方
              </template>
            </div>
            <div class="col green bold">{{$toFixed(totalData.total_invoice_price)}}万元</div>
            <div class="col green bold">{{$toFixed(totalData.total_pay_price)}}万元</div>
            <div class="col green bold">{{$toFixed(totalData.total_deduct_price)}}万元</div>
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
import { client, clientType } from '@/assets/js/api'
import { limitArr, moneyArr } from '@/assets/js/dictionary'
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
      type: 2,
      status: 1,
      clientType: '',
      tag_id: '',
      bindFlag: false,
      clientTypeList: [],
      clientTagList: [],
      limitList: limitArr,
      only_delete: 0,
      settle_unit: '',
      unitArr: moneyArr,
      year: new Date().getFullYear().toString(),
      totalData: {
        total_pay_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_plan_number: 0,
        total_plan_price: 0,
        total_real_number: 0,
        total_real_price: 0
      },
      sortCol: 'total_plan_price',
      sort: 'desc'
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientTypeName(): any {
      return this.$route.query.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(this.$route.query.clientType)).name
        : ''
    }
  },
  methods: {
    getClientTag(ev: number) {
      if (ev) {
        this.clientTagList = this.clientTypeList.find((item: { id: number }) => item.id === ev).children
      } else {
        this.clientTagList = []
      }
      this.changeRouter()
    },
    getList() {
      this.loading = true
      client
        .financialList({
          sortCol: this.sortCol,
          sort: this.sort,
          limit: this.limit,
          page: this.page,
          name: this.keyword,
          status: this.status,
          only_delete: this.only_delete,
          settle_unit: this.settle_unit,
          tag_id: this.tag_id ? [this.tag_id] : null, // 筛选标签用的，暂时没用到
          client_type_id: this.clientType ? [this.clientType] : this.clientTypeList.map((item: any) => item.id),
          year: this.year
        })
        .then((res) => {
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
      this.status = query.status ? (query.status === 'null' ? null : Number(query.status)) : 1
      this.keyword = query.keyword
      this.clientType = Number(query.clientType) || ''
      this.only_delete = Number(query.only_delete) || 0
      this.year = query.year || '' + new Date().getFullYear().toString()
      this.settle_unit = query.settle_unit || ''
      this.clientTagList = this.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(query.clientType)).public_tag
        : []
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }

      this.$router.push(
        '/settlement/paymentList?page=' +
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
          this.year +
          '&settle_unit=' +
          this.settle_unit
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
    // 由于列表需要用到type数据，所以这里不用checkCommonInfo
    clientType.list().then((res) => {
      this.clientTypeList = res.data.data.filter((item: { type: string }) => Number(item.type) === Number(this.type))
      this.getFilters()
      this.getList()
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/settlement/paymentList.less';
</style>

