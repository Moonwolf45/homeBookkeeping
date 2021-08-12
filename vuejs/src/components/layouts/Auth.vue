<template>
  <v-app>
    <v-main class="auth">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="elevation-2 auth-block">
              <v-card-title class="auth-header">
                <h1 class="auth-title">
                  <div class="logo">
                    <span class="l l1"></span>
                    <span class="l l2"></span>
                    <span class="l l3"></span>
                    <span class="l l4"></span>
                    <span class="l l5"></span>
                  </div>
                  {{ $t('main.homeBookkeeping') }} </h1>
              </v-card-title>
              <v-card-subtitle>
                <v-tabs centered>
                  <v-tab @click="setLocale('ru')">
                    {{ $t('auth.language.ru') }}
                  </v-tab>

                  <v-tab @click="setLocale('en')">
                    {{ $t('auth.language.en') }}
                  </v-tab>
                </v-tabs>
              </v-card-subtitle>

              <router-view></router-view>

            </v-card>
          </v-flex>
        </v-layout>

        <v-snackbar :timeout="5000" :multi-line="true" :color="status" v-model="snackbar">
          {{ message }}

          <template>
            <v-btn text dark @click="closeError">
              {{ $t('main.close') }}
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {  }
  },
  computed: {
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
    closeError () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style scoped lang="scss">
  .auth {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: #5238e0;
    overflow-x: hidden;
    overflow-y: auto;
    justify-content: center;
    align-items: center;
  }

  .auth-block {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;

    .v-card__title+.v-card__subtitle {
      margin-top: 0;
    }

    .auth-header {
      text-align: center;
      border-bottom: 1px solid #52bcd3;
      justify-content: center;

      .auth-title {
        color: #97a4b1;
        padding: 4px;
        line-height: 30px;
        font-size: 26px;
        font-weight: 600;
        margin: 0;
      }
    }
  }
</style>
