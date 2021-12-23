import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store/index'
import Message from 'element-ui'
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: string) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login.vue')
  }, {
    path: '/commonPrint/printEasy',
    name: '普通打印页',
    component: () => import('../views/commonPrint/printEasy.vue')
  }, {
    path: '/commonPrint/printMenu',
    name: '菜单打印页',
    component: () => import('../views/commonPrint/printMenu.vue')
  }, {
    path: '/craft/print',
    name: '工艺单打印',
    component: () => import('../views/craft/print.vue')
  }, {
    path: '/materialPlan/print',
    name: '物料计划单打印',
    component: () => import('../views/materialPlan/print.vue')
  }, {
    path: '/store/materialLogPrint',
    name: '原料出入库打印',
    component: () => import('../views/store/materialLogPrint.vue')
  }, {
    path: '/quotedPrice/print',
    name: '报价单打印',
    component: () => import('../views/quotedPrice/print.vue')
  }, {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
      path: '/menu',
      name: '其他管理',
      component: () => import('../views/menu.vue')
    }, {
      path: '/homePage',
      name: '主页',
      component: () => import('../views/homePage.vue')
    }, {
      path: '/setting',
      name: '系统设置',
      component: () => import('../views/setting/setting.vue')
    }, {
      path: '/quotedPrice/create',
      name: '添加报价单',
      component: () => import('../views/quotedPrice/create.vue')
    }, {
      path: '/quotedPrice/list',
      name: '报价单列表',
      component: () => import('../views/quotedPrice/list.vue')
    }, {
      path: '/quotedPrice/detail',
      name: '报价单详情',
      component: () => import('../views/quotedPrice/detail.vue')
    }, {
      path: '/quotedPrice/update',
      name: '修改报价单',
      component: () => import('../views/quotedPrice/update.vue')
    }, {
      path: '/client/list',
      name: '客户/单位列表',
      component: () => import('../views/client/list.vue')
    }, {
      path: '/client/create',
      name: '添加客户/单位',
      component: () => import('../views/client/create.vue')
    }, {
      path: '/client/update',
      name: '修改客户/单位',
      component: () => import('../views/client/update.vue')
    }, {
      path: '/sampleOrder/list',
      name: '样单列表',
      component: () => import('../views/sampleOrder/list.vue')
    }, {
      path: '/sampleOrder/create',
      name: '样单添加',
      component: () => import('../views/sampleOrder/create.vue')
    }, {
      path: '/sampleOrder/detail',
      name: '样单详情',
      component: () => import('../views/sampleOrder/detail.vue')
    }, {
      path: '/sampleOrder/update',
      name: '样单修改',
      component: () => import('../views/sampleOrder/update.vue')
    }, {
      path: '/sampleOrder/again',
      name: '继续打样',
      component: () => import('../views/sampleOrder/again.vue')
    }, {
      path: '/order/list',
      name: '订单列表',
      component: () => import('../views/order/list.vue')
    }, {
      path: '/order/create',
      name: '订单添加',
      component: () => import('../views/order/create.vue')
    }, {
      path: '/order/detail',
      name: '订单详情',
      component: () => import('../views/order/detail.vue')
    }, {
      path: '/order/update',
      name: '订单修改',
      component: () => import('../views/order/update.vue')
    }, {
      path: '/craft/create',
      name: '创建工艺单',
      component: () => import('../views/craft/create.vue')
    }, {
      path: '/craft/update',
      name: '修改工艺单',
      component: () => import('../views/craft/update.vue')
    }, {
      path: '/craft/detail',
      name: '工艺单详情',
      component: () => import('../views/craft/detail.vue')
    }, {
      path: '/craft/list',
      name: '工艺单列表',
      component: () => import('../views/craft/list.vue')
    }, {
      path: '/ingredient/create',
      name: '创建配料单',
      component: () => import('../views/ingredient/create.vue')
    }, {
      path: '/ingredient/update',
      name: '修改配料单',
      component: () => import('../views/ingredient/update.vue')
    }, {
      path: '/store/list',
      name: '仓库列表',
      component: () => import('../views/store/list.vue')
    }, {
      path: '/store/create',
      name: '添加仓库',
      component: () => import('../views/store/create.vue')
    }, {
      path: '/store/materialDetail',
      name: '物料仓库详情',
      component: () => import('../views/store/materialDetail.vue')
    }, {
      path: '/store/productDetail',
      name: '产品仓库详情',
      component: () => import('../views/store/productDetail.vue')
    }, {
      path: '/materialPlan/create',
      name: '物料计划添加',
      component: () => import('../views/materialPlan/create.vue')
    }, {
      path: '/materialPlan/list',
      name: '物料计划列表',
      component: () => import('../views/materialPlan/list.vue')
    }, {
      path: '/materialPlan/detail',
      name: '物料计划详情',
      component: () => import('../views/materialPlan/detail.vue')
    }, {
      path: '/materialPlan/update',
      name: '物料计划修改',
      component: () => import('../views/materialPlan/update.vue')
    }, {
      path: '/materialManage/list',
      name: '原料管理列表',
      component: () => import('../views/materialManage/list.vue')
    }, {
      path: '/materialManage/detail',
      name: '原料管理详情',
      component: () => import('../views/materialManage/detail.vue')
    }, {
      path: '/accessoriesManage/create',
      name: '辅料订购加工',
      component: () => import('../views/accessoriesManage/create.vue')
    }, {
      path: '/accessoriesManage/list',
      name: '辅料管理列表',
      component: () => import('../views/accessoriesManage/list.vue')
    }, {
      path: '/accessoriesManage/detail',
      name: '辅料管理详情',
      component: () => import('../views/accessoriesManage/detail.vue')
    }, {
      path: '/materialStock/detail',
      name: '物料出入库详情',
      component: () => import('../views/materialStock/detail.vue')
    }, {
      path: '/materialStock/list',
      name: '物料出入库列表',
      component: () => import('../views/materialStock/list.vue')
    }, {
      path: '/productionPlan/list',
      name: '生产计划列表',
      component: () => import('../views/productionPlan/list.vue')
    }, {
      path: '/productionPlan/detail',
      name: '生产计划详情',
      component: () => import('../views/productionPlan/detail.vue')
    }, {
      path: '/inspection/detail',
      name: '检验收发详情',
      component: () => import('../views/inspection/detail.vue')
    }, {
      path: '/inspection/list',
      name: '检验收发列表',
      component: () => import('../views/inspection/list.vue')
    }, {
      path: '/materialPlanOrder/list',
      name: '原料预订购列表',
      component: () => import('../views/materialPlanOrder/list.vue')
    }, {
      path: '/materialPlanOrder/detail',
      name: '原料预订购详情',
      component: () => import('../views/materialPlanOrder/detail.vue')
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 *  专用于判断权限
 * @param {string|number} id 需要判断权限的id
 * @returns {boolean}
 */
const isHasPermissions = (id: string | number) => {
  if (!window.sessionStorage.getItem('module_id')) return
  const moduleId = JSON.parse(window.sessionStorage.getItem('module_id') as string)
  if (!moduleId.includes(id)) return
  return true
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 权限判断
  if (to.meta && to.meta.permissions_id) {
    if (!isHasPermissions(to.meta.permissions_id)) {
      next(false)
      Message.Message.warning('抱歉，您没有相应的权限')
      return
    }
  }
  // 获取路由
  // store.commit('status/getTitle', to.name ? to.name : from.name)
  store.commit('status/getRoute', {
    name: to.name,
    fullPath: to.fullPath
  })
  next()
})


export default router

