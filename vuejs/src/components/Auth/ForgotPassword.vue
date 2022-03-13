<template>
  <div class="auth-subtitle">
    <p class="text-center">{{ $t('auth.passwordRecovery') }}</p>

    <template v-if="!changePass">
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
                        v-model="email" required outlined />

          <div class="v-text-field__details" v-if="notEmail">
            <div class="v-messages theme--light error--text" role="alert">
              <div class="v-messages__wrapper">
                <div class="v-messages__message">{{ notEmailMessage }}</div>
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('auth.change') }}
        </v-btn>
      </v-card-actions>

      <div class="form-group">
        <p class="text-muted text-center">
          <router-link :to="'/auth/login'">{{ $t('all.cancel') }}</router-link>
        </p>
      </div>
    </template>
    <template v-else>
      <v-card-text>
        <div class="text--primary">
          {{ $t('auth.changePasswordSuccess.message') }}
        </div>
      </v-card-text>
    </template>
  </div>
</template>

<script>
import { debounce } from '../../helper'

export default {
  data () {
    return {
      email: '',
      valid: false,
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      changePass: false,
      notEmail: false,
      notEmailMessage: null
    }
  },
  created () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setMessage', { status: 'error', message: this.$i18n.t('auth.errors.noLogin') })
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    email: debounce(function () {
      this.changePass = false;
      this.notEmail = false;
      this.notEmailMessage = null;

      this.$store.dispatch('isUserEmailExists', { email: this.email }).then((res) => {
        if (!res.data.result) {
          this.notEmail = true
          this.notEmailMessage = this.$i18n.t(res.data.message)
          this.valid = false
        } else {
          this.valid = true
        }
      }).catch(() => {})
    }, 1000)
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          language: this.$root.$i18n.locale
        }

        this.$store.dispatch('forgotPasswordUser', user).then((res) => {
          if (res.result === 'ok') {
            this.changePass = true
            debounce(function () {
              this.$router.push('/')
            }, 2000)
          }
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .auth-subtitle {
    padding: 30px 50px;
  }
</style>
