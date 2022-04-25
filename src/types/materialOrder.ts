export interface MaterialOrderInfo {
  created_at?: string
  id?: number | string
  code?: string
  order_id?: number | string
  sup_id?: number | string
  plan_id?: number | string // 计划单id
  reserve_id?: number | string // 原料预订购单id
  client_id_arr?: string[] // 前端下拉框选择公司用
  client_id: number | string
  client_name?: string
  order_time: string
  delivery_time: string
  total_number: number | string
  total_price: number | string
  material_type: 1 | 2 // 1原料2辅料
  others_fee_data: Array<{
    desc: string // 额外费用备注
    name: string
    price: number | string
  }>
  desc: string
  info_data: MaterialListInfo[]
}

export interface MaterialListInfo {
  process_info?: any[]
  id?: string | number
  check?: boolean // 前端用
  material_id?: number | string
  material_name?: string
  material_color?: string
  material_type?: number
  yarn_type?: number // 1纱线，2面料
  before_color?: string | null
  attribute?: string
  price: string
  number: string | number
  material_order_name?: string // 后端根据采购单查询的物料
  material_transfer_name?: string
  order_material_id?: string | number // 后端根据采购单查询的物料
  material_order_info_id?: number | string // 采购单子项id 可以通过这个查询到原纱线id，颜色id
  material_transfer_info_id?: number | string // 调取单子项id 可以通过这个查询到原纱线id，颜色id
  before_attribute?: string // 原属性
  after_attribute?: string
  after_color?: string // 加工后颜色
  unit: string
  pengsha_desc?: string // 膨纱要求 
  qiege_desc?: string // 切割要求
  bingxian_desc?: string // 并线要求
  plan_color?: string
  sup_color?: string
}

