import zhNav from './zhNav/zhNav.vue'
import zhBread from './zhBread/zhBread.vue'
import zhOverflowText from './zhOverflowText/zhOverflowText.vue'
import zhListSetting from './zhListSetting/zhListSetting.vue'
import sampleEdit from './sampleEdit/sampleEdit.vue'
import productEdit from './productEdit/productEdit.vue'
import productDetail from './productDetail/productDetail.vue'
import sampleDetail from './sampleDetail/sampleDetail.vue'
import colorPicker from './colorPicker/colorPicker.vue'
import orderDetail from './orderDetail/orderDetail.vue'
import zhList from './zhList/zhList.vue'
import zhCheck from './zhCheck/zhCheck.vue'
import othersFeeData from './othersFeeData/othersFeeData.vue'
import usingTutorials from './usingTutorials/usingTutorials.vue'
import vue from '@handsontable/vue'
export default {
  install: (Vue: any) => {
    Vue.component('zhNav', zhNav)
    Vue.component('zhBread', zhBread)
    Vue.component('zhOverflowText', zhOverflowText)
    Vue.component('zhListSetting', zhListSetting)
    Vue.component('sampleEdit', sampleEdit)
    Vue.component('sampleDetail', sampleDetail)
    Vue.component('productDetail', productDetail)
    Vue.component('productEdit', productEdit)
    Vue.component('zhColorPicker', colorPicker) //和elment-ui区分
    Vue.component('orderDetail', orderDetail)
    Vue.component('zhList', zhList)
    Vue.component('zhCheck', zhCheck)
    Vue.component('othersFeeData', othersFeeData)
    Vue.component('usingTutorials', usingTutorials)
  }
}