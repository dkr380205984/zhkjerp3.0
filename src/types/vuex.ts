interface StatusAndArr {
  status: boolean
  arr: any[]
}

// 维护api公共state
export interface ApiState {
  [propName: string]: StatusAndArr
}

// 全局state
export interface State {
  api: {
    [propName: string]: StatusAndArr
  }
  status: {
    breadUrl: Array<{
      url: string
      name: string
    }>
    token: string
  }
}

// 用于调取公共状态是否存在的函数所需的参数类型
export interface CheckCommonInfo {
  checkWhich: string // 需要的公共数据
  getInfoMethed?: 'commit' | 'dispatch' // commit or dispatch,api一般都是异步，用dispatch调用，status一般是同步，用commit调用,默认就是dispatch
  getInfoApi: string // 没有公共数据的时候需要调用的函数
}

// 维护全局的state，暂时保留，没什么用
export interface SelfState {
  api: ApiState
}

// 公共数据——级联选择器类型
export interface CascaderInfo {
  label: string
  value: null | number | string
  type?: string | number
  children?: CascaderInfo[] | undefined
  unit?: string
}
