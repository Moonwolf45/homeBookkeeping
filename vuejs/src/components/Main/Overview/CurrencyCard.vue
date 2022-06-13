<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loader">
    </v-skeleton-loader>
    <v-card elevation="2" outlined v-if="!loader">
      <v-card-text>
        <v-card-title>
          <h4 class="title">{{ $t('overview.exchangeRates') }}</h4>
        </v-card-title>

        <div class="card-content">
          <v-simple-table>
            <thead>
              <tr>
                <th>{{ $t('overview.currency') }}</th>
                <th>{{ $t('overview.course') }}</th>
                <th>{{ $t('overview.date') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="currencyItem in currenciesUser" :key="currencyItem.id">
                <template v-if="currencyItem.CharCode !== 'RUB'">
                  <td>{{ $t(currencyItem.Name) }}</td>
                  <td>
                    {{ new Intl.NumberFormat(mainCurrency !== null ? mainCurrency.locale : 'ru-RU', { style: 'currency',
                    currency: mainCurrency !== null ? mainCurrency.CharCode : 'RUB', minimumFractionDigits: 2,
                    maximumFractionDigits: 2 }).format(getCurrencyFormat(currencyItem.CharCode))
                    }}
                  </td>
                  <td>{{ $moment(currencies.PreviousDate).format('DD.MM.YYYY HH:mm') }}</td>
                </template>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    loader () {
      return this.$store.getters.loadingCurrency || this.$store.getters.loadingCurrencyUser
        || this.$store.getters.loadingMainCurrency
    },
    currencies () {
      return this.$store.getters.currencies
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser
    },
    mainCurrency () {
      return this.$store.getters.mainCurrency
    }
  },
  methods: {
    getCurrencyFormat (code) {
      let currencyArr = Object.values(this.currencies?.Valute);
      let currency = currencyArr.find(item => item.CharCode === code)

      if (this.mainCurrency?.CharCode === 'RUB') {
        return (currency.Value / currency.Nominal)
      }

      let mainCurrencyObj = currencyArr.find(item => item.CharCode === this.mainCurrency?.CharCode)

      return (currency.Value / currency.Nominal) / (mainCurrencyObj.Value / mainCurrencyObj.Nominal)
    }
  }
}
</script>

<style scoped lang="scss">
.v-card__title {
  .title {
    font-size: 1.1rem !important;
    color: #4f5f6f;
    line-height: 1.1;
    font-weight: 600;
  }
}
.card-content {
  max-height: 500px;
  overflow-y: auto;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0.75rem;
  line-height: 1.5;
  font-size: 15px;
}
</style>
