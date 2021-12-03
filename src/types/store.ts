// const storeType = [{
//   name: '本厂仓库',
//   value: 1
// }, {
//   name: '加工厂仓库',
//   value: 2
// }, {
//   name: '供货商仓库',
//   value: 3
// }]

import { MaterialStockInfo } from '@/types/materialStock';
export interface StoreInfo {
  id?: number
  name: string
  type: 1 | 2 | 3
  client_id?: string | number
  tree_data: number[] | string
  manager_id: string | number // 管理员
  desc: string
  store_type: 1 | 2 | 3 | 4 | 5 | 6 // 1.纱线原料 2.面料 3.毛料 4.装饰辅料 5.产品仓库 6.包装辅料
  secondary_store: Array<{
    name: string
    is_default: number
  }>
}

export interface StoreDetail {
  id?: number
  name: string
  type: 1 | 2 | 3
  client_id?: string | number
  tree_data: number[] | string
  manager_id: string | number // 管理员
  manager_name: string
  desc: string
  store_type: 1 | 2 | 3 | 4 | 5 | 6 // 1.纱线原料 2.面料 3.毛料 4.装饰辅料 5.产品仓库 6.包装辅料
  secondary_store: Array<{
    id: number
    store_id: number
    name: string
    is_default?: number
  }>
  store_log: MaterialStockInfo[]
  store_total: Array<{
    id: number
    material_name: string
    material_color: string
    number: number
    attribute: string
    batch_code: string
    color_code: string
    vat_code: string
    secondary_store: string
  }>
}