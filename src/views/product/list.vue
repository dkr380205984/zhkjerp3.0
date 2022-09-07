<template>
  <div id="productList"
    class="bodyContainer"
    v-loading="loading">
    <div class="module"
      v-loading="mainLoading"
      element-loading-text="正在导出文件中....请耐心等待">
      <div class="titleCtn">
        <div class="title">产品列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn"
            style="width:200px">
            <el-input placeholder="搜索产品/样品编号"
              v-model="code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:200px">
            <el-input v-model="product_name"
              placeholder="搜索产品/样品名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:200px">
            <el-select v-model="product_type"
              placeholder="请选择类型"
              @change="changeRouter">
              <el-option label="全部"
                :value="0"></el-option>
              <el-option label="产品"
                :value="1"></el-option>
              <el-option label="样品"
                :value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn"
            style="width:200px">
            <el-select v-model="style_data"
              placeholder="请选择产品款式"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in productStyleList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn"
            style="width:200px">
            <el-cascader placeholder="请选择产品品类"
              v-model="typeArr"
              :options="productTypeList"
              clearable
              @change="changeRouter"></el-cascader>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn"
            style="width:130px">
            <el-input placeholder="库存数量(最低)"
              v-model="minStore"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <span style="position:absolute;transform: translate(-14px, 5px);">~</span>
          <div class="elCtn"
            style="width:130px">
            <el-input placeholder="库存数量(最高)"
              v-model="maxStore"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:130px">
            <el-input placeholder="价格区间(最低)"
              v-model="minPrice"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <span style="position:absolute;transform: translate(-14px, 5px);">~</span>
          <div class="elCtn"
            style="width:130px">
            <el-input placeholder="价格区间(最高)"
              v-model="maxPrice"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:130px">
            <el-select v-model="user_id"
              placeholder="请选择创建人"
              @change="changeRouter"
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
          <!-- <div class="btn backHoverBlue">
            添加产品
          </div> -->
          <div :class="checkedCount.length>0 ? 'btn backHoverBlue fl' : 'btn backHoverBlue fl noCheck'"
            @click="exportExcel()">
            导出Excel
          </div>
        </div>
        <zh-list :list="list"
          :check="true"
          :checkedCount="checkedCount"
          :listKey="originalSetting"
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
    <product-detail :id="product_id"
      :show="productShow"
      @close="productShow = false;getList()"></product-detail>
  </div>
</template>

<script lang="ts">
import { exportExcel, product } from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      product_id: '',
      code: '',
      product_name: '',
      user_id: '',
      product_type: 0,
      list: [],
      loading: false,
      mainLoading: false,
      page: 1,
      limit: 10,
      total: 1,
      style_data: '',
      typeArr: [],
      minPrice: '',
      maxPrice: '',
      minStore: '',
      maxStore: '',
      date: [],
      checkedCount: [],
      productShow: false,
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
            // @ts-ignore
            this.product_id = item.id
            // @ts-ignore
            this.productShow = true
          }
        }
      ],
      originalSetting: [
        {
          key: 'product_code',
          name: '系统编号',
          ifShow: true,
          ifLock: true,
          index: 0,
          ifCaogao: 'product_type',
          caogaoArr: ['产', '样']
        },
        {
          key: 'name',
          name: '名称',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'style_code',
          name: '客户款号',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          index: 3,
          ifImage: true
        },
        {
          key: 'order_code',
          name: '关联单号',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'order_number',
          name: '历史下单数量',
          ifShow: true,
          ifLock: false,
          index: 5,
          errVal: '0'
        },
        {
          key: 'store_number',
          name: '库存数量',
          ifShow: true,
          ifLock: false,
          index: 6,
          errVal: '0'
        },
        {
          key: 'quote_price',
          name: '报价单价格',
          ifShow: true,
          ifLock: false,
          index: 7,
          errVal: '0',
          unitKey: 'quote_unit'
        },
        {
          key: 'has_craft',
          name: '工艺单',
          ifShow: true,
          ifLock: false,
          index: 8,
          filterArr: ['', '待创建', '已创建'],
          classArr: ['', 'orange', 'blue']
        },
        {
          key: 'has_quote',
          name: '报价单',
          ifShow: true,
          ifLock: false,
          index: 9,
          filterArr: ['', '待创建', '已创建'],
          classArr: ['', 'orange', 'blue']
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'created_at',
          name: '创建时间',
          ifShow: true,
          ifLock: false,
          index: 11
        }
      ]
    }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    },
    productTypeList(): CascaderInfo[] {
      return this.$store.state.api.productType.arr
    },
    productStyleList(): Array<{ name: string; id: number }> {
      return this.$store.state.api.productStyle.arr
    }
  },
  methods: {
    exportExcel() {
      if (this.checkedCount.length === 0) {
        this.$message.error('请选择需要导出的产品')
        return
      }
      this.mainLoading = true
      exportExcel.product({ product_id: this.checkedCount.map((item: any) => item.id) }).then((res: any) => {
        if (res.data.status) {
          window.location.href = res.data.data
        }
        this.mainLoading = false
      })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.limit = Number(query.limit) || 10
      this.product_type = Number(query.product_type) || 0
      this.product_name = query.product_name || ''
      this.code = query.product_code || ''
      this.minPrice = query.minPrice || ''
      this.maxPrice = query.maxPrice || ''
      this.minStore = query.minStore || ''
      this.maxStore = query.maxStore || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.style_data = Number(query.style_data) || ''
      this.typeArr = query.typeArr ? (query.typeArr as string).split(',').map((item) => Number(item)) : []
    },
    changeRouter() {
      this.$router.push(
        '/product/list?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&product_code=' +
          this.code +
          '&product_name=' +
          this.product_name +
          '&user_id=' +
          this.user_id +
          '&product_type=' +
          this.product_type +
          '&typeArr=' +
          this.typeArr +
          '&style_data=' +
          this.style_data +
          '&date=' +
          this.date +
          '&minPrice=' +
          this.minPrice +
          '&maxPrice=' +
          this.maxPrice +
          '&minStore=' +
          this.minStore +
          '&maxStore=' +
          this.maxStore
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/product/list?page=&limit=&product_code=&product_name=&user_id=&product_type=')
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
      product
        .list({
          page: this.page,
          limit: this.limit,
          product_code: this.code,
          product_name: this.product_name,
          product_type: this.product_type,
          user_id: this.user_id,
          minStore: this.minStore,
          maxStore: this.maxStore,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          style_data: this.style_data,
          category_id: this.typeArr.length > 0 ? this.typeArr[0] : '',
          secondary_category_id: this.typeArr.length > 0 ? this.typeArr[1] : ''
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/productType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getProductTypeAsync'
      },
      {
        checkWhich: 'api/productStyle',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getProductStyleAsync'
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
@import '~@/assets/css/product/list.less';
</style>