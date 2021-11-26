// 出入库类型
// const stockType = [{
//   name: '中转入库', // 采购单半成品原料入库
//   value: 1
// }, {
//   name: '客供入库',
//   value: 2
// }, {
//   name: '中转出库', // 物料加工出库
//   value: 3
// }, {
//   name: '最终入库', // 采购单，以4为准统计入库值
//   value: 4
// }, {
//   name: '单据生产出库', // 织造半成品单位出库
//   value: 5
// }, {
//   name: '订单结余入库',
//   value: 6
// }, {
//   name: '移库出库',
//   value: 7
// }, {
//   name: '移库入库',
//   value: 8
// }, {
//   name: '仓库入库',
//   value: 9
// }, {
//   name: '仓库出库',
//   value: 10
// }]
export interface MaterialStockLog {
  check?: boolean
  stockInList?: MaterialStockLog[] // 这部分数据是前端用的入库数据列表,出库的时候只能选入库日志
  material_id: string | number
  material_name?: string
  material_color: string
  color_code: string
  batch_code: string
  vat_code: string
  attribute: string
  price?: string // 预订购的时候要算钱
  number: string | number
  item: string // 件数
  tree_data?: string[]
  rel_doc_info_id?: string | number // 采购单调取单加工单子项id
}
export interface MaterialStockInfo {
  id?: number
  order_id?: string | number
  action_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  rel_doc_type?: string
  rel_doc_id: string | number
  rel_doc_code?: string // 前端显示单据编号用
  complete_time: string
  client_id: string | number
  client_name?: string
  desc: string
  store_id?: number | string
  secondary_store_id?: number | null | string
  move_store_id?: number | string // 移库
  move_secondary_store_id?: number | string
  tree_data?: number[]
  selectList?: Array<{
    name: string
    value: number
    material_color?: string
    material_id?: string | number
    material_name?: string
    attribute?: string
    number?: string | number
  }> // 前端用，存储勾选的单据纱线列表
  info_data: MaterialStockLog[]
}