export interface InspectionInfo {
  id?: null | number
  type?: string | number // 1:出库 2：入库
  order_id?: string | number
  doc_info_id?: string | number
  complete_time?: string
  number: string
  size?: string
  color?: string
  part_name?: string
  shoddy_number: string
  part_shoddy_number: string | number
  deduct_price: string | number
  shoddy_reason: string | string[]
  desc?: string
  client?: string[] | string // 出库单位，存中文，需求如此
}