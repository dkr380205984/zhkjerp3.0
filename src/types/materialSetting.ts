// 包装辅料
export interface PackMaterialInfo {
  id?: null | number | string
  name: string
  unit: string
  calc_type: string
  price_info: Array<{
    price: string | number
    client_id: string | number
    client_id_arr?: number[]
    desc: string
  }>
}

// 装饰辅料
export interface DecorateMaterialInfo {
  id?: null | number | string
  name: string
  unit: string
  price_info: Array<{
    price: string | number
    client_id: string | number
    client_id_arr?: number[]
    desc: string
  }>
}