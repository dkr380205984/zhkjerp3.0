<template>
  <div id="craftList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">工艺单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="筛选工艺单编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="product_code"
              placeholder="筛选产品/样品编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="yarn_name"
              placeholder="筛选纱线名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="btn fr borderBtn"
            @click="reset">重置</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/craft/create')">添加工艺单</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="$setLocalStorage('create_user',user_id);changeRouter()"
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
        <zh-list :list="list"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"></zh-list>
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
    <!-- 列表设置 -->
    <zh-list-setting @close="showSetting=false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="10"
      :data.sync="listKey"
      :originalData="originalSetting"></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { craft, listSetting } from '@/assets/js/api'
import { ListSetting } from '@/types/list'
import { limitArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    originalSetting: ListSetting[]
    [porpName: string]: any
  } {
    return {
      loading: true,
      list: [],
      limitList: limitArr,
      keyword: '',
      product_code: '',
      yarn_name: '',
      client_id: [],
      group_id: '',
      user_id: '',
      status: '0',
      date: [],
      limit: 10,
      total: 1,
      page: 1,
      showSetting: false,
      listSettingId: null,
      listKey: [],
      originalSetting: [
        {
          key: 'craft_code',
          name: '工艺单编号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'title',
          name: '工艺单名称',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'product_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 3
        },
        {
          key: 'material_name',
          name: '纱线信息',
          ifShow: true,
          ifLock: false,
          from: 'material_info',
          index: 4,
          mark: true
        },
        {
          key: 'size',
          name: '规格',
          unit: 'cm',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'weight',
          name: '克重',
          unit: 'g',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'create_time',
          name: '创建时间',
          ifShow: true,
          ifLock: false,
          index: 8
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
            this.$router.push('/craft/detail?id=' + item.id)
          }
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            this.$router.push('/craft/update?id=' + item.id)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            this.$confirm('是否删除工艺单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                craft
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
      ]
    }
  },
  methods: {
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.keyword = query.keyword || ''
      this.product_code = query.product_code || ''
      this.yarn_name = query.yarn_name || ''
      this.user_id = query.user_id || this.$getLocalStorage('create_user')
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    changeRouter() {
      this.$router.push(
        '/craft/list?page=' +
          this.page +
          '&user_id=' +
          this.user_id +
          '&keyword=' +
          this.keyword +
          '&product_code=' +
          this.product_code +
          '&yarn_name=' +
          this.yarn_name +
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
          this.client_id = []
          this.keyword = ''
          this.user_id = ''
          this.product_code = ''
          this.yarn_name = ''
          this.date = []
          this.status = 'null'
          this.limit = 5
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
      craft
        .list({
          keyword: this.keyword,
          page: this.page,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          product_code: this.product_code,
          yarn_name: this.yarn_name,
          limit: this.limit
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.list.forEach((item: any) => {
              if (item.product_info) {
                item.product_code = item.product_info.product_code || item.product_info.system_code
                item.image_data = item.product_info.image_data
              } else {
                item.product_code = '未绑定产品'
                item.image_data = []
              }
            })
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 10
        })
        .then((res) => {
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

<style lang="less" scoped>
@import '~@/assets/css/craft/list.less';
</style>