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
        <currencyCard></currencyCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BillCard from './../../Main/Overview/BillCard';
import CurrencyCard from './../../Main/Overview/CurrencyCard';

export default {
  data () {
    return {}
  },
  methods: {
    onRefresh () {
      this.getCurrency()
    },
    getCurrency () {
      this.$store.dispatch('getCurrency').then(() => {}).catch(() => {})
    }
  },
  components: {
    billCard: BillCard,
    currencyCard: CurrencyCard
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
</style>
