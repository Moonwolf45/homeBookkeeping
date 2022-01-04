<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loader">
    </v-skeleton-loader>
    <v-card elevation="2" outlined v-if="!loader">
      <v-card-text>
        <v-card-title>
          <h4 class="title">{{ $t('overview.exchangeRates') }}</h4>
        </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th>{{ $t('overview.currency') }}</th>
                <th>{{ $t('overview.course') }}</th>
                <th>{{ $t('overview.date') }}</th>
              </tr>
            </thead>

            <tbody v-if="currencies !== null && currenciesUser !== null">
              <tr v-for="currencyItem in currenciesUser" :key="currencyItem.id">
                <td>{{ $t(currencyItem.Name) }}</td>
                <td v-if="currencyItem.CharCode === 'RUB'">
                  {{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB',
                    minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(1) }}
                </td>
                <td v-else>
                  {{ new Intl.NumberFormat(currencyItem.locale, { style: 'currency', currency: currencyItem.CharCode,
                    minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currencies.Valute[currencyItem.CharCode].Value / currencies.Valute[currencyItem.CharCode].Nominal)
                  }}
                </td>
                <td>{{ $moment(currencies.Date).format('DD.MM.YYYY HH:mm') }}</td>
              </tr>
            </tbody>
          </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['loader'],
  data () {
    return {}
  },
  computed: {
    currencies () {
      return this.$store.getters.currencies
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser
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
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0.75rem;
  line-height: 1.5;
  font-size: 15px;
}
</style>
