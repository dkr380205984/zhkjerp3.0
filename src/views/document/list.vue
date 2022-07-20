<template>
  <div id="documentList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">单证列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="可搜索订单号或产品编号"
              @keydown.enter.native="changeRouter"></el-input>
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
          <div class="btn backHoverBlue fr"
            @click="$router.push('/document/detail')">详情页面入口</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/document/create')">添加单证</div>
        </div>
        <zh-list :list="list"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      list: [],
      keyword: '',
      date: [],
      limit: 10,
      total: 1,
      page: 1,
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
      originalSetting: [
        {
          key: 'po_number',
          name: 'PO Number',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'invoice_number',
          name: 'Invoice Number',
          ifShow: true,
          ifLock: true,
          index: 1
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
          key: '',
          name: 'Invoice State',
          ifShow: true,
          ifLock: false,
          index: 5,
          specialForOrderPrcess: 'document'
        },
        {
          key: 'order_number',
          name: '订单总数',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'create_time',
          name: '添加日期',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 12
        }
      ],
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {}
        },
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {}
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any) => {
            this.$confirm('是否删除单证?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {})
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
    changeRouter() {},
    getFilters() {}
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/list.less';
</style>