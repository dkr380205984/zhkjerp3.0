<template>
  <div id="productionPlanProgressList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/productionPlan/list?page=&keyword=&client_id=&user_id=&group_id=&order_type=&status=&date=&limit=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shengchanjihua2'></use>
        </svg>
        <span class="text">生产计划</span>
      </div>
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shengchanjindu'></use>
        </svg>
        <span class="text">生产进度</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产进度列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="筛选客户/加工厂名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="changeRouter"
              v-model="status"
              placeholder="筛选加工状态">
              <el-option label="全部"
                :value="0"></el-option>
              <el-option label="已分配"
                :value="1"></el-option>
              <el-option label="已逾期"
                :value="2"></el-option>
              <el-option label="生产中"
                :value="3"></el-option>
              <el-option label="生产完成"
                :value="4"></el-option>
            </el-select>
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
        <div class="fixedTableCtn"
          v-loading="loading">
          <div class="original">
            <div class="row title">
              <div class="column w150">生产计划单号</div>
              <div class="column w150">产品信息</div>
              <div class="column">产品图片</div>
              <div class="column">加工工序</div>
              <div class="column w150">加工单位</div>
              <div class="column">加工状态</div>
              <div class="column w150">生产进度</div>
              <div class="column w220">分配/交货时间</div>
              <div class="column">下单公司</div>
              <div class="column w150">操作</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="column w150">{{item.code}}</div>
              <div class="column w150">
                <span>{{item.product.product_code}}</span>
              </div>
              <div class="column">
                <div class="imageCtn">
                  <el-image style="width:100%;height:100%"
                    :src="item.product.rel_image2.length>0?item.product.rel_image2[0].image_url:''"
                    :preview-src-list="item.product.rel_image2.map((item)=>item.image_url)">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="column">{{item.process_name}}</div>
              <div class="column w150">{{item.client.name}}</div>
              <div class="column"><span :class="item.status|filterStatusClass">{{item.status|filterStatus}}</span></div>
              <div class="column w150">
                <span :class="{'gray':Number(item.real_number)===0,'orange':Number(item.real_number)<Number(item.number),'green':Number(item.real_number)>=Number(item.number)}">{{item.real_number}}/{{item.number}}</span>
              </div>
              <div class="column w220"
                style="flex-direction:column;align-items:center">
                <span>{{item.start_time}}~{{item.end_time}}</span>
                <span :class="$diffByDate(item.end_time)>0?'green':'red'">({{$diffByDate(item.end_time)>0?'还剩'+$diffByDate(item.end_time)+'天':'逾期'+Math.abs($diffByDate(item.end_time))+'天'}})</span>
              </div>
              <div class="column">{{item.customer.name}}</div>
              <div class="column w150">操作</div>
            </div>
          </div>
          <div class="cover">
            <div class="fixedRight">
              <div class="row title">
                <div class="column w150">操作</div>
              </div>
              <div class="row"
                v-for="item in list"
                :key="item.id">
                <div class="column w150">
                  <div class="opr hoverBlue"
                    @click="$router.push('/productionPlan/progressDetail?id='+item.id)">详情</div>
                </div>
              </div>
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
import { productionProgress } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      total: 1,
      limit: 10,
      page: 1,
      list: [],
      keyword: '',
      status: 0,
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
      }
    }
  },
  filters: {
    filterStatusClass(val: number) {
      const arr = ['', 'orange', 'red', 'blue', 'green']
      return arr[val]
    },
    filterStatus(val: number) {
      const arr = ['', '已分配', '已逾期', '生产中', '生产完成']
      return arr[val]
    }
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
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.keyword = query.keyword || ''
      this.status = Number(query.status) || 0
      this.user_id = query.user_id || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = query.limit ? Number(query.limit) : 10
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/productionPlan/progressList?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&user_id=' +
          this.user_id +
          '&status=' +
          this.status +
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
          this.keyword = ''
          this.user_id = ''
          this.date = []
          this.status = 0
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
      productionProgress
        .list({
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
          status: this.status,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    this.getFilters()
    this.getList()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/progressList.less';
</style>