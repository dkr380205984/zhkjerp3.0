// 公司类型
export interface ClientTypeInfo {
  name: string
  code?: string
  client_type_id?: null | string | number // 只有在rel_tag里才有这个
  id?: null | string | number
  type: number | string
  rel_client?: ClientInfo[]
  rel_tag?: ClientTypeInfo[]
  public_tag?: ClientTypeInfo[]
}

export interface ClientInfo {
  id?: null | string | number
  code: string
  workshop_id?: string | null
  name: string
  alias: string // 简称
  contacts_data: Array<{
    id?: null | string | number
    name: string // 联系人
    phone: string
    email: string
    station: string
  }>
  address: string
  client_type_id: number | string
  rel_tag_data: number[] // 二级标签
}