import axios from 'axios'
import { i18n } from '@/i18n/i18n'
import { environment } from '@/environments/environment'

class User {
  constructor (username, email, auth_key, status, id = null) {
    this.id = parseInt(id);
    this.username = username;
    this.email = email;
    this.auth_key = auth_key;
    this.status = parseInt(status) === 10 ? 'active' : 'deactivated';
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      if (payload !== null) {
        state.user = new User(payload.username, payload.email, payload.auth_key, payload.status, payload.id)
        localStorage.setItem('auth_user', JSON.stringify(payload))
      } else {
        state.user = null
        localStorage.removeItem('auth_user');
      }
    },
    setAccessToken(state, payload) {
      if (payload !== null) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + payload
        localStorage.setItem('access_token', payload)
      } else {
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('access_token');
      }
    }
  },
  actions: {
    async registerUser ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        await axios.post(environment.url + '/api/v1/users/registration', payload)
        commit('setLoading', false)
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async loginUser ({ commit, dispatch }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const user = await axios.post(environment.url + '/api/v1/users/login', payload)
        commit('setUser', user.data)
        commit('setAccessToken', user.data.access_token)
        commit('setLoading', false)

        dispatch('getProfile', user.data.id)
        dispatch('getCurrency')
        dispatch('getCategory', user.data.id)
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async autoLoginUser ({ commit, dispatch }) {
      const auth_user = localStorage.getItem('auth_user')
      const access_token = localStorage.getItem('access_token')

      if (auth_user) {
        commit('setUser', JSON.parse(auth_user))
        commit('setAccessToken', access_token)

        await dispatch('getProfile', JSON.parse(auth_user).id)
        await dispatch('getCurrency')
        await dispatch('getCategory', JSON.parse(auth_user).id)
      }
    },
    logoutUser ({ commit }) {
      commit('setUser', null)
      commit('setAccessToken', null)

      commit('setProfile', null)
      commit('loadCategory', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
