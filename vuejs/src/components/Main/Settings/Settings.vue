<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('sittings.name') }}
      </h3>
    </div>

    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-row v-if="!loading">
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field prepend-icon="account_box" :label="$t('form.username')" type="text" v-model="username" />
          <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
                        v-model="email" required />

          <v-radio-group prepend-icon="price_change" v-model="currency" row :label="$t('form.currency')" :rules="currencyRules" dense outlined>
            <v-radio v-for="item in currencies" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-checkbox prepend-icon="restore_page" type="checkbox" name="loginAfterRegistration" v-model="changePassword"
                      :label="$t('form.changePassword')" off-icon="check_box_outline_blank" on-icon="check_box" />

          <div v-if="changePassword">
            <v-text-field prepend-icon="lock" :label="$t('form.password')" required :counter="6" :rules="passwordRules"
                          :type="showPassword ? 'text' : 'password'" v-model="password"
                          @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'visibility' : 'visibility_off'" />
            <v-text-field prepend-icon="lock" :label="$t('form.confirmPassword')" required :counter="6"
                          :type="showConfirmPassword ? 'text' : 'password'" :rules="passwordConfirmRules"
                          v-model="confirmPassword" @click:append="showConfirmPassword = !showConfirmPassword"
                          :append-icon="showConfirmPassword ? 'visibility' : 'visibility_off'" />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.add') }}
        </v-btn>
      </v-card-actions>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      email: '',
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      currency: 'rub',
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      currencies: [
        { type: 'rub', label: 'RUB' },
        { type: 'usd', label: 'USD' },
        { type: 'eur', label: 'EUR' }
      ],
      changePassword: false,
      password: '',
      showPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
      passwordRules: [],
      passwordConfirmRules: [],
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.profile === null && this.$store.getters.user === null
    },
  },
  watch: {
    changePassword () {
      if (this.changePassword) {
        this.passwordRules = [
          v => !!v || this.$i18n.t('form.errors.passwordRequired'),
          v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong')
        ]
        this.passwordConfirmRules = [
          v => !!v || this.$i18n.t('form.errors.passwordRequired'),
          v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong'),
          v => v === this.password || this.$i18n.t('form.errors.passwordNotMatch')
        ]
      } else {
        this.passwordRules = []
        this.passwordConfirmRules = []
      }
    },
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Settings = {
          user_id: this.$store.getters.user.id,
          username: this.username,
          email: this.email,
          currency: this.currency,
          password: this.password,
          confirmPassword: this.confirmPassword,
        }

        console.log(Settings);
        // this.$store.dispatch('addEvent', Settings).then(() => {}).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.main_title {
  float: left;
  font-size: 1.45rem;
  line-height: 1.1;
  font-weight: 600;
  margin: 0;
  color: #4f5f6f;
}
.bordered {
  border-bottom: 1px solid #d7dde4;
  margin-bottom: 16px;
}
</style>
