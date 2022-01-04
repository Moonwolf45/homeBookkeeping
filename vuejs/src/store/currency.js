import axios from 'axios';
import { environment } from '@/environments/environment';
import { i18n } from '@/i18n/i18n';

class Currency {
  constructor (user_id, CharCode, Name , locale, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.CharCode = CharCode;
    this.Name = 'currency.' + CharCode;
    this.locale = locale;
  }
}

export default {
  state: {
    currency: null,
    currencyAll: null,
    currencyUser: null,
    mainCurrency: null,
  },
  mutations: {
    loadCurrencyUser (state, payload) {
      if (payload !== null) {
        state.currencyUser = payload
      } else {
        state.currencyUser = null
      }
    },
    loadCurrency (state, payload) {
      if (payload !== null) {
        state.currency = payload
      } else {
        state.currency = null
      }
    },
    loadAllCurrency (state, payload) {
      if (payload !== null) {
        state.currencyAll = payload
      } else {
        state.currencyAll = null
      }
    },
    loadMainCurrency (state, payload) {
      if (payload !== null) {
        state.mainCurrency = payload
      } else {
        state.mainCurrency = null
      }
    },
  },
  actions: {
    async getCurrencyUser ({ commit }, payload) {
      commit('clearError')
      const resultCurrencies = []

      try {
        const currencies = await axios.get(environment.url + '/api/v1/currencies/' + payload)

        if (currencies.data.currency.length !== 0) {
          let user_id = currencies.data.user_id;
          currencies.data.currency.forEach((key, index) => {
            resultCurrencies.push(
              new Currency(user_id, key.CharCode, key.Name, key.locale, index)
            )
          })

          commit('loadMainCurrency', new Currency(user_id, currencies.data.mainCurrency.CharCode,
            currencies.data.mainCurrency.Name, currencies.data.mainCurrency.locale))
        }

        commit('loadCurrencyUser', resultCurrencies)
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

        commit('loadCurrency', currency.data)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async getAllCurrency ({ commit, getters }) {
      commit('clearError')
      const resultAllCurrencies = []

      try {
        const currencies = await axios.get(environment.url + '/api/v1/currencies/all-currency')

        if (currencies.data.length !== 0) {
          let user = getters.user;
          let counter = 0;
          for (let key in currencies.data) {
            resultAllCurrencies.push(
              new Currency(user.id, currencies.data[key].CharCode, currencies.data[key].Name,
                currencies.data[key].locale, counter)
            )
            counter++;
          }
        }

        commit('loadAllCurrency', resultAllCurrencies)
      } catch (err) {
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
    currencies (state) {
      return state.currency
    },
    mainCurrency (state) {
      return state.mainCurrency
    },
    currenciesUser (state) {
      return state.currencyUser
    },
    currenciesAll (state) {
      return state.currencyAll
    }
  }
}
