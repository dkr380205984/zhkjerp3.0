export interface InspectionInfo {
  id?: null | number
  type?: 1 | 2 | string // 1:出库 2：入库
  order_id?: string | number
  doc_info_id?: string | number
  complete_time?: string
  number: string
  size?: string
  color?: string
  part_name?: string
  shoddy_number: string
  shoddy_reason: string | string[]
  client?: string[] | string // 出库单位，存中文，需求如此
}