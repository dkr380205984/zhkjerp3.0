<template>
  <div id="workerManage" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">员工列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="员工编号、姓名搜索"
              @keydown.enter.native="changeRouter"
            ></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="department" placeholder="部门筛选">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="status" placeholder="员工状态筛选">
              <el-option value="1" label="在职"></el-option>
              <el-option value="2" label="离职"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="type" placeholder="工种筛选">
              <el-option value="1" label="临时工"></el-option>
              <el-option value="2" label="合同工"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn" style="height: 33px">
          <div class="btn backHoverBlue fr" @click="$router.push('/workerManage/create')">添加员工</div>
          <div class="btn backHoverBlue fr" @click="importExcel()">导入Excel模板</div>
          <div class="btn backHoverBlue fr" @click="downloadExcel()">下载Excel模板</div>
          <div
            :class="
              this.multipleSelection.length !== 0 ? 'btn backHoverOrange fl' : 'btn backHoverOrange fl noCheckOrange'
            "
            @click="moreLeave()"
            style="margin-left: 0"
          >
            批量离职
          </div>
          <div
            :class="this.multipleSelection.length !== 0 ? 'btn backHoverBlue fl' : 'btn backHoverBlue fl noCheck'"
            @click="exportExcel()"
          >
            导出Excel
          </div>
        </div>
        <div class="list">
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            :row-key="rowKey"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="code" label="员工编号"></el-table-column>
            <el-table-column prop="name" label="员工姓名"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="department" label="所属部门"></el-table-column>
            <el-table-column prop="type" label="工种">
              <template slot-scope="scope">
                {{ scope.row.type === '1' ? '临时工' : scope.row.type === '2' ? '合同工' : '状态有误' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="员工状态">
              <template slot-scope="scope">
                <div :class="scope.row.status === 1 ? 'blue' : scope.row.status === 2 ? 'orange' : 'red'">
                  {{ scope.row.status === 1 ? '在职' : scope.row.status === 2 ? '离职' : '状态有误' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="opr hoverBlue" @click="$router.push('/workerManage/detail?id=' + scope.row.id)">详情</span>
                <span class="opr hoverOrange" @click="$router.push('/workerManage/update?id=' + scope.row.id)"
                  >修改</span
                >
                <span class="opr hoverRed" @click="deleteWorker(scope.row)">离职</span>
              </template>
            </el-table-column>
          </el-table>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { quotedPrice, listSetting, exportExcel, staff } from '@/assets/js/api'
import { ListSetting } from '@/types/list'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { limitArr } from '@/assets/js/dictionary'
interface QuotedPriceInfoList extends QuotedPriceInfo {
  image_data: string[]
  product_info: string
}
export default Vue.extend({
  data(): {
    originalSetting: ListSetting[]
    list: QuotedPriceInfoList[]
    [propName: string]: any
  } {
    return {
      loading: true,
      checkAll: false,
      isIndeterminate: false,
      mainLoading: false,
      limitList: limitArr,
      list: [],
      page: 1,
      total: 1,
      limit: 10,
      keyword: '',
      department: '',
      departmentList: [],
      user_id: '',
      group_id: '',
      status: null,
      listSettingId: null,
      listKey: [],
      date: [],
      checkedCount: [],
      checked: false,
      originalSetting: [
        {
          key: 'code',
          name: '报价单号',
          ifShow: true,
          ifLock: true,
          ifCaogao: 'is_draft',
          caogaoArr: ['稿', '整'],
          index: 0
        },
        {
          key: 'title',
          name: '报价标题',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '询价公司',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'contacts_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'image',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 4,
          from: 'product_data'
        },
        {
          key: 'system_total_price',
          name: '系统合计报价',
          ifShow: true,
          ifLock: false,
          index: 5,
          errVal: '0',
          unit: '元'
        },
        {
          key: 'real_quote_price',
          name: '客户实际报价',
          ifShow: true,
          ifLock: false,
          index: 6,
          errVal: '0',
          unit: '元'
        },
        {
          key: 'is_check',
          name: '审核状态',
          ifShow: true,
          ifLock: false,
          index: 7,
          filterArr: ['待审核', '已审核', '已驳回'],
          classArr: ['orange', 'blue', 'red']
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
        },
        {
          key: 'settle_unit',
          name: '报价币种',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'created_at',
          name: '创建日期',
          ifShow: true,
          ifLock: false,
          index: 11
        }
      ],
      type: '',
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
      showSetting: false,
      multipleSelection: []
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    },
    checkedCount(newVal) {
      if (newVal.length > 0) {
        this.checked = true
      } else {
        this.checked = false
      }
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
  methods: {
    getLocalStorage(ev: any, type: string) {
      if (!ev) {
        this.$setLocalStorage(type, '')
      }
      this.changeRouter()
    },
    deleteWorker(item: any) {
      console.log(item)
    },
    rowKey(row: { id: any }) {
      return row.id
    },
    importExcel() {},
    downloadExcel() {},
    changeRouter() {
      this.$router.push(
        '/workerManage/list?page=' +
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
          this.date +
          '&limit=' +
          this.limit
      )
    },
    toggleSelection(rows: any[]) {
      let mainInputEl: any = this.$refs.mainInput
      if (rows) {
        rows.forEach((row) => {
          mainInputEl.toggleRowSelection(row)
        })
      } else {
        mainInputEl.clearSelection()
      }
    },
    handleSelectionChange(val: any) {
      this.multipleSelection = val
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.status = query.status === 'null' ? null : query.status
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.limit = Number(query.limit) || 10
      this.date = query.date ? (query.date as string).split(',') : []
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
          this.limit = 10
          this.status = null
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

      staff
        .list({
          keyword: this.keyword,
          department: this.department,
          page: this.page,
          limit: this.limit,
          type: this.type,
          status: this.status
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    exportExcel() {
      if (this.multipleSelection.length === 0) {
        return
      }
      this.mainLoading = true
      let idArr: any[] = []
      this.list.forEach((item) => {
        // console.log(item)
        idArr.push(item.id)
      })
      console.log(idArr)
      exportExcel
        .quoteList({
          client_id: this.client_id,
          id: idArr
        })
        .then((res: any) => {
          console.log(this.list)
          if (res.data.status) {
            console.log(res.data.data)
            this.mainLoading = false
            window.location.href = res.data.data
          }
        })
    },
    getListSetting() {
      this.loading = true
      this.listKey = []
      listSetting
        .detail({
          type: 1
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
          this.loading = false
        })
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
@import '~@/assets/css/workerManage/list.less';
</style>