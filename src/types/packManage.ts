// 装箱计划
export interface PackPlanInfo {
  id?: number | string
  order_id: string | number
  delivery_time: string
  delivery_batch: string
  batch_name: string
  total_delivery_number: string
  data: PackPlanInfoData[]
  gather_info: Array<{
    unit: string
    number: string | number
    pack_material_id: number | string
    length: string
    width: string
    height: string
    desc: string
    file_url: string
  }>
}

export interface PackPlanInfoData {
  desc: string
  product_info: Array<{
    product_show_info?: string // 前端记录产品展示信息
    product_id: number | string
    size_id: number | string
    size_name?: string
    color_id: number | string
    color_name?: string
    pack_number: string | number
  }>
  info_data: Array<{
    first_box_number: string
    last_box_number: string
    box_count: string
    box_gross_weight: string
    box_net_weight: string
    total_gross_weight: string
    total_net_weight: string
    length: string
    width: string
    height: string
    single_bulk: string
    total_bulk: string
    desc: string
    product_info: Array<{
      product_show_info?: string
      product_id: number | string
      size_id: number | string
      color_id: number | string
      pack_number: number | string
    }>
  }>
}


// 包装订购信息
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