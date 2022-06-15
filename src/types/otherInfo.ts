export interface CheckBeyondInfo {
  doc_type: number // 单据类型
  // 采购单查询格式
  data?: any[]
  // data_1?: Array<{
  //   plan_info_id: string | number
  //   sup_info_id: string | number
  //   number: string | number
  //   attribute: string
  // }>
  // // 最终入库单查询格式
  // data_2?: Array<{
  //   action_type: string | number
  //   rel_doc_info_id: string | number
  //   number: string | number
  // }>
  // // 生产计划单查询格式
  // data_3?: Array<{
  //   plan_id: string | number
  //   part_id: string | number
  //   product_id: string | number
  //   size_id: string | number
  //   color_id: string | number
  //   number: string | number
  // }>
  // // 检验入库单查询格式
  // data_4?: Array<{
  //   doc_info_id: string | number
  //   number: string | number
  // }>
}