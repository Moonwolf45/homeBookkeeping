<template>
  <v-app>
    <v-main class="auth">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>

            <router-view></router-view>

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
  //background-color: #5238e0;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
}
</style>
