interface PMInfo {
  value?: string
  repeat?: string | number
  number?: string | number
  total?: string | number
  children?: PMInfo[]
}

export interface GLInfo {
  value: string
  mark: string | number
}

export interface GLReapeat {
  start: string | number
  end: string | number
  repeat: string | number
}

interface ColourInfo {
  color_id: string | number
  weave_number: string | number
  color_name?: string
  color_scheme: Array<{
    color: string
    name: string
    number?: number // 根数
    material_weight?: Array<{
      material_type: 1 | 2
      material_id: number
      material_name: string
      weight: number
    }>
  }>
}

interface MaterialInfo {
  material_id: string | number
  material_name?: string
  apply: string[] | number[]
  type_materail?: 0 | 1 // 0：主要 1：次要
  number?: string | number
}


export interface CraftMaterialInfo {
  material_type: 1 | 2
  material_id: string | number
  material_name: string
  material_color: string
  number: number
}

export interface DraftMethods {
  PM: PMInfo[] // 穿综法
  PMFlag: 'normal' | 'complex' // 是否高级穿综法
  GL: Array<Array<Array<GLInfo>>> // 纹版图
  GLFlag: 'normal' | 'complex' // 是否高级纹版图
  GLRepeat: Array<Array<GLReapeat>> // 纹版图循环
  PMDesc: string // 穿综备注
  GLDesc: string // 纹版备注
}

export interface MergeDataInfo {
  row: number
  col: number
  rowspan?: number
  colspan: number
  romoved?: boolean
  oldCol?: number // 工艺单打印页面夹断处理
}
export interface CraftInfo {
  id?: null | string | number
  part_id?: string | number
  product_id: string | number
  craft_code?: string
  title: string
  size: string // 大身规格
  weight: string // 大身克重
  other_info: string
  desc: string
  is_draft: 1 | 2
  calc_weight_way: 1 | 2 // 计算公式
  product_time: string // 下机时间
  process_data: string[] // 后道工序
  // 物料系数
  yarn_coefficient: Array<{
    id?: string
    name: string
    value: string | number
    chuankou: string | number
  }>
  // 穿综纹版
  draft_method: DraftMethods
  // 经向
  warp_data: {
    color_data: ColourInfo[]
    material_data: MaterialInfo[]
    assist_material: MaterialInfo[] // 辅助原料
    warp_rank: Array<Array<any>>
    warp_rank_back: Array<Array<any>>
    merge_data: string | MergeDataInfo[]
    merge_data_back: string | MergeDataInfo[]
    weft: string | number // 总头纹
    width: string // 整经门幅
    side: string | number // 边型
    machine: string | number // 机型
    reed: string // 筘号
    reed_method: string // 穿筘法
    reed_width: string // 筘幅
    reed_width_explain: string[] // 筘幅说明,包含左中右厘米数
    sum_up: string // 综页
    back_status: 1 | 2 // 1：有，2：无
  }
  // 纬向
  weft_data: {
    color_data: ColourInfo[]
    material_data: MaterialInfo[]
    assist_material: MaterialInfo[] // 辅助原料
    weft_rank: Array<Array<any>>
    weft_rank_back: Array<Array<any>>
    merge_data: string | MergeDataInfo[]
    merge_data_back: string | MergeDataInfo[]
    organization: string | number // 组织法
    peifu: string | number // 胚服
    weimi: string // 纬密
    shangchiya: string // 上齿牙
    xiachiya: string // 下齿牙
    neichang: string // 内长
    rangwei: string // 让位
    total: string | number // 总计
    back_status: 1 | 2 // 1：有，2：无
    peifu_explain: string // 胚服说明
  }
  // 物料信息
  material_info: Array<{
    color_id: number | string
    info_data: CraftMaterialInfo[]
  }>
}