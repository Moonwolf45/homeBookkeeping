import Vue from 'vue'
import Vuex from 'vuex'

import shared from './shared'
import user from './user'
import profile from './profile'
import category from './category'
import event from './event'
import planningEvent from './planningEvent'
import currency from './currency'
import notification from './notification'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    shared,
    user,
    profile,
    category,
    event,
    planningEvent,
    currency,
    notification
  }
})
