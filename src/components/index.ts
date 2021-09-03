import zhNav from './zhNav/zhNav.vue'
import zhBread from './zhBread/zhBread.vue'
import zhOverflowText from './zhOverflowText/zhOverflowText.vue'
import zhListSetting from './zhListSetting/zhListSetting.vue'
import sampleEdit from './sampleEdit/sampleEdit.vue'
import productEdit from './productEdit/productEdit.vue'
import sampleDetail from './sampleDetail/sampleDetail.vue'
import colorPicker from './colorPicker/colorPicker.vue'
import orderDetail from './orderDetail/orderDetail.vue'
export default {
  install: (Vue: any) => {
    Vue.component('zhNav', zhNav)
    Vue.component('zhBread', zhBread)
    Vue.component('zhOverflowText', zhOverflowText)
    Vue.component('zhListSetting', zhListSetting)
    Vue.component('sampleEdit', sampleEdit)
    Vue.component('sampleDetail', sampleDetail)
    Vue.component('productEdit', productEdit)
    Vue.component('zhColorPicker', colorPicker) //和elment-ui区分
    Vue.component('orderDetail', orderDetail)
  }
}