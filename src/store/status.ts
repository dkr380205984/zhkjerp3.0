// 该模块用于管理公共状态，如面包屑信息，token，用户信息等
import { ActionContext } from 'vuex'
import { getToken } from '@/assets/js/api'
import { ApiState } from '@/types/vuex'

interface State {
  breadUrl: BreadUrl[]
  token: string
}
interface BreadUrl {
  fullPath: string
  name: string
}
const statusState: State = {
  breadUrl: [],
  token: ''
}

const statusMutations = {
  getRoute(state: State, route: BreadUrl) {
    if (route.name !== '首页' && route.name !== 'login') {
      let finded = state.breadUrl.find((item) => {
        return item.name === route.name
      })
      if (finded) {
        finded.fullPath = route.fullPath
      } else {
        state.breadUrl.push(route)
      }
    }
  },
  deleteRoute(state: State, route: BreadUrl) {
    let spliceIndex = 0
    let finded = state.breadUrl.find((item, index) => {
      spliceIndex = index
      return item.name === route.name
    })
    if (finded) {
      state.breadUrl.splice(spliceIndex, 1)
    }
  },
  getToken(state: State, token: string) {
    state.token = token
  }
}

const statusActions = {
  getTokenAsync(content: ActionContext<ApiState, any>) {
    getToken().then((res) => {
      if (res.data.status) {
        content.commit('getToken', res.data.data)
      }
    })
  }
}
export default {
  namespaced: true,
  state: statusState,
  mutations: statusMutations,
  actions: statusActions
}
