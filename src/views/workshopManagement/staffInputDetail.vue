<template>
  <div id="staffInputDetail" class="bodyContainer" v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">结算日志</div>
      </div>
      <div class="listCtn" v-if="!isAll">
        <div class="filterCtn">
          选择月份：
          <div class="elCtn">
            <el-date-picker
              v-model="month"
              type="month"
              placeholder="选择月"
              value-format="yyyy-M"
              @change="changeRouter"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="tableCtn">
        <el-table
          ref="chooseSettlementLogList"
          @selection-change="handleSelectionChange"
          :data="settlementLogList"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" fixed> </el-table-column>
          <el-table-column prop="id" label="序号" width="70" fixed></el-table-column>
          <el-table-column prop="created_at" label="添加时间" width="110" fixed> </el-table-column>
          <el-table-column prop="staff_name" label="人员" width="120" fixed>
            <template slot-scope="scope">
              <div>{{ scope.row.staff_code.substring(scope.row.staff_code.length - 4) }}</div>
              <div>{{ scope.row.staff_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="process_name" label="工序"> </el-table-column>
          <el-table-column prop="staff_name" label="订单号" width="140">
            <template slot-scope="scope">
              <div
                class="blue"
                style="cursor: pointer"
                @click="$router.push('/workshopManagement/detail?id=' + scope.row.order_id)"
              >
                {{ scope.row.order_code }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="颜色尺码" width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="number" label="完成数量" width="120"> </el-table-column>
          <el-table-column prop="extra_number" label="额外数量" width="120"> </el-table-column>
          <el-table-column prop="shoddy_number" label="次品数量" width="120"> </el-table-column>
          <el-table-column label="工序说明" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.process_desc || '无工序说明'"
                placement="top-start"
              >
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
              <div v-if="scope.row.is_check === 1" class="blue">通过</div>
              <div v-if="scope.row.is_check === 2" class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="操作人" width="110"> </el-table-column>
          <el-table-column prop="product_code" label="产品编号" width="120"> </el-table-column>
          <el-table-column label="次品原因" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.shoddy_reason || '无次品原因'"
                placement="top-start"
              >
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="结算单价(元/件)" fixed="right" width="150"> </el-table-column>
          <el-table-column prop="total_price" label="结算总价(元)" fixed="right" width="120"> </el-table-column>
        </el-table>
        <div class="listCtn">
          <div class="pageCtn">
            <el-pagination
              background
              :page-size="10"
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="page"
              @current-change="changeRouter"
            >
            </el-pagination>
          </div>
        </div>
        <div style="position: relative; float: left" v-if="!isAll">
          <span style="margin-top: 20px; margin-left: 32px; display: inline-block">合计</span>
          <span style="margin-top: 20px; margin-left: 32px; display: inline-block">
            本月完成数量：
            <span class="green" style="font-weight: bold"> {{ additional.total_number }} 件 </span>
          </span>
          <span style="margin-top: 20px; margin-left: 32px; display: inline-block">
            本月完成金额：
            <span class="green" style="font-weight: bold"> {{ additional.total_price }} 元 </span>
          </span>
        </div>
        <div class="buttonList" style="margin-bottom: 20px">
          <div style="margin-top: 20px; margin-left: 32px" class="btn backHoverBlue" @click="lostAgree">批量通过</div>
          <div style="margin-top: 20px; margin-left: 32px" class="btn backHoverRed" @click="lostDelete">批量删除</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { workshop } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
export default Vue.extend({
  components: { zhInput },
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      total: 0,
      page: 1,
      month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      additional: {},
      settlementLogList: [],
      chooseSettlementLogList: []
    }
  },
  methods: {
    init() {
      let params = {}

      if (this.isAll) {
        params = { page: this.page, limit: 10 }
      } else {
        params = {
          staff_id: this.$route.query.id + '',
          page: this.page,
          limit: 10,
          month: +this.month.split('-')[1],
          year: this.month.split('-')[0]
        }
      }

      workshop.list(params).then((res) => {
        this.settlementLogList = res.data.data.items
        this.additional = res.data.data.additional
        this.total = res.data.data.total
      })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.month = query.month || new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
      this.id = query.id
      this.isAll = query.isAll
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/workshopManagement/staffInputDetail?page=' +
          (this.page || 1) +
          '&month=' +
          this.month +
          (this.isAll ? '&isAll=true' : '&id=' + this.$route.query.id)
      )
    },
    handleSelectionChange(val: any) {
      this.chooseSettlementLogList = val
    },
    lostAgree() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .check({
          id: arr,
          is_check: 1
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('审核成功')
            this.init()
          }
        })
    },
    lostDelete() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .delete({
          id: arr
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
            this.init()
          }
        })
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.init()
    }
  },
  mounted() {
    this.getFilters()
    this.init()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/staffInputDetail.less';
</style>