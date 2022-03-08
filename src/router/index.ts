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
    path: '/materialManage/orderPrint',
    name: '物料订购单打印',
    component: () => import('../views/materialManage/orderPrint.vue')
  }, {
    path: '/materialManage/processPrint',
    name: '物料加工单打印',
    component: () => import('../views/materialManage/processPrint.vue')
  }, {
    path: '/store/materialLogPrint',
    name: '原料出入库打印',
    component: () => import('../views/store/materialLogPrint.vue')
  }, {
    path: '/tagEditPrint/tagPrint',
    name: '产品标签打印',
    component: () => import('../views/tagEditPrint/tagPrint.vue')
  }, {
    path: '/quotedPrice/print',
    name: '报价单打印',
    component: () => import('../views/quotedPrice/print.vue')
  }, {
    path: '/sampleOrder/print',
    name: '布置单打印',
    component: () => import('../views/sampleOrder/print.vue')
  }, {
    path: '/productionPlan/print',
    name: '生产计划单打印',
    component: () => import('../views/productionPlan/print.vue')
  }, {
    path: '/setting/printQRCode',
    name: '公司二维码打印',
    component: () => import('../views/setting/printQRCode.vue')
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
      meta: {
        permissions_id: '1-1',
      },
      path: '/quotedPrice/create',
      name: '添加报价单',
      component: () => import('../views/quotedPrice/create.vue')
    }, {
      meta: {
        permissions_id: '1-3',
      },
      path: '/quotedPrice/list',
      name: '报价单列表',
      component: () => import('../views/quotedPrice/list.vue')
    }, {
      path: '/quotedPrice/detail',
      name: '报价单详情',
      component: () => import('../views/quotedPrice/detail.vue')
    }, {
      meta: {
        permissions_id: '1-2',
      },
      path: '/quotedPrice/update',
      name: '修改报价单',
      component: () => import('../views/quotedPrice/update.vue')
    }, {
      meta: {
        permissions_id: '13-3',
      },
      path: '/client/list',
      name: '客户/单位列表',
      component: () => import('../views/client/list.vue')
    }, {
      meta: {
        permissions_id: '13-1',
      },
      path: '/client/create',
      name: '添加客户/单位',
      component: () => import('../views/client/create.vue')
    }, {
      meta: {
        permissions_id: '13-2',
      },
      path: '/client/update',
      name: '修改客户/单位',
      component: () => import('../views/client/update.vue')
    }, {
      meta: {
        permissions_id: '2-3',
      },
      path: '/sampleOrder/list',
      name: '样单列表',
      component: () => import('../views/sampleOrder/list.vue')
    }, {
      meta: {
        permissions_id: '2-1',
      },
      path: '/sampleOrder/create',
      name: '样单添加',
      component: () => import('../views/sampleOrder/create.vue')
    }, {
      path: '/sampleOrder/detail',
      name: '样单详情',
      component: () => import('../views/sampleOrder/detail.vue')
    }, {
      meta: {
        permissions_id: '2-2',
      },
      path: '/sampleOrder/update',
      name: '样单修改',
      component: () => import('../views/sampleOrder/update.vue')
    }, {
      meta: {
        permissions_id: '2-1',
      },
      path: '/sampleOrder/again',
      name: '继续打样',
      component: () => import('../views/sampleOrder/again.vue')
    }, {
      meta: {
        permissions_id: '3-3',
      },
      path: '/order/list',
      name: '订单列表',
      component: () => import('../views/order/list.vue')
    }, {
      meta: {
        permissions_id: '3-1',
      },
      path: '/order/create',
      name: '订单添加',
      component: () => import('../views/order/create.vue')
    }, {
      path: '/order/detail',
      name: '订单详情',
      component: () => import('../views/order/detail.vue')
    }, {
      meta: {
        permissions_id: '3-2',
      },
      path: '/order/update',
      name: '订单修改',
      component: () => import('../views/order/update.vue')
    }, {
      path: '/tagEditPrint/editTag',
      name: '编辑标签',
      component: () => import('../views/tagEditPrint/editTag.vue')
    }, {
      meta: {
        permissions_id: '15-1',
      },
      path: '/craft/create',
      name: '创建工艺单',
      component: () => import('../views/craft/create.vue')
    }, {
      meta: {
        permissions_id: '15-2',
      },
      path: '/craft/update',
      name: '修改工艺单',
      component: () => import('../views/craft/update.vue')
    }, {
      path: '/craft/detail',
      name: '工艺单详情',
      component: () => import('../views/craft/detail.vue')
    }, {
      meta: {
        permissions_id: '15-3',
      },
      path: '/craft/list',
      name: '工艺单列表',
      component: () => import('../views/craft/list.vue')
    }, {
      meta: {
        permissions_id: '17-1',
      },
      path: '/workerManage/create',
      name: '添加员工',
      component: () => import('../views/workerManage/create.vue')
    }, {
      meta: {
        permissions_id: '17-2',
      },
      path: '/workerManage/detail',
      name: '员工详情',
      component: () => import('../views/workerManage/detail.vue')
    }, {
      meta: {
        permissions_id: '17-2',
      },
      path: '/workerManage/update',
      name: '修改员工',
      component: () => import('../views/workerManage/update.vue')
    }, {
      meta: {
        permissions_id: '17-3',
      },
      path: '/workerManage/list',
      name: '员工列表',
      component: () => import('../views/workerManage/list.vue')
    }, {
      meta: {
        permissions_id: '18-1',
      },
      path: '/reimbursementManage/create',
      name: '添加报销单',
      component: () => import('../views/reimbursementManage/create.vue')
    }, {
      meta: {
        permissions_id: '18-2',
      },
      path: '/reimbursementManage/detail',
      name: '报销单详情',
      component: () => import('../views/reimbursementManage/detail.vue')
    }, {
      meta: {
        permissions_id: '18-3',
      },
      path: '/reimbursementManage/list',
      name: '报销单列表',
      component: () => import('../views/reimbursementManage/list.vue')
    }, {
      meta: {
        permissions_id: '18-3',
      },
      path: '/reimbursementManage/update',
      name: '修改报销单',
      component: () => import('../views/reimbursementManage/update.vue')
    }, {
      meta: {
        permissions_id: '12-3',
      },
      path: '/store/list',
      name: '仓库列表',
      component: () => import('../views/store/list.vue')
    }, {
      meta: {
        permissions_id: '12-3',
      },
      path: '/store/productList',
      name: '产品仓库列表',
      component: () => import('../views/store/productList.vue')
    }, {
      meta: {
        permissions_id: '12-1',
      },
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
      meta: {
        permissions_id: '4-1',
      },
      path: '/materialPlan/create',
      name: '物料计划添加',
      component: () => import('../views/materialPlan/create.vue')
    }, {
      meta: {
        permissions_id: '4-3',
      },
      path: '/materialPlan/list',
      name: '物料计划列表',
      component: () => import('../views/materialPlan/list.vue')
    }, {
      path: '/materialPlan/detail',
      name: '物料计划详情',
      component: () => import('../views/materialPlan/detail.vue')
    }, {
      meta: {
        permissions_id: '4-2',
      },
      path: '/materialPlan/update',
      name: '物料计划修改',
      component: () => import('../views/materialPlan/update.vue')
    }, {
      meta: {
        permissions_id: '5-3',
      },
      path: '/materialManage/list',
      name: '原料管理列表',
      component: () => import('../views/materialManage/list.vue')
    }, {
      path: '/materialManage/detail',
      name: '原料管理详情',
      component: () => import('../views/materialManage/detail.vue')
    }, {
      path: '/materialManage/supList',
      name: '补充物料列表',
      component: () => import('../views/materialManage/supList.vue')
    }, {
      meta: {
        permissions_id: '6-1',
      },
      path: '/accessoriesManage/create',
      name: '辅料订购加工',
      component: () => import('../views/accessoriesManage/create.vue')
    }, {
      meta: {
        permissions_id: '6-3',
      },
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
      meta: {
        permissions_id: '7-3',
      },
      path: '/materialStock/list',
      name: '物料出入库列表',
      component: () => import('../views/materialStock/list.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/list',
      name: '生产计划列表',
      component: () => import('../views/productionPlan/list.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/progressList',
      name: '生产进度列表',
      component: () => import('../views/productionPlan/progressList.vue')
    }, {
      path: '/productionPlan/detail',
      name: '生产计划详情',
      component: () => import('../views/productionPlan/detail.vue')
    }, {
      path: '/productionPlan/progressDetail',
      name: '生产进度详情',
      component: () => import('../views/productionPlan/progressDetail.vue')
    }, {
      path: '/inspection/detail',
      name: '检验收发详情',
      component: () => import('../views/inspection/detail.vue')
    }, {
      meta: {
        permissions_id: '9-3',
      },
      path: '/inspection/list',
      name: '检验收发列表',
      component: () => import('../views/inspection/list.vue')
    }, {
      meta: {
        permissions_id: '10-3',
      },
      path: '/packManage/list',
      name: '包装管理列表',
      component: () => import('../views/packManage/list.vue')
    }, {
      path: '/packManage/detail',
      name: '包装管理详情',
      component: () => import('../views/packManage/detail.vue')
    }, {
      meta: {
        permissions_id: '19-3',
      },
      path: '/workshopManagement/list',
      name: '车间管理列表',
      component: () => import('../views/workshopManagement/list.vue')
    }, {
      path: '/workshopManagement/detail',
      name: '车间管理详情',
      component: () => import('../views/workshopManagement/detail.vue')
    }, {
      meta: {
        permissions_id: '14-3',
      },
      path: '/materialPlanOrder/list',
      name: '原料预订购列表',
      component: () => import('../views/materialPlanOrder/list.vue')
    }, {
      path: '/materialPlanOrder/detail',
      name: '原料预订购详情',
      component: () => import('../views/materialPlanOrder/detail.vue')
    }, {
      path: '/tutorialSystem/create',
      name: '添加系统教程',
      component: () => import('../views/tutorialSystem/create.vue')
    }, {
      path: '/tutorialSystem/detail',
      name: '系统教程详情',
      component: () => import('../views/tutorialSystem/detail.vue')
    }, {
      path: '/tutorialSystem/list',
      name: '系统教程列表',
      component: () => import('../views/tutorialSystem/list.vue')
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
  if (!window.sessionStorage.getItem('module_id')) {
    return true
  }
  const moduleId = JSON.parse(window.sessionStorage.getItem('module_id') as string)
  if (!moduleId.includes(id)) return
  return true
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 权限判断 新增无权限即为初始帐号权限
  if (to.meta && to.meta.permissions_id && window.sessionStorage.getItem('module_id') && JSON.parse(window.sessionStorage.getItem('module_id') as string).length > 0) {
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

