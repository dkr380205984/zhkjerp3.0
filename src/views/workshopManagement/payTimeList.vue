<template>
  <div id="payTimeList" v-loading="loading" class="bodyContainer">
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
          <div class="elCtn" style="position: relative">
            <el-cascader
              style="width: 95%"
              v-model="process"
              :options="processList"
              @change="changeRouter"
              :show-all-levels="false"
              filterable
              placeholder="工序筛选"
              clearable
            ></el-cascader>
            <el-tooltip class="item" effect="dark" content="保存工序筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('process', process)"></i>
            </el-tooltip>
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
            <!-- <el-date-picker v-model="date"
              type="month"
              @change="changeRouter"
              value-format="yyyy-MM"
              placeholder="选择月份">
            </el-date-picker> -->
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select v-model="limit" placeholder="每页展示条数" @change="changeRouter">
              <el-option label="每页10条" :value="10"> </el-option>
              <el-option label="每页15条" :value="15"> </el-option>
              <el-option label="每页20条" :value="20"> </el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="group_id" placeholder="筛选负责小组" clearable>
              <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="is_check" placeholder="审核状态" clearable>
              <el-option :value="0" label="审核中"></el-option>
              <el-option :value="1" label="通过"></el-option>
              <el-option :value="2" label="不通过"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter" v-model="show_price_type" placeholder="显示金额" clearable>
              <el-option :value="1" label="默认"></el-option>
              <el-option :value="2" label="按万位显示金额"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue fr" style="margin-left: 20px" @click="updateNumber(1)">计件更新（按订单）</div>
          <div class="btn backHoverBlue fr" style="margin-left: 20px" @click="updateNumber(2)">计件更新（按员工）</div>
          <div
            class="btn backHoverBlue fr"
            style="margin-bottom: 20px; margin-left: 20px"
            @click="$router.push('/workshopManagement/payTimeDetail')"
          >
            其它更新（按件或时）
          </div>
        </div>
        <div class="tableCtn" style="padding-left: 0; padding-right: 0; padding-top: 0">
          <el-tabs v-model="activeName" type="card" @tab-click="changeRouter">
            <el-tab-pane label="计件结算表" name="1">
              <el-table
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                :row-key="rowKey"
                style="width: 100%"
                @selection-change="handleSelectionChange"
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
                <el-table-column prop="client_name" label="所属客户" width="150"></el-table-column>
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
                <el-table-column prop="total_number" label="总数" width="120"> </el-table-column>
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
                      class="item"
                      effect="dark"
                      v-if="scope.row.shoddy_reason"
                      :content="scope.row.shoddy_reason"
                      placement="top-start"
                    >
                      <span class="blue" style="cursor: pointer">查看</span>
                    </el-tooltip>
                    <div v-else style="color: rgba(0, 0, 0, 0.25)">无</div>
                  </template>
                </el-table-column>
                <el-table-column prop="total_price" label="结算总价(元)" width="120"> </el-table-column>
                <el-table-column prop="group_name" label="负责小组" width="120"> </el-table-column>
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
            </el-tab-pane>
            <el-tab-pane label="其它计价结算表" name="2">
              <el-table
                ref="multipleTable2"
                :data="list"
                tooltip-effect="dark"
                :row-key="rowKey"
                style="width: 100%"
                @selection-change="handleSelectionChange"
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
                <el-table-column prop="price" label="计价方式" width="110">
                  <template slot-scope="scope">
                    <div v-if="scope.row.time_type == 1">小时</div>
                    <div v-if="scope.row.time_type == 2">天</div>
                    <div v-if="scope.row.time_type == 3">件</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="结算单价" width="110">
                  <template slot-scope="scope">
                    <div>{{ scope.row.price }} 元</div>
                  </template>
                </el-table-column>
                <el-table-column label="时长/件数" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.time_type == 1">{{ scope.row.time_count }} 小时</div>
                    <div v-if="scope.row.time_type == 2">{{ scope.row.time_count }} 天</div>
                    <div v-if="scope.row.time_type == 3">{{ scope.row.time_count }} 件</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核状态" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
                    <div v-if="scope.row.is_check === 1" class="blue">通过</div>
                    <div v-if="scope.row.is_check === 2" class="red">不通过</div>
                  </template>
                </el-table-column>
                <el-table-column prop="total_price" label="结算总价(元)" width="120"> </el-table-column>
                <el-table-column prop="group_name" label="负责小组" width="120"> </el-table-column>
                <el-table-column prop="desc" label="备注" width="120"> </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="120"> </el-table-column>
                <el-table-column prop="user_name" label="创建人" width="120"> </el-table-column>
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
            </el-tab-pane>
          </el-tabs>
        </div>

        <div
          v-if="activeName == 1"
          style="width: 80%; display: flex; justify-content: space-between; margin-left: 20px; line-height: 2"
        >
          <span>
            合计完成数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span>
            合计额外数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_extra_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span>
            合计总数：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span>
            合计次品数量：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_shoddy_number / 10000).toFixed(2) }} 万件
            </span>
          </span>
          <span>
            合计结算金额：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_price / 10000).toFixed(2) }} 万元
            </span>
          </span>
        </div>
        <div
          v-if="activeName == 2"
          style="width: 55%; display: flex; justify-content: space-between; margin-left: 20px; line-height: 2"
        >
          <span>
            合计小时：
            <span class="green" style="font-weight: bold"> {{ (additional.times / 10000).toFixed(2) }} 万小时 </span>
          </span>
          <span>
            合计天数：
            <span class="green" style="font-weight: bold"> {{ (additional.days / 10000).toFixed(2) }} 万天 </span>
          </span>
          <span>
            合计件数：
            <span class="green" style="font-weight: bold"> {{ (additional.numbers / 10000).toFixed(2) }} 万件 </span>
          </span>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float: left">
          <div class="btn backHoverOrange" @click="lostEdit()">批量修改</div>
          <div class="btn backHoverBlue" @click="lostAgree">批量通过</div>
          <div class="btn backHoverRed" style="margin-left: 32px" @click="lostDelete(false)">批量删除</div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue" @click="exportExcel">导出结算报表</div>
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
    <product-detail :id="productDetail" :show="productShow" @close="productShow = false" :noOpr="true"></product-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { process, listSetting, staff, exportExcel, workshop, check } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { limitArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    list: OrderInfo[]
    [porpName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      productShow: false,
      list: [],
      limitList: limitArr,
      productDetail: '',
      reviewerParams: {
        pid: '',
        check_type: 14,
        check_desc: '',
        is_check: 1, // 1通过 2没通过
        desc: ''
      },
      limit: 10,
      keyword: '',
      is_check: '',
      show_price_type: 1,
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
      status: '',
      activeName: '1',
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
      this.client_id = query.client_id ? (query.client_id as string).split(',').map(item => Number(item)) : []
      this.department = Number(query.department) || Number(this.$getLocalStorage('department')) || ''
      this.keyword = query.keyword || ''
      this.activeName = query.type || ''
      this.departmentName = query.departmentName || ''
      this.status = query.status || ''
      this.user_id = query.user_id || ''
      this.is_check = query.is_check ? Number(query.is_check) : ''
      this.show_price_type = query.show_price_type ? Number(query.show_price_type) : 1
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      let process = query.process
        ? // @ts-ignore
          query.process.split(',')
        : this.$getLocalStorage('process')
        ? this.$getLocalStorage('process').split(',')
        : []
      process = process.length > 0 ? [Number(process[0]), process[1]] : process
      this.process = process
      this.date = query.date
        ? // @ts-ignore
          query.date.split(',')
        : [
            new Date().getFullYear() +
              '-' +
              (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) +
              '-' +
              '01',
            new Date().getFullYear() +
              '-' +
              (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) +
              '-' +
              new Date().getDate()
          ]
      this.limit = Number(query.limit) || 10
    },
    changeStatus(row: any) {
      this.checkFlag = true
      this.reviewerParams.pid = row.id
    },
    agreeCheck(item: any) {
      if (this.reviewerParams.is_check === 1) {
        this.reviewerParams.check_desc = ''
      }
      check.create(this.reviewerParams).then(res => {
        if (res.data.status) {
          this.$message.success('审核成功')
          this.checkFlag = false
          this.checkAllPlan = false
          this.getList()
        }
      })
    },
    lostEdit(ids?: Array<any>) {
      if (ids) {
        this.$router.push(
          '/workshopManagement/staffInputDetail?type=' + this.activeName + '&ids=' + encodeURIComponent(ids.toString())
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
          '/workshopManagement/staffInputDetail?type=' + this.activeName + '&ids=' + encodeURIComponent(arr.toString())
        )
      }
    },
    lostAgree() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.multipleSelection.forEach((item: any) => {
        arr.push(item.id)
      })

      workshop
        .check({
          id: arr,
          is_check: 1
        })
        .then(res => {
          if (res.data.status === true) {
            this.$message.success('审核成功')
            // @ts-ignore
            this.$refs.multipleTable.clearSelection()
            // @ts-ignore
            this.$refs.multipleTable2.clearSelection()
            this.getList()
          }
        })
    },
    lostDelete(id: any) {
      if (this.multipleSelection.length === 0 && !id) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []

      if (!id) {
        this.multipleSelection.forEach((settlementLog: any) => {
          arr.push(settlementLog.id)
        })
      } else {
        arr = [id]
      }
      workshop
        .delete({
          id: arr
        })
        .then(res => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
            // @ts-ignore
            this.$refs.multipleTable.clearSelection()
            // @ts-ignore
            this.$refs.multipleTable2.clearSelection()
            this.getList()
          }
        })
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
        .then(res => {
          this.departmentName = res.data.data.name
          this.getList()
        })
    },
    handleSelectionChange(val: any) {
      this.multipleSelection = val
    },
    updateNumber(type: 1 | 2) {
      if (type === 1) {
        this.$router.push('/workshopManagement/list')
      } else if (type === 2) {
        // let a = this.multipleSelection.map((user: any) => {
        //   return {
        //     id: user.id,
        //     name: user.name,
        //     code: user.code,
        //     process: user.process
        //   }
        // })
        this.$router.push('/workshopManagement/staffDetail?staffInfo=' + JSON.stringify([]))
      }
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/workshopManagement/payTimeList?page=' +
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
          '&is_check=' +
          this.is_check +
          '&type=' +
          this.activeName +
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
          this.status = ''
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
    exportExcel() {
      if (this.list.length === 0) {
        this.$message.error('请重新进行筛选，表格里有数据方可导出')
        return
      }
      this.mainLoading = true

      workshop
        .list({
          type: this.activeName,
          keyword: this.keyword,
          department: this.departmentName,
          group_id: this.group_id,
          is_check: this.is_check,
          process: this.process[1],
          // year: this.date.split('-')[0],
          // month: this.date.split('-')[1],
          start_time: this.date[0],
          end_time: this.date[1],
          export_excel: 1
        })
        .then(res => {
          if (res.data.status) {
            this.mainLoading = false
            window.location.href = res.data.data
          }
        })
    },
    getList() {
      this.loading = true
      this.processList = []

      staff
        .departmentList({
          keyword: '',
          limit: ''
        })
        .then(res => {
          if (res.data.status) {
            this.departmentList = res.data.data
            this.departmentName = res.data.data.find((res: any) => {
              return res.id == this.department
            })
            this.departmentName = this.departmentName?.name || ''
          }

          workshop
            .list({
              keyword: this.keyword,
              department: this.departmentName,
              type: this.activeName,
              page: this.page,
              limit: this.limit,
              group_id: this.group_id,
              is_check: this.is_check,
              show_price_type: 1,
              process_name: this.process[1],
              start_time: this.date[0],
              end_time: this.date[1]
            })
            .then(res => {
              if (res.data.status) {
                this.list = res.data.data.items
                this.additional = res.data.data.additional
                this.total = res.data.data.total
              }
              this.loading = false
            })
        })

      process.list({ type: 2 }).then(res => {
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
        process.list({ type: 3 }).then(res => {
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
        .then(res => {
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
@import '~@/assets/css/workshopManagement/payTimeList.less';
</style>
