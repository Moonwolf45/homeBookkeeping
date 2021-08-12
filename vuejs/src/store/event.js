import axios from 'axios';
import { environment } from '@/environments/environment';
import { i18n } from '@/i18n/i18n';
import moment from 'moment';

class Events {
  constructor (user_id, category_id, currency, type, amount, date, description, id = null) {
    let cur = ''

    this.id = parseInt(id);
    this.user_id = parseInt(user_id);
    this.category_id = parseInt(category_id);

    if (parseInt(currency) === 1) {
      cur = 'rub'
    } else if (parseInt(currency) === 2) {
      cur = 'usd'
    } else {
      cur = 'eur'
    }
    this.currency = cur;
    this.type = parseInt(type) === 1 ? 'income' : 'outcome' ;
    this.amount = parseFloat(amount);
    this.date = moment(date, 'X').format('DD.MM.YYYY HH:mm');
    this.description = description;
  }
}

export default {
  state: {
    events: null,
    income: null,
    outcome: null,
    loadEvents: false,
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
    loadEvents (state, payload) {
      state.loadEvents = payload
    },
  },
  actions: {
    async addEvent ({ commit, rootGetters }, payload) {
      commit('clearError')
      commit('setLoading', true)

      try {
        await axios.post(environment.url + '/api/v1/events', payload)
        commit('setLoading', false)
        commit('setMessage', { status: 'success', message: i18n.t('records.event.success') })

        const profile = rootGetters.profile
        switch (payload.currency) {
          case 'rub':
            if (payload.type === 'income') {
              profile.balanceRUB += payload.amount
            } else {
              profile.balanceRUB -= payload.amount
            }
          break

          case 'usd':
            if (payload.type === 'income') {
              profile.balanceUSD += payload.amount
            } else {
              profile.balanceUSD -= payload.amount
            }
          break

          case 'eur':
            if (payload.type === 'income') {
              profile.balanceEUR += payload.amount
            } else {
              profile.balanceEUR -= payload.amount
            }
          break
        }
        commit('setProfile', profile)
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
    async getAllEvents ({ commit, rootGetters }, payload = null) {
      commit('clearError')
      commit('setLoading', true)
      commit('loadEvents', true)
      let filterData = null
      const finalEvents = []

      try {
        if (payload === '') {
          // filterData = { user_id: rootGetters.user.id, dataFrom: moment().startOf('week').day(1).format('X'),
          //   dataTo: moment().endOf('week').day(7).format('X'), categories: 'all', type: 'all' }

          filterData = { user_id: rootGetters.user.id, dataFrom: moment().startOf('year').format('X'),
            dataTo: moment().endOf('year').format('X'), categories: 'all', type: 'all' }
        } else {
          filterData = payload
        }

        const events = await axios.get(environment.url + '/api/v1/events', {
          params: filterData
        })

        if (Object.keys(events.data.events).length > 0) {
          events.data.events.forEach((event) => {
            finalEvents.push(
              new Events(event.user_id, event.category_id, event.currency, event.type, event.amount, event.date,
                         event.description, event.id)
            )
          })

          commit('addEvents', finalEvents)
        }

        if (Object.keys(events.data.income).length > 0) {
          commit('setIncome', events.data.income)
        }

        if (Object.keys(events.data.outcome).length > 0) {
          commit('setOutcome', events.data.outcome)
        }
        commit('setLoading', false)
        commit('loadEvents', false)
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
    events (state) {
      return state.events
    },
    income (state) {
      return state.income
    },
    outcome (state) {
      return state.outcome
    },
    loadEvents (state) {
      return state.loadEvents
    }
  }
}
