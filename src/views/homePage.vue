<template>
  <div id="homePage"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">搜索</div>
      </div>
      <div class="content">
        <div class="searchCtn">
          <el-input class="input"
            placeholder="请输入产品/样品/报价单/订单信息按回车搜索"
            v-model="searchValue"
            @keydown.native.enter="searchInfo">
            <i slot="suffix"
              class="el-input__icon el-icon-search"></i>
            <el-select v-model="searchType"
              slot="prepend"
              class="select"
              placeholder="请选择">
              <el-option label="所有"
                value="1"></el-option>
              <el-option label="样品"
                value="2"></el-option>
              <el-option label="样品订单"
                value="3"></el-option>
              <el-option label="报价单"
                value="4"></el-option>
              <el-option label="产品"
                value="5"></el-option>
              <el-option label="订单"
                value="6"></el-option>
            </el-select>
          </el-input>
          <div class="btn backHoverBlue"
            @click="searchInfo">搜索</div>
        </div>
        <div class="seachHistory">
          <div class="container">
            <span class="label gray">近期搜索记录：</span>
            <span class="normal gray"
              v-for="(item,index) in history"
              :key="index"
              @click="searchHistory(item)">{{item}}</span>
          </div>
          <div class="btn noBorder gray"
            @click="resetHistory">清空历史</div>
        </div>
        <div class="searchBox"
          v-show="showSearch"
          v-loading="searchLoading">
          <i class="el-icon-circle-close icons"
            @click="showSearch = false"></i>
          <div class="block">
            <div class="titled">相关样品</div>
            <div class="info">
              <span class="text">XXXXXXX</span>
              <span class="text">XXXXXXXXXXX</span>
              <span class="text">XXXXXXXXXXX</span>
              <span class="text">XXXXXXXXX</span>
            </div>
            <div class="noMsg">暂无相关信息</div>
          </div>
          <!--<div class="block"
              v-show="searchType==='1'||searchType==='2'">
              <div class="titled">相关样品</div>
              <div class="info"
                v-for="item in sampleProductCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.product_code"
                  @click="$router.push('/sample/sampleDetail/' + item.id)"></span>
                <span class="text">{{item.category_info.category_name + '/' + item.category_info.type_name + '/' + item.category_info.style_name }}</span>
                <span class="text">{{item.product_title}}</span>
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="noMsg"
                v-if="sample_product.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='3'">
              <div class="titled">相关样单</div>
              <div class="info"
                v-for="item in sampleOrderCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.order_code"
                  @click="$router.push('/sample/sampleOrderDetail/' + (item.pid!==0?item.pid:item.id))"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_number}}</span>
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="noMsg"
                v-if="sample_order.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='5'">
              <div class="titled">相关产品</div>
              <div class="info"
                v-for="item in productCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.product_code"
                  @click="$router.push('/product/productDetail/' + item.id)"></span>
                <span class="text">{{item.category_info.category_name + '/' + item.category_info.type_name + '/' + item.category_info.style_name }}</span>
                <span class="text">{{item.product_title}}</span>
                <span class="text">{{item.user_name}}</span>
              </div>
              <div class="noMsg"
                v-if="product.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='4'">
              <div class="titled">相关报价单</div>
              <div class="info"
                v-for="item in quotationCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.quotation_code"
                  @click="$router.push('/price/priceDetail/' + item.id)"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_price}}元</span>
                <span class="text">{{item.status===1?'待审核':(item.status===2?'已通过':'驳回')}}</span>
              </div>
              <div class="noMsg"
                v-if="quotation.length===0">暂无相关信息</div>
            </div>
            <div class="block"
              v-show="searchType==='1'||searchType==='6'">
              <div class="titled">相关订单</div>
              <div class="info"
                v-for="item in orderCmp"
                :key="item.id">
                <span class="text"
                  v-html="item.order_code"
                  @click="$router.push('/order/orderDetail/' + item.id)"></span>
                <span class="text">{{item.client_name}}</span>
                <span class="text">{{item.total_number}}</span>
                <span class="text">{{item.group_name}}</span>
              </div>
              <div class="noMsg"
                v-if="order.length===0">暂无相关信息</div>
            </div> -->
        </div>
      </div>
    </div>
    <div class="fastEditCtn">
      <div class="first_line">
        <div class="fastEdit_item"
          v-for="(item,index) in userCheckedOpr"
          :key="index"
          @click="easyOprFlag ? false : $router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <span class="name">{{item.opr}}</span>
          <span class="editBtn delete el-icon-minus red"
            v-if="easyOprFlag"
            @click.stop="item.isChecked = false"></span>
        </div>
        <div class="edit_item"
          @click="easyOprFlag ? saveOpr() : easyOprFlag = true">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xitongshezhi"></use>
          </svg>
          <span class="name blue">{{easyOprFlag ? '完成编辑' : '自定义编辑'}}</span>
        </div>
      </div>
      <div class="edit_line_box"
        :class="easyOprFlag ? false : 'hiddle'"
        :style="'height:' + userCanCheckedOpr.length * 132 + 'px'">
        <div class="edit_line"
          v-for="(item,index) in userCanCheckedOpr"
          :key="index">
          <div class="fastEdit_item"
            v-for="(itemN,indexN) in item"
            :key="indexN">
            <svg class="iconFont"
              aria-hidden="true">
              <use :xlink:href="'#' + itemN.icon"></use>
            </svg>
            <span class="name">{{itemN.opr}}</span>
            <span class="editBtn add el-icon-plus green"
              v-if="easyOprFlag"
              @click.stop="addFastList(itemN)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="flexCtn">
      <div class="leftCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">版本更新公告</div>
          </div>
        </div>
      </div>
      <div class="rightCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">系统教学</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      searchType: '1',
      searchValue: '',
      history: ['喜喜', '哈哈'],
      showSearch: true,
      searchLoading: false,
      easyOprFlag: false,
      userEasyOpr: [],
      easyOpr: [
        {
          id: 1,
          isChecked: false,
          opr: '添加报价单',
          icon: 'icon-tianjiabaojiadan',
          url: '/quotedPrice/create',
          check: true
        },
        {
          id: 1,
          isChecked: false,
          opr: '报价单列表',
          icon: 'icon-baojiadan',
          url: '/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: 3,
          isChecked: false,
          opr: '添加订单',
          icon: 'icon-tianjiadingdan',
          url: '/order/create'
        },
        {
          id: 3,
          isChecked: false,
          opr: '订单管理',
          icon: 'icon-dingdan',
          url: '/order/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: 5,
          isChecked: false,
          opr: '添加样单',
          icon: 'icon-tianjiayangdan',
          url: '/sampleOrder/create'
        },
        {
          id: 5,
          isChecked: false,
          opr: '样单管理',
          icon: 'icon-yangdan',
          url: '/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: 6,
          isChecked: false,
          opr: '物料计划',
          icon: 'icon-wuliaojihua',
          url: '/materialPlan/list?page=1&keyword=&client_id=&user_id=&status=0&date=&&order_type=null'
        },
        {
          id: 7,
          isChecked: false,
          opr: '物料管理',
          icon: 'icon-wuliaodinggou',
          url: '/materialManage/list?page=1&type=1&code=&order_code=&date='
        },
        {
          id: 8,
          isChecked: false,
          opr: '物料出入库',
          icon: 'icon-wuliaochuruku',
          url: '/materialStock/list?page=1&type=1'
        },
        {
          id: 9,
          isChecked: false,
          opr: '生产计划',
          icon: 'icon-zhizaojiagong',
          url: '/productionPlan/list?page=1&type=1'
        },
        {
          id: 10,
          isChecked: false,
          opr: '产品检验',
          icon: 'icon-chanpinshoufa',
          url: '/inspection/list?page=1&type=1'
        },
        {
          opr: '仓库管理',
          isChecked: false,
          id: 11,
          icon: 'icon-chanpinshoufa',
          url: '/store/list?page=1&keyword=&user_id=&store_type=1'
        },
        {
          opr: '客户与合作商管理',
          isChecked: false,
          id: 12,
          icon: 'icon-chanpinshoufa',
          url: '/client/list?page=1&type=1&status=1&keyword='
        },
        {
          opr: '原料预订购',
          isChecked: false,
          id: 13,
          icon: 'icon-chanpinshoufa',
          url: '/materialPlanOrder/list?page=1&type=1'
        }
      ]
    }
  },
  methods: {
    newSplice(data: any[], index = 5, arr?: any) {
      if (data.length === 0 || !data) {
        return []
      }
      if (!arr) {
        arr = []
      }
      arr.push(data.splice(0, index))
      if (data.length > 0) {
        this.newSplice(data, index, arr)
      }
      return arr
    },
    searchInfo() {
      console.log(this.userCanCheckedOpr)
    },
    searchHistory() {},
    resetHistory() {},
    saveOpr() {
      // window.localStorage.setItem('userEasyOpr', JSON.stringify(this.userCheckedOpr.map(itemM => itemM.opr)))
      // this.$message.success('编辑成功')
      // this.easyOprFlag = false
    },
    deleteOpr(index: number) {
      this.userEasyOpr.splice(index, 1)
    },
    addFastList(item: any) {
      if (this.userCheckedOpr.length >= 6) {
        this.$message.warning('最多可添加6个快捷操作入口')
      } else {
        item.isChecked = true
      }
    }
  },
  computed: {
    // 用户可选的操作
    userCanCheckedOpr(): any[] {
      return this.newSplice(
        this.easyOpr.filter((itemF) => !itemF.isChecked),
        7
      )
    },
    // 用户已选的操作
    userCheckedOpr(): any[] {
      return this.easyOpr.filter((itemF: any) => itemF.isChecked)
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/homePage.less';
</style>
<style lang="less">
#homePage {
  .searchCtn {
    .el-input-group__prepend {
      background-color: #fff !important;
    }
    .select {
      width: 120px;
      .el-input .el-input__inner {
        border-color: transparent !important;
      }
      .el-input .el-input__inner:focus {
        border-color: transparent !important;
      }
    }
  }
}
</style>
