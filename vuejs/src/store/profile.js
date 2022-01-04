import axios from 'axios';
import { environment } from '@/environments/environment';
import { i18n } from '@/i18n/i18n';

class Profile {
  constructor (user_id, name, balance, currency, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.name = name.toString();
    this.balance = parseFloat(balance);
    this.currency = currency;
  }
}

export default {
  state: {
    profile: null
  },
  mutations: {
    setProfile (state, payload) {
      if (payload !== null) {
        state.profile = payload
      } else {
        state.profile = null
      }
    }
  },
  actions: {
    async getProfile ({ commit }, payload) {
      commit('clearError')
      const resultBills = []

      try {
        const profile = await axios.get(environment.url + '/api/v1/profiles/' + payload)

        if (profile.data.length !== 0) {
          profile.data.forEach((key) => {
            resultBills.push(
              new Profile(key.user_id, key.name, key.balance, key.currency, key.id)
            )
          })
        }

        commit('setProfile', resultBills)
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
        const profile = await axios.post(environment.url + '/api/v1/profiles', payload)

        resultBills.push(
          new Profile(profile.data.user_id, profile.data.name, profile.data.balance, profile.data.currency, profile.data.id)
        )

        commit('setProfile', resultBills)
        commit('setMessage', { status: 'success', message: i18n.t('records.profile.add_success') })
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
    async editProfile ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultBills = getters.profile

      try {
        const editProfile = await axios.patch(environment.url + '/api/v1/profiles/' + payload.id, payload)

        resultBills.forEach((element) => {
          if (element.id === editProfile.data.id) {
            element.name = editProfile.data.name
          }
        });

        commit('setProfile', resultBills)
        commit('setMessage', {
          status: 'success',
          message: i18n.t('records.profile.edit_success')
        })
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', {
            status: 'error',
            message: i18n.t(err.response.data.message)
          })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async deleteProfile ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultBills = getters.profile

      try {
        await axios.delete(environment.url + '/api/v1/profiles/' + payload.id)

        resultBills.filter(item => item.id !== payload.id)

        commit('setProfile', resultBills)
        commit('setMessage', {
          status: 'success',
          message: i18n.t('records.profile.delete_success', { name: payload.name })
        })
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', {
            status: 'error',
            message: i18n.t(err.response.data.message)
          })
        } else {
          console.log(err)
        }

        throw err
      }
    }
  },
  getters: {
    profile (state) {
      return state.profile
    },
    profileById (state) {
      return profileId => {
        return state.profile.find(bill => bill.id === profileId)
      }
    }
  }
}
