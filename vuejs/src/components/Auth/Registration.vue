<template>
  <div class="auth-subtitle">
    <p class="text-center">{{ $t('auth.registrationText') }}</p>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field prepend-icon="account_box" :label="$t('form.username')" type="text" v-model="username" outlined />
        <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
                      v-model="email" required outlined />

        <v-autocomplete prepend-icon="access_time" v-model="timeZone" :items="arrTimeZone" chips dense
                        :label="$t('form.timZone')" :filter="filter" required></v-autocomplete>

        <v-text-field prepend-icon="lock" :label="$t('form.password')" required :counter="6" :rules="passwordRules"
                      :type="showPassword ? 'text' : 'password'" v-model="password" outlined
                      @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'visibility' : 'visibility_off'" />

        <v-text-field prepend-icon="lock" :label="$t('form.confirmPassword')" required :counter="6" outlined
                      :type="showConfirmPassword ? 'text' : 'password'" :rules="passwordConfirmRules"
                      v-model="confirmPassword" @click:append="showConfirmPassword = !showConfirmPassword"
                      :append-icon="showConfirmPassword ? 'visibility' : 'visibility_off'" />

        <vue-recaptcha ref="recaptcha" :sitekey="process.env.VUE_APP_KEY_SITE" :loadRecaptchaScript="true"
                       :language="this.$root.$i18n.locale" @verify="verifyRecaptcha" @expired="onCaptchaExpired" />

        <v-checkbox prepend-icon="login" type="checkbox" name="loginAfterRegistration" v-model="loginAfterRegistration"
                    :label="$t('form.loginAfterRegistration')" off-icon="check_box_outline_blank" on-icon="check_box" />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
        {{ $t('auth.registration') }}
      </v-btn>
    </v-card-actions>

    <div class="form-group">
      <p class="text-muted text-center">
        {{ $t('auth.ifAccount') }} <router-link :to="'/auth/login'">{{ $t('auth.enterNow') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { TIMEZONE } from '../../helper/timeZone';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      showPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
      timeZone: this.$jstz.determine().name(),
      arrTimeZone: TIMEZONE,
      loginAfterRegistration: true,
      valid: false,
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      passwordRules: [
        v => !!v || this.$i18n.t('form.errors.passwordRequired'),
        v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong')
      ],
      passwordConfirmRules: [
        v => !!v || this.$i18n.t('form.errors.passwordRequired'),
        v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong'),
        v => v === this.password || this.$i18n.t('form.errors.passwordNotMatch')
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    filter (item, queryText) {
      return (item.text || '').toLowerCase().indexOf((queryText || '').toLowerCase()) > -1
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          username: this.username,
          email: this.email,
          password: this.password,
          timeZone: this.timeZone
        }

        this.$store.dispatch('registerUser', user).then(() => {
          if (this.loginAfterRegistration) {
            this.$store.dispatch('loginUser', { email: this.email, password: this.password }).then(() => {
              this.$router.push('/')
            }).catch(() => {})
          } else {
            this.$router.push('/auth/login')
          }
        }).catch(() => {})
      }
    },
    verifyRecaptcha () {

    },
    onCaptchaExpired () {
      // this.$refs.recaptcha.reset()
    }
  },
  components: {
    VueRecaptcha
  }
}
</script>

<style scoped lang="scss">
.auth-subtitle {
  padding: 30px 50px;
}
</style>
