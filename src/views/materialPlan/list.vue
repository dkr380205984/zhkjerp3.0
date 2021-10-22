<template>
  <div id="materialPlanList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">单据列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="筛选报价/产品/样品编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-cascader @change="changeRouter"
              placeholder="筛选下单公司"
              v-model="client_id"
              :options="clientList"
              clearable>
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="status"
              placeholder="筛选报价单状态">
              <el-option value="0"
                label="全部"></el-option>
              <el-option value="1"
                label="已审核"></el-option>
              <el-option value="2"
                label="待审核"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select v-model="order_type"
              @change="changeRouter">
              <el-option label="所有单据"
                :value="null"></el-option>
              <el-option label="订单"
                :value="1"></el-option>
              <el-option label="样单"
                :value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="group_id"
              placeholder="筛选负责小组">
              <el-option v-for="item in groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
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
          <div class="btn backHoverOrange fr"
            @click="showSetting=true">列表设置</div>
          <div class="btn backHoverGreen fr"
            @click="getFilters();getList()">刷新列表</div>
        </div>
        <zh-list :list="list"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"></zh-list>
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
      :type="4"
      :data.sync="listKey"
      :originalData="originalSetting"></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, listSetting } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
export default Vue.extend({
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      loading: true,
      list: [],
      order_type: null,
      keyword: '',
      client_id: [],
      group_id: '',
      user_id: '',
      status: '0',
      date: [],
      total: 1,
      page: 1,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      originalSetting: [
        {
          key: 'code',
          name: '单据编号',
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
          index: 2
        },
        {
          key: 'has_plan',
          name: '物料计划状态',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'product_info',
          name: '产品信息',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'total_price',
          name: '下单总额',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'status',
          name: '审核状态',
          ifShow: true,
          ifLock: false,
          index: 8
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 9
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'settle_unit',
          name: '结算单位',
          ifShow: true,
          ifLock: false,
          index: 11
        }
      ],
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
      },
      oprList: [
        {
          name: (item: any) => {
            return item.has_plan === 1 ? '详情' : '添加'
          },
          class: 'hoverBlue',
          fn: (item: any) => {
            if (item.has_plan === 1) {
              this.$router.push('/materialPlan/detail?id=' + item.id)
            } else {
              this.$router.push('/materialPlan/create?id=' + item.id)
            }
          }
        }
      ]
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.status = query.status || '0'
      this.user_id = Number(query.user_id) || ''
      this.group_id = Number(query.gourp_id) || ''
      this.order_type = Number(query.order_type) || null
      this.date = query.date ? (query.date as string).split(',') : []
    },
    changeRouter() {
      this.$router.push(
        '/materialPlan/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&group_id=' +
          this.group_id +
          '&status=' +
          this.status +
          '&date=' +
          this.date
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
      order
        .list({
          order_type: this.order_type,
          keyword: this.keyword,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: 5,
          is_check: this.status,
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
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 3
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
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
    this.getListSetting()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
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
@import '~@/assets/css/materialPlan/list.less';
</style>