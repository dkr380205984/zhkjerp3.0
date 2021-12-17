<template>
  <div id="menu"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产流程管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item,index) in menuList.production"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">其他管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item,index) in menuList.other"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="module">
      <div class="titleCtn">
        <div class="title">财务管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item,index) in menuList.finance"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      menuList: {
        production: [
          {
            name: '物料计划',
            id: 4,
            icon: 'icon-wuliaojihua',
            url: '/materialPlan/list?page=1&keyword=&client_id=&user_id=&status=0&date=&&order_type=null'
          },
          {
            name: '物料管理',
            id: 5,
            icon: 'icon-wuliaoguanli',
            url: '/materialManage/list?page=1&type=1&code=&order_code=&date='
          },
          {
            name: '物料出入库',
            id: 6,
            icon: 'icon-wuliaochuruku',
            url: '/materialStock/list?page=1&type=1'
          },
          {
            name: '生产计划',
            id: 7,
            icon: 'icon-shengchanjihua',
            url: '/productionPlan/list?page=1&type=1'
          },
          {
            name: '产品检验',
            id: 8,
            icon: 'icon-shengchanpinjianyan',
            url: '/inspection/list?page=1&type=1'
          },
          {
            name: '装箱计划——暂无',
            id: 9,
            icon: 'icon-zhuangxiangjihua',
            url: '/packPlan/list?page=1&type=1'
          },
          {
            name: '装箱运输——暂无',
            id: 10,
            icon: 'icon-zhuangxiangjihua',
            url: '/packOut/list?page=1&type=1'
          }
        ],
        other: [
          {
            name: '仓库管理',
            id: 11,
            icon: 'icon-cangkuguanli',
            url: '/store/list?page=1&keyword=&user_id=&store_type=1'
          },
          {
            name: '客户与合作商管理',
            id: 12,
            icon: 'icon-kehuguanli',
            url: '/client/list?page=1&type=1&status=1&keyword='
          },
          {
            name: '原料预订购',
            id: 13,
            icon: 'icon-wuliaoyudinggou',
            url: '/materialPlanOrder/list?page=1&type=1'
          },
          {
            name: '工艺单列表',
            id: 14,
            icon: 'icon-wuliaoyudinggou',
            url: '/craft/list?page=1'
          }
          // {
          //   name: '普通打印模板',
          //   id: 14,
          //   icon: 'iconshouye',
          //   url: '/commonPrint/printEasy'
          // },
          // {
          //   name: '菜单打印没做',
          //   id: 15,
          //   icon: 'iconshouye',
          //   url: '/commonPrint/printMenu'
          // }
        ],
        finance: []
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/menu.less';
</style>