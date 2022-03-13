import axios from 'axios';
import { i18n } from '@/i18n/i18n';
import moment from 'moment';

class PlanningEvent {
  constructor (user_id, category_id, bill_id, currency, type, amount, date, description, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.category_id = parseInt(category_id);
    this.bill_id = parseInt(bill_id);
    this.currency = currency;
    this.type = parseInt(type) === 1 ? 'income' : 'outcome' ;
    this.amount = parseFloat(amount);
    this.date = moment(date, 'X').format('DD.MM.YYYY HH:mm');
    this.description = description;
  }
}

export default {
  state: {
    activePlanningEvents: null,
    nonActivePlanningEvents: null,
    loadingPlanningEvents: false,
  },
  mutations: {
    addActivePlanningEvents (state, payload) {
      if (payload !== null) {
        state.activePlanningEvents = payload
      } else {
        state.activePlanningEvents = null
      }
    },
    addNonActivePlanningEvents (state, payload) {
      if (payload !== null) {
        state.nonActivePlanningEvents = payload
      } else {
        state.nonActivePlanningEvents = null
      }
    },
    setLoadingPlanningEvents (state, payload) {
      state.loadingPlanningEvents = payload
    },
  },
  actions: {
    async getAllPlanningEvents ({ commit, getters }) {
      commit('clearError')
      commit('setLoadingPlanningEvents', true)

      const finalEvents = []

      try {
        const events = await axios.get(process.env.VUE_APP_URL + '/api/v1/planning-events', {
          params: { user_id: getters.user.id }
        })

        console.log(events.data);
        if (Object.values(events.data.events).length > 0) {
          events.data.events.forEach((event) => {
            finalEvents.push(
              new PlanningEvent(event.user_id, event.category_id, event.bill_id, event.currency, event.type, event.amount,
                         event.date, event.description, event.id)
            )
          })

          commit('addActivePlanningEvents', finalEvents)
          commit('addNonActivePlanningEvents', finalEvents)
        }

        commit('setLoadingPlanningEvents', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        commit('setLoadingPlanningEvents', false)
        throw err
      }
    },
    async addPlanningEvent ({ commit }, payload) {
      commit('clearError')
      commit('setLoadingPlanningEvents', true)

      try {
        await axios.post(process.env.VUE_APP_URL + '/api/v1/planning-events', payload)

        commit('setMessage', { status: 'success', message: i18n.t('records.event.success') })
        commit('setLoadingPlanningEvents', false)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        commit('setLoadingPlanningEvents', false)
        throw err
      }
    },
  },
  getters: {
    activePlanningEvents (state) {
      return state.activePlanningEvents
    },
    nonActivePlanningEvents (state) {
      return state.nonActivePlanningEvents
    },
    loadingPlanningEvents (state) {
      return state.loadingPlanningEvents
    }
  }
}
