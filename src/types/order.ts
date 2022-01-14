import { PartInfo } from "./product";
import { CraftMaterialInfo } from "./craft";
import { QuotedPriceProduct } from "./quotedPrice";
// 批次
export interface OrderBatch {
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
    status?: 1 | 2 // 1.待定 2.已确认
    name?: string
    system_code?: string
    image_data?: string[]
    color_data?: any[]
    size_data?: any[]
    product_id: string | number
    product_code?: string
    category?: string
    secondary_category?: string
    quote_rel_product_id?: string | number
    quote_rel_product_info?: QuotedPriceProduct
    size_color_list: Array<{
      label: string
      value: string
    }>
    part_data?: PartInfo[]
    process_data?: Array<{
      process_id: number
      process_name: string
    }>
    product_info: Array<{
      material_info?: CraftMaterialInfo[] //有工艺单就有物料信息
      size_color?: string // 前端使用
      size_id: string | number
      color_id: string | number
      color_name?: string
      size_name?: string
      number: string | number
      price: string | number
      plan_number?: string | number
    }>
  }>
}

// 第几次下单，样单为多次打样，订单可能翻单
export interface OrderTime {
  order_type?: string | number
  order_id?: number | null | string // 再次打样的时候用
  id?: number | null | string
  order_time: string
  order_type_id: string | number
  complete_time: string
  is_draft: 1 | 2  // 1.草稿 2.非草稿
  total_style: string | number
  total_number: string | number
  total_price: string | number
  is_urgent?: 1 | 2 // 样单用 1.紧急 2.不紧急
  is_before_confirm?: 1 | 2 // 订单用 产前确认
  is_send?: 1 | 2 // 订单用 是否邮寄
  has_material_plan?: 1 | 2
  batch_data: OrderBatch[]
}

export interface OrderInfo {
  pid?: number | null | string // 绑定样单的id
  id?: number | null | string
  order_type: 1
  code: string
  desc: string
  client_id: number | string
  tree_data?: string | number[]
  group_id: number | string
  contacts_id: number | string
  public_files: string[]
  private_files: string[]
  settle_tax: string // 结算税率
  settle_unit: string // 报价币种
  exchange_rate?: string | number//汇率
  rel_quote_id?: number | string
  time_data: OrderTime | OrderTime[]
}

// 从订单里面处理出来的产品表格信息——展平
export interface OrderProductFlatten {
  material_info: CraftMaterialInfo[]
  color_id: string | number
  color_name?: string
  size_id: string | number
  size_name?: string
  order_number: string | number
  price: string | number
  product_code?: string
  product_id: string | number
  category?: string
  secondary_category?: string
  part_data?: PartInfo[]
  plan_number?: string | number
  quote_rel_product_id?: string | number
  quote_rel_product_info?: QuotedPriceProduct
  process_data?: Array<{
    process_id: number
    process_name: string
  }>
}
// 从订单里面处理出来的产品表格信息——合并
export interface OrderProductMerge {
  info_data: { color_id: string | number; color_name?: string | undefined; size_id: string | number; size_name?: string | undefined; number: string | number; price: string | number; }[];
  product_code?: string
  product_id: string | number
  category?: string
  secondary_category?: string
  part_data: PartInfo[]
  childrenMergeInfo: Array<{
    color_id: string | number
    color_name?: string
    size_id: string | number
    size_name?: string
    number: string | number
    price: string | number
  }>
}