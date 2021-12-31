export interface SampleInfo {
  quote_rel_product_id?: number | string // 绑报价单产品id，通常用于报价转样单
  system_code?: string
  product_id?: string | number
  product_type: 2 // 1：产品 2：样品
  pid?: number | null | string
  pid_status?: number | null // 1：待确认 2.已确认 3.已修改 4.转产品
  id?: number | null | string
  status?: 1 | 2 | 3 | 4 | null // 1：待确认 2.已确认 3.已修改 4.转产品
  name: string
  product_code: string
  style_code: string // 客户款号
  unit: string
  category?: string
  category_id?: string | number
  secondary_category_id?: string | number
  secondary_category?: string
  type?: number[] // 品类下拉框
  image_data: string[]
  file_list?: Array<{
    id: number
    url: string
  }>
  desc: string
  style_data: string[] // 款式
  component_data: Array<{
    component_id: string | number
    component_name?: string
    number: string | number // 成分信息
  }>
  size_data: Array<{
    size_name?: string
    size_id: string | number
    name?: string
    size_info: string
    weight: string
  }> // 尺码组
  color_data: Array<{
    name: string
    id: number | string
  }> | Array<string>  // 配色组
  // 配件信息
  part_data: Array<{
    name: string
    unit: string
    part_size_data: Array<{
      size_name?: string
      size_id: string | number
      name?: string
      size_info: string
      weight: string
    }>
    part_component_data: Array<{
      component_id: string | number
      component_name?: string
      number: string | number // 成分信息
    }>
  }>
  client_edit_idea?: string
}