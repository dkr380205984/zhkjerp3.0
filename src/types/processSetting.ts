export interface ProcessInfo {
  id: null | number | string
  name: string
  type: 1 | 2 | 3 // 1原料工序 2半成品工序 3结算工序
}