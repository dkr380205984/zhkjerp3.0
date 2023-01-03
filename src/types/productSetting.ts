// 产品款式
export interface StyleInfo {
  id: null | number | string
  name: string
}

// 产品成份
export interface IngredientInfo {
  id: null | number | string
  name: string
}

// 配色组
export interface ColourInfo {
  id: null | number | string
  name: string
  color_code: string | null
}

// 尺码
export interface SizeInfo {
  id: null | number | string
  name: string
  category_id: number | string
}

// 产品尺码设置
export interface SizeSetting {
  id: null | number | string
  pid: null | number | string
  name: string
  child_size: SizeInfo[]
}

// 尺码模板设置
export interface SizeModuleSetting {
  id: null | number | string
  name: string
  content: string
}

// 产品品类
export interface CategoryInfo {
  id: number | string
  name: string
  code: string
  unit: string
  secondary_category: Array<{
    name: string
    id: number | string
  }>
}
