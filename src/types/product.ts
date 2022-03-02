export interface ProductInfo {
  quote_product_id?: number | string
  system_code?: string
  product_id?: number | string
  product_type: 1 // 1：产品 2：样品
  pid?: number | null | string
  id?: number | null | string
  pid_status?: number | null
  name: string
  product_code?: string
  style_code?: string // 客户款号
  unit?: string
  category?: string
  category_id?: string | number
  secondary_category_id?: string | number
  secondary_category?: string
  type?: string | string[] | number[] // 品类下拉框
  image_data: string[]
  file_list?: Array<{
    id: number
    url: string
  }>
  cv_list?: string[] // 复制粘贴操作专用字段
  cvFlag?: boolean
  cvImageLength?: number
  desc: string
  style_data?: string[] // 款式
  component_data: Array<{
    component_id: string | number
    component_name?: string
    number: string | number // 成分信息
  }>
  size_data: Array<{
    id: string
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
  part_data: PartInfo[]
}

// 配件信息
export interface PartInfo {
  id?: string | number
  name: string
  unit: string
  part_size_data?: Array<{
    id: string
    size_name?: string
    size_id: string | number
    name?: string
    size_info: string
    weight: string
  }>
  part_component_data?: Array<{
    component_id: string | number
    component_name?: string
    number: string | number // 成分信息
  }>
  client_edit_idea?: string
}