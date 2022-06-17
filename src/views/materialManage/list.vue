<template>
  <div id="materialManageList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shaxianyuanliaocangku'></use>
        </svg>
        <span class="text">物料计划单</span>
      </div>
      <div class="tag"
        @click="$router.push('/materialManage/supList?page=1')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-mianliaoyuanliaocangku'></use>
        </svg>
        <span class="text">物料补充单</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料管理列表</div>
      </div>
      <div class="listCtn"
        v-loading="loading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索计划单号"
              v-model="code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="搜索订单号"
              v-model="order_code"
              @keydown.enter.native="changeRouter"></el-input>
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
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select v-model="filter_way"
              placeholder="采购调取比例"
              @change="changeRouter"
              clearable>
              <el-option value="greater"
                label="大于100%"></el-option>
              <el-option value="less"
                label="小于100%"></el-option>
              <el-option value="equal"
                label="等于100%"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="is_check"
              placeholder="审核状态"
              @change="changeRouter"
              clearable>
              <el-option value="0"
                label="待审核"></el-option>
              <el-option value="1"
                label="已审核"></el-option>
              <el-option value="2"
                label="已驳回"></el-option>
              <el-option value="3"
                label="单据异常"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="changeRouter">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">计划单号</div>
            <div class="col">关联订单</div>
            <div class="col">负责小组/人</div>
            <div class="col">合计计划数量</div>
            <div class="col">合计采购数量</div>
            <div class="col">合计加工数量</div>
            <div class="col">采购调取比例</div>
            <div class="col">审核状态</div>
            <div class="col">创建人</div>
            <div class="col">创建日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.group_name}}</div>
            <div class="col">{{item.total_plan_number}}</div>
            <div class="col">{{item.total_order_number}}</div>
            <div class="col">{{item.total_production_number || 0}}</div>
            <div class="col"
              :class="item.material_order_progress>=100?'green':'orange'">{{item.material_order_progress}}%</div>
            <div class="col"
              :class="item.is_check|filterCheckClass">{{item.is_check|filterCheck}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at.slice(0,10)}}</div>
            <div class="col">
              <span class="opr hoverBlue"
                @click="$router.push('/materialManage/detail?id='+item.id)">订购加工</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
import { limitArr } from '@/assets/js/dictionary'
import { MaterialPlanInfo } from '@/types/materialPlan'
export default Vue.extend({
  data(): {
    list: MaterialPlanInfo[]
    [porpName: string]: any
  } {
    return {
      loading: false,
      list: [],
      limitList: limitArr,
      total: 1,
      page: 1,
      limit: 10,
      code: '',
      order_code: '',
      date: [],
      user_id: '',
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
      additional: {
        pre_loss: 0,
        total_material_number: 0,
        total_production_number: 0
      },
      filter_way: '',
      is_check: ''
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.code = query.code
      this.order_code = query.order_code
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
      this.user_id = query.user_id || ''
      this.filter_way = query.filter_way || ''
      this.is_check = query.is_check || ''
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/materialManage/list?page=' +
          this.page +
          '&code=' +
          this.code +
          '&order_code=' +
          this.order_code +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit +
          '&user_id=' +
          this.user_id +
          '&filter_way=' +
          this.filter_way +
          '&is_check=' +
          this.is_check
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.code = ''
          this.order_code = ''
          this.date = []
          this.limit = 10
          this.user_id = ''
          this.filter_way = ''
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
      materialPlan
        .list({
          limit: this.limit,
          page: this.page,
          code: this.code,
          order_code: this.order_code,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          filter_way: this.filter_way,
          filter_progress: this.filter_way ? 1 : '',
          is_check: this.is_check
        })
        .then((res) => {
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.additional = res.data.data.additional
          this.loading = false
        })
    }
    // getListSetting() {
    //   this.listKey = []
    //   listSetting
    //     .detail({
    //       type: 5
    //     })
    //     .then((res) => {
    //       this.listSettingId = res.data.data ? res.data.data.id : null
    //       this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
    //     })
    // }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  created() {
    this.getFilters()
    this.getList()
    // this.getListSetting()
    this.$checkCommonInfo([
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
@import '~@/assets/css/materialManage/list.less';
</style>