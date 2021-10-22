// const storeType = [{
//   name: '本厂仓库',
//   value: 1
// }, {
//   name: '加工厂仓库',
//   value: 2
// }, {
//   name: '供货商仓库',
//   value: 3
// }]

export interface StoreInfo {
  id?: number
  name: string
  type: 1 | 2 | 3
  client_id?: string | number
  manager_id: string | number // 管理员
  desc: string
  secondary_store: string[]
}