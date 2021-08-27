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

import { CheckCommonInfo } from '@/types/vuex'
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any
    $getDataType: any
    $mergeData: any
    $clone<T extends any[]>(data: T): T
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
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
