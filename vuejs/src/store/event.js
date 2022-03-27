import axios from 'axios';
import { i18n } from '../i18n/i18n';
import moment from 'moment';

class Event {
  constructor (user_id, category_id, bill_id, currency, type, amount, convertAmount, date, description, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.category_id = parseInt(category_id);
    this.bill_id = parseInt(bill_id);
    this.currency = currency;
    this.type = parseInt(type) === 1 ? 'income' : 'outcome' ;
    this.amount = parseFloat(amount);
    this.convertAmount = parseFloat(convertAmount);
    this.date = moment(date, 'X').format('DD.MM.YYYY HH:mm');
    this.description = description;
  }
}

function getCurrencyBalance(balance, currency, currentCurrency, currencies) {
  let currencyArr = Object.values(currencies.Valute);
  let mainCurrencyObj = currencyArr.find(item => item.CharCode === currentCurrency)

  if (currency === 'RUB' && currentCurrency === 'RUB') {
    return parseFloat(balance)
  } else if (currency === 'RUB' && currentCurrency !== 'RUB') {
    return parseFloat(balance) / (mainCurrencyObj.Value / mainCurrencyObj.Nominal)
  } else {
    let currencyItem = currencyArr.find(item => item.CharCode === currency)

    if (parseFloat(balance) > 0) {
      return (parseFloat(balance) / (mainCurrencyObj.Value / mainCurrencyObj.Nominal)) * (currencyItem.Value / currencyItem.Nominal)
    }

    return 0
  }
}

export default {
  state: {
    events: null,
    income: null,
    outcome: null,
    loadingEvents: false,
  },
  mutations: {
    addEvents (state, payload) {
      if (payload !== null) {
        state.events = payload
      } else {
        state.events = null
      }
    },
    setIncome (state, payload) {
      if (payload !== null) {
        state.income = payload
      } else {
        state.income = null
      }
    },
    setOutcome (state, payload) {
      if (payload !== null) {
        state.outcome = payload
      } else {
        state.outcome = null
      }
    },
    setLoadingEvents (state, payload) {
      state.loadingEvents = payload
    },
  },
  actions: {
    async getAllEvents ({ commit, getters }, payload = null) {
      commit('clearError')
      commit('setLoading', true)
      commit('setLoadingEvents', true)

      let filterData = null
      const finalEvents = []
      const finalEventsIncome = new Map()
      const finalEventsOutcome = new Map()

      try {
        if (payload === null) {
          filterData = { user_id: getters.user.id, dataFrom: moment().utc().startOf('week').day(1).format('X'),
            dataTo: moment().utc().endOf('week').day(7).format('X') }
        } else {
          filterData = payload
        }

        const events = await axios.get(process.env.VUE_APP_URL + '/api/v1/events', {
          params: filterData
        })

        if (events.data.events.length > 0) {
          events.data.events.forEach((event) => {
            finalEvents.push(
              new Event(event.user_id, event.category_id, event.bill_id, event.currency, event.type, event.amount,
                event.convertAmount, event.date, event.description, event.id)
            )

            let currentAmount = getCurrencyBalance(event.amount, event.bill.currency,
              getters.mainCurrency.CharCode, getters.currencies)

            let currentCategory = parseInt(event.category_id)
            let currentType = parseInt(event.type)

            if (currentType === 1) {
              if (finalEventsIncome.has(currentCategory)) {
                let eventIncome = JSON.parse(finalEventsIncome.get(currentCategory));
                eventIncome.total += currentAmount;
                finalEventsIncome.set(currentCategory, JSON.stringify(eventIncome));
              } else {
                finalEventsIncome.set(currentCategory, JSON.stringify({ label: event.category.title,
                  color: event.category.color, total: currentAmount }));
              }
            } else if (currentType === 2) {
              if (finalEventsOutcome.has(currentCategory)) {
                let eventOutcome = JSON.parse(finalEventsOutcome.get(currentCategory));
                eventOutcome.total += currentAmount;
                finalEventsOutcome.set(currentCategory, JSON.stringify(eventOutcome));
              } else {
                finalEventsOutcome.set(currentCategory, JSON.stringify({ label: event.category.title,
                  color: event.category.color, total: currentAmount }));
              }
            }
          })

          if (finalEventsIncome.size > 0) {
            commit('setIncome', finalEventsIncome)
          }

          if (finalEventsOutcome.size > 0) {
            commit('setOutcome', finalEventsOutcome)
          }

          commit('addEvents', finalEvents)
        }

        commit('setLoading', false)
        commit('setLoadingEvents', false)
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
    async addEvent ({ commit, dispatch, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const event = await axios.post(process.env.VUE_APP_URL + '/api/v1/events', payload)

        if (event.data.id > 0) {
          await dispatch('getProfile', getters.user.id)

          commit('setMessage', { status: 'success', message: i18n.t('records.event.add_success') })
          commit('setLoading', false)
        }
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
    async updateEvent ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let finalEvents = getters.events

      try {
        const event = await axios.patch(process.env.VUE_APP_URL + '/api/v1/events/' + payload.id, payload)

        if (event.data.id > 0) {
          finalEvents.forEach((eventObject) => {
            if (eventObject.id === event.data.id) {
              eventObject.category_id = event.data.category_id
              eventObject.description = event.data.description
            }
          })

          commit('addEvents', finalEvents)

          commit('setMessage', { status: 'success', message: i18n.t('records.event.edit_success') })
          commit('setLoading', false)
        }
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
    async deleteEvent ({ commit, dispatch, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const event = await axios.delete(process.env.VUE_APP_URL + '/api/v1/events/' + payload.id)

        if (event.status === 204) {
          await dispatch('getProfile', getters.user.id)

          commit('setMessage', { status: 'success', message: i18n.t('records.event.delete_success') })
          commit('setLoading', false)
        }
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        commit('setLoading', false)
        throw err
      }
    }
  },
  getters: {
    events (state) {
      return state.events
    },
    income (state) {
      return state.income
    },
    outcome (state) {
      return state.outcome
    },
    loadingEvents (state) {
      return state.loadingEvents
    }
  }
}
