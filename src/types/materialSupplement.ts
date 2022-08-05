// 补纱
export interface MaterialSupplementInfo {
  id?: string | number
  order_id: string | number
  rel_doc_id: string | number // 关联加工单
  client_data: Array<{
    bear_price: string | number // 承担金额
    bear_client_id: string | number // 承担单位
    bear_client_name?: string
  }>
  client_name?: string
  client_id: string | number // 补纱单位
  desc: string
  info_data: Array<{
    yarn_type?: 1 | 2
    check?: boolean
    id?: string | number
    material_id: string | number
    material_name?: string
    material_color: string
    number: string | number
    tree_data: string | string[]
    unit: string
    total_order_number?: string | number
    total_transfer_number?: string | number
    material_type: 1 | 2 //1原料 2辅料
  }>
}