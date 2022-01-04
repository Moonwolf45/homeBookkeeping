<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('sittings.name') }}
      </h3>
    </div>

    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-row v-if="!loading && currenciesValue.length !== 0 && currenciesItems.length !== 0">
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field prepend-icon="account_box" :label="$t('form.username')" type="text" v-model="username" />
          <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
            v-model="email" required />

          <v-select prepend-icon="currency_exchange" v-model="currenciesValue" :items="currenciesItems" multiple attach
                    chips :label="$t('form.available_currencies')" dense></v-select>

          <v-radio-group prepend-icon="price_change" v-model="currency" row :label="$t('form.main_currency')"
            :rules="currencyRules" dense outlined>
            <v-radio v-for="item in currenciesValue" :key="item" :label="item" on-icon="radio_button_checked"
                     :value="item" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>
          <span class="text--secondary">{{ $t('form.main_currency_help') }}</span>

          <v-checkbox prepend-icon="restore_page" type="checkbox" name="loginAfterRegistration" v-model="changePassword"
                      :label="$t('form.changePassword')" off-icon="check_box_outline_blank" on-icon="check_box" />

          <div v-if="changePassword">
            <v-text-field prepend-icon="lock" :label="$t('form.currentPassword')" required :counter="6" :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'" v-model="password"
              @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'visibility' : 'visibility_off'" />

            <v-text-field prepend-icon="lock" :label="$t('form.newPassword')" required :counter="6" :rules="newPasswordRules"
              :type="showNewPassword ? 'text' : 'password'" v-model="newPassword"
              @click:append="showNewPassword = !showNewPassword" :append-icon="showNewPassword ? 'visibility' : 'visibility_off'" />

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
      username: this.$store.getters.user.username,
      email: this.$store.getters.user.email,
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      currency: null,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      currenciesItems: [],
      currenciesValue: [],
      changePassword: false,
      password: '',
      showPassword: false,
      newPassword: '',
      showNewPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
      passwordRules: [],
      newPasswordRules: [],
      passwordConfirmRules: [],
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.profile === null && this.$store.getters.user === null
    },
    mainCurrency () {
      return this.$store.getters.mainCurrency
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser
    },
    currenciesAll () {
      return this.$store.getters.currenciesAll
    },
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    mainCurrency () {
      this.currency = this.mainCurrency.CharCode
    },
    currenciesAll () {
      this.currenciesAll.forEach((currency) => {
          this.currenciesItems.push({ text: currency.CharCode, value: currency.CharCode, disabled: currency.CharCode === 'RUB' })
      })
    },
    currenciesUser () {
      this.currenciesUser.forEach((currency) => {
        this.currenciesValue.push(currency.CharCode)
      })
    },
    changePassword () {
      if (this.changePassword) {
        this.passwordRules = [
          v => !!v || this.$i18n.t('form.errors.passwordRequired'),
          v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong')
        ]
        this.newPasswordRules = [
          v => !!v || this.$i18n.t('form.errors.passwordRequired'),
          v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong')
        ]
        this.passwordConfirmRules = [
          v => !!v || this.$i18n.t('form.errors.passwordRequired'),
          v => (v && v.length >= 6) || this.$i18n.t('form.errors.passwordLong'),
          v => v === this.newPassword || this.$i18n.t('form.errors.passwordNotMatch')
        ]
      } else {
        this.passwordRules = []
        this.newPasswordRules = []
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
          changePassword: this.changePassword,
          password: this.password,
          newPassword: this.newPassword,
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
