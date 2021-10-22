export interface InspectionInfo {
  id?: null | number
  type?: 1 | 2 | string // 1:出库 2：入库
  order_id?: string | number
  doc_info_id?: string | number
  complete_time?: string
  number: string
  shoddy_number: string
  shoddy_reason: string | string[]
}