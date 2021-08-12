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

            <tbody>
              <tr>
                <td>RUB</td>
                <td>{{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(1) }}</td>
                <td>{{ this.$moment(this.currency.PreviousDate).format('DD.MM.YYYY HH:mm') }}</td>
              </tr>

              <tr>
                <td>{{ this.currency.Valute.USD.CharCode }}</td>
                <td>{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.currency.Valute.USD.Value) }}</td>
                <td>{{ this.$moment(this.currency.PreviousDate).format('DD.MM.YYYY HH:mm') }}</td>
              </tr>

              <tr>
                <td>{{ this.currency.Valute.EUR.CharCode }}</td>
                <td>{{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(this.currency.Valute.EUR.Value) }}</td>
                <td>{{ this.$moment(this.currency.PreviousDate).format('DD.MM.YYYY HH:mm') }}</td>
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
    currency () {
      return this.$store.getters.currency
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
