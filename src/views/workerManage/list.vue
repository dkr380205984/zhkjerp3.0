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
                :value="item.name"
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
          <div class="btn backHoverBlue fr">
            <el-upload
              class="upload-demo"
              action="/api/import/staff"
              :headers="headers"
              :name="excelfile"
              :show-file-list="false"
              :on-success="uploadSuccess"
            >
              点击上传
            </el-upload>
          </div>
          <div class="btn backHoverBlue fr" @click="downloadExcel()">下载Excel模板</div>
          <div
            :class="
              this.multipleSelection.length !== 0 ? 'btn backHoverOrange fl' : 'btn backHoverOrange fl noCheckOrange'
            "
            @click="batchResignation()"
            style="margin-left: 0"
          >
            批量离职
          </div>
          <div class="btn backHoverBlue fl" @click="exportExcel()">导出Excel</div>
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
import { exportExcel, staff } from '@/assets/js/api'

export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      mainLoading: false,
      list: [],
      page: 1,
      total: 1,
      limit: 10,
      keyword: '',
      department: '',
      departmentList: [],
      status: '',
      type: '',
      multipleSelection: []
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    headers() {
      return {
        Authorization: 'bearer ' + window.sessionStorage.getItem('token')
      }
    },
    excelfile() {
      return 'excelfile'
    }
  },
  methods: {
    deleteWorker(item: any) {
      console.log(item)
    },
    rowKey(row: { id: any }) {
      return row.id
    },
    downloadExcel() {
      staff.downloadExcel().then((res) => {
        window.location.href = res.data.data
      })
    },
    changeRouter() {
      this.$router.push(
        '/workerManage/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&department=' +
          this.department +
          '&status=' +
          this.status +
          '&type=' +
          this.type +
          '&limit=' +
          this.limit
      )
    },
    handleSelectionChange(val: any) {
      this.multipleSelection = val
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.keyword = query.keyword || ''
      this.status = query.status === 'null' ? null : query.status
      this.department = query.department
      this.type = query.type
      this.limit = Number(query.limit) || 10
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
          this.type = ''
          this.limit = 10
          this.status = ''
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
    // 批量离职
    batchResignation() {
      let data: Array<{
        id: number | string
        status: number | string
      }> = []

      this.multipleSelection.forEach((item: any) => {
        data.push({ id: item.id, status: 2 })
      })

      staff.changeStaffStatus({ data }).then((res) => {
        if (res.data.status) {
          this.$message({
            type: 'success',
            message: '批量离职成功'
          })
          this.toggleSelection()
          this.getList()
        }
      })
    },
    toggleSelection() {
      let a:any = this.$refs
      a.multipleTable.clearSelection()
    },
    exportExcel() {
      this.mainLoading = true
      exportExcel
        .staff({
          keyword: this.keyword,
          department: this.department,
          limit: this.limit,
          type: this.type,
          status: this.status
        })
        .then((res: any) => {
          if (res.data.status) {
            this.mainLoading = false
            window.location.href = res.data.data
          }
        })
    },
    uploadSuccess(res: any) {
      if (res.status) {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getList()
      }
    }
  },
  created() {
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workerManage/list.less';
</style>