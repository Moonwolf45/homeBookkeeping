<template>
  <div class="auth-subtitle">
    <p class="text-center">{{ $t('auth.enterText') }}</p>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
                      v-model="email" required outlined />
        <v-text-field prepend-icon="lock" :label="$t('form.password')" :type="showPassword ? 'text' : 'password'"
                      :counter="6" :rules="passwordRules" v-model="password" outlined
                      @click:append="showPassword = !showPassword" required
                      :append-icon="showPassword ? 'visibility' : 'visibility_off'" />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
        {{ $t('auth.login') }}
      </v-btn>
    </v-card-actions>

    <div class="form-group">
      <p class="text-muted text-center">
        {{ $t('auth.noAccount') }} <router-link :to="'/auth/registration'">{{ $t('auth.registerNow') }}</router-link>
      </p>
      <p class="text-muted text-center">
        {{ $t('auth.forgotPassword') }} <router-link :to="'/auth/forgot-password'">{{ $t('auth.change') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      showPassword: false,
      valid: false,
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      passwordRules: [
        v => !!v || this.$i18n.t('form.errors.passwordRequired'),
        v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong')
      ]
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
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        }

        this.$store.dispatch('loginUser', user).then(() => {
          this.$router.push('/')
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
