<template>
  <div>
    <slot></slot>

    <v-card-text>
      <h3 class="text-h5 mb-2">
        {{ getName(event) }}

        <v-btn icon @click="closeModal" v-if="hiddenButton" style="margin-left:auto">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </h3>
      <div class="blue--text mb-2">
        {{ $t('history.table.bill') }}: {{ this.$store.getters.profileById(event.bill_id).name }}
      </div>
      <div class="blue--text subheading font-weight-bold">
        {{ $t('history.table.category') }}: {{ $t(this.$store.getters.categoryById(event.category_id).title) }}
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-row class="text-left" tag="v-card-text">
      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
        {{ $t('history.table.type') }}
      </v-col>
      <v-col cols="5">
        <span :class="getColor(event.type)">
          {{ event.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
        </span>
      </v-col>
      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
        {{ $t('history.table.amount') }}
      </v-col>
      <v-col cols="5">
        <span class="stat-icon" v-html="$getSymbolCurrency(event.currency)"></span>
        {{ new Intl.NumberFormat(currenciesUser.filter((cur) => { cur.CharCode === event.currency }).locale, {
          style: 'decimal', currency: event.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(event.amount) }}

        <template v-if="event.currency !== currencyDefault" class="two-currency"> ~
          <span class="stat-icon" v-html="$getSymbolCurrency(currencyDefault)"></span>
          {{ new Intl.NumberFormat(currentLocale, { style: 'decimal', currency: currencyDefault, minimumFractionDigits: 2,
            maximumFractionDigits: 2 }).format($getCurrencyBalance(currencies, event.amount, event.currency, currencyDefault)) }}
        </template>
      </v-col>
      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
        {{ $t('history.table.description') }}
      </v-col>
      <v-col cols="5">{{ event.active === 1 ? $t('form.status_on') : $t('form.status_off') }}</v-col>

      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
        {{ $t('form.status') }}
      </v-col>
      <v-col cols="5">{{ event.description }}</v-col>

      <v-row v-if="!hiddenButton">
        <v-btn class="mr-2" dark color="teal" @click="editPlanningEvent(event)">
          {{ $t('all.edit') }}
        </v-btn>
        <v-btn class="mr-2" dark color="teal" @click="deletePlanningEvent(event.id)">
          {{ $t('all.delete') }}
        </v-btn>
        <template v-if="event.status === 2">
          <v-btn class="mt-2" dark color="teal" @click="writeInEvent(event)">
            {{ $t('all.writeInEvent') }}
          </v-btn>
        </template>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import { i18n } from '../../i18n/i18n';

export default {
  name: 'ViewEventComponent',
  props: {
    event: {
      type: Object
    },
    hiddenButton: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      convertAmount: 0
    }
  },
  computed: {
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    currencyDefault () {
      return this.$store.getters.mainCurrency?.CharCode
    },
    currentLocale () {
      return this.$store.getters.mainCurrency?.locale
    },
    currencies () {
      return this.$store.getters.currencies;
    },
  },
  methods: {
    closeModal () {
      this.$emit('callCloseModal');
    },
    getColor (type) {
      if (type === 'income') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    },
    getName (event) {
      return (event.type === 'income' ? i18n.t('history.chart.income') : i18n.t('history.chart.outcome'))
        + ' ' + i18n.t('planning.from') + ' ' + event.date;
    },
    editPlanningEvent (currentEvent) {
      this.$emit('callEditPlanningEvent', currentEvent);
    },
    writeInEvent (currentEvent) {
      if (this.checkAmount(this.currencies, currentEvent.type, currentEvent.amount, currentEvent.bill_id,
                           currentEvent.currency)) {
        currentEvent.convertAmount = this.convertAmount;
        this.$emit('callWriteInEvent', currentEvent.id);
      } else {
        this.$store.dispatch('setMessage', { status: 'error', message: i18n.t('form.errors.amountInsufficient') })
      }
    },
    deletePlanningEvent (id) {
      this.$emit('callDeletePlanningEvent', id);
    },
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
    }
  }
}
</script>

<style scoped>

</style>
