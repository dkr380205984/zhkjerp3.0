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
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
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
      path: '/client/create',
      name: '添加公司',
      component: () => import('../views/client/create.vue')
    }, {
      path: '/sample/list',
      name: '样单列表',
      component: () => import('../views/sample/list.vue')
    }, {
      path: '/sample/create',
      name: '样单添加',
      component: () => import('../views/sample/create.vue')
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

