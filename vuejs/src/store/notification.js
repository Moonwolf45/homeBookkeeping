import axios from 'axios';
import { i18n } from '../i18n/i18n';

export default {
  state: {},
  mutations: {},
  actions: {
    async saveNotificationToken ({ commit }, payload) {
      try {
        if (localStorage.getItem("sentFirebaseMessagingToken") !== payload.token) {
          if (payload.tokenId === null) {
            await axios.post(process.env.VUE_APP_URL + '/api/v1/notifications', payload).then((response) => {
              console.log('Successfully saved notification token!')

              localStorage.setItem('sentFirebaseMessagingToken', response.data.token ? response.data.token : '');
              localStorage.setItem('sentFirebaseMessagingId', response.data.id ? response.data.id : '');
            })
          } else {
            await axios.patch(process.env.VUE_APP_URL + '/api/v1/notifications/' + payload.tokenId, payload).then((response) => {
              console.log('Successfully update notification token!')

              localStorage.setItem('sentFirebaseMessagingToken', response.data.token ? response.data.token : '');
              localStorage.setItem('sentFirebaseMessagingId', response.data.id ? response.data.id : '');
            })
          }
        }
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
  getters: {}
}
