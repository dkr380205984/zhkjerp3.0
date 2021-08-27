import zhNav from './zhNav/zhNav.vue'
import zhBread from './zhBread/zhBread.vue'
import zhOverflowText from './zhOverflowText/zhOverflowText.vue'
import zhListSetting from './zhListSetting/zhListSetting.vue'
import sampleEdit from './sampleEdit/sampleEdit.vue'
import sampleDetail from './sampleDetail/sampleDetail.vue'
export default {
  install: (Vue: any) => {
    Vue.component('zhNav', zhNav)
    Vue.component('zhBread', zhBread)
    Vue.component('zhOverflowText', zhOverflowText)
    Vue.component('zhListSetting', zhListSetting)
    Vue.component('sampleEdit', sampleEdit)
    Vue.component('sampleDetail', sampleDetail)
  }
}