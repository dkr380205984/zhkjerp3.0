export interface PackOrderInfo {
  id?: number | string
  order_id?: string | number
  client_id: string | number
  client_id_arr?: number[] // 前端用
  client_name?: string
  order_time: string
  delivery_time: string
  desc: string
  file_url: string
  total_price: number | string
  total_number: number | string
  others_fee_data: Array<{
    desc: string // 额外费用备注
    name: string
    price: number | string
  }>
  info_data: Array<{
    price_type: 1 | 2 | 3 // 1箱子 2胶带 3其他
    pack_material_id: string
    length: string
    width: string
    height: string
    desc: string
    bulk_price: string
    count_price: string
    number: string | number
  }>
}