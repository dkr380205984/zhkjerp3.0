// 报价单数据结构
export interface QuotedPriceInfo {
  code?: string
  id?: null | number | string
  is_check?: 0 | 1 | 2
  is_draft: 1 | 2 // 2草稿
  title: string
  client_name?: string
  client_id: number | string  // 这个字段提交client_id给后台
  tree_data: number[] | string // 这个数据提交client_id的所有信息，一级分类二级分类和client_id
  contacts_id: number | string
  contacts_name?: string
  group_id: number | string
  group_name?: string
  settle_unit: string // 报价币种
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
  product_data: QuotedPriceProduct[]
}

// 报价单产品信息
export interface QuotedPriceProduct {
  total_price?: number | string // 统计产品的价格信息
  product_id?: string | number // 有id传id，无id传下面
  type?: number[] // 品类下拉框
  category_id?: string | number
  category?: string
  secondary_category_id?: string | number
  secondary_category?: string
  image_data: string[]
  file_list?: Array<{
    id: number
    url: string
  }>
  client_target_price?: number | string //客户目标价
  start_order_number?: number | string //起订量
  desc?: string
  transport_fee_desc?: string // 运费
  transport_fee?: string
  material_data: Array<{
    id?: number | string
    material_id?: number | string
    tree_data?: number[] | string
    material_name?: string
    weight: number | string
    loss: number | string
    price: number | string
    unit: string
    total_price: number | string
  }>
  assist_material_data: Array<{
    id?: number | string
    material_id?: number | string
    material_name?: string
    number: number | string
    loss: number | string
    price: number | string
    unit: string
    total_price: number | string
  }>
  weave_data: Array<{
    id?: number | string
    name: string
    desc: number | string
    total_price: number | string
  }>
  semi_product_data: Array<{
    id?: number | string
    process_id?: string | number
    process_name: string
    desc: string
    total_price: number | string
  }>
  production_data: Array<{
    id?: number | string
    name: string
    desc: string
    total_price: number | string
  }>
  pack_material_data: Array<{
    id?: number | string
    material_id?: string | number
    material_name: string
    desc: string
    total_price: number | string
  }>
  other_fee_data: Array<{
    id?: number | string
    name: string
    desc: string
    total_price: number | string
  }>
}