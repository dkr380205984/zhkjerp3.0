// const productStockType = [{
//   name: '普通入库',
//   value: 1
// }, {
//   name: '订单结余入库',
//   value: 2
// }, {
//   name: '移库入库',
//   value: 3
// }, {
//   name: '移库出库',
//   value: 4
// }, {
//   name: '销售出库',
//   value: 5
// }, {
//   name: '销毁出库',
//   value: 6
// }]

export interface ProductStockInfo {
  action_type: 1 | 2 | 3 | 4 | 5 | 6
  complete_time: string
  client_id?: string | number
  move_store_id?: string | number
  move_secondary_store_id?: string | number
  desc: string
  store_id: string | number
  secondary_store_id: string | number
  store: string
  secondary_store: string
  rel_doc_id?: string // 关联单号
  rel_doc_code?: string
  store_arr?: number[] // 前端下拉框用
  tree_data?: string[] | string
  info_data: Array<{
    product_code?: string
    name?: string
    category?: string
    secondary_category?: string
    product_id: string | number
    size_id: string | number
    color_id: string | number
    color_name?: string
    size_name?: string
    price?: number | string
    number: number | string
    color_size?: string
    tree_data?: string // 前端用
  }>
}

export interface ProductStoreInfo {
  id: number | string
  check?: boolean
  category: string
  secondary_category: string
  style_code: string
  store: string
  secondary_store: string
  image_data: string[]
  product_id: string | number
  info_data: Array<{
    check?: boolean
    color_name: string
    color_id: string | number
    size_name: string
    size_id: string | number
    number: string | number
  }>
}