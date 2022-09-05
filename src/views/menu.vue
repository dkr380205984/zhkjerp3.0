<template>
  <div id="menu"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产流程管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item, index) in menuList.production"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">其他管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item, index) in menuList.other"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">财务管理</div>
      </div>
      <div class="menuList">
        <div class="menu_item"
          v-for="(item, index) in menuList.finance"
          :key="index"
          @click="$router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <p class="name">{{ item.name }}</p>
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
      menuList: {
        production: [
          {
            name: '原料计划',
            id: '4-3',
            icon: 'icon-wuliaojihua',
            url: '/materialPlan/list?page=1&keyword=&client_id=&user_id=&status=0&date=&&order_type=null'
          },
          {
            name: '原料管理',
            id: '5-3',
            icon: 'icon-yuanliaoguanli',
            url: '/materialManage/list?page=1&type=1&code=&order_code=&date='
          },
          {
            name: '辅料管理',
            id: '6-3',
            icon: 'icon-fuliaoguanli',
            url: '/accessoriesManage/list?page=1&code=&date='
          },
          {
            name: '原料出入库',
            id: '7-3',
            icon: 'icon-wuliaochuruku',
            url: '/materialStock/list?page=1&type=1'
          },
          {
            name: '生产计划',
            id: '8-3',
            icon: 'icon-shengchanjihua',
            url: '/productionPlan/list?page=1&type=1'
          },
          {
            name: '检验收发',
            id: '9-3',
            icon: 'icon-shengchanpinjianyan',
            url: '/inspection/list?page=1&type=1&status=1&order_type=1'
          },
          {
            name: '包装管理',
            id: '11-3',
            icon: 'icon-zhuangxiangjihua',
            url: '/packManage/list?page=1&type=1'
          },
          {
            name: '车间管理',
            id: '19-3',
            icon: 'icon-chejianguanli',
            url: '/workshopManagement/payTimeList?page=1&type=1'
          },
          {
            name: '发货管理',
            id: '10-3',
            icon: 'icon-zhuangxiangjihua',
            url: '/boxManage/list?page=1&type=1'
          }
        ],
        other: [
          {
            name: '仓库管理',
            id: '12-3',
            icon: 'icon-cangkuguanli',
            url: '/store/list?page=1&keyword=&user_id=&store_type=1'
          },
          {
            name: '客户与合作商管理',
            id: '13-3',
            icon: 'icon-kehuguanli',
            url: '/client/list?page=1&type=1&status=1&keyword='
          },
          {
            name: '原料预订购',
            id: '14-3',
            icon: 'icon-wuliaoyudinggou',
            url: '/materialPlanOrder/list?page=1&type=1'
          },
          {
            name: '工艺单管理',
            id: '15-3',
            icon: 'icon-gongyidanliebiao',
            url: '/craft/list?page=1'
          },
          {
            name: '员工管理',
            id: '17-3',
            icon: 'icon-yuangongguanli',
            url: '/workerManage/list?page=1&keyword=&department=&status=&type=&limit=10'
          },
          {
            name: '产品管理',
            id: '24-3',
            icon: 'icon-gongyidanliebiao',
            url: '/product/list?page=1'
          },
          {
            name: '文件管理',
            id: '23-1',
            icon: 'icon-wuliaojihua',
            url: '/fileManage/list?page=1&status=&client_id=&date=&group_id=&user_id=&limit='
          },
          {
            name: '系统设置',
            id: 16,
            icon: 'icon-xitongshezhi',
            url: '/setting'
          },
          {
            name: '单证管理',
            id: '25-3',
            icon: 'icon-wuliaojihua',
            url: '/document/list?page=1&date=&keyword='
          }
        ],
        finance: [
          {
            name: '报销单管理',
            id: '18-3',
            icon: 'icon-chexiaodanguanli',
            url: '/reimbursementManage/list?page=1&status='
          },
          {
            name: '财务结算',
            id: 22,
            icon: 'icon-chexiaodanguanli',
            url: '/settlement/collectionList?page=1&status='
          }
        ]
      }
    }
  },
  mounted() {
    const moduleInfo = window.sessionStorage.getItem('module_id') as string
    this.menuList = {
      production:
        JSON.parse(moduleInfo).length === 0
          ? this.menuList.production
          : this.menuList.production.filter((item) => {
              return JSON.parse(moduleInfo).indexOf(item.id) !== -1
            }),
      other:
        JSON.parse(moduleInfo).length === 0
          ? this.menuList.other
          : this.menuList.other.filter((item) => {
              return JSON.parse(moduleInfo).indexOf(item.id) !== -1
            }),
      finance:
        JSON.parse(moduleInfo).length === 0
          ? this.menuList.finance
          : this.menuList.finance.filter((item) => {
              return JSON.parse(moduleInfo).indexOf(item.id) !== -1
            })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/menu.less';
</style>