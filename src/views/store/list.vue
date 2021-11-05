<template>
  <div id="storeList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        :class="{'active':store_type===1}"
        @click="store_type=1;changeRouter">
        <i class="icon">图标</i>
        <span class="text">纱线原料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===2}"
        @click="store_type=2;changeRouter">
        <i class="icon">图标</i>
        <span class="text">面料原料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===3}"
        @click="store_type=3;changeRouter">
        <i class="icon">图标</i>
        <span class="text">毛料原料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===4}"
        @click="store_type=4;changeRouter">
        <i class="icon">图标</i>
        <span class="text">装饰辅料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===5}"
        @click="store_type=5;changeRouter">
        <i class="icon">图标</i>
        <span class="text">产品仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===6}"
        @click="store_type=6;changeRouter">
        <i class="icon">图标</i>
        <span class="text">包装辅料仓库</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="elCtn">
            <el-input placeholder="筛选"></el-input>
          </div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/store/create?store_type='+store_type)">添加仓库</div>
          <div class="btn backHoverGreen fr"
            @click="lookListFlag=true">查看仓库列表</div>
        </div>
        <div class="list"
          v-loading="loading">
          <div class="row title">
            <div class="col">仓库名称</div>
            <div class="col">仓库类型</div>
            <div class="col">关联单位</div>
            <div class="col">当前库存总数量</div>
            <div class="col">仓库备注</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.type===1?'本厂仓库':item.type===2?'加工厂仓库':'供货商仓库'}}</div>
            <div class="col">{{item.client_name || '无'}}</div>
            <div class="col">{{item.total_number}}</div>
            <div class="col">{{item.desc}}</div>
            <div class="col oprCtn">
              <div class="opr hoverBlue"
                @click="store_type!==5?$router.push('/store/materialDetail?id='+item.id):$router.push('/store/productDetail?id='+item.id)">详情</div>
              <div class="opr hoverRed">删除</div>
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
    <div class="popup"
      v-show="lookListFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">仓库列表</span>
          <div class="closeCtn"
            @click="lookListFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="list"
            v-loading="loading">
            <div class="row title">
              <div class="col">仓库名称</div>
              <div class="col">仓库类型</div>
              <div class="col">关联单位</div>
              <div class="col">当前库存总数量</div>
              <div class="col">仓库备注</div>
              <div class="col">操作</div>
            </div>
            <div class="row"
              v-for="item in list"
              :key="item.id">
              <div class="col">{{item.name}}</div>
              <div class="col">{{item.type===1?'本厂仓库':item.type===2?'加工厂仓库':'供货商仓库'}}</div>
              <div class="col">{{item.client_name || '无'}}</div>
              <div class="col">{{item.total_number}}</div>
              <div class="col">{{item.desc}}</div>
              <div class="col">
                <div class="opr hoverBlue"
                  @click="store_type!==5?$router.push('/store/materialDetail?id='+item.id):$router.push('/store/productDetail?id='+item.id)">详情</div>
                <div class="opr hoverRed">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="lookListFlag=false">关闭</span>
          <span class="btn backHoverBlue"
            @click="$router.push('/store/create?store_type='+store_type)">添加新仓库</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '@/assets/js/api'
import { storeType } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      store_type: 1,
      keyword: '',
      user_id: '',
      page: 1,
      total: 1,
      list: [],
      lookListFlag: false,
      storeTypeList: storeType
    }
  },
  filters: {},
  watch: {
    store_type(val) {
      this.changeRouter()
    },
    $route(val) {
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    changeRouter() {
      this.$router.push(
        '/store/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&user_id=' +
          this.user_id +
          '&store_type=' +
          this.store_type
      )
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.user_id = Number(query.user_id) || ''
      this.store_type = Number(query.store_type) || ''
    },
    getList() {
      this.loading = true
      store
        .list({
          store_type: this.store_type,
          page: 1,
          limit: 5
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
  created() {
    this.getFilters()
    this.getList()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/store/list.less';
</style>