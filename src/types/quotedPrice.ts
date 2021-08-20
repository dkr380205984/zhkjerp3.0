// 报价单数据结构
export interface QuotedPriceInfo {
  code?: string
  id?: null | number | string
  is_draft: 1 | 2 // 2草稿
  title: string
  client_name?: string
  client_id: number | string | string[]
  contacts_id: number | string
  contacts_name?: string
  group_id: number | string
  group_name?: string
  settle_unit: string // 结算单位
  exchange_rate: number | string // 汇率
  total_number: number | string // 产品总数
  total_cost_price: number | string // 总成本
  commission_percentage: number | string // 佣金百分比
  commission_price: number | string
  rate_taxation: number | string // 税率
  rate_price: number | string
  profit_percentage: number | string //利润
  profit_price: string | number
  desc: string
  real_quote_price: string | number // 实际报价
  system_total_price: string | number //系统总价
  user_name?: string // 创建人
  created_at?: string // 创建日期
  product_data: Array<{
    total_price: number | string // 统计产品的价格信息
    product_id?: string | number // 有id传id，无id传下面
    type?: string[] // 品类下拉框
    category_id?: string | number
    type_id?: string | number
    image_data?: string[]
    client_target_price?: number | string //客户目标价
    start_order_number?: number | string //起订量
    desc?: string
    transport_fee_desc?: string // 运费
    transport_fee?: string
    material_data: Array<{
      material_id?: number | string | string[]
      material_name?: string
      weight: number | string
      loss: number | string
      price: number | string
      unit: string
      total_price: number | string
    }>
    assist_material_data: Array<{
      material_id?: number | string
      material_name?: string
      number: number | string
      loss: number | string
      price: number | string
      unit: string
      total_price: number | string
    }>
    weave_data: Array<{
      name: string
      desc: number | string
      total_price: number | string
    }>
    semi_product_data: Array<{
      process_id?: string | number
      process_name: string
      desc: string
      total_price: number | string
    }>
    production_data: Array<{
      name: string
      desc: string
      total_price: number | string
    }>
    pack_material_data: Array<{
      material_id?: string | number
      material_name: string
      desc: string
      total_price: number | string
    }>
    other_fee_data: Array<{
      name: string
      desc: string
      total_price: number | string
    }>
  }>
}