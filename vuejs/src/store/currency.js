import axios from 'axios';
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
    loadingCurrency: true,
    currencyAll: null,
    loadingCurrencyAll: true,
    currencyUser: null,
    loadingCurrencyUser: true,
    mainCurrency: null,
    loadingMainCurrency: true
  },
  mutations: {
    loadCurrency (state, payload) {
      if (payload !== null) {
        state.currency = payload
      } else {
        state.currency = null
      }
    },
    setLoadingCurrency (state, payload) {
      state.loadingCurrency = payload
    },
    loadAllCurrency (state, payload) {
      if (payload !== null) {
        state.currencyAll = payload
      } else {
        state.currencyAll = null
      }
    },
    setLoadingCurrencyAll (state, payload) {
      state.loadingCurrencyAll = payload
    },
    loadCurrencyUser (state, payload) {
      if (payload !== null) {
        state.currencyUser = payload
      } else {
        state.currencyUser = null
      }
    },
    setLoadingCurrencyUser (state, payload) {
      state.loadingCurrencyUser = payload
    },
    loadMainCurrency (state, payload) {
      if (payload !== null) {
        state.mainCurrency = payload
      } else {
        state.mainCurrency = null
      }
    },
    setLoadingMainCurrency (state, payload) {
      state.loadingMainCurrency = payload
    }
  },
  actions: {
    async getCurrency ({ commit, getters }) {
      commit('setLoadingCurrency', true)
      commit('clearError')
      const mainCurrency = getters.mainCurrency.CharCode;

      try {
        const currency = await axios.get(process.env.VUE_APP_URL + '/api/v1/profiles/currency?base=' + mainCurrency)

        commit('loadCurrency', currency.data)
        commit('setLoadingCurrency', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    setLoadingCurrency ({ commit }, payload) {
      commit('setLoadingCurrency', payload)
    },
    async getAllCurrency ({ commit, getters }) {
      commit('setLoadingCurrencyAll', true)
      commit('clearError')
      const resultAllCurrencies = []

      try {
        const currencies = await axios.get(process.env.VUE_APP_URL + '/api/v1/currencies/all-currency')

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
        commit('setLoadingCurrencyAll', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    setLoadingCurrencyAll ({ commit }, payload) {
      commit('setLoadingCurrencyAll', payload)
    },
    async getCurrencyUser ({ commit }, payload) {
      commit('setLoadingCurrencyUser', true)
      commit('setLoadingMainCurrency', true)
      commit('clearError')
      const resultCurrencies = []

      try {
        const currencies = await axios.get(process.env.VUE_APP_URL + '/api/v1/currencies/' + payload)

        if (currencies.data.currency.length !== 0) {
          let user_id = currencies.data.user_id;
          currencies.data.currency.forEach((key, index) => {
            resultCurrencies.push(
              new Currency(user_id, key.CharCode, key.Name, key.locale, index)
            )
          })

          commit('loadMainCurrency', new Currency(user_id, currencies.data.mainCurrency.CharCode,
            currencies.data.mainCurrency.Name, currencies.data.mainCurrency.locale, currencies.data.id))
          commit('setLoadingMainCurrency', false)
        }

        commit('loadCurrencyUser', resultCurrencies)
        commit('setLoadingCurrencyUser', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    setLoadingCurrencyUser ({ commit }, payload) {
      commit('setLoadingCurrencyUser', payload)
    },
    setLoadingMainCurrency ({ commit }, payload) {
      commit('setLoadingMainCurrency', payload)
    }
  },
  getters: {
    currencies (state) {
      return state.currency
    },
    loadingCurrency (state) {
      return state.loadingCurrency
    },
    currenciesAll (state) {
      return state.currencyAll
    },
    loadingCurrencyAll (state) {
      return state.loadingCurrencyAll
    },
    currenciesUser (state) {
      return state.currencyUser
    },
    loadingCurrencyUser (state) {
      return state.loadingCurrencyUser
    },
    mainCurrency (state) {
      return state.mainCurrency
    },
    loadingMainCurrency (state) {
      return state.loadingMainCurrency
    },
  }
}
