export interface BoxInfo {
  code?: string
  user_name?: string
  created_at?: string
  rel_plan?: number[]
  client_id: string | number
  tree_data?: string | number[]
  city: string
  address: string
  total_box: string | number
  total_gross_weight: string | number
  total_net_weight: string | number
  total_bulk: string | number
  price: string | number
  others_fee: string
  total_price: string | number
  price_bulk: string | number
  transport_number_data: Array<{
    order_product_info_id: string | number
    transport_number: string | number
    [propName: string]: any // 前端用的字段，展示产品尺码配色等等
  }>
}