<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-card elevation="2" outlined v-if="!loading">
      <v-card-title class="bordered">
        {{ $t('records.event.title') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateFormatted" :label="$t('form.date')" dense v-bind="attrs" v-on="on"
                                @blur="date = parseDate(dateFormatted)" readonly outlined />
                </template>
                <v-date-picker ref="picker" v-model="date" :max="$moment().format('YYYY-MM-DD')" min="1970-01-01"
                               @change="saveDate" :first-day-of-week="this.$root.$i18n.locale === 'ru' ? 1 : 0"
                               :locale="this.$root.$i18n.locale">
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto" :return-value.sync="time">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="time" :label="$t('form.time')" dense v-bind="attrs" v-on="on" readonly outlined />
                </template>
                <v-time-picker format="24hr" v-if="menu2" v-model="time" @click:minute="$refs.menu2.save(time)">
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-select :items="profile" :label="$t('form.selectAccount')" :rules="billRules" dense outlined
                    item-text="name" item-value="id" v-model="bill_id" required></v-select>

          <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                    :item-text="categoryName" item-value="id" v-model="category_id" required></v-select>

          <v-radio-group v-model="currency" row :label="$t('form.currency')" :rules="currencyRules" dense>
            <v-radio v-for="item in currenciesUser" :key="item.CharCode" :label="item.CharCode" on-icon="radio_button_checked"
                     :value="item.CharCode" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-radio-group v-model="type" row :label="$t('form.type')" :rules="typeRules" dense>
            <v-radio v-for="item in types" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-text-field type="number" :label="$t('form.amount')" :rules="amountRules" v-model="amount" dense
                        required outlined />
          <v-text-field :label="$t('form.description')" maxlength="255" v-model="description" dense outlined />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      dateFormatted: this.saveDate(this.$moment().format('YYYY-MM-DD')),
      menu: false,
      time: this.$moment().format('HH:mm'),
      menu2: false,
      bill_id: null,
      category_id: null,
      billRules: [
        v => !!v || this.$i18n.t('form.errors.billRequired')
      ],
      categoryRules: [
        v => !!v || this.$i18n.t('form.errors.categoryRequired')
      ],
      currency: this.$store.getters.mainCurrency?.CharCode,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      type: 'income',
      types: [
        { type: 'income', label: this.$i18n.t('history.chart.income') },
        { type: 'outcome', label: this.$i18n.t('history.chart.outcome') }
      ],
      typeRules: [
        v => !!v || this.$i18n.t('form.errors.typeRequired'),
      ],
      amount: 0,
      convertAmount: 0,
      amountRules: [
        v => !!v || this.$i18n.t('form.errors.amountRequired'),
        v => (v > 0) || this.$i18n.t('form.errors.amountAboveZero'),
        v => this.checkAmount(this.currencies, this.type, v, this.bill_id, this.currency) || this.$i18n.t('form.errors.amountInsufficient')
      ],
      description: '',
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loadingCategory || this.$store.getters.loadingMainCurrency
          || this.$store.getters.loadingCurrencyUser || this.$store.getters.loadingCurrency
          || this.$store.getters.loadingProfile
    },
    category () {
      return this.$store.getters.category
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    currencies () {
      return this.$store.getters.currencies;
    },
    profile () {
      return this.$store.getters.profile
    },
  },
  watch: {
    date () {
      this.dateFormatted = this.saveDate(this.date)
    },
    bill_id () {
      this.$refs.form.validate()
    },
    currency () {
      this.$refs.form.validate()
    },
    type () {
      this.$refs.form.validate()
    }
  },
  methods: {
    checkAmount (allCurrencies, type, balance, bill_id, current_currency) {
      if (bill_id !== null) {
        let currencyArr = Object.values(allCurrencies.Valute);
        let infoBill = this.$store.getters.profileById(bill_id);

        if (infoBill.currency === current_currency) {
          this.convertAmount = parseFloat(balance)
        } else if (current_currency === 'RUB' && infoBill.currency !== 'RUB') {
          let currencyItem = currencyArr.find(item => item.CharCode === infoBill.currency)

          if (parseFloat(balance) > 0) {
            this.convertAmount = parseFloat(balance) / (currencyItem.Value / currencyItem.Nominal)
          } else {
            this.convertAmount = 0
          }
        } else if (current_currency !== 'RUB' && infoBill.currency === 'RUB') {
          let mainCurrencyObj = currencyArr.find(item => item.CharCode === current_currency)

          this.convertAmount = parseFloat(balance) * (mainCurrencyObj.Value / mainCurrencyObj.Nominal)
        } else {
          let mainCurrencyObj = currencyArr.find(item => item.CharCode === current_currency)
          let currencyItem = currencyArr.find(item => item.CharCode === infoBill.currency)

          if (parseFloat(balance) > 0) {
            this.convertAmount = (parseFloat(balance) * (mainCurrencyObj.Value / mainCurrencyObj.Nominal) / (currencyItem.Value / currencyItem.Nominal))
          } else {
            this.convertAmount = 0
          }
        }

        if (type === 'outcome') {
          return this.convertAmount <= infoBill.balance
        } else {
          return true
        }
      }

      return false
    },
    categoryName (item) {
      return this.$i18n.t(item.title)
    },
    saveDate (date) {
      if (!date) return null

      const momentDate = this.$moment(date, 'YYYY-MM-DD')
      return momentDate.format('DD.MM.YYYY')
    },
    parseDate (date) {
      if (!date) return null

      const momentDate = this.$moment(date, 'DD.MM.YYYY')
      return momentDate.format('YYYY-MM-DD')
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Event = {
          user_id: this.$store.getters.user.id,
          category_id: this.category_id,
          bill_id: this.bill_id,
          currency: this.currency,
          type: this.type,
          amount: parseFloat(this.amount),
          convertAmount: parseFloat(this.convertAmount).toFixed(2),
          date: this.$moment(this.date + ' ' + this.time).utc().format('X'),
          description: this.description
        }

        this.$store.dispatch('addEvent', Event).then(() => {
          this.$refs.form.reset()

          this.date = this.$moment().format('YYYY-MM-DD')
          this.dateFormatted = this.saveDate(this.$moment().format('YYYY-MM-DD'))
          this.time = this.$moment().format('HH:mm')

          this.bill_id = null
          this.category_id = null
          this.currency = this.$store.getters.mainCurrency?.CharCode || 'RUB'
          this.type = 'income'
          this.amount = 0
          this.convertAmount = 0
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordered {
  border-bottom: 1px solid #d7dde4;
  margin-bottom: 16px;
}
</style>
