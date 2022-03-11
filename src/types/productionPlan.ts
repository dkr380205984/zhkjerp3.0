import { MaterialSupplementInfo } from "./materialSupplement";

export interface ProductionPlanInfo {
  id?: string | number
  code?: string
  process_type?: string | number//  1机织计划 2 半成品加工计划 3 成品加工计
  process_id: number | string
  process_name?: string
  process_name_arr?: string[]
  order_id: number | string
  plan_id?: number | string // 计划单id
  client_id_arr?: number[] // 前端选公司用
  client_id: number | string
  client_name?: string
  start_time: string
  end_time: string
  desc: string
  total_price: number | string
  total_number: number | string
  product_info_data: Array<{
    id?: string | number // 后端给的加工单子项id，用于后续检验
    check?: boolean // 前端用字段
    product_id: number | string
    product_code?: string
    size_name?: string
    color_name?: string
    part_name?: string
    size_id: number | string
    color_id: number | string
    part_id: number | string
    number: number | string
    price: number | string
    total_price: number | string
    image_data?: string[]
    select_arr?: string // 前端用，下拉框选择一个产品尺码配色信息
  }>
  material_info_data: ProductionMaterialPlanInfo[]
  sup_data?: MaterialSupplementInfo[]
  others_fee_data: Array<{
    name: string
    price: string | number
    desc: string
  }>
}

export interface ProductionMaterialPlanInfo {
  id?: number | string
  check?: boolean // 前端用
  material_id: number | string
  material_name: string
  material_color: string
  number: number | string
  unit: string
}