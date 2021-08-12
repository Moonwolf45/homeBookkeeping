<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loading">
    </v-skeleton-loader>
    <v-card elevation="2" outlined v-if="!loading">
      <v-card-text>
        <v-card-title>
          <h4 class="title">{{ $t('overview.balance') }}</h4>
        </v-card-title>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <div class="stat-icon">&#8381;</div>
              <div class="stat">
                <div class="value">{{ new Intl.NumberFormat('ru-RU', { style: 'decimal', currency: 'RUB',
                  minimumSignificantDigits: 3 }).format(profile.balanceRUB) }}</div>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear value="100" color="#008000" height="2"></v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <div class="stat-icon">&#36;</div>
              <div class="stat">
                <div class="value">{{ new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD',
                  minimumSignificantDigits: 3 }).format(profile.balanceUSD) }}</div>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear value="100" color="#008000" height="2"></v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <div class="stat-icon">&euro;</div>
              <div class="stat">
                <div class="value">{{ new Intl.NumberFormat('fr-FR', { style: 'decimal', currency: 'EUR',
                  minimumSignificantDigits: 3 }).format(profile.balanceEUR) }}</div>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear value="100" color="#008000" height="2"></v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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
    loading () {
      return this.$store.getters.profile === null
    },
    profile () {
      return this.$store.getters.profile
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
.stat-icon {
  color: #52bcd3;
  display: inline-block;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  width: 50px;
}
.stat {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;

  .value {
    font-size: 1.3vw;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    color: #4f5f6f;
  }
}
</style>
