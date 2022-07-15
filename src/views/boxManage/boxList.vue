<template>
  <div id="boxListList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/boxManage/list?page=1')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-zhuangxiangjihuachuku"></use>
          </svg>
        </div>
        <span class="text">装箱计划出库</span>
      </div>
      <div class="tag"
        @click="$router.push('/boxManage/orderList?page=1')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-dingdanzhijiechuku"></use>
          </svg>
        </div>
        <span class="text">订单直接发货</span>
      </div>
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-fahuodanliebiao"></use>
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
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="code"
              placeholder="筛选发货单编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="order_code"
              placeholder="筛选订单编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-cascader @change="changeRouter"
              placeholder="筛选运输公司"
              v-model="client_id"
              :options="clientList"
              clearable>
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select @change="$setLocalStorage('create_user',user_id);changeRouter()"
              v-model="user_id"
              placeholder="筛选创建人"
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
        <div class="filterCtn">
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
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">发货单号</div>
            <div class="col">订单号</div>
            <div class="col">运输单位</div>
            <div class="col">运输城市</div>
            <div class="col">合计箱数/箱</div>
            <div class="col">合计毛重/kg</div>
            <div class="col">合计体积/m³</div>
            <div class="col">运输金额/元</div>
            <div class="col">创建人</div>
            <div class="col">创建时间</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code?item.order_code.join(','):'无'}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.city}}</div>
            <div class="col">{{item.total_box}}</div>
            <div class="col">{{item.total_gross_weight}}</div>
            <div class="col">{{item.total_net_weight}}</div>
            <div class="col">{{item.total_price}}元</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at.slice(0,10)}}</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/boxManage/boxDetail?id='+item.id)">详情</span>
              <span class="opr hoverRed"
                @click="deleteBox(item.id)">删除</span>
            </div>
          </div>
          <div class="row title">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col green">{{$toFixed(additional.total_number)}}立方</div>
            <div class="col green">{{$toFixed(additional.total_price/10000)}}万元</div>
            <div class="col"></div>
            <div class="col"></div>
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
      limit: 10,
      code: '',
      order_code: '',
      client_id: '',
      user_id: '',
      date: [],
      additional: {
        total_number: 0,
        total_price: 0,
        total_settle_price: 0
      },
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
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '运输单位')
    },
    userList() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/boxManage/boxList?page' +
          this.page +
          '&order_code=' +
          this.order_code +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&code=' +
          this.code +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit
      )
      this.getList()
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.code = query.code || ''
      this.order_code = query.order_code || ''
      this.user_id = query.user_id || ''
      this.date = query.date ? (query.date as string).split(',') : []
    },
    getList() {
      this.loading = true
      boxManage
        .list({
          order_code: this.order_code,
          code: this.code,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: this.limit
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.additional = res.data.data.additional
          }
          this.loading = false
        })
    },
    deleteBox(id: number) {
      this.$confirm('是否删除发货单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          boxManage
            .delete({
              id
            })
            .then((res) => {
              if (res.data.stauts) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }

              this.getList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    reset() {}
  },
  mounted() {
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/boxList.less';
</style>