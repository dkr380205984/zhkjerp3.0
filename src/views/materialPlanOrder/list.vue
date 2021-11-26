<template>
  <div id="materialPlanOrderList"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">物料预订购列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-cascader placeholder="请选择订购供货商"
              v-model="search_client_id"
              :options="orderClientList"
              @change="changeRouter"
              clearable>
            </el-cascader>
          </div>
          <div class="btn backHoverBlue fr"
            @click="addFlag = true">添加预订购</div>
        </div>
        <div class="list"
          v-loading="loading">
          <div class="row title">
            <div class="col">年份</div>
            <div class="col">类型</div>
            <div class="col">公司名称</div>
            <div class="col">预定数量</div>
            <div class="col">入库物料</div>
            <div class="col">入库数量</div>
            <div class="col">备注信息</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.year}}</div>
            <div class="col">{{item.material_type|filterMaterialType}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.total_number}}</div>
            <div class="col">没数据</div>
            <div class="col">没数据</div>
            <div class="col">{{item.desc||'无'}}</div>
            <div class="col oprCtn">
              <div class="opr hoverBlue"
                @click="$router.push('/materialPlanOrder/detail?id='+item.id)">详情</div>
              <div class="opr hoverRed"
                @click="deleteMaterialPlanOrder(item.id)">删除</div>
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
      v-show="addFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加订购商</span>
          <div class="closeCtn"
            @click="addFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label isMust">预定年份：</div>
            <div class="info elCtn">
              <el-date-picker v-model="materialPlanOrderClient.year"
                style="width:100%"
                placeholder="请选择预定年份"
                value-format="yyyy"
                type="year"></el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">原料类型：</div>
            <div class="info elCtn">
              <el-select placeholder="请选择原料类型"
                v-model="materialPlanOrderClient.material_type">
                <el-option v-for="item in yarnTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">订购供货商：</div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择订购供货商"
                v-model="materialPlanOrderClient.tree_data"
                :options="orderClientList"
                @change="(ev)=>{materialPlanOrderClient.client_id=ev[2]}">
              </el-cascader>
            </div>
          </div>
          <div class="row">
            <div class="label isMust">预订购总数：</div>
            <div class="info elCtn">
              <el-input placeholder="请输入预订购总数"
                v-model="materialPlanOrderClient.total_number">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="materialPlanOrderClient.desc">
              </el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="addFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialPlanOrderClient">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialPlanOrderClient } from '@/types/materialPlanOrder'
import { CascaderInfo } from '@/types/vuex'
import { materialOrder, materialPlanOrder } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    materialPlanOrderClient: MaterialPlanOrderClient
    [propName: string]: any
  } {
    return {
      addFlag: false,
      list: [],
      keyword: '',
      search_client_id: [],
      client_id: [],
      date: [],
      total: 1,
      page: 1,
      materialPlanOrderClient: {
        year: new Date().getFullYear().toString(),
        material_type: '',
        client_id: '',
        tree_data: [],
        total_number: '',
        desc: ''
      }
    }
  },
  filters: {
    filterMaterialType(type: 1 | 2 | 3) {
      const typeArr = ['', '纱线', '面料', '毛料']
      return typeArr[type]
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
      this.search_client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.date = query.date ? (query.date as string).split(',') : []
    },
    changeRouter() {
      this.$router.push(
        '/materialPlanOrder/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.search_client_id +
          '&date=' +
          this.date
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.search_client_id = []
          this.keyword = ''
          this.date = []
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
      materialPlanOrder
        .list({
          order_type: 1,
          keyword: this.keyword,
          client_id: this.search_client_id.length > 0 ? this.search_client_id[2] : '',
          page: this.page,
          limit: 5,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : ''
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    saveMaterialPlanOrderClient() {
      const formcheck = this.$formCheck(this.materialPlanOrderClient, [
        {
          key: 'material_type',
          errMsg: '请选择原料类型'
        },
        {
          key: 'client_id',
          errMsg: '请选择订购供货商'
        },
        {
          key: 'total_number',
          errMsg: '请填写预订购总数'
        }
      ])
      if (!formcheck) {
        this.loading = true
        materialPlanOrder.create(this.materialPlanOrderClient).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.addFlag = false
            this.getFilters()
            this.getList()
          }
        })
      }
    },
    deleteMaterialPlanOrder(id: number) {
      this.$confirm('是否删除该预订购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialPlanOrder.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    }
  },
  computed: {
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) => item.label === '纱线原料单位' || item.label === '面料原料单位'
      )
    },
    yarnTypeList(): CascaderInfo[] {
      return this.$store.state.api.yarnType.arr
    }
  },
  created() {
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlanOrder/list.less';
</style>