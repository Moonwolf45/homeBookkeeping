import axios from 'axios';
import { i18n } from '../i18n/i18n';

class Profile {
  constructor (user_id, name, balance, currency, countEvent, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.name = name.toString();
    this.balance = parseFloat(balance);
    this.currency = currency;
    this.countEvent = countEvent.length;
  }
}

export default {
  state: {
    profile: null,
    loadingProfile: false
  },
  mutations: {
    setProfile (state, payload) {
      if (payload !== null) {
        state.profile = payload
      } else {
        state.profile = null
      }
    },
    setLoadingProfile (state, payload) {
      state.loadingProfile = payload
    }
  },
  actions: {
    async getProfile ({ commit }, payload) {
      commit('setLoadingProfile', true)
      commit('clearError')
      const resultBills = []

      try {
        const profile = await axios.get(process.env.VUE_APP_BACKEND_URL + '/api/v1/profiles/' + payload)

        if (profile.data.length !== 0) {
          profile.data.forEach((key) => {
            resultBills.push(
              new Profile(key.user_id, key.name, key.balance, key.currency, key.countEvent, key.id)
            )
          })
        }

        commit('setProfile', resultBills)
        commit('setLoadingProfile', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async createProfile ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultBills = getters.profile

      try {
        const profile = await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/profiles', payload)

        resultBills.push(
          new Profile(profile.data.user_id, profile.data.name, profile.data.balance, profile.data.currency,
                      [], profile.data.id)
        )

        commit('setProfile', resultBills)
        commit('setMessage', { status: 'success', message: i18n.t('records.profile.add_success') })
        commit('setLoading', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        commit('setLoading', false)
        throw err
      }
    },
    async editProfile ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultBills = getters.profile

      try {
        const editProfile = await axios.patch(process.env.VUE_APP_BACKEND_URL + '/api/v1/profiles/' + payload.id, payload)

        resultBills.forEach((element) => {
          if (element.id === editProfile.data.id) {
            element.name = editProfile.data.name
            element.balance = editProfile.data.balance
            element.currency = editProfile.data.currency
          }
        });

        commit('setProfile', resultBills)
        commit('setMessage', {
          status: 'success',
          message: i18n.t('records.profile.edit_success')
        })
        commit('setLoading', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', {
            status: 'error',
            message: i18n.t(err.response.data.message)
          })
        } else {
          console.log(err)
        }

        commit('setLoading', false)
        throw err
      }
    },
    async deleteProfile ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultBills = getters.profile

      try {
        await axios.delete(process.env.VUE_APP_BACKEND_URL + '/api/v1/profiles/' + payload.id)

        resultBills.filter(item => item.id !== payload.id)

        commit('setProfile', resultBills)
        commit('setMessage', {
          status: 'success',
          message: i18n.t('records.profile.delete_success', { name: payload.name })
        })
        commit('setLoading', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', {
            status: 'error',
            message: i18n.t(err.response.data.message)
          })
        } else {
          console.log(err)
        }

        commit('setLoading', false)
        throw err
      }
    }
  },
  getters: {
    profile (state) {
      return state.profile
    },
    loadingProfile (state) {
      return state.loadingProfile
    },
    profileById (state) {
      return profileId => {
        return state.profile.find(bill => bill.id === profileId)
      }
    }
  }
}
