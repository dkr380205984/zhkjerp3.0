export interface ListSetting {
  key: string
  otherkey?: string // 如不显示产品编号就显示系统编号
  name: string
  ifShow: boolean
  ifLock: boolean
  ifCaogao?: string // 标记草稿
  caogaoArr?: string[] // 标记字符
  ifImage?: boolean // 是否是图片特殊格式
  errVal?: string // 数据为空时显示信息
  from?: string // 隶属于某数组对象，常用于一个订单有多个产品
  mark?: boolean // 在有数组对象的时候标记哪个字段需要箭头
  index: number
  unit?: string // 有些情况下需要单位
  filterArr?: string[] // 通常用于用于状态适配，如status = 1|2|3 filterArr:['待审核','已审核','未通过']
  class?: string // 用于改字体颜色用的
  classArr?: string[] // 一般配合filterArr一起用，不同状态用不同颜色标记
  isCheck?: boolean
  isStatus?: boolean // 给订单状态专门设置的
  isProgress?: boolean // 给订单进度专门设置的
  specialForOrderPrcess?: 'order' | 'sampleOrder' // 订单样单流程专用，理论上不应该出现在组件里
}