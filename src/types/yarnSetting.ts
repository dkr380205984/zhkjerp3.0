export interface YarnInfo {
  id: null | number | string
  name: string | string[] // 可以单个添加,可以批量传递数组
  type: 1 | 2 | 3 // 纱线/面料/毛料
  yarn_rel_type: number[] // 类型id数组
  yarn_data?: Array<{
    id: number
    name: string
  }>
}

export interface YarnTypeInfo {
  id: null | number | string
  type: 1 | 2 | 3 // 纱线/面料/毛料
  name: string
}

