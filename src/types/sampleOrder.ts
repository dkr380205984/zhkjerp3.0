// 批次
export interface SampleOrderBatch {
  id?: number | null | string
  batch_number: number // 第几批
  batch_title: string
  batch_type_id?: string | number
  batch_type?: string | number
  delivery_time: string // 发货时间
  is_urgent: 1 | 2 // 1.紧急 2.不紧急
  is_draft: 1 | 2  // 1.草稿 2.非草稿
  total_style: string
  total_number: string
  total_price: string
  desc: string
  product_data: Array<{
    id?: number
    pid_status?: number
    status?: 1 | 2 // 1.待定 2.已确认
    image_data?: string[]
    color_data?: any[]
    size_data?: any[]
    product_id: string | number
    category_id?: number
    secondary_category_id?: number
    desc?: string
    size_color_list: Array<{
      label: string
      value: string
    }>
    product_info: Array<{
      size_color?: string // 前端使用
      size_id: string | number
      color_id: string | number
      number: string | number
      price: string | number
    }>
  }>
}

// 第几次下单，样单为多次打样，订单可能翻单
export interface SampleOrderTime {
  order_id?: number | null | string // 再次打样的时候用
  id?: number | null | string
  order_time: string
  order_type_id: string | number
  order_type?: string
  complete_time: string
  is_draft: 1 | 2  // 1.草稿 2.非草稿
  total_style: string | number
  total_number: string | number
  total_price: string | number
  is_urgent?: 1 | 2 // 样单用 1.紧急 2.不紧急
  is_before_confirm?: 1 | 2 // 订单用 产前确认
  is_send?: 1 | 2 // 订单用 是否邮寄
  batch_data: SampleOrderBatch[]
}

export interface SampleOrderInfo {
  id?: number | null | string
  order_type: 2
  code: string
  desc: string
  client_id: number | string
  tree_data: number[] | string
  group_id: number | string
  contacts_id: number | string
  public_files: string[]
  private_files: string[]
  status?: number
  settle_tax: string // 结算税率
  settle_unit: string // 报价币种
  rel_quote_id?: number | string
  time_data: SampleOrderTime | SampleOrderTime[]
}