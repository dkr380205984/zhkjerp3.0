export interface SampleInfo {
  system_code?: string
  product_type: 2 // 1：产品 2：样品
  id?: number | null | string
  name: string
  product_code: string
  style_code: string // 客户款号
  unit: string
  category?: string
  category_id?: string | number
  type_id?: string | number
  type?: string | string[] // 品类下拉框
  image_data: string[]
  desc: string
  style_data: string[] // 款式
  component_data: Array<{
    component_id: string | number
    component_name?: string
    number: string | number // 成分信息
  }>
  size_data: Array<{
    size_id: string | number
    name?: string
    size_info: string
    weight: string
  }> // 尺码组
  color_data: Array<{
    name: string
    id: number
  }> | Array<number>  // 配色组
  // 配件信息
  part_data: Array<{
    name: string
    unit: string
    part_size_data: Array<{
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
}