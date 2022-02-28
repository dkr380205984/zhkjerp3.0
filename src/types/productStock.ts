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
  store_arr?: number[] // 前端下拉框用
  info_data: Array<{
    product_id: string | number
    size_id: string | number
    color_id: string | number
    color_size?: string // 前端选尺码颜色用
    price?: number | string
    number: number | string
  }>
}