export interface ListSetting {
  key: string
  name: string
  ifShow: boolean
  ifLock: boolean
  index: number
  unit?: string // 有些情况下需要单位
}