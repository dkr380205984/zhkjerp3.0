<template>
  <div id="workshopManagementStaffList" class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag" @click="$router.push('/workshopManagement/list')">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-andingdanluru"></use>
        </svg>
        <span class="text">按订单录入</span>
      </div>
      <div class="tag active">
        <svg class="iconFont" aria-hidden="true">
          <use xlink:href="#icon-anyuangongluru"></use>
        </svg>
        <span class="text">按员工录入</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">单据列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword" placeholder="编号、姓名搜索" @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="department" placeholder="部门筛选" clearable>
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-cascader
              v-model="process"
              :options="processList"
              @change="changeRouter"
              :show-all-levels="false"
              placeholder="工序筛选"
              clearable
            ></el-cascader>
          </div>
          <div class="elCtn">
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changeRouter"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="list">
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            :row-key="rowKey"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column label="员工编号">
              <template slot-scope="scope">
                <div>{{ scope.row.code }}</div>
              </template>
            </el-table-column>
            <el-table-column label="员工姓名">
              <template slot-scope="scope">
                <div>{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="所属部门"></el-table-column>
            <el-table-column prop="process" label="负责工序"></el-table-column>
            <el-table-column prop="total_number" label="本月完成数量"></el-table-column>
            <el-table-column prop="total_price" label="本月完成金额"></el-table-column>
            <el-table-column label="平均单价">
              <template slot-scope="scope">
                <span>{{ scope.row.total_price / (scope.row.total_number || 1) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="opr hoverBlue" @click="$router.push('/workerManage/detail?id=' + scope.row.id)"
                  >继续添加</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="btn backHoverBlue fl noCheck"
          style="margin-top: 16px"
          @click="$router.push('/workerManage/create')"
        >
          导出年度报表
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="9"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { process, listSetting, staff } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { limitArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      loading: true,
      list: [],
      limitList: limitArr,
      limit: 10,
      keyword: '',
      client_id: [],
      department: '',
      departmentList: [],
      process: '',
      processList: [],
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
          key: 'contacts_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'has_production_inspection',
          name: '管理添加状态',
          filterArr: ['', '已添加', '待添加'],
          classArr: ['', 'blue', 'orange'],
          ifShow: true,
          ifLock: false,
          index: 4,
          isStatus: true
        },
        {
          key: 'product_code',
          otherkey: 'system_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 5,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 6,
          from: 'product_data'
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 8
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 9
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
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            this.$router.push('/workshopManagement/detail?id=' + item.id)
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
      this.user_id = query.user_id || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/workshopManagement/staffList?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&department=' +
          this.department +
          '&process=' +
          this.process +
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
          this.department = ''
          this.process = ''
          this.group_id = ''
          this.date = []
          this.status = '0'
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
      staff
        .departmentList({
          keyword: '',
          limit: ''
        })
        .then((res) => {
          if (res.data.status) {
            this.departmentList = res.data.data
          }
        })

      process.list({ type: 2 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.name,
            value: item.name
          })
        })
        this.processList.push({
          label: '半成品加工工序',
          value: 2,
          children: arr
        })
        process.list({ type: 3 }).then((res) => {
          let arr: any = []
          res.data.data.forEach((item: any) => {
            arr.push({
              label: item.name,
              value: item.name
            })
          })
          this.processList.push({
            label: '成品加工工序',
            value: 3,
            children: arr
          })
        })
      })

      staff
        .list({
          keyword: this.keyword,
          department: this.department,
          process: this.process ? this.process[1] : '',
          page: this.page,
          limit: this.limit,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : ''
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
          type: 10
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
  created() {
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

<style lang="less">
@import '~@/assets/css/workshopManagement/staffList.less';
</style>