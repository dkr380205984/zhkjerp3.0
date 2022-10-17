<template>
  <div id="quotedPriceList" class="bodyContainer">
    <div class="module" v-loading="mainLoading" element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">报价单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn" style="position: relative">
          <div class="elCtn">
            <el-input
              v-model="keyword"
              clearable
              @clear="changeRouter"
              placeholder="筛选报价/产品/样品编号"
              @keydown.enter.native="changeRouter"
            ></el-input>
          </div>
          <div class="elCtn">
            <el-cascader
              @change="changeRouter"
              placeholder="筛选询价客户"
              v-model="client_id"
              :options="clientList"
              filterable
              clearable
            >
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select
              placeholder="请选择公司联系人"
              v-model="contacts_id"
              no-data-text="请先选择下单公司"
              filterable
              clearable
              @change="changeRouter"
            >
              <el-option v-for="item in contactsList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn" style="width: 130px">
            <el-input v-model="start_price" placeholder="价格区间" @keydown.enter.native="changeRouter"></el-input>
          </div>
          <span style="position: absolute; transform: translate(-14px, 5px)">~</span>
          <div class="elCtn" style="width: 130px">
            <el-input v-model="end_price" placeholder="价格区间" @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn hasIcon">
            <el-select
              @change="(ev) => getLocalStorage(ev, 'create_user')"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable
            >
              <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存创建人筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('create_user', user_id)"></i>
            </el-tooltip>
          </div>
          <div class="elCtn hasIcon">
            <el-select
              @change="(ev) => getLocalStorage(ev, 'group_id')"
              v-model="group_id"
              placeholder="筛选负责小组"
              clearable
            >
              <el-option v-for="item in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存小组筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('group_id', group_id)"></i>
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
          </div>
          <div class="elCtn" style="width: 130px">
            <el-select v-model="limit" placeholder="每页展示条数" @change="changeRouter">
              <el-option v-for="item in limitList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn" style="width: 130px">
            <el-select @change="changeRouter" v-model="status" placeholder="筛选报价单状态">
              <el-option :value="null" label="全部"></el-option>
              <el-option value="0" label="待审核"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="已驳回"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn" style="height: 33px">
          <div class="elCtn">
            <el-input
              v-model="title"
              placeholder="筛选报价标题"
              @keydown.enter.native="changeRouter"
              clearable
              @clear="changeRouter"
            ></el-input>
          </div>
          <div class="btn backHoverBlue fr" @click="$router.push('/quotedPrice/create')">添加报价单</div>
        </div>
        <div class="filterCtn" style="height: 33px">
          <div class="btn backHoverOrange fl" @click="showSetting = true" style="margin-left: 0">列表设置</div>
          <div
            class="btn backHoverGreen fl"
            @click="
              getFilters()
              getList()
            "
          >
            刷新列表
          </div>
          <div
            :class="orderCheckList.length > 0 ? 'btn backHoverBlue fl' : 'btn backHoverBlue fl noCheck'"
            @click="exportExcel()"
          >
            导出Excel
          </div>
        </div>
        <div class="filterCtn clearfix checkCtn">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check" v-for="(item, index) in orderCheckList" :key="item.id">
            <el-input v-model="item.code" disabled>
              <template slot="append">
                <i class="el-icon-close hoverRed" style="cursor: pointer" @click="orderCheckList.splice(index, 1)"></i>
              </template>
            </el-input>
          </div>
        </div>
        <zh-list
          :list="list"
          :listKey="listKey"
          :loading="loading"
          :check="true"
          :checkedCount="orderCheckList"
          :oprList="oprList"
        ></zh-list>
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
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="1"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { quotedPrice, listSetting, exportExcel, client } from '@/assets/js/api'
import { ListSetting } from '@/types/list'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { limitArr } from '@/assets/js/dictionary'
import zhList from '@/components/zhList/zhList.vue'
interface QuotedPriceInfoList extends QuotedPriceInfo {
  image_data: string[]
  product_info: string
}
export default Vue.extend({
  components: { zhList },
  data(): {
    originalSetting: ListSetting[]
    list: QuotedPriceInfoList[]
    [propName: string]: any
  } {
    return {
      loading: true,
      mainLoading: false,
      contacts_id: '',
      contactsList: [],
      limitList: limitArr,
      list: [],
      page: 1,
      total: 1,
      limit: 10,
      keyword: '',
      title: '',
      client_id: [],
      user_id: '',
      group_id: '',
      status: null,
      start_price: '',
      end_price: '',
      listSettingId: null,
      listKey: [],
      date: [],
      orderCheckList: [],
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
          unitKey: 'settle_unit'
        },
        {
          key: 'real_quote_price',
          name: '客户实际报价',
          ifShow: true,
          ifLock: false,
          index: 6,
          errVal: '0',
          unitKey: 'settle_unit'
        },
        {
          key: 'has_order',
          name: '绑定产品',
          ifShow: true,
          ifLock: false,
          index: 7,
          filterArr: ['', '已绑定', '未绑定'],
          classArr: ['', 'green', 'orange']
        },
        {
          key: 'is_check',
          name: '审核状态',
          ifShow: true,
          ifLock: false,
          index: 8,
          filterArr: ['待审核', '已审核', '已驳回'],
          classArr: ['orange', 'blue', 'red']
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
          key: 'settle_unit',
          name: '报价币种',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'created_at',
          name: '创建日期',
          ifShow: true,
          ifLock: false,
          index: 12
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
            // 判断是否为草稿
            if (item.is_draft === 1) {
              this.$router.push('/quotedPrice/update?id=' + item.id)
            } else {
              this.$router.push('/quotedPrice/detail?id=' + item.id)
            }
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            this.$router.push('/quotedPrice/update?id=' + item.id)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            if (!this.$permissionsFlag('1-4')) {
              return
            }
            this.$confirm('是否删除报价单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                quotedPrice
                  .delete({
                    id: item.id
                  })
                  .then((res) => {
                    if (res.data.status) {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      })
                      // @ts-ignore
                      this.getList()
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
        }
      ],
      showSetting: false
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
  methods: {
    getContacts(ev: number[]) {
      if (ev && ev.length) {
        client
          .detail({
            id: ev.length === 1 ? ev[0] : ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.contactsList = res.data.data.contacts_data
              if (ev.length === 1) {
                this.client_id = [res.data.data.client_type_id, res.data.data.rel_tag_data[0].id, ev[0]]
              }
            }
          })
      } else {
        this.contacts_id = ''
      }
    },
    getLocalStorage(ev: any, type: string) {
      if (!ev) {
        this.$setLocalStorage(type, '')
      }
      this.changeRouter()
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/quotedPrice/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&title=' +
          this.title +
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
          this.limit +
          '&contacts_id=' +
          this.contacts_id +
          '&start_price=' +
          this.start_price +
          '&end_price=' +
          this.end_price
      )
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.contacts_id = Number(query.contacts_id) || ''
      if (this.client_id && this.client_id.length) {
        // 从别的页面跳进来默认只有client_id，需要处理一下
        this.getContacts(this.client_id)
      }
      this.keyword = query.keyword || ''
      this.title = query.title || ''
      this.status = query.status === 'null' ? null : query.status
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.limit = Number(query.limit) || 10
      this.date = query.date ? (query.date as string).split(',') : []
      this.start_price = query.start_price || ''
      this.end_price = query.end_price || ''
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.client_id = []
          this.title = ''
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.contacts_id = ''
          this.date = []
          this.limit = 10
          this.start_price = ''
          this.end_price = ''
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
      quotedPrice
        .list({
          keyword: this.keyword,
          title: this.title,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: this.limit,
          is_check: this.status,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          group_id: this.group_id,
          contacts_id: this.contacts_id,
          min_price: this.start_price,
          max_price: this.end_price
        })
        .then((res) => {
          // 产品信息需要在列表里展示，配合列表设置要把产品信息拿到最外层
          res.data.data.items.map((item: any) => {
            this.$set(item, 'isCheck', false)
            item.system_total_price = this.$toFixed((item.system_total_price * 100) / (item.exchange_rate || 100))
            return item
          })
          this.list = res.data.data.items
          this.total = res.data.data.total
          this.loading = false
        })
    },
    exportExcel() {
      const idArr = this.orderCheckList.map((item: any) => item.id)
      if (idArr.length === 0) {
        this.$message.error('请选择需要导出的报价单')
        return
      }
      this.mainLoading = true
      exportExcel
        .quoteList({
          client_id: this.client_id,
          id: idArr
        })
        .then((res: any) => {
          if (res.data.status) {
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

<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/list.less';
</style>