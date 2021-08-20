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

// 品类
export interface ProductTypeInfo {
  id: null | number | string
  pid: null | number | string
  name: string
  child_size: SizeInfo[]
}