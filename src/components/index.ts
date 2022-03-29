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
import zhCharts from './zhCharts/zhCharts.vue'
import zhCheck from './zhCheck/zhCheck.vue'
import zhCheckDetail from './zhCheck/zhCheckDetail.vue'
import othersFeeData from './othersFeeData/othersFeeData.vue'
import usingTutorials from './usingTutorials/usingTutorials.vue'
import zhDeduct from './zhDeduct/zhDeduct.vue'
import zhDeductDetail from './zhDeduct/zhDeductDetail.vue'
import associatedPage from './associatedPage/associatedPage.vue'
import zhImage from './zhImage/zhImage.vue'
import zhInput from './zhInput/zhInput.vue'
import todayIsHoliday from './todayIsHoliday/todayIsHoliday.vue'
import storeSurplus from './storeSurplus/storeSurplus.vue'
import zhOrderLog from './zhOrderLog/zhOrderLog.vue'
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
    Vue.component('zhCharts', zhCharts)
    Vue.component('zhCheck', zhCheck)
    Vue.component('othersFeeData', othersFeeData)
    Vue.component('usingTutorials', usingTutorials)
    Vue.component('zhDeduct', zhDeduct)
    Vue.component('zhInput', zhInput)
    Vue.component('zhDeductDetail', zhDeductDetail)
    Vue.component('associatedPage', associatedPage)
    Vue.component('zhImage', zhImage)
    Vue.component('todayIsHoliday', todayIsHoliday)
    Vue.component('storeSurplus', storeSurplus)
    Vue.component('zhOrderLog', zhOrderLog)
    Vue.component('zhCheckDetail', zhCheckDetail)
  }
}