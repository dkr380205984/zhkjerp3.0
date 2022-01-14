import { PartInfo } from "./product";
import { CraftMaterialInfo } from "./craft";
import { ProductInfo } from "./product";
import { QuotedPriceProduct } from "./quotedPrice";
export interface MaterialPlanInfo {
  id?: number
  order_id: string | number
  type: string | number // 1:按尺码颜色 2:按产品
  desc: string
  is_draft: 1 | 2
  production_plan_data: Array<{
    product_detail?: ProductInfo // product_detail的数据在外面一层也有是为了保持源数据结构不变
    product_code?: string
    product_name?: string
    category?: string
    secondary_category?: string
    product_id: string | number
    quote_rel_product_id?: string
    quote_rel_product_info?: QuotedPriceProduct
    part_data?: PartInfo[]
    process_data?: Array<{
      process_id: number
      process_name: string
    }>
    product_data: Array<{
      material_info: CraftMaterialInfo[]
      size_color?: string[] // 尺码颜色下拉框选择项
      color_id: string | number
      color_name?: string
      size_id: string | number
      size_name?: string
      add_percent: string | number
      order_number: number | string
      quote_rel_product_id?: string | number
      number?: number | string | null // 后台给的不知道有什么软用
      info_data: Array<{
        id?: string
        unit?: string
        name?: string
        part_id: string | number
        number: string | number
      }>
    }>
  }>
  material_plan_data: MaterailPlanData[]
  material_plan_gather_data: MaterialPlanGatherData[]
}

export interface MaterialPlanGatherData {
  id?: number
  check?: boolean // 前端用字段
  material_name?: string
  material_id: string | number
  material_type: string | number
  material_color: string
  need_number: string | number
  loss: string | number
  final_number: string | number
  unit: string
}

export interface MaterailPlanData {
  check?: boolean // 前端用
  product_code?: string
  product_name?: string
  category?: string
  secondary_category?: string
  part_id: string | number
  part_name?: string
  size_color?: string[] // 尺码颜色下拉框选择项
  color_id: string | number
  color_name?: string
  size_id: string | number
  size_name?: string
  number?: string | number // 计划生产数量
  order_number?: string | number // 下单数量
  product_id: string | number // 	按产品填写时传
  loss: string | number
  processList?: Array<{
    name: string
    id: string | number
  }> // 优化产品是否有工艺单后道工序
  info_data: Array<{
    process_name_arr?: string[]
    process_name?: string // 二级工序
    process_type?: string // 一级工序
    process_id?: string | number
    tree_data?: string[]
    material_id: string | number
    material_name?: string
    material_type: string | number
    material_color: string
    assist_material_number: string | number
    need_number: string | number
    production_number: string | number
    loss: string | number
    final_number: string | number
    has_plan?: boolean
    unit: string // 单位，默认是kg
  }>
}