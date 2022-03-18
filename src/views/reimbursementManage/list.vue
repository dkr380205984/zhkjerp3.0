<template>
  <div id="reimbursementManageList" class="bodyContainer" v-loading="loading">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">报销单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              placeholder="报销单编号或报销人姓名搜索"
              @keydown.enter.native="changeRouter"
            ></el-input>
          </div>
          <div class="elCtn">
            <el-select v-model="group" placeholder="小组筛选" @change="changeRouter" clearable>
              <el-option v-for="item in groupList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="status" placeholder="审核状态筛选">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="待审核"></el-option>
              <el-option value="2" label="已审核"></el-option>
              <el-option value="3" label="已驳回"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn" style="height: 33px">
          <div class="btn backHoverBlue fr" @click="$router.push('/reimbursementManage/create')">添加报销单</div>
          <div class="btn backHoverBlue fl" style="margin-left: unset" @click="exportExcel()">导出Excel</div>
        </div>
        <div class="list">
          <!-- 表格 -->
          <el-table :data="list" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="code" label="报销单编号"></el-table-column>
            <el-table-column prop="name" label="报销人"></el-table-column>
            <el-table-column prop="group" label="所属小组"></el-table-column>
            <el-table-column prop="amount" label="报销金额"></el-table-column>
            <el-table-column prop="total_order_number" label="相关凭证">
              <template slot-scope="scope">
                <el-image
                  style="height: 44px; width: 44px;padding-top:5px"
                  fix="cover"
                  :src="
                    scope.row.certificate
                      ? scope.row.certificate.split(',')[0]
                      : require('@/assets/image/common/noPic.png')
                  "
                  :preview-src-list="scope.row.certificate ? [scope.row.certificate.split(',')[0]] : []"
                >
                </el-image>
                <!-- <img :src="scope.row.certificate ? scope.row.certificate.split(',')[0] : ''" style="width: 100%" /> -->
              </template>
            </el-table-column>
            <el-table-column label="审核状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status === 1" class="orange">待审核</div>
                <div v-if="scope.row.status === 2" class="blue">已审核</div>
                <div v-if="scope.row.status === 3" class="red">已驳回</div>
              </template>
            </el-table-column>
            <el-table-column prop="reviewer.name" label="审核人"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="opr hoverBlue" @click="$router.push('/reimbursementManage/detail?id=' + scope.row.id)"
                  >详情</span
                >
                <span
                  class="opr hoverOrange"
                  v-if="scope.row.status !== 2"
                  @click="$router.push('/reimbursementManage/update?id=' + scope.row.id)"
                  >修改</span
                >
                <span v-if="scope.row.status !== 2" class="opr hoverRed" @click="deleteReimbursement(scope.row)"
                  >删除</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageCtn" style="align-items: center; justify-content: space-between">
          <div>
            合计金额 <span style="margin-left: 50px">{{ totalAmount }}</span> 元
          </div>
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
import { exportExcel, receipt } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      mainLoading: false,
      totalAmount: 0,
      list: [],
      page: 1,
      total: 1,
      limit: 10,
      keyword: '',
      group: '',
      status: ''
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    groupList() {
      return this.$store.state.api.group.arr
    }
  },
  methods: {
    deleteReimbursement(item: any) {
      receipt
        .delete({
          id: item.id
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.changeRouter()
          }
        })
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/reimbursementManage/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&group=' +
          this.group +
          '&status=' +
          this.status +
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
      this.keyword = query.keyword || ''
      this.status = query.status
      this.group = query.group || ''
      this.limit = Number(query.limit) || 10
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.keyword = ''
          this.group = ''
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
      receipt.total().then((res) => {
        this.totalAmount = res.data.data
      })
      receipt
        .list({
          keyword: this.keyword,
          page: this.page,
          limit: this.limit,
          status: this.status,
          group: this.group
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    exportExcel() {
      this.mainLoading = true
      exportExcel
        .receipt({
          group: this.group,
          keyword: this.keyword,
          status: this.status
        })
        .then((res: any) => {
          console.log(this.list)
          if (res.data.status) {
            console.log(res.data.data)
            this.mainLoading = false
            window.location.href = res.data.data
          }
        })
    }
  },
  created() {
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      }
    ])
  }
})
</script>

<style lang="less">
@import '~@/assets/css/reimbursementManage/list.less';
</style>