import axios from 'axios'
import moment from 'moment-timezone';
import { i18n } from '../i18n/i18n'

class User {
  constructor (username, email, auth_key, timeZone, status, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.username = username;
    this.email = email;
    this.auth_key = auth_key;
    this.timeZone = timeZone;
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
        state.user = new User(payload.username, payload.email, payload.auth_key, payload.timeZone, payload.status, payload.id)
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
        await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/registration', payload)
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
        const user = await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/login', payload)
        commit('setUser', user.data)
        commit('setAccessToken', user.data.access_token)
        moment.tz.setDefault(user.data.timeZone);

        await dispatch('getAllCurrency')
        await dispatch('getCurrencyUser', user.data.id)
        await dispatch('getCurrency')
        await dispatch('getProfile', user.data.id)
        await dispatch('getCategory', user.data.id)
        await dispatch('getAllPlanningEvents')

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
    async forgotPasswordUser ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const user = await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/forgot-password', payload)
        commit('setLoading', false)

        return user;
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
        moment.tz.setDefault(JSON.parse(auth_user).timeZone);

        await dispatch('getAllCurrency')
        await dispatch('getCurrencyUser', JSON.parse(auth_user).id)
        await dispatch('getCurrency')
        await dispatch('getProfile', JSON.parse(auth_user).id)
        await dispatch('getCategory', JSON.parse(auth_user).id)
        await dispatch('getAllPlanningEvents')

        commit('setLoading', false)
      }
    },
    async isUserEmailExists ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const user = await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/user-exists', payload);
        commit('setLoading', false)

        return user;
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
    logoutUser ({ commit }) {
      commit('setUser', null)
      commit('setAccessToken', null)

      commit('setProfile', null)
      commit('loadCategory', null)
    },
    async updateUser ({ commit, dispatch }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const updateUserSettings = await axios.patch(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/' + payload.user_id, payload)
        moment.tz.setDefault(updateUserSettings.data.user.timeZone);
        commit('setUser', updateUserSettings.data.user)

        await dispatch('getCurrencyUser',  updateUserSettings.data.user.id)

        commit('setLoading', false)
        commit('setMessage', { status: 'success', message: i18n.t('settings.form.edit_success') })
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
    async updateUserLanguage ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const updateUserSettings = await axios.patch(process.env.VUE_APP_BACKEND_URL + '/api/v1/users/update-language/' + payload.user_id, payload)
        commit('setUser', updateUserSettings.data.user)

        commit('setLoading', false)
        commit('setMessage', { status: 'success', message: i18n.t('settings.form.edit_success') })
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
