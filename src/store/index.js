import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { prop: true },
  mutations: {
    updateProp(state, payload) {
      state.prop = payload.prop
    },
  },
  actions: {
    updateProp({ commit }, payload) {
      commit('updateProp', payload)
    },
  },
  modules: {},
  getters: { prop: state => state.prop },
})
