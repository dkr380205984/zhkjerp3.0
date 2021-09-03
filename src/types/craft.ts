interface PMInfo {
  value: string
  repeat: string | number
  children?: PMInfo[]
}

interface GLInfo {
  value: string
  mark: string | number
}

interface GLReapeat {
  start: string | number
  end: string | number
  repeat: string | number
}

interface ColourInfo {
  color_id: string | number
  weave_number: string | number
  color_scheme: Array<{
    color: string
    name: string
  }>
}

interface MaterialInfo {
  material_id: string | number
  apply: string[]
  type_materail?: 0 | 1 // 0：主要 1：次要
  number?: string | number
}

export interface CraftInfo {
  id?: null | string | number
  product_id: string | number
  title: string
  size: string // 大身规格
  weight: string // 大身克重
  other_info: string
  desc: string
  is_draft: 1 | 2
  // 物料系数
  yarn_coefficient: Array<{
    name: string
    value: string | number
    chuankou: string | number
  }>
  // 穿综纹版
  draft_method: {
    PM: PMInfo[] // 穿综法
    PMFlag: Boolean // 是否高级穿综法
    GL: Array<Array<Array<GLInfo>>> // 纹版图
    GLFlag: Boolean // 是否高级纹版图
    GLRepeat: Array<Array<GLReapeat>> // 纹版图循环
    PMDesc: string // 穿综备注
    GLDesc: string // 纹版备注
  }
  // 经向
  warp_data: {
    color_data: ColourInfo[]
    material_data: MaterialInfo[]
    assist_material: MaterialInfo[] // 辅助原料
    warp_rank: string // 经向表格转字符串
    warp_rank_back: string
    merge_data: string
    merge_data_back: string
    weft: string | number // 总头纹
    width: string // 整经门幅
    side_id: string | number // 边型
    machine_id: string | number // 机型
    reed: string // 筘号
    reed_method: string // 穿筘法
    reed_width: string // 筘幅
    reed_width_explain: string // 筘幅说明
    sum_up: string // 综页
    back_status: 1 | 2 // 1：有，2：无
  }
  // 纬向
  weft_data: {
    color_data: ColourInfo[]
    material_data: MaterialInfo[]
    assist_material: MaterialInfo[] // 辅助原料
    warp_rank: string // 经向表格转字符串
    warp_rank_back: string
    merge_data: string
    merge_data_back: string
    organization_id: string | number // 组织法
    peifu: string | number // 胚服
    weimi: string // 纬密
    shangchiya: string // 上齿牙
    xiachiya: string // 下齿牙
    neichang: string // 内长
    rangwei: string // 让位
    total: string // 总计
    back_status: 1 | 2 // 1：有，2：无
    peifu_explain: string // 胚服说明
  }
}