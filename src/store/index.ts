import Vue from 'vue'
import Vuex from 'vuex'
import status from './status'
import api from './api'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
    status
  }
})
