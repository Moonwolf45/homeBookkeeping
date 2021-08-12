import axios from 'axios';
import { environment } from '@/environments/environment';
import { i18n } from '@/i18n/i18n';

class Profile {
  constructor (user_id, balanceRUB, balanceUSD, balanceEUR, currency, id = null) {
    let cur = ''

    this.id = parseInt(id);
    this.user_id = parseInt(user_id);
    this.balanceRUB = parseFloat(balanceRUB);
    this.balanceUSD = parseFloat(balanceUSD);
    this.balanceEUR = parseFloat(balanceEUR);

    if (parseInt(currency) === 1) {
      cur = 'rub'
    } else if (parseInt(currency) === 2) {
      cur = 'usd'
    } else {
      cur = 'eur'
    }
    this.currency = cur;
  }
}

export default {
  state: {
    profile: null,
    currency: null
  },
  mutations: {
    setProfile (state, payload) {
      if (payload !== null) {
        state.profile = new Profile(payload.user_id, payload.balanceRUB, payload.balanceUSD, payload.balanceEUR,
                                    payload.currency, payload.id)
      } else {
        state.profile = null
      }
    },
    setCurrency (state, payload) {
      state.currency = payload
    }
  },
  actions: {
    async getProfile ({ commit }, payload) {
      commit('clearError')

      try {
        const profile = await axios.get(environment.url + '/api/v1/profiles/' + payload)
        commit('setProfile', profile.data)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async getCurrency ({ commit }) {
      commit('clearError')

      try {
        const currency = await axios.get(environment.url + '/api/v1/profiles/currency')
        commit('setCurrency', currency.data)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
  },
  getters: {
    profile (state) {
      return state.profile
    },
    currency (state) {
      return state.currency
    }
  }
}
