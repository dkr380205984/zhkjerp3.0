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
      <!-- <div class="tag"
        :class="{'active':store_type===3}"
        @click="store_type=3;changeRouter">
        <i class="icon">图标</i>
        <span class="text">毛料原料仓库</span>
      </div> -->
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
      <!--<div class="tag"
        :class="{'active':store_type===6}"
        @click="store_type=6;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-baozhuangfuliaocangku'></use>
        </svg>
        <span class="text">包装辅料仓库</span>
      </div> -->
    </div>
    <div class="module">
      <div class="listCtn">
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
            <el-input v-model="product_name"
              placeholder="搜索产品名称"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverGreen fr"
            @click="goStock(1)">产品入库</div>
          <!-- <div class="btn backHoverOrange fr"
            @click="goStock(6)">销毁出库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(5)">销售出库</div>
          <div class="btn backHoverBlue fr"
            @click="goStock(4)">产品移库</div> -->
          <div class="btn backHoverBlue fr"
            @click="$router.push('/store/create?store_type='+5)">添加仓库</div>
          <div class="btn backHoverGreen fr"
            @click="getStoreList();lookListFlag=true">仓库列表</div>
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
                <div class="opr hoverBlue"
                  @click="store_type!==5?$router.push('/store/materialDetail?id='+item.id+'&store_type='+store_type):$router.push('/store/productDetail?id='+item.id +'&store_type='+store_type)">详情</div>
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
      @afterStockSave="stockInFlag=false"></product-edit>
  </div>
</template>

<script lang="ts">
import { store } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      storeArr: [],
      store_id: '',
      secondary_id: '',
      store_arr: [],
      product_code: '',
      product_name: '',
      stockInFlag: false,
      storeLoading: false,
      storeList: [],
      storePage: 1,
      storeTotal: 1,
      lookListFlag: false
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
    changeRouter() {},
    reset() {},
    getList() {
      store
        .searchPro({
          page: 1,
          limit: 10
        })
        .then((res) => {
          console.log(res)
        })
    },
    goStock(type: number) {
      if (type === 1) {
        this.stockInFlag = true
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
    }
  },
  created() {
    this.getStoreSelect()
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
