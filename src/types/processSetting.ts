export interface ProcessInfo {
  id: null | number | string
  code?: string
  name: string
  process_desc: string
  rel_tag?: number[]
  type: 1 | 2 | 3 // 1原料工序 2半成品工序 3结算工序
}
export interface ProcessTypeInfo {
  id: null | number | string
  name: string
}