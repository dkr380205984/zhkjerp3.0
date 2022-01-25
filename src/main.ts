import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from './assets/js/plugin'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mycomponent from './components'
Vue.config.productionTip = false
Vue.use(mycomponent)
Vue.use(ElementUI)
Vue.use(plugin)

// 审核公共图
Vue.filter('checkFilter', (val: 0 | 1 | 2 | null) => {
  const index = Number(val) || 0
  const imgArr = [
    require('@/assets/image/common/waiting.png'),
    require('@/assets/image/common/pass.png'),
    require('@/assets/image/common/return.png')
  ]
  return imgArr[index]
})
// 样品转产品过程中的状态转换
Vue.filter('productStatusFilter', (val: 1 | 2 | 3 | 4 | 5 | 6) => {
  const statusArr = ['未知', '待确认', '已确认', '已修改', '已转产品', '已取消', '确认继续打样']
  return statusArr[val]
})

// 样品转产品过程中的状态转换 class
Vue.filter('productStatusClassFilter', (val: 1 | 2 | 3 | 4 | 5 | 6) => {
  const statusArr = ['', 'orange', 'green', 'orange', 'blue', 'gray', 'green']
  return statusArr[val]
})


import { stockType } from '@/assets/js/dictionary'
// 出入库状态转换
Vue.filter('materialStockTypeFilter', (val: 1 | 2 | 3 | 4 | 5 | 6) => {
  return stockType.find((item) => item.value === val)?.name
})

// 出入库状态转换 class
Vue.filter('materialStockTypeClassFilter', (val: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
  if (val === 3 || val === 5 || val === 7 || val === 10) {
    return 'orange'
  } else {
    return 'green'
  }
})

// 订单状态
Vue.filter('orderStatusFilter', (val: 0 | 1 | 2 | 3) => {
  const statusArr = ['', '已创建', '进行中', '已完成', '已结算', '已取消']
  return statusArr[val]
})
// 订单状态 class
Vue.filter('orderStatusClassFilter', (val: 0 | 1 | 2 | 3) => {
  const statusArr = ['', 'orange', 'blue', 'green', 'green', 'red']
  return statusArr[val]
})


import { CheckCommonInfo } from '@/types/vuex'
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any
    $getDataType: any
    $mergeData: any
    $clone<T>(data: T): T
    $diffDate(date: DateConstructor): string
    $diffByDate(date: DateConstructor): string | number
    $getDate(date?: Date, connector?: string): string
    $downloadExcel(data: any[], mapTitle: Array<{ title: string, key: string }>, excelName: string): void
    $addItem<T>(father: T[], son: T): void
    $deleteItem(father: any[], index: number | string): void
    $checkCommonInfo(info: CheckCommonInfo[]): void
    $flatten(data: any[]): any[]
    $formCheck(
      data: any,
      checkArr: Array<{ key: string, errMsg?: string, regExp?: RegExp, regNormal?: 'isNum' | 'isEmail' | 'isPhone' | 'isNull' | 'checkArr' }>
    ): boolean
    $ifRepeatArray(arr: string[]): boolean
    findId<T, K extends keyof T>(jsonArr: T[], id: number | string, returnKey: K, findKey: K): T[K]
    $sliceToArray<T>(arr: T[], num: number): T[][]
    $copyInfo(info: any, keyArr: string[], callback?: Function): void
    $setLocalStorage(name: string, info: any): void
    $getLocalStorage(name: string): string
  }
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



