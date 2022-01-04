<template>
  <div>
    <div class="title-block">
      <h3 class="main_title">
        {{ $t('overview.name') }}
      </h3>
      <div class="text-right">
        <v-btn dark color="teal" @click="onRefresh">
          <v-icon dark>
            refresh
          </v-icon>
        </v-btn>
      </div>
    </div>

    <v-row>
      <v-col class="col-md-6 col-xs-12">
        <billCard></billCard>
      </v-col>

      <v-col class="col-md-6 col-xs-12">
        <currencyCard :loader="currencyLoader"></currencyCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BillCard from '@/components/Main/Overview/BillCard';
import CurrencyCard from '@/components/Main/Overview/CurrencyCard';

export default {
  data () {
    return {
      loading: true,
      currencyLoader: false
    }
  },
  mounted () {
    this.getProfile()
  },
  methods: {
    onRefresh () {
      this.getCurrency(true)
    },
    getProfile () {
      this.$store.dispatch('getProfile', this.$store.getters.user.id).then(() => {}).catch(() => {})
    },
    getCurrency (load) {
      this.currencyLoader = load

      this.$store.dispatch('getCurrency').then(() => {
        this.currencyLoader = false
      }).catch(() => {})
    }
  },
  components: {
    billCard: BillCard,
    currencyCard: CurrencyCard
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
</style>
