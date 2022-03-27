<template>
  <v-app>
    <v-navigation-drawer app dark color="#3a4651" :permanent="notMobile" :width="sidebarWidth" touchless v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <div class="logo">
              <span class="l l1"></span>
              <span class="l l2"></span>
              <span class="l l3"></span>
              <span class="l l4"></span>
              <span class="l l5"></span>
            </div>

            {{ $t('main.homeBookkeeping') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item-group>
          <v-list-item :to="item.path" v-for="(item, i) in menu" :key="i" role="link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="language">
            <template v-slot:activator>
              <v-list-item-title>{{ $t('main.language') }}</v-list-item-title>
            </template>

            <v-list-item @click="setLocale('ru')">
              <v-list-item-content>
                <v-list-item-title>{{ $t('main.russian') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="setLocale('en')">
              <v-list-item-content>
                <v-list-item-title>{{ $t('main.english') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="content">
      <v-toolbar color="#d7dde4">
        <v-app-bar-nav-icon v-if="!notMobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <div class="header-block header-block-nav">
          {{ $t('main.hello', { name: username }) }}
        </div>

        <v-btn @click="onLogout">
          <v-icon left>exit_to_app</v-icon>

          {{ $t('main.logout') }}
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <router-view></router-view>
      </v-container>

      <v-snackbar :timeout="5000" :multi-line="true" :color="status" v-model="snackbar">
        {{ message }}

        <template>
          <v-btn text dark @click="closeError">
            {{ $t('main.close') }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { initializeApp } from 'firebase/app'
import { getMessaging, onMessage, getToken, isSupported } from "firebase/messaging";

export default {
  data () {
    return {
      menu: [
        { path: '/', name: 'main.bill', icon: 'account_balance_wallet' },
        { path: '/history', name: 'main.history', icon: 'history' },
        { path: '/planning', name: 'main.planning', icon: 'business_center' },
        { path: '/records', name: 'main.recording', icon: 'add_box' },
        { path: '/settings', name: 'main.settings', icon: 'settings' }
      ],
      drawer: document.documentElement.clientWidth >= 769,
      notMobile: document.documentElement.clientWidth >= 769,
      sidebarWidth: this.getWidthSidebar()
    }
  },
  mounted () {
    this.getAllNeedData()

    try {
      const firebaseApp = initializeApp({
        apiKey: "AIzaSyBLfIKBKNQ-v4vOdCMnDH28FHbo9Pn_qn4",
        authDomain: "homebookkeeping-a1eb2.firebaseapp.com",
        projectId: "homebookkeeping-a1eb2",
        storageBucket: "homebookkeeping-a1eb2.appspot.com",
        messagingSenderId: "930154418965",
        appId: "1:930154418965:web:0be85a050dbfba00460f1c",
        measurementId: "G-DB4P6TCFZM"
      });
      const messaging = getMessaging(firebaseApp)

      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          getToken(messaging, {
            vapidKey: "BINrS5LHig3lXbq2JJNujbUN45qWUOAQi9j7-iJWNAIaU707s6IEjml3YKzDb-va9x_wfnTx-QgvewcTHcZ7eWk",
          }).then((token) => {
            this.saveNotificationToken(token)
          })
        } else {
          console.log('Unable to get permission to notify.');
        }
      });

      if ("Notification" in window && isSupported()) {
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);

          const data = { ...payload.notification, ...payload.data };
          const notificationTitle = data.title;
          const notificationOptions = {
            body: data.body,
            icon: data.icon,
            image: data.image,
            requireInteraction: true,
            click_action: data.click_action,
            data
          };

          new Notification(notificationTitle, notificationOptions);
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    username () {
      return this.$store.getters.user.username === '' ? this.$i18n.t('main.user') + ' #'
          + this.$store.getters.user.id : this.$store.getters.user.username
    },
    snackbar: {
      get: function () {
        return this.$store.getters.error !== null
      },
      set: function () {
        return this.$store.getters.error !== null
      }
    },
    message () {
      return this.$store.getters.error
    },
    status () {
      return this.$store.getters.status
    }
  },
  methods: {
    beforeMount() {
      const locale = localStorage.getItem('locale') || 'ru';
      this.$root.$i18n.locale = locale;
      this.$moment.locale(locale);
    },
    setLocale(locale) {
      this.$root.$i18n.locale = locale;
      this.$moment.locale(locale);
      localStorage.setItem('locale', locale);
    },
    onLogout () {
      this.$store.dispatch('logoutUser')
      this.$router.push('/auth/login')
    },
    closeError () {
      this.$store.dispatch('clearError')
    },
    getAllNeedData () {
      if (this.$store.getters.currenciesAll === null && this.$store.getters.loadingCurrencyAll === false) {
        this.$store.dispatch('getAllCurrency').then(() => {}).catch(() => {});
      }
      if (this.$store.getters.user !== null) {
        if (this.$store.getters.currenciesUser === null && this.$store.getters.loadingCurrencyUser === false
            && this.$store.getters.loadingMainCurrency === false) {
          this.$store.dispatch('getCurrencyUser', this.$store.getters.user.id).then(() => {}).catch(() => {});
        }
        if (this.$store.getters.currencies === null && this.$store.getters.loadingCurrency === false) {
          this.$store.dispatch('getCurrency').then(() => {}).catch(() => {});
        }
        if (this.$store.getters.profile === null && this.$store.getters.loadingProfile === false) {
          this.$store.dispatch('getProfile', this.$store.getters.user.id).then(() => {}).catch(() => {});
        }
        if (this.$store.getters.category === null && this.$store.getters.loadingCategory === false) {
          this.$store.dispatch('getCategory', this.$store.getters.user.id).then(() => {}).catch(() => {});
        }
        if ((this.$store.getters.activePlanningEvents === null || this.$store.getters.nonActivePlanningEvents === null)
            && this.$store.getters.loadingPlanningEvents === false) {
          this.$store.dispatch('getAllPlanningEvents').then(() => {}).catch(() => {});
        }
      }
    },
    saveNotificationToken(token) {
      const tokenBlock = {
        user_id: this.$store.getters.user.id,
        token: token,
        tokenId: localStorage.getItem('sentFirebaseMessagingTokenId')
      }

      this.$store.dispatch('saveNotificationToken', tokenBlock).then(() => {}).catch(() => {});
    },
    getWidthSidebar() {
      if (document.documentElement.clientWidth <= 1024) {
        return 256
      }

      return 310
    }
  }
}
</script>

<style scoped lang="scss">
  .v-application {
    .title {
      font-size: 1.2rem!important;
    }
  }
  .header-block {
    padding: .5rem 15px;
  }
  .header-block-nav {
    margin-left: auto;
    padding: 0 15px;
    font-weight: 700;
    color: #4f5f6f;
  }
  .content {
    background-color: #f0f3f6;
    box-shadow: 0 0 3px #ccc;
    transition: left 0.3s ease;
  }
  .container {
    padding: 55px 80px 100px 20px;
  }
</style>
