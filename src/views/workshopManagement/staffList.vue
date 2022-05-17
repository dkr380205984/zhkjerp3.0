<template>
  <div id="workshopManagementStaffList" v-loading="loading" class="bodyContainer">
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
          <div class="elCtn" style="position: relative">
            <el-select
              style="width: 95%"
              @change="changeDepartment()"
              v-model="department"
              placeholder="部门筛选"
              clearable
            >
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存部门筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('department', department)"></i>
            </el-tooltip>
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
            <!-- <el-date-picker
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
            </el-date-picker> -->
            <el-date-picker
              v-model="date"
              type="month"
              @change="changeRouter"
              value-format="yyyy-MM"
              placeholder="选择月份"
            >
            </el-date-picker>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="btn backHoverBlue" style="margin-bottom: 20px" @click="updateNumber">更新数量</div>
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
            <el-table-column prop="total_extra_number" label="本月额外数量"></el-table-column>
            <el-table-column prop="total_price" label="本月完成金额"></el-table-column>
            <el-table-column label="平均单价">
              <template slot-scope="scope">
                <span>{{ (scope.row.total_price / (scope.row.total_number || 1)).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <span
                  class="opr hoverBlue"
                  @click="
                    $router.push(
                      '/workshopManagement/staffDetail?staffInfo=' +
                        JSON.stringify([
                          { id: scope.row.id, name: scope.row.name, code: scope.row.code, process: scope.row.process }
                        ])
                    )
                  "
                  >继续添加</span
                >
                <span
                  class="opr hoverBlue"
                  @click="$router.push('/workshopManagement/staffInputDetail?id=' + scope.row.id)"
                  >详情</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btn backHoverBlue fl" style="margin-right: 40px" @click="exportExcel(1)">导出月度报表</div>
        <div class="btn backHoverBlue fl" style="margin-right: 40px" @click="exportExcel(2)">导出月度明细</div>
        <div style="width: 50%; display: flex; justify-content: space-between; margin-left: 20px; line-height: 2">
          <span>
            完成数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span>
            完成金额：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_price / 10000).toFixed(2) }} 万元
            </span>
          </span>
          <span>
            额外数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_extra_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
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
import { process, listSetting, staff, exportExcel, workshop } from '@/assets/js/api'
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
      additional: {},
      client_id: [],
      department: '',
      departmentName: '',
      departmentList: [],
      multipleSelection: [],
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
      this.department = Number(query.department) || Number(this.$getLocalStorage('department')) || ''
      this.keyword = query.keyword || ''
      this.departmentName = query.departmentName || ''
      this.status = query.status || '0'
      this.user_id = query.user_id || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date =
        query.date ||
        new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
      this.limit = Number(query.limit) || 10
    },
    rowKey(row: { id: any }) {
      return row.id
    },
    changeDepartment() {
      if (this.department === '') {
        this.$setLocalStorage('department', '')
        this.departmentName = ''
        this.getList()
        return
      }
      staff
        .departmentDetail({
          id: this.department
        })
        .then((res) => {
          this.departmentName = res.data.data.name
          this.getList()
        })
    },
    handleSelectionChange(val: any) {
      this.multipleSelection = val
    },
    updateNumber() {
      let a = this.multipleSelection.map((user: any) => {
        return {
          id: user.id,
          name: user.name,
          code: user.code,
          process: user.process
        }
      })
      this.$router.push('/workshopManagement/staffDetail?staffInfo=' + JSON.stringify(a))
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
          '&departmentName=' +
          this.departmentName +
          '&process=' +
          this.process +
          '&group_id=' +
          this.group_id +
          '&date=' +
          (this.date || '') +
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
    exportExcel(type: 1 | 2) {
      this.mainLoading = true
      if (type === 1) {
        exportExcel
          .staffMonth({
            keyword: this.keyword,
            department: this.departmentName,
            process: this.process ? this.process[1] : '',
            month: this.date
          })
          .then((res: any) => {
            if (res.data.status) {
              this.mainLoading = false
              window.location.href = res.data.data
            }
          })
      } else if (type === 2) {
        workshop
          .list({
            keyword: this.keyword,
            department: this.departmentName,
            process: this.process[1],
            year: this.date.split('-')[0],
            month: this.date.split('-')[1],
            export_excel: 1
          })
          .then((res) => {
            if (res.data.status) {
              this.mainLoading = false
              window.location.href = res.data.data
            }
          })
      }
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
            this.departmentName = res.data.data.find((res: any) => {
              return res.id == this.department
            })
            this.departmentName = this.departmentName?.name || ""
          }
          staff
            .list({
              keyword: this.keyword,
              department: this.departmentName,
              page: this.page,
              limit: this.limit,
              month: this.date
            })
            .then((res) => {
              if (res.data.status) {
                this.list = res.data.data.items
                this.total = res.data.data.total
                this.additional = res.data.data.additional
              }
              this.loading = false
            })
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