import axios from 'axios';
import { i18n } from '../i18n/i18n';
import moment from 'moment';

class PlanningEvent {
  constructor (user_id, category_id, bill_id, currency, type, amount, date, description, status, active, id = null,
               event_id = null) {

    this.id = id !== null ? parseInt(id) : null;
    this.event_id = event_id !== null ? parseInt(event_id) : null;
    this.user_id = parseInt(user_id);
    this.category_id = parseInt(category_id);
    this.bill_id = parseInt(bill_id);
    this.currency = currency;
    this.type = parseInt(type) === 1 ? 'income' : 'outcome' ;
    this.amount = parseFloat(amount);
    this.date = moment(date, 'YYYY-MM-DD HH:mm').format('DD.MM.YYYY HH:mm');
    this.description = description;
    this.status = parseInt(status);
    this.active = parseInt(active);
  }
}

export default {
  state: {
    activePlanningEvents: [],
    nonActivePlanningEvents: [],
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
      commit('setLoadingPlanningEvents', true)

      try {
        const planningEvent = await axios.get(process.env.VUE_APP_BACKEND_URL + '/api/v1/planning-events', {
          params: { user_id: getters.user.id }
        })

        const finalPlanningEventsActive = []
        const finalPlanningEventsNoneActive = []

        if (Object.values(planningEvent.data).length > 0) {
          if (planningEvent.data.activePlanningEvents.length > 0) {
            planningEvent.data.activePlanningEvents.forEach((planningEvent) => {
              let childrenActive = [];

              if (planningEvent.children.length > 0) {
                planningEvent.children.forEach((childrenPlanningEvent) => {
                  childrenActive.push(new PlanningEvent(childrenPlanningEvent.user_id, childrenPlanningEvent.category_id,
                    childrenPlanningEvent.bill_id, childrenPlanningEvent.currency, childrenPlanningEvent.type,
                    childrenPlanningEvent.amount, childrenPlanningEvent.date, childrenPlanningEvent.description,
                    childrenPlanningEvent.status, childrenPlanningEvent.active, childrenPlanningEvent.id,
                    childrenPlanningEvent.event_id));
                });
              }

              finalPlanningEventsActive.push({ id: planningEvent.id, name: planningEvent.name, children: childrenActive });
            });
          }

          if (planningEvent.data.noneActivePlanningEvents.length > 0) {
            planningEvent.data.noneActivePlanningEvents.forEach((planningEvent) => {
              let childrenNoneActive = [];

              if (planningEvent.children.length > 0) {
                planningEvent.children.forEach((childrenPlanningEvent) => {
                  childrenNoneActive.push(new PlanningEvent(childrenPlanningEvent.user_id,
                    childrenPlanningEvent.category_id, childrenPlanningEvent.bill_id, childrenPlanningEvent.currency,
                    childrenPlanningEvent.type, childrenPlanningEvent.amount, childrenPlanningEvent.date,
                    childrenPlanningEvent.description, childrenPlanningEvent.status, childrenPlanningEvent.active,
                    childrenPlanningEvent.id, childrenPlanningEvent.event_id));
                });
              }

              finalPlanningEventsNoneActive.push({ id: planningEvent.id, name: planningEvent.name, children: childrenNoneActive });
            });
          }

          commit('addActivePlanningEvents', finalPlanningEventsActive)
          commit('addNonActivePlanningEvents', finalPlanningEventsNoneActive)
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
    async addPlanningEvent ({ commit, dispatch }, payload) {
      commit('clearError')
      commit('setLoadingPlanningEvents', true)

      try {
        const planningEvent = await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/v1/planning-events', payload)

        if (planningEvent.data.id > 0) {
          commit('setMessage', { status: 'success', message: i18n.t('planning.edit_planning.add_success') })
          commit('setLoadingPlanningEvents', false)

          await dispatch('getAllPlanningEvents')
        }
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
    async updatePlanningEvent ({ commit, dispatch }, payload) {
      commit('clearError')
      commit('setLoadingPlanningEvents', true)

      try {
        const planningEvent = await axios.patch(process.env.VUE_APP_BACKEND_URL + '/api/v1/planning-events/' + payload.id, payload)

        if (planningEvent.status === 200) {
          commit('setMessage', { status: 'success', message: i18n.t('planning.edit_planning.edit_success') })
          commit('setLoadingPlanningEvents', false)

          await dispatch('getAllPlanningEvents')
        }
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
    async deletePlanningEvent ({ commit, dispatch }, payload) {
      commit('clearError')
      commit('setLoadingPlanningEvents', true)

      try {
        const planningEvent = await axios.delete(process.env.VUE_APP_BACKEND_URL + '/api/v1/planning-events/' + payload)

        if (planningEvent.status === 204) {
          commit('setMessage', { status: 'success', message: i18n.t('planning.edit_planning.delete_success') })
          commit('setLoadingPlanningEvents', false)

          await dispatch('getAllPlanningEvents')
        }
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
