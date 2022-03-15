<template>
  <div id="productStoreList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        @click="$router.push('/store/list?page=1&keyword=&store_type=1&store_id=&secondary_id=&material_name=&material_color=&attribute=&vat_code=&color_code=&batch_code=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shaxianyuanliaocangku'></use>
        </svg>
        <span class="text">纱线原料仓库</span>
      </div>
      <div class="tag"
        @click="$router.push('/store/list?page=1&keyword=&store_type=2&store_id=&secondary_id=&material_name=&material_color=&attribute=&vat_code=&color_code=&batch_code=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-mianliaoyuanliaocangku'></use>
        </svg>
        <span class="text">面料原料仓库</span>
      </div>
      <div class="tag"
        @click="$router.push('/store/list?page=1&keyword=&store_type=4&store_id=&secondary_id=&material_name=&material_color=&attribute=&vat_code=&color_code=&batch_code=')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-zhuangshifuliaocangku'></use>
        </svg>
        <span class="text">装饰辅料仓库</span>
      </div>
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-chanpincangku'></use>
        </svg>
        <span class="text">产品仓库</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn"
        v-loading="loading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-cascader :options="storeArr"
              clearable
              placeholder="请选择仓库"
              v-model="store_arr"
              @change="(ev)=>{store_id=ev[0];secondary_id=ev[1];changeRouter()}"></el-cascader>
          </div>
          <div class="elCtn">
            <el-input v-model="product_code"
              placeholder="搜索产品编号"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="name"
              placeholder="搜索产品名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="btn borderBtn fr"
            @click="reset">重置</div>
          <div class="btn borderBtn fr"
            @click="page=1;listType=!listType;changeRouter()">查看{{listType?'产品库存列表':'产品日志列表'}}</div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverGreen fr"
            @click="goStock(1)">产品入库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(6)">销毁出库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(5)">销售出库</div>
          <div class="btn backHoverBlue fr"
            @click="goStock(4)">产品移库</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/store/create?store_type='+5)">添加仓库</div>
          <div class="btn backHoverGreen fr"
            @click="getStoreList();lookListFlag=true">仓库列表</div>
        </div>
        <!-- 日志列表 -->
        <template v-if="listType">
          <div class="tableCtn noPad">
            <div class="thead">
              <div class="trow">
                <div class="tcol">日志单号</div>
                <div class="tcol">出入库类型</div>
                <div class="tcol">调取详情</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">产品信息</div>
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">库存数量</div>
                    <div class="tcol">销售单价</div>
                  </div>
                </div>
                <div class="tcol">操作人</div>
                <div class="tcol">操作日期</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in list"
                :key="item.id">
                <div class="tcol">{{item.code}}</div>
                <div class="tcol"
                  :class="item.action_type|productStockTypeClassFilter">{{item.action_type | productStockTypeFilter}}</div>
                <div class="tcol">
                  <template v-if="item.action_type===5">
                    <div class="changeCtn">
                      <span>{{item.store}}/{{item.secondary_store}}</span>
                      <span class="el-icon-s-unfold green"></span>
                      <span>{{item.client_name}}</span>
                    </div>
                  </template>
                  <template v-if="item.action_type===4 || item.action_type===3">
                    <div class="changeCtn">
                      <span>{{item.store}}/{{item.secondary_store}}</span>
                      <span class="el-icon-s-unfold green"></span>
                      <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                    </div>
                  </template>
                  <template v-if="item.action_type===6 || item.action_type===2 || item.action_type===1">
                    <div class="changeCtn">
                      <span>{{item.store}}/{{item.secondary_store}}</span>
                    </div>
                  </template>
                </div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.info_data"
                    :key="indexChild">
                    <div class="tcol">
                      <span>{{itemChild.product_code}}</span>
                      <span>{{itemChild.category}}/{{itemChild.secondary_category}}</span>
                    </div>
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{itemChild.number}}</div>
                    <div class="tcol">{{itemChild.price||0}}元</div>
                  </div>
                </div>
                <div class="tcol">{{item.user_name}}</div>
                <div class="tcol">操作日期</div>
              </div>
            </div>
          </div>
        </template>
        <!-- 库存列表 -->
        <template v-else>
          <div class="tableCtn noPad">
            <div class="thead">
              <div class="trow">
                <div class="tcol">仓库名称</div>
                <div class="tcol">产品编号品类</div>
                <div class="tcol">产品名称</div>
                <div class="tcol">客户款号</div>
                <div class="tcol">产品图片</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">库存数量</div>
                    <div class="tcol">操作</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in list"
                :key="item.id">
                <div class="tcol">{{item.store}}/{{item.secondary_store}}</div>
                <div class="tcol">{{item.product_code}}({{item.category}}/{{item.secondary_category}})</div>
                <div class="tcol">{{item.name}}</div>
                <div class="tcol">{{item.style_code}}</div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%"
                      :src="item.image_data&&item.image_data.length>0?item.image_data[0]:''"
                      :preview-src-list="item.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.info_data"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{itemChild.number}}</div>
                    <div class="tcol">
                      <el-checkbox v-model="itemChild.check"></el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcol">合计：</div>
                <div class="tcol"></div>
                <div class="tcol"></div>
                <div class="tcol"></div>
                <div class="tcol"></div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol"></div>
                    <div class="tcol">库存数量</div>
                    <div class="tcol"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 产品出入库 -->
    <div class="popup"
      v-show="stockFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="title">{{productStockInfo.action_type===4?'移':'出'}}库信息</div>
          <div class="closeCtn"
            @click="stockFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">来源仓库</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <div class="disableInput">{{productStockInfo.store}}/{{productStockInfo.secondary_store}}</div>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">出入库类型</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <div class="disableInput">{{productStockInfo.action_type | productStockTypeFilter}}</div>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="productStockInfo.action_type===5||productStockInfo.action_type===4">
                  <span class="text">{{productStockInfo.action_type===5?'选择单位':'选择仓库'}}</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader v-if="productStockInfo.action_type===5"
                    placeholder="请选择出库单位"
                    v-model="productStockInfo.tree_data"
                    :options="clientList"
                    @change="(ev)=>{productStockInfo.client_id=ev[2]}"
                    filterable>
                  </el-cascader>
                  <el-cascader v-if="productStockInfo.action_type===4"
                    :options="storeArr"
                    placeholder="请选择仓库"
                    v-model="productStockInfo.tree_data"
                    @change="(ev)=>{productStockInfo.move_store_id=ev[0];productStockInfo.move_secondary_store_id=ev[1]}"></el-cascader>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in productStockInfo.info_data"
              :key="index">
              <div class="col">
                <div class="label">
                  <span class="text">产品信息</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <div class="disableInput">{{item.product_code}}({{item.category}}/{{item.secondary_category}})</div>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">尺码颜色</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <div class="disableInput">{{item.size_name}}/{{item.color_name}}</div>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once"
                    v-if="productStockInfo.action_type===5">
                    <div class="label">
                      <span class="text">销售单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input v-model="item.price"
                        placeholder="销售单价">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label">
                      <span class="text">出库数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input v-model="item.number"
                        placeholder="出库数量"></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col"
                style="max-width:280px">
                <div class="label">
                  <span class="text">出库日期</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="操作日期"
                    value-format="yyyy-MM-dd"
                    v-model="productStockInfo.complete_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="备注信息"
                    v-model="productStockInfo.desc"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="stockFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveProductStock">确认出库</span>
        </div>
      </div>
    </div>
    <!-- 仓库列表 -->
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
            v-loading="storeLoading">
            <div class="row title">
              <div class="col">仓库名称</div>
              <div class="col">仓库类型</div>
              <div class="col">关联单位</div>
              <div class="col">当前库存总数量</div>
              <div class="col">仓库备注</div>
              <div class="col">操作</div>
            </div>
            <div class="row"
              v-for="item in storeList"
              :key="item.id">
              <div class="col">{{item.name}}</div>
              <div class="col">{{item.type===1?'本厂仓库':item.type===2?'加工厂仓库':'供货商仓库'}}</div>
              <div class="col">{{item.client_name || '无'}}</div>
              <div class="col">{{item.total_number}}</div>
              <div class="col">{{item.desc}}</div>
              <div class="col">
                <div class="opr hoverRed"
                  @click="deleteStore(item.id)">删除</div>
              </div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="storeTotal"
              :current-page.sync="storePage"
              @current-change="getStoreList">
            </el-pagination>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="lookListFlag=false">关闭</span>
        </div>
      </div>
    </div>
    <product-edit :show="stockInFlag"
      :ifStore="true"
      @close="stockInFlag=false"
      @afterStockSave="stockInFlag=false;getList()"></product-edit>
  </div>
