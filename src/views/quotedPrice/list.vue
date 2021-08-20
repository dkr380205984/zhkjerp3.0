<template>
  <div id="quotedPriceList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">报价单列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue fr"
            @click="$router.push('/quotedPrice/create')">添加报价单</div>
          <div class="btn backHoverOrange fr"
            @click="showSetting=true">列表设置</div>
        </div>
        <div class="fixedTableCtn"
          v-loading="loading">
          <div class="original">
            <div class="row title">
              <div class="column"
                v-for="itemKey in listKey"
                :key="itemKey.index"
                v-show="itemKey.ifShow">{{itemKey.name}}</div>
              <div class="column w130">操作</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.list">
              <div class="column"
                v-for="itemKey in listKey"
                :key="itemKey.index"
                v-show="itemKey.ifShow">{{item[itemKey.key]}}</div>
              <div class="column w130">
                <div class="opr hoverBlue"
                  @click="$router.push('/quotedPrice/detail?id=' + item.id)">详情</div>
                <div class="opr hoverOrange">修改</div>
                <div class="opr hoverRed">删除</div>
              </div>
            </div>
          </div>
          <div class="cover">
            <div class="fixedLeft">
              <div class="row title">
                <div class="column"
                  v-for="itemKey in listKey"
                  :key="itemKey.index"
                  v-show="itemKey.ifShow && itemKey.ifLock">{{itemKey.name}}</div>
              </div>
              <div class="row"
                v-for="item in list"
                :key="item.list">
                <div class="column"
                  v-for="itemKey in listKey"
                  :key="itemKey.index"
                  v-show="itemKey.ifShow && itemKey.ifLock">{{itemKey.name}}</div>
              </div>
            </div>
          </div>
          <div class="cover">
            <div class="fixedRight">
              <div class="row title">
                <div class="column w130">操作</div>
              </div>
              <div class="row"
                v-for="item in list"
                :key="item.list">
                <div class="column w130">
                  <div class="opr hoverBlue"
                    @click="$router.push('/quotedPrice/detail?id=' + item.id)">详情</div>
                  <div class="opr hoverOrange">修改</div>
                  <div class="opr hoverRed">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
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
      :type="1"
      :data.sync="listKey"
      :originalData="originalSetting"></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { quotedPrice, listSetting } from '@/assets/js/api'
import { ListSetting } from '@/types/list'
import { QuotedPriceInfo } from '@/types/quotedPrice'
interface QuotedPriceInfoList extends QuotedPriceInfo {
  image_data: string[]
  product_info: string
}
export default Vue.extend({
  data(): {
    originalSetting: ListSetting[]
    list: QuotedPriceInfoList[]
    [propName: string]: any
  } {
    return {
      loading: true,
      list: [],
      page: 1,
      total: 1,
      listSettingId: null,
      listKey: [],
      originalSetting: [
        {
          key: 'code',
          name: '报价单号',
          ifShow: true,
          ifLock: true,
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
          key: 'contact_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'product_info',
          name: '产品信息',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'system_total_price',
          name: '系统合计报价',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'real_quote_price',
          name: '客户实际报价',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'status',
          name: '审核状态',
          ifShow: true,
          ifLock: false,
          index: 8
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
          name: '结算单位',
          ifShow: true,
          ifLock: false,
          index: 11
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
  methods: {
    changeRouter() {
      this.$router.push('/quotedPrice/list?page=' + this.page)
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
    },
    getList() {
      this.loading = true
      quotedPrice
        .list({
          page: this.page,
          limit: 5
        })
        .then((res) => {
          // 产品信息需要在列表里展示，配合列表设置要把产品信息拿到最外层
          this.list = res.data.data.items
          // this.list.forEach((item) => {
          //   item.product_data.forEach((itemChild) => {
          //     item.image_data = item.image_data.concat(itemChild.image_data as string[])
          //   })
          // })
          this.total = res.data.data.total
          this.loading = false
        })
    },
    getListSetting() {
      this.listKey = []
      listSetting
        .detail({
          type: 1
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
        })
    }
  },
  created() {
    this.getFilters()
    this.getList()
    this.getListSetting()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/list.less';
</style>