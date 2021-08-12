export default {
  state: {
    loading: false,
    error: null,
    status: 'error'
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setMessage (state, payload) {
      state.status = payload.status
      state.error = payload.message
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setMessage ({ commit }, payload) {
      commit('setMessage', payload)
    },
    clearError ({ commit }) {
      commit('clearError')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    status (state) {
      return state.status
    }
  }
}