</template>

<script lang="ts">
import { productStock, store } from '@/assets/js/api'
import { ProductStoreInfo, ProductStockInfo } from '@/types/productStock'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    productStockInfo: ProductStockInfo
    list: ProductStoreInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      storeArr: [],
      store_id: '',
      secondary_id: '',
      store_arr: [],
      product_code: '',
      name: '',
      stockFlag: false,
      stockInFlag: false,
      storeLoading: false,
      listType: false,
      list: [],
      page: 1,
      total: 1,
      storeList: [],
      storePage: 1,
      storeTotal: 1,
      lookListFlag: false,
      productStockInfo: {
        action_type: 1,
        complete_time: this.$getDate(new Date()),
        tree_data: [], // 存公司或者移库仓库用
        client_id: '',
        move_store_id: '',
        move_secondary_store_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        store: '',
        secondary_store: '',
        store_arr: [], // 前端下拉框用
        info_data: [
          {
            product_code: '',
            name: '',
            category: '',
            secondary_category: '',
            product_id: '',
            size_id: '',
            color_id: '',
            price: '',
            size_name: '',
            color_name: '',
            number: ''
          }
        ]
      }
    }
  },
  computed: {
    clientList(): any[] {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    }
  },
  watch: {
    $route(val) {
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getStoreSelect() {
      store
        .list({
          store_type: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.storeArr = res.data.data.map((item: any) => {
              return {
                label: item.name,
                value: item.id,
                children: item.secondary_store.map((itemChild: any) => {
                  return {
                    label: itemChild.name,
                    value: itemChild.id
                  }
                })
              }
            })
          }
        })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.listType = query.listType === 'true' ? true : false
      this.store_id = Number(query.store_id) || ''
      this.secondary_id = Number(query.secondary_id) || ''
      this.store_arr = Number(query.store_id) ? [Number(query.store_id), Number(query.secondary_id)] : []
      this.name = query.name
      this.product_code = query.product_code
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/store/productList?page=' +
          this.page +
          '&listType=' +
          this.listType +
          '&store_id=' +
          this.store_id +
          '&secondary_id=' +
          this.secondary_id +
          '&product_code' +
          this.product_code +
          '&name' +
          this.name
      )
    },
    reset() {},
    getList() {
      this.loading = true
      if (this.listType) {
        store
          .proLog({
            page: this.page,
            product_code: this.product_code,
            name: this.name,
            store_id: this.store_id,
            secondary_id: this.secondary_id,
            limit: 10
          })
          .then((res) => {
            if (res.data.status) {
              this.list = res.data.data.items
              this.total = res.data.data.total
            }
            this.loading = false
          })
      } else {
        store
          .searchPro({
            product_code: this.product_code,
            name: this.name,
            store_id: this.store_id,
            secondary_id: this.secondary_id,
            page: this.page,
            limit: 10
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
    goStock(type: 1 | 5 | 6) {
      if (type === 1) {
        this.stockInFlag = true
      } else {
        const checkInfo = this.list.filter((item) => {
          return item.info_data.some((itemChild) => itemChild.check)
        })
        if (checkInfo.length === 0) {
          this.$message.error('请选择产品进行操作')
          return
        }
        const mergeArr = this.$mergeData(checkInfo, {
          mainRule: ['store_id', 'secondary_store_id'],
          otherRule: [{ name: 'store' }, { name: 'secondary_store' }]
        })
        if (mergeArr.length > 1) {
          this.$message.error('只能选择同一仓库/二级仓库的产品进行操作')
          return
        }
        this.productStockInfo.action_type = type
        this.productStockInfo.store_id = mergeArr[0].store_id
        this.productStockInfo.secondary_store_id = mergeArr[0].secondary_store_id
        this.productStockInfo.store = mergeArr[0].store
        this.productStockInfo.secondary_store = mergeArr[0].secondary_store
        console.log(mergeArr[0])
        this.productStockInfo.info_data = []
        mergeArr[0].childrenMergeInfo.forEach((item: any) => {
          item.info_data.forEach((itemChild: any) => {
            this.productStockInfo.info_data.push({
              product_id: item.product_id,
              product_code: item.product_code,
              name: item.name,
              category: item.category,
              secondary_category: item.secondary_category,
              size_id: itemChild.size_id,
              color_id: itemChild.color_id,
              size_name: itemChild.size_name,
              color_name: itemChild.color_name,
              price: '',
              number: ''
            })
          })
        })
        console.log(this.productStockInfo)
        this.stockFlag = true
      }
    },
    getStoreList() {
      this.storeLoading = true
      store
        .list({
          store_type: 5,
          page: 1,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.storeList = res.data.data.items
            this.storeTotal = res.data.data.total
          }
          this.storeLoading = false
        })
    },
    saveProductStock() {
      const formCheck =
        (this.productStockInfo.action_type === 5 &&
          this.$formCheck(this.productStockInfo, [
            {
              key: 'client_id',
              errMsg: '请选择出库单位'
            }
          ])) ||
        (this.productStockInfo.action_type === 4 &&
          this.$formCheck(this.productStockInfo, [
            {
              key: 'store_id',
              errMsg: '请选择移库仓库'
            }
          ])) ||
        this.productStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'number',
              errMsg: '请输入数量'
            }
          ])
        })
      if (!formCheck) {
        this.loading = true
        productStock.create(this.productStockInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.productStockInfo = {
              action_type: 1,
              complete_time: this.$getDate(new Date()),
              tree_data: [], // 存公司或者移库仓库用
              client_id: '',
              move_store_id: '',
              move_secondary_store_id: '',
              desc: '',
              store_id: '',
              secondary_store_id: '',
              store: '',
              secondary_store: '',
              store_arr: [], // 前端下拉框用
              info_data: [
                {
                  product_code: '',
                  name: '',
                  category: '',
                  secondary_category: '',
                  product_id: '',
                  size_id: '',
                  color_id: '',
                  price: '',
                  size_name: '',
                  color_name: '',
                  color_size: '',
                  number: ''
                }
              ]
            }
            this.stockFlag = false
            this.getList()
          }
          this.loading = false
        })
      }
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
    this.getStoreSelect()
    this.getFilters()
    this.getList()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/store/productList.less';
</style>
<style lang="less">
#productStoreList {
  .el-input-group__append {
    padding: 0 12px;
  }
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 38px;
        .el-input__inner {
          padding: 0 6px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
  // checkbox优化
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background: #fff;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    cursor: pointer;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }
  input:disabled {
    cursor: pointer;
    color: -internal-light-dark(black, white);
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409eff !important;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
  // checkbox瞎几把改造到此为止
}
</style>
