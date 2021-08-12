<template>
  <v-app>
    <v-navigation-drawer app permanent dark color="#3a4651" width="320">
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
    }
  }
}
</script>

<style scoped lang="scss">
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
