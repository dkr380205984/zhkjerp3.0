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
        <div class="filterCtn">
          <div class="elCtn hasIcon">
            <el-select @change="changeRouter"
              v-model="group_id"
              placeholder="筛选负责小组"
              clearable>
              <el-option v-for="item in groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
            <el-tooltip class="item"
              effect="dark"
              content="保存负责小组筛选"
              placement="top">
              <i class="el-icon-upload hoverOrange"
                @click="$setLocalStorage('group_id',group_id)"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn fl"
            style="float:left;margin-left:0"
            :class="{'backHoverBlue':listType===2,'backGray':listType===1}"
            @click="getList(1)">切换到生产单</div>
          <div class="btn fl"
            style="float:left"
            :class="{'backHoverBlue':listType===1,'backGray':listType===2}"
            @click="getList(2)">切换到订单</div>
          <div class="btn fr backHoverBlue"
            @click="getUpdateDetail">更新生产数量</div>
        </div>
        <div class="fixedTableCtn"
          v-loading="loading"
          v-if="listType===1">
          <zh-list :list="list"
            :check="true"
            :checkedCount="checkedCount"
            :listKey="originalSetting2"
            :loading="loading"
            :oprList="oprList"></zh-list>
          <!-- <div class="original">
            <div class="row title">
              <div class="column w150">生产计划单号</div>
              <div class="column w150">产品信息</div>
              <div class="column">产品图片</div>
              <div class="column">加工工序</div>
              <div class="column w150">加工单位</div>
              <div class="column">加工状态</div>
              <div class="column w150">生产进度</div>
              <div class="column w220">分配/交货时间</div>
              <div class="column">更新日期</div>
              <div class="column">下单公司</div>
              <div class="column">创建人</div>
              <div class="column w150">操作</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="column w150">
                <el-checkbox v-model="item.check"
                  @change="$forceUpdate()">{{item.code}}</el-checkbox>
              </div>
              <div class="column w150">
                <span>{{item.product_info[0].product_code}}</span>
              </div>
              <div class="column">
                <div class="imageCtn">
                  <el-image style="width:100%;height:100%"
                    :src="item.product_info[0].image_data.length>0?item.product_info[0].image_data[0].image_url:''"
                    :preview-src-list="item.product_info[0].image_data.map((item)=>item.image_url)">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="column">{{item.process_name}}</div>
              <div class="column w150">{{item.client_name}}</div>
              <div class="column"><span :class="item.status|filterStatusClass">{{item.status|filterStatus}}</span></div>
              <div class="column w150">
                <span :class="{'gray':Number(item.real_number)===0,'orange':Number(item.real_number)<Number(item.number),'green':Number(item.real_number)>=Number(item.number)}">{{item.real_number}}/{{item.number}}</span>
              </div>
              <div class="column w220"
                style="flex-direction:column;align-items:center">
                <span>{{item.start_time}}~{{item.end_time}}</span>
                <span :class="$diffByDate(item.end_time)>0?'green':'red'">({{$diffByDate(item.end_time)>0?'还剩'+$diffByDate(item.end_time)+'天':'逾期'+Math.abs($diffByDate(item.end_time))+'天'}})</span>
              </div>
              <div class="column">{{item.updated_at}}</div>
              <div class="column">{{item.client_name}}</div>
              <div class="column">{{item.user_name}}</div>
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
          </div> -->
        </div>
        <div class="fixedTableCtn"
          v-loading="loading"
          v-if="listType===2">
          <zh-list :list="list"
            :check="true"
            :checkedCount="checkedCount"
            :listKey="originalSetting"
            :loading="loading"
            :oprList="oprList"></zh-list>
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
    <div class="popup"
      v-if="updateFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">更新生产数量</span>
          <div class="closeCtn"
            @click="updateFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tableCtn"
            style="padding:32px 0;font-size:12px">
            <div class="thead">
              <div class="trow">
                <div class="tcol">订单号</div>
                <div class="tcol">生产单号</div>
                <div class="tcol">单位(工序)</div>
                <div class="tcol">产品信息</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单/分配数量</div>
                <div class="tcol">已完成数量</div>
                <div class="tcol">更新时间</div>
                <div class="tcol">最新备注信息</div>
                <div class="tcol">本次完成数量</div>
                <div class="tcol">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in updateList"
                :key="item.id">
                <div class="tcol">{{item.order_code}}</div>
                <div class="tcol">{{item.weave_code}}</div>
                <div class="tcol">{{item.client_name}}
                  (<span class="green">{{item.process_name}}</span>)
                </div>
                <div class="tcol">{{item.product_code}}</div>
                <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{item.order_number}}/{{item.number}}</div>
                <div class="tcol">{{item.real_number}}</div>
                <div class="tcol">{{item.update_time}}</div>
                <div class="tcol">{{item.desc}}</div>
                <div class="tcol">
                  <div class="elCtn">
                    <el-input v-model="item.new_number"
                      placeholder="数量"></el-input>
                  </div>
                </div>
                <div class="tcol">
                  <div class="elCtn">
                    <el-input v-model="item.new_desc"
                      placeholder="备注"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updateFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveUpdateInfo">确认更新</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-if="updateLogFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">生产更新日志</span>
          <div class="closeCtn"
            @click="updateLogFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tableCtn"
            style="padding:32px 0;font-size:12px">
            <div class="thead">
              <div class="trow">
                <div class="tcol">订单号</div>
                <div class="tcol">生产单号</div>
                <div class="tcol">单位(工序)</div>
                <div class="tcol">产品信息</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">更新数量</div>
                <div class="tcol">更新时间</div>
                <div class="tcol">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in updateLog"
                :key="item.id">
                <div class="tcol">{{item.order_code}}</div>
                <div class="tcol">{{item.weave_code}}</div>
                <div class="tcol">{{item.client_name}}
                  (<span class="green">{{item.process_name}}</span>)
                </div>
                <div class="tcol">{{item.product_code}}</div>
                <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{item.number}}</div>
                <div class="tcol">{{item.update_time}}</div>
                <div class="tcol">{{item.desc}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updateLogFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="updateLogFlag=false">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, productionProgress } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      listType: 2,
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
      },
      checked: false,
      checkedCount: [],
      updateList: [],
      updateFlag: false,
      updateLog: [],
      updateLogFlag: false,
      originalSetting2: [
        {
          key: 'code',
          name: '生产计划单号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'order_code',
          name: '关联订单号',
          ifShow: true,
          ifLock: true,
          index: 2
        },
        {
          key: 'process_name',
          name: '加工工序',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'client_name',
          name: '加工单位',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'product_code',
          otherkey: 'system_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 5,
          from: 'product_info',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 6,
          from: 'product_info'
        },
        {
          key: 'total_number',
          name: '分配数量',
          ifShow: true,
          ifLock: false,
          index: 7,
          errVal: '0'
        },
        {
          key: 'total_real_number',
          name: '完成数量',
          ifShow: true,
          ifLock: false,
          index: 8,
          class: 'green',
          errVal: '0'
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 9
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 11
        }
      ],
      originalSetting: [
        {
          key: 'code',
          name: '订单号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
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
          key: 'product_code',
          otherkey: 'system_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 5,
          from: 'product_data'
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 6,
          errVal: '0'
        },
        {
          key: 'weave_plan_real_number',
          name: '已完成数量',
          ifShow: true,
          ifLock: false,
          index: 7,
          class: 'green',
          errVal: '0'
        },
        {
          key: 'has_weave_plan_status',
          name: '计划单状态',
          ifShow: true,
          ifLock: false,
          index: 8,
          filterArr: ['', '已创建', '待创建'],
          classArr: ['', 'blue', 'orange']
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
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 10
        }
      ],
      oprList: [
        {
          name: '查看生产日志',
          class: 'hoverBlue',
          fn: (item: any) => {
            productionProgress
              .updateDetail({
                // @ts-ignore
                plan_ids: this.listType === 1 ? [item.id] : [],
                // @ts-ignore
                order_ids: this.listType === 2 ? [item.id] : []
              })
              .then((res) => {
                if (res.data.status) {
                  if (res.data.data.update_log.length > 0) {
                    // @ts-ignore
                    this.updateLog = res.data.data.update_log
                    // @ts-ignore
                    this.updateLogFlag = true
                  } else {
                    this.$message.error('暂无生产日志')
                  }
                }
              })
          }
        }
      ]
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
    },
    groupList() {
      return this.$store.state.api.group.arr
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
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.keyword = query.keyword || ''
      this.status = Number(query.status) || 0
      this.user_id = query.user_id || ''
      this.group_id = query.group_id || ''
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
          this.limit +
          '&group_id=' +
          this.group_id
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
          this.group_id = ''
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
    getList(listType?: number) {
      if (listType) {
        this.listType = listType
        this.keyword = ''
        this.user_id = ''
        this.group_id = ''
        this.date = []
        this.status = 0
        this.limit = 10
      }
      this.loading = true
      if (this.listType === 1) {
        productionProgress
          .list({
            order_type: 1,
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
            }
            this.loading = false
          })
      } else {
        order
          .list({
            order_type: 1,
            page: this.page,
            limit: this.limit,
            keyword: this.keyword,
            // status: this.status,
            start_time: this.date.length > 0 ? this.date[0] : '',
            end_time: this.date.length > 0 ? this.date[1] : '',
            user_id: this.user_id
          })
          .then((res) => {
            if (res.data.status) {
              this.list = res.data.data.items
              this.total = res.data.data.total
              this.list.forEach((item: any) => {
                item.has_weave_plan_status = item.has_weave_plan.status
              })
            }
            this.loading = false
          })
      }
    },
    getUpdateDetail() {
      const checkList = this.checkedCount
      if (checkList.length === 0) {
        this.$message.error('请选择要更新数量的单据')
        return
      }
      this.loading = true
      productionProgress
        .updateDetail({
          plan_ids: this.listType === 1 ? checkList.map((item: any) => item.id) : [],
          order_ids: this.listType === 2 ? checkList.map((item: any) => item.id) : []
        })
        .then((res) => {
          console.log(res)
          if (res.data.status) {
            this.updateList = res.data.data.weave_info
            this.updateFlag = true
          }
          this.loading = false
        })
    },
    saveUpdateInfo() {
      const formData = this.updateList.filter((item: any) => item.new_number)
      if (formData.length === 0) {
        this.$message.error('至少填写一项')
        return
      }
      this.loading = true
      productionProgress
        .updateNumber({
          data: formData.map((item: any) => {
            return {
              pid: item.id,
              number: item.new_number,
              desc: item.new_desc || ''
            }
          })
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('更新成功')
            this.getList()
            this.updateFlag = false
          }
          this.loading = false
        })
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
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