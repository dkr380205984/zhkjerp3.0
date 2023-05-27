<template>
  <div id="staffInputDetail" class="bodyContainer" v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">结算日志</div>
      </div>
      <div class="tableCtn" v-if="$route.query.type == '1'">
        <el-table :data="settlementLogList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="id" label="序号" width="70" fixed></el-table-column>
          <el-table-column prop="created_at" label="添加时间" width="110" fixed> </el-table-column>
          <el-table-column prop="staff_name" label="员工姓名" width="120" fixed>
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
          <el-table-column prop="product_code" label="产品编号" width="120"> </el-table-column>
          <el-table-column label="颜色尺码" width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="number" label="完成数量" width="120">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.number"
                @input="changeAddi"
                placeholder="请输入完成数量"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column prop="extra_number" label="额外数量" width="120">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.extra_number"
                @input="changeAddi"
                placeholder="请输额外数量"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column prop="total_number" label="总数" width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.extra_number + scope.row.number }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shoddy_number" label="次品数量" width="120">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.shoddy_number"
                placeholder="请输次品数量"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column label="工序说明" width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.process_desc || '无工序说明' }}</div>
              <!-- <el-tooltip class="item" effect="dark" :content="scope.row.process_desc || '无工序说明'" placement="top-start">
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip> -->
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
          <el-table-column label="次品原因" width="120">
            <template slot-scope="scope">
              <el-select
                style="height: 32px !important"
                v-model="scope.row.shoddy_reason"
                multiple
                filterable
                allow-create
                default-first-option
                collapse-tags
                placeholder="请选择次品原因"
              >
                <el-option
                  v-for="item in substandardReason"
                  :key="item.value + 'ciPinReason'"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="结算单价(元/件)" fixed="right" width="150">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.price"
                @input="changeAddi"
                placeholder="请输结算单价"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column label="结算总价(元)" fixed="right" width="120">
            <template slot-scope="scope">
              <div>
                {{ ((scope.row.price || 0) * (scope.row.number || 0)).toFixed(3) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="$route.query.type == '1'"
          style="width: 55%; display: flex; justify-content: space-between; margin-left: 20px; margin-top: 20px; line-height: 2"
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
            合计结算金额：
            <span class="green" style="font-weight: bold">
              {{ (additional.total_price / 10000).toFixed(2) }} 万元
            </span>
          </span>
        </div>
      </div>
      <div class="tableCtn" v-if="$route.query.type == '2'">
        <el-table :data="settlementLogList" tooltip-effect="dark" :row-key="rowKey" style="width: 100%">
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
              <div>{{ scope.row.process_desc || '无工序说明' }}</div>
              <!-- <el-tooltip class="item" effect="dark" :content="scope.row.process_desc || '无工序说明'" placement="top-start">
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column prop="price" label="计价方式" width="140">
            <template slot-scope="scope">
              <el-select v-model="scope.row.time_type" placeholder="请选择" style="height: 32px !important">
                <el-option label="按小时计价" value="1"> </el-option>
                <el-option label="按天计价" value="2"> </el-option>
                <el-option label="按件计价" value="3"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="结算单价" width="110">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.price"
                placeholder="请输入单价"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column label="时长/件数" width="120">
            <template slot-scope="scope">
              <zh-input
                v-model="scope.row.time_count"
                placeholder="请输入时长/件数"
                :keyBoard="keyBoard"
                type="number"
              ></zh-input>
            </template>
          </el-table-column>
          <el-table-column label="所属小组" width="120">
            <template slot-scope="scope">
              <div class="elCtn">
                <el-select v-model="scope.row.group_id" placeholder="所属小组" clearable>
                  <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
              <div v-if="scope.row.is_check === 1" class="blue">通过</div>
              <div v-if="scope.row.is_check === 2" class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="total_price" label="结算总价(元)">
            <template slot-scope="scope">
              <div>{{ ((scope.row.price || 0) * (scope.row.time_count || 0)).toFixed(3) }} 元</div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="备注">
            <template slot-scope="scope">
              <zh-input v-model="scope.row.desc" placeholder="请输入备注" :keyBoard="keyBoard"></zh-input>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: center">
                <div class="hoverOrange opr">修改</div>
                <div class="hoverBlue opr" @click="changeStatus(scope.row)">审核</div>
                <div class="hoverRed opr" @click="lostDelete(scope.row.id)">删除</div>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue fr" @click="workSave">提交修改</div>
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
      additional: {},
      month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      settlementLogList: [],
      keyBoard: false,
      substandardReason: [
        {
          value: '织造原因',
          label: '织造原因'
        },
        {
          value: '捻须原因',
          label: '捻须原因'
        },
        {
          value: '拉毛原因',
          label: '拉毛原因'
        },
        {
          value: '刺毛原因',
          label: '刺毛原因'
        },
        {
          value: '水洗原因',
          label: '水洗原因'
        },
        {
          value: '车缝原因',
          label: '车缝原因'
        },
        {
          value: '套口原因',
          label: '套口原因'
        },
        {
          value: '整烫原因',
          label: '整烫原因'
        },
        {
          value: '手工原因',
          label: '手工原因'
        },
        {
          value: '其它原因',
          label: '其它原因'
        }
      ]
    }
  },
  methods: {
    init() {
      this.loading = true
      let params: {
        ids: Array<any>
        type: string | number
      } = {
        // @ts-ignore
        ids: this.$route.query.ids.split(','),
        type: this.$route.query.type + ''
      }

      workshop.list(params).then(res => {
        this.settlementLogList = res.data.data
        this.changeAddi()
        this.loading = false
      })
    },
    changeAddi() {
      this.additional = {
        total_price: this.settlementLogList.reduce((a: any, b: any) => {
          return a + Number(b.number) * Number(b.price)
        }, 0),
        total_number: this.settlementLogList.reduce((a: any, b: any) => {
          return a + Number(b.number)
        }, 0),
        total_extra_number: this.settlementLogList.reduce((a: any, b: any) => {
          return a + Number(b.extra_number)
        }, 0)
      }
    },
    workSave() {
      if (this.type == 2) {
        this.settlementLogList.forEach((item: any) => {
          item.total_price = (item.price || 0) * (item.time_count || 0)
        })
      }
      if (this.type == 1) {
        this.settlementLogList.forEach((item: any) => {
          item.total_price = (item.price || 0) * (item.number || 0)
        })
      }
      workshop.save({ type: this.type, data: this.settlementLogList }).then(res => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          // this.$router.push('/workshopManagement/staffInputDetail?isAll=true')
          if (this.$route.query.staffId) {
            this.$router.push('/workerManage/detail?id=' + this.$route.query.staffId)
          } else {
            this.$router.push('/workshopManagement/payTimeList?page=1&type=' + this.type)
          }
        }
      })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.month = query.month || new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
      this.ids = query.ids
      this.type = query.type
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
          '&ids=' +
          this.ids +
          '&type=' +
          this.type
      )
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.init()
    }
  },
  computed: {
    groupList(): any {
      return this.$store.state.api.group.arr
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      }
    ])
    this.getFilters()
    this.init()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/staffInputDetail.less';
</style>
