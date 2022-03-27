<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('planning.name') }}
      </h3>
      <div class="text-right">
        <v-btn dark color="teal" @click="addPlanEvent">
          <v-icon dark>
            add
          </v-icon>
        </v-btn>
      </div>
    </div>

    <modalWindow :dialog="actionPlanningEvent" :maxWidth="'720px'">
      <PlanningEventComponent :event="objectPlanningEventElement" @callCreatePlanningEvent="createPlanningEvent"
                              @callUpdatePlanningEvent="updatePlanningEvent" @callCloseModal="closeModalEventComponent" />
    </modalWindow>

    <v-tabs v-model="tab" background-color="transparent" centered>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-skeleton-loader class="mx-auto" type="date-picker" v-if="loadingPlanningEvents">
        </v-skeleton-loader>

        <template v-if="!loadingPlanningEvents">
          <v-card>
            <v-row class="pa-4" justify="space-between">
              <template v-if="activePlanningEvent.length === 0">
                <h2 class="error-text">{{ $t('planning.notActivePlanningTransaction') }}</h2>
              </template>

              <template v-if="activePlanningEvent.length > 0">
                <v-col cols="5">
                  <v-treeview :active.sync="activeActive" :items="activePlanningEvent" activatable color="success"
                              open-on-click transition :open="initiallyOpenActive">
                    <template v-slot:prepend="{ item }">
                      <v-icon v-if="!item.children">
                        mdi-account
                      </v-icon>
                    </template>
                  </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col class="d-flex text-center">
                  <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                      {{ activeActive.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                    </div>

                    <v-card v-else :key="selected.id" class="pt-6 mx-auto" flat max-width="400">
                      <v-card-text>
                        <h3 class="text-h5 mb-2">
                          {{ selected.name }}
                        </h3>
                        <div class="blue--text mb-2">
                          {{ $t('history.table.bill') }}: {{ this.$store.getters.profileById(selected.bill_id).name }}
                        </div>
                        <div class="blue--text subheading font-weight-bold">
                          {{ $t('history.table.category') }}: {{ $t(this.$store.getters.categoryById(selected.category_id).title) }}
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-row class="text-left" tag="v-card-text">
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('history.table.type') }}
                        </v-col>
                        <v-col>
                        <span :class="getColor(selected.type)">
                          {{ selected.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
                        </span>
                        </v-col>
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('history.table.amount') }}
                        </v-col>
                        <v-col>
                          <span class="stat-icon" v-html="$getSymbolCurrency(selected.currency)"></span>
                          {{ new Intl.NumberFormat(currenciesUser.filter((cur) => { cur.CharCode === selected.currency }).locale,
                            { style: 'decimal', currency: selected.currency, minimumFractionDigits: 2,
                              maximumFractionDigits: 2 }).format(selected.amount) }}

                          <template v-if="selected.currency !== currencyDefault" class="two-currency"> ~
                            <span class="stat-icon" v-html="$getSymbolCurrency(currencyDefault)"></span>
                            {{ new Intl.NumberFormat(currentLocale, { style: 'decimal', currency: currencyDefault,
                              minimumFractionDigits: 2, maximumFractionDigits: 2 }).format($getCurrencyBalance(currencies,
                              selected.amount, selected.currency, currencyDefault)) }}
                          </template>
                        </v-col>
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('form.status') }}
                        </v-col>
                        <v-col>{{ selected.status === 1 ? $t('form.status_on') : $t('form.status_off') }}</v-col>

                        <v-col cols="6" align-self="center">
                          <v-btn dark color="teal" @click="deletePlanningEvent(selected.id)">
                            {{ $t('all.delete') }}
                          </v-btn>
                        </v-col>
                        <v-col cols="6" align-self="center">
                          <v-btn dark color="teal" @click="editPlanningEvent(selected)">
                            {{ $t('all.edit') }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-scroll-y-transition>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </template>
      </v-tab-item>

      <v-tab-item>
        <v-skeleton-loader class="mx-auto" type="date-picker" v-if="loadingPlanningEvents">
        </v-skeleton-loader>

        <template v-if="!loadingPlanningEvents">
          <v-card>
            <v-row class="pa-4" justify="space-between">
              <template v-if="nonActivePlanningEvent.length === 0">
                <h2 class="error-text">{{ $t('planning.notNoneActivePlanningTransaction') }}</h2>
              </template>

              <template v-if="nonActivePlanningEvent.length > 0">
                <v-col cols="5">
                  <v-treeview :active.sync="activeNoneActive" :items="nonActivePlanningEvent" activatable color="success"
                              open-on-click transition :open="initiallyOpenNoneActive">
                  </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col class="d-flex text-center">
                  <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected1" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                      {{ activeNoneActive.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                    </div>

                    <v-card v-else :key="selected1.id" class="pt-6 mx-auto" flat max-width="400">
                      <v-card-text>
                        <h3 class="text-h5 mb-2">
                          {{ selected1.name }}
                        </h3>
                        <div class="blue--text mb-2">
                          {{ $t('history.table.bill') }}: {{ this.$store.getters.profileById(selected.bill_id).name }}
                        </div>
                        <div class="blue--text subheading font-weight-bold">
                          {{ $t('history.table.category') }}: {{ $t(this.$store.getters.categoryById(selected.category_id).title) }}
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-row class="text-left" tag="v-card-text">
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('history.table.type') }}
                        </v-col>
                        <v-col>
                        <span :class="getColor(selected1.type)">
                          {{ selected1.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
                        </span>
                        </v-col>
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('history.table.amount') }}
                        </v-col>
                        <v-col>
                          <span class="stat-icon" v-html="$getSymbolCurrency(selected1.currency)"></span>
                          {{ new Intl.NumberFormat(currenciesUser.filter((cur) => { cur.CharCode === selected1.currency }).locale,
                            { style: 'decimal', currency: selected1.currency, minimumFractionDigits: 2,
                              maximumFractionDigits: 2 }).format(selected1.amount) }}

                          <template v-if="selected1.currency !== currencyDefault" class="two-currency"> ~
                            <span class="stat-icon" v-html="$getSymbolCurrency(currencyDefault)"></span>
                            {{ new Intl.NumberFormat(currentLocale, { style: 'decimal', currency: currencyDefault,
                              minimumFractionDigits: 2, maximumFractionDigits: 2 }).format($getCurrencyBalance(currencies,
                              selected1.amount, selected1.currency, currencyDefault)) }}
                          </template>
                        </v-col>
                        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                          {{ $t('form.status') }}
                        </v-col>
                        <v-col>{{ selected1.status === 1 ? $t('form.status_on') : $t('form.status_off') }}</v-col>

                        <v-col cols="6" align-self="center">
                          <v-btn dark color="teal" @click="deletePlanningEvent(selected1.id)">
                            {{ $t('all.delete') }}
                          </v-btn>
                        </v-col>
                        <v-col cols="6" align-self="center">
                          <v-btn dark color="teal" @click="editPlanningEvent(selected1)">
                            {{ $t('all.edit') }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-scroll-y-transition>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </template>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import ModalWindow from './../../Other/ModalComponent';
import PlanningEventComponent from './../../Other/PlanningEventComponent';

export default {
  data() {
    return {
      tab: this.$i18n.t('planning.tabs.active'),
      items: [
        this.$i18n.t('planning.tabs.active'), this.$i18n.t('planning.tabs.notActive'),
      ],
      activeActive: [],
      activeNoneActive: [],
      initiallyOpenActive: [],
      initiallyOpenNoneActive: [],

      actionPlanningEvent: false,
      objectPlanningEventElement: null,
      actionEditPlanningEvent: false
    }
  },
  computed: {
    loadingPlanningEvents () {
      return this.$store.getters.loadingPlanningEvents || this.$store.getters.loadingProfile
          || this.$store.getters.loadingCategory || this.$store.getters.loadingMainCurrency
          || this.$store.getters.loadingCurrencyUser || this.$store.getters.loadingCurrency
    },
    currencyDefault () {
      return this.$store.getters.mainCurrency?.CharCode
    },
    currentLocale () {
      return this.$store.getters.mainCurrency?.locale
    },
    currencies () {
      return this.$store.getters.currencies
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    activePlanningEvent () {
      return this.$store.getters.activePlanningEvents
    },
    nonActivePlanningEvent () {
      return this.$store.getters.nonActivePlanningEvents
    },
    selected () {
      if (!this.activeActive.length) return undefined
      const id = this.activeActive[0]
      let result = null

      this.activePlanningEvent.forEach((element) => {
        element.children.forEach((item) => {
          if (item.id === id) {
            result = item
          }
        })
      })

      return result
    },
    selected1 () {
      if (!this.activeNoneActive.length) return undefined
      const id = this.activeNoneActive[0]
      let result = null

      this.nonActivePlanningEvent.forEach((element) => {
        element.children.forEach((item) => {
          if (item.id === id) {
            result = item
          }
        })
      })

      return result
    }
  },
  methods: {
    getColor (type) {
      if (type === 'income') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    },
    addPlanEvent () {
      this.objectPlanningEventElement = null
      this.actionPlanningEvent = !this.actionPlanningEvent
    },
    createPlanningEvent (planningEvent) {
      this.actionPlanningEvent = false
      this.objectPlanningEventElement = planningEvent

      this.$store.dispatch('addPlanningEvent', planningEvent).then(() => {
        this.objectPlanningEventElement = null
      }).catch(() => {})
    },
    closeModalEventComponent () {
      this.actionPlanningEvent = false;
    },
    deletePlanningEvent (id) {
      let isConfirmDeleteEvent = confirm(this.$i18n.t('history.table.isDeleteEvent'))

      if (isConfirmDeleteEvent) {
        this.$store.dispatch('deletePlanningEvent', id).then(() => {}).catch(() => {})
      }
    },
    editPlanningEvent (item) {
      this.objectPlanningEventElement = item

      this.actionPlanningEvent = !this.actionPlanningEvent
    },
    updatePlanningEvent(planningEvent) {
      this.actionPlanningEvent = false
      this.objectPlanningEventElement = planningEvent

      this.$store.dispatch('updatePlanningEvent', planningEvent).then(() => {
        this.objectPlanningEventElement = null
      }).catch(() => {})
    }
  },
  components: {
    PlanningEventComponent,
    ModalWindow
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
.error-text {
  color: #4f5f6f;
  text-align: center;
  margin: 0 auto;
}
</style>
