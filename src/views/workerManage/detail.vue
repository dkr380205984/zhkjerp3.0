<template>
  <div id="workerManageDetail" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">员工信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">员工编号：</div>
            <div class="text">{{ userDetailInfo.code }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工姓名：</div>
            <div class="text">{{ userDetailInfo.name }}</div>
          </div>
          <div class="col">
            <div class="label">手机号：</div>
            <div class="text">{{ userDetailInfo.phone }}</div>
          </div>
          <div class="col">
            <div class="label">所属部门：</div>
            <div class="text">{{ userDetailInfo.department }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工工种：</div>
            <div class="text">
              {{ userDetailInfo.type == '1' ? '临时工' : userDetailInfo.type == '2' ? '合同工' : '数据有误' }}
            </div>
          </div>
          <div class="col">
            <div class="label">入职时间：</div>
            <div class="text">{{ userDetailInfo.entry_time }}</div>
          </div>
          <div class="col">
            <div class="label">离职时间：</div>
            <div class="text">{{ userDetailInfo.resign_time }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">负责工序：</div>
            <div class="text" v-for="item in userDetailInfo.process" :key="item">{{ item }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">年龄：</div>
            <div class="text">{{ userDetailInfo.age }}</div>
          </div>
          <div class="col">
            <div class="label">性别：</div>
            <div class="text">
              {{ userDetailInfo.sex == '1' ? '女' : userDetailInfo.sex == '2' ? '男' : '' }}
            </div>
          </div>
          <div class="col">
            <div class="label">身份证号码：</div>
            <div class="text">{{ userDetailInfo.id_number }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族：</div>
            <div class="text">{{ userDetailInfo.nation }}</div>
          </div>
          <div class="col">
            <div class="label">学历：</div>
            <div class="text">{{ userDetailInfo.education }}</div>
          </div>
          <div class="col">
            <div class="label">健康状况：</div>
            <div class="text">{{ userDetailInfo.health }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行：</div>
            <div class="text">{{ userDetailInfo.bank }}</div>
          </div>
          <div class="col">
            <div class="label">银行卡号：</div>
            <div class="text">{{ userDetailInfo.card_number }}</div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保：</div>
            <div class="text">
              {{ userDetailInfo.social_security == '1' ? '否' : userDetailInfo.social_security === '2' ? '是' : '' }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注：</div>
            <div class="text">{{ userDetailInfo.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">结算日志</div>
      </div>
      <div class="listCtn">
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
        <!-- <el-table
          ref="chooseSettlementLogList"
          @selection-change="handleSelectionChange"
          :data="settlementLogList"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" fixed> </el-table-column>
          <el-table-column prop="id" label="序号" width="70" fixed></el-table-column>
          <el-table-column prop="created_at" label="添加时间" width="110" fixed> </el-table-column>
          <el-table-column prop="user_name" label="操作人" width="110" fixed> </el-table-column>
          <el-table-column label="审核状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
              <div v-if="scope.row.is_check === 1" class="blue">通过</div>
              <div v-if="scope.row.is_check === 2" class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="process_name" label="工序"> </el-table-column>
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
          <el-table-column prop="staff_name" label="人员" width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.staff_code.substring(scope.row.staff_code.length - 4) }}</div>
              <div>{{ scope.row.staff_name }}</div>
            </template>
          </el-table-column>
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
          <el-table-column prop="product_code" label="产品编号" width="120"> </el-table-column>
          <el-table-column label="颜色尺码" width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="number" label="完成数量" width="120"> </el-table-column>
          <el-table-column prop="extra_number" label="额外数量" width="120"> </el-table-column>
          <el-table-column prop="shoddy_number" label="次品数量" width="120"> </el-table-column>
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
          <el-table-column prop="price" label="结算单价(元/件)" width="150"> </el-table-column>
          <el-table-column prop="total_price" label="结算总价(元)" fixed="right" width="120"> </el-table-column>
        </el-table> -->
        <el-table
          ref="chooseSettlementLogList"
          @selection-change="handleSelectionChange"
          :data="settlementLogList"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column prop="id" label="序号" width="70" fixed></el-table-column>
          <el-table-column prop="staff_name" label="员工姓名" width="130" fixed>
            <template slot-scope="scope">
              <div>
                {{ scope.row.staff_code.substring(scope.row.staff_code.length - 4) }} - {{ scope.row.staff_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="process_name" label="生产工序" width="110" fixed> </el-table-column>
          <el-table-column label="工序说明" width="110" fixed>
            <template slot-scope="scope">
              <div v-if="scope.row.process_desc">
                <div v-if="scope.row.process_desc.length <= 10">{{ scope.row.process_desc }}</div>
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="scope.row.process_desc || '无工序说明'"
                  placement="top-start"
                >
                  <span class="blue" style="cursor: pointer">查看</span>
                </el-tooltip>
              </div>
              <div v-else>无</div>
            </template>
          </el-table-column>
          <el-table-column prop="staff_name" label="订单号" width="150">
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
          <el-table-column prop="product_code" label="产品编号" width="160">
            <template slot-scope="scope">
              <span
                class="blue"
                style="cursor: pointer"
                @click="
                  productDetail = scope.row.product_id
                  productShow = true
                "
                >{{ scope.row.product_code || scope.row.system_code }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="尺码颜色" width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="price" label="结算单价" width="110">
            <template slot-scope="scope">
              <div>{{ scope.row.price }} 元</div>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="完成数量" width="120"> </el-table-column>
          <el-table-column prop="extra_number" label="额外数量" width="120"> </el-table-column>
          <el-table-column prop="shoddy_number" label="次品数量" width="120"> </el-table-column>
          <el-table-column label="审核状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
              <div v-if="scope.row.is_check === 1" class="blue">通过</div>
              <div v-if="scope.row.is_check === 2" class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column label="次品原因" width="120">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.shoddy_reason"
                class="item"
                effect="dark"
                :content="scope.row.shoddy_reason || '无次品原因'"
                placement="top-start"
              >
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip>
              <div v-else>无</div>
            </template>
          </el-table-column>
          <el-table-column prop="total_price" label="结算总价(元)" width="120"> </el-table-column>
          <el-table-column prop="complete_time" label="创建时间" width="110"> </el-table-column>
          <el-table-column prop="user_name" label="创建人" width="110"> </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: center">
                <div class="hoverOrange opr" @click="lostEdit([scope.row.id])">修改</div>
                <div class="hoverBlue opr" @click="changeStatus(scope.row)">审核</div>
                <div class="hoverRed opr" @click="lostDelete(scope.row.id)">删除</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="listCtn">
          <div class="pageCtn">
            <el-pagination
              background
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="total"
              :current-page.sync="page"
              @current-change="changeRouter"
            >
            </el-pagination>
          </div>
        </div>
        <div style="position: relative; float: left">
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
        <div class="buttonList">
          <div style="margin-top: 20px; margin-left: 20px" class="btn backHoverBlue" @click="lostAgree">批量通过</div>
          <div style="margin-top: 20px; margin-left: 20px" class="btn backHoverOrange" @click="beforeLostEdit">
            批量修改
          </div>
          <div style="margin-top: 20px; margin-left: 20px" class="btn backHoverRed" @click="lostDelete">批量删除</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="checkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">车间结算日志审核</span>
          <div class="closeCtn" @click="checkFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">是否通过：</div>
            <div class="info" style="line-height: 32px">
              <el-radio v-model="reviewerParams.is_check" :label="1">通过</el-radio>
              <el-radio v-model="reviewerParams.is_check" :label="2">驳回</el-radio>
            </div>
          </div>
          <div class="row" v-if="reviewerParams.is_check === 2">
            <div class="label">驳回理由：</div>
            <div class="info" style="min-height: 32px; height: auto">
              <el-input placeholder="请输入驳回理由" v-model="reviewerParams.check_desc"></el-input>
            </div>
          </div>
          <div class="row" v-else></div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息" v-model="reviewerParams.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="checkFlag = false">取消</span>
          <span class="btn backHoverBlue" @click="agreeCheck">确认</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div
            class="borderBtn"
            @click="$router.push('/workerManage/list?page=1&keyword=&department=&status=&type=&limit=10')"
          >
            返回
          </div>
          <div class="btn backHoverRed" @click="deleteWorker">
            <svg class="iconFont" aria-hidden="true">
              <use xlink:href="#icon-shanchudingdan"></use>
            </svg>
            <span class="text">离职</span>
          </div>
          <div class="btn backHoverOrange" @click="$router.push('/workerManage/update?id=' + userDetailInfo.id)">
            <svg class="iconFont" aria-hidden="true">
              <use xlink:href="#icon-xiugaidingdan"></use>
            </svg>
            <span class="text">修改</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff, workshop, check } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      total: 0,
      page: 1,
      month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      reviewerParams: {
        pid: '',
        check_type: 14,
        check_desc: '',
        is_check: 1, // 1通过 2没通过
        desc: ''
      },
      userDetailInfo: {},
      additional: {},
      settlementLogList: [],
      chooseSettlementLogList: []
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.init()
    }
  },
  methods: {
    init(id?: number) {
      this.loading = true

      staff
        .detail({
          id: id || Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.data.process !== null) {
            res.data.data.process = res.data.data.process.toString()
          }

          if (res.data.data.entry_time !== null) {
            res.data.data.entry_time = res.data.data.entry_time.slice(0, 10)
          }

          if (res.data.data.resign_time !== null) {
            res.data.data.resign_time = res.data.data.resign_time.slice(0, 10)
          }
          this.userDetailInfo = res.data.data
          this.loading = false
        })

      workshop
        .list({
          staff_id: this.$route.query.id + '',
          page: this.page,
          limit: 10,
          month: +this.month.split('-')[1],
          year: this.month.split('-')[0]
        })
        .then((res) => {
          this.settlementLogList = res.data.data.items
          this.additional = res.data.data.additional
          this.total = res.data.data.total
        })
    },
    // 打开审核
    changeStatus(row: any) {
      this.checkFlag = true
      this.reviewerParams.pid = row.id
    },
    // 通过审核
    agreeCheck(item: any) {
      if (this.reviewerParams.is_check === 1) {
        this.reviewerParams.check_desc = ''
      }
      check.create(this.reviewerParams).then((res) => {
        if (res.data.status) {
          this.$message.success('审核成功')
          this.checkFlag = false
          this.checkAllPlan = false
          this.init()
        }
      })
    },
    // 批量修改
    lostEdit(ids: Array<any>) {
      if (ids) {
        this.$router.push(
          '/workshopManagement/staffInputDetail?type=' +
            1 +
            '&ids=' +
            encodeURIComponent(ids.toString()) +
            '&staffId=' +
            this.userDetailInfo.id
        )
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择至少一条日志')
          return
        }

        let arr = this.multipleSelection.map((item: any) => {
          return item.id
        })

        this.$router.push(
          '/workshopManagement/staffInputDetail?type=' +
            1 +
            '&ids=' +
            encodeURIComponent(arr.toString()) +
            '&staffId=' +
            this.userDetailInfo.id
        )
      }
    },
    beforeLostEdit() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      this.lostEdit(arr)
    },
    // 批量通过
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
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.month = query.month || new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
      this.id = query.id
    },
    lostDelete(id: number) {
      if (!id) {
        if (this.chooseSettlementLogList.length === 0) {
          this.$message.error('请选择至少一条日志')
          return
        }
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .delete({
          id: id ? [id] : arr
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
            this.init()
          }
        })
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/workerManage/detail?page=' + (this.page || 1) + '&month=' + this.month + '&id=' + this.$route.query.id
      )
    },
    handleSelectionChange(val: any) {
      this.chooseSettlementLogList = val
    },
    deleteWorker() {
      this.$confirm('是否离职该员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          staff
            .changeStaffStatus({
              data: [
                {
                  id: this.userDetailInfo.id,
                  status: 2
                }
              ]
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '离职成功!'
                })
                this.$router.push('/workerManage/list?page=1&keyword=&department=&status=&type=&limit=10')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    this.getFilters()
    this.init()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workerManage/detail.less';
</style>
<style lang="less">
#workerManageDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .normalTab {
    .el-tabs__nav {
      margin-left: 32px !important;
    }
  }
}
</style>