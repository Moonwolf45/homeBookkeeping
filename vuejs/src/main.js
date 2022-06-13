import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment-timezone';
import jstz from 'jstimezonedetect';
import JsonExcel from 'vue-json-excel';
import router from './router'
import store from './store'
import BookkeepingConvertPlugin from './plugins/bookkeepingConvertPlugin';

import { i18n } from './i18n/i18n'

import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import App from './App'
import Main from './components/layouts/Main';
import Auth from './components/layouts/Auth';
import Empty from './components/layouts/Empty';

Vue.component('main-layout', Main);
Vue.component('auth-layout', Auth);
Vue.component('empty-layout', Empty);
Vue.component("downloadExcel", JsonExcel);

Vue.use(Vuetify)
Vue.use(BookkeepingConvertPlugin);

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.prototype.$moment = moment;
Vue.prototype.$jstz = jstz;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js', {
    scope: 'firebase-cloud-messaging-push-scope' }).then(() => {
  }).catch((err) => {
    console.log(err)
  })
}

new Vue({
  vuetify: new Vuetify(),
  i18n,
  router,
  store,
  render: h => h(App),
  created () {
    this.$store.dispatch('autoLoginUser').then(() => {}).catch(() => {})
  }
}).$mount('#app')
