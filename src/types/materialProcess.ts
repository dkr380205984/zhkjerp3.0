import { MaterialListInfo } from "./materialOrder";
export interface MaterialProcessInfo {
  code?: string
  id?: number
  order_id: number | string
  plan_id: number | string
  process: string // 工序
  material_order_id?: number | string // 采购单id
  material_transfer_id?: number | string // 调取单id
  client_id_arr?: string[] // 前端下拉框选择公司用
  client_id: number | string
  client_name?: string
  order_time: string
  delivery_time: string
  others_fee_data: Array<{
    desc: string // 额外费用备注
    name: string
    price: number | string
  }>
  desc: string
  info_data: MaterialListInfo[]
}