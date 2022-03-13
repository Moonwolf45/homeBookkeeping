<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('settings.name') }}
      </h3>
    </div>

    <v-skeleton-loader  class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-row v-if="!loading">
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field prepend-icon="account_box" :label="$t('form.username')" type="text" v-model="username" outlined />
          <v-text-field prepend-icon="contact_mail" :label="$t('form.email')" type="email" :rules="emailRules"
            v-model="email" required outlined />

          <v-select prepend-icon="currency_exchange" required v-model="currenciesValue" :items="currenciesAll" multiple chips
                    :label="$t('form.available_currencies')" dense :item-text="currencyName" item-value="CharCode"
                    :item-disabled="currencyDisable"></v-select>

          <v-radio-group prepend-icon="price_change" v-model="currency" row :label="$t('form.main_currency')"
            :rules="currencyRules" dense>
            <v-radio v-for="item in currenciesValue" :key="item" :label="item" on-icon="radio_button_checked"
                     :value="item" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>
          <span class="text--secondary">{{ $t('form.main_currency_help') }}</span>

          <v-autocomplete prepend-icon="access_time" required v-model="timeZone" :items="arrTimeZone" chips dense
                    :label="$t('form.timZone')" class="mt-4" :filter="filter"></v-autocomplete>

          <v-checkbox prepend-icon="restore_page" type="checkbox" name="loginAfterRegistration" v-model="changePassword"
                      :label="$t('form.changePassword')" off-icon="check_box_outline_blank" on-icon="check_box" />

          <div v-if="changePassword">
            <v-text-field prepend-icon="lock" :label="$t('form.currentPassword')" required :counter="6" :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'" v-model="password" outlined
              @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'visibility' : 'visibility_off'" />

            <v-text-field prepend-icon="lock" :label="$t('form.newPassword')" required :counter="6" :rules="newPasswordRules"
              :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" outlined
              @click:append="showNewPassword = !showNewPassword" :append-icon="showNewPassword ? 'visibility' : 'visibility_off'" />

            <v-text-field prepend-icon="lock" :label="$t('form.confirmPassword')" required :counter="6" outlined
              :type="showConfirmPassword ? 'text' : 'password'" :rules="passwordConfirmRules"
              v-model="confirmPassword" @click:append="showConfirmPassword = !showConfirmPassword"
              :append-icon="showConfirmPassword ? 'visibility' : 'visibility_off'" />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.edit') }}
        </v-btn>
      </v-card-actions>
    </v-row>
  </div>
</template>

<script>
import { TIMEZONE } from '../../../helper/timeZone';

export default {
  data () {
    return {
      valid: false,
      username: this.$store.getters.user?.username ?? '',
      email: this.$store.getters.user?.email,
      emailRules: [
        v => !!v || this.$i18n.t('form.errors.emailRequired'),
        v => /.+@.+/.test(v) || this.$i18n.t('form.errors.emailCorrect')
      ],
      currency: this.$store.getters.mainCurrency?.CharCode,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      currenciesValue: [],
      timeZone: this.$store.getters.user?.timeZone ?? 'Europe/Moscow',
      changePassword: false,
      password: '',
      showPassword: false,
      newPassword: '',
      showNewPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
      passwordRules: [],
      newPasswordRules: [],
      passwordConfirmRules: []
    }
  },
  mounted () {
    this.getCurrenciesValue()
  },
  computed: {
    loading () {
      return this.$store.getters.loadingProfile || this.$store.getters.user === null
          || this.$store.getters.loadingCurrencyAll || this.$store.getters.loadingCurrencyUser
    },
    currenciesAll () {
      return this.$store.getters.currenciesAll
    },
    user () {
      return this.$store.getters.user
    },
    arrTimeZone () {
      const timeZoneSort = TIMEZONE;

      timeZoneSort.sort(function (a, b) {
        let a_num = a.text.slice(1, 7)
        a_num = a_num.replace(':', '.')
        let p = a_num[0] === '+' ? 1 : 0
        a_num = Number(a_num) + p

        let b_num = b.text.slice(1, 7)
        b_num = b_num.replace(':', '.')
        p = b_num[0] === '+' ? 1 : 0
        b_num = Number(b_num) + p

        if (a_num > b_num) {
          return 1
        }
        if (a_num < b_num) {
          return -1
        }
      });

      return timeZoneSort
    }
  },
  watch: {
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
    currencyName (item) {
      return item.CharCode + ' — ' + this.$i18n.t(item.Name)
    },
    currencyDisable (item) {
      return item.CharCode === 'RUB'
    },
    getCurrenciesValue () {
      this.$store.getters.currenciesUser?.forEach((currency) => {
        this.currenciesValue.push(currency.CharCode)
      })
    },
    filter (item, queryText) {
      return (item.text || '').toLowerCase().indexOf((queryText || '').toLowerCase()) > -1
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Settings = {
          user_id: this.$store.getters.user?.id,
          username: this.username,
          email: this.email,
          currency: this.currency,
          currenciesUser: this.currenciesValue,
          timeZone: this.timeZone,
          changePassword: this.changePassword,
          password: this.password,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
        }

        this.$store.dispatch('updateUser', Settings).then(() => {}).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.title-block {
  overflow: hidden;
  padding-bottom: 15px;
  margin: 0 0 30px 0;
  border-bottom: 1px solid #d7dde4;

  .main_title {
    float: left;
    font-size: 1.45rem;
    line-height: 1.1;
    font-weight: 600;
    margin: 0;
    color: #4f5f6f;
  }
}
.bordered {
  border-bottom: 1px solid #d7dde4;
  margin-bottom: 16px;
}
</style>
