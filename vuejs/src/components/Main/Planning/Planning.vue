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
                <v-col cols="12" sm="5">
                  <v-treeview :active.sync="activeActive" :items="activePlanningEvent" activatable color="success"
                              open-on-click transition :open="initiallyOpenActive">

                    <template v-slot:prepend="{ item }">
                      <template v-if="!item.children">
                        <v-icon>
                          mdi-account
                        </v-icon>

                        {{ getName(item) }}
                      </template>
                    </template>
                  </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col cols="12" sm="6" class="d-flex text-center">
                  <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                      {{ activeActive.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                    </div>

                    <v-card v-else :key="selected.id" class="pt-6 mx-auto" flat max-width="400">
                      <ViewEventComponent :event="selected" @callEditPlanningEvent="editPlanningEvent"
                        @callWriteInEvent="closeModalEventComponent" @callDeletePlanningEvent="deletePlanningEvent" />
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
                <v-col cols="12" sm="5">
                  <v-treeview :active.sync="activeNoneActive" :items="nonActivePlanningEvent" activatable color="success"
                              open-on-click transition :open="initiallyOpenNoneActive">

                    <template v-slot:prepend="{ item }">
                      <template v-if="!item.children">
                        <v-icon>
                          mdi-account
                        </v-icon>

                        {{ getName(item) }}
                      </template>
                    </template>
                  </v-treeview>
                </v-col>

                <v-divider vertical></v-divider>

                <v-col cols="12" sm="6" class="d-flex text-center">
                  <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected1" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                      {{ activeNoneActive.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                    </div>

                    <v-card v-else :key="selected1.id" class="pt-6 mx-auto" flat max-width="400">
                      <ViewEventComponent :event="selected1" @callEditPlanningEvent="editPlanningEvent"
                        @callWriteInEvent="writeInEvent" @callDeletePlanningEvent="deletePlanningEvent" />
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
import ViewEventComponent from './../../Other/ViewEventComponent';
import { i18n } from '../../../i18n/i18n';

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

      this.$store.dispatch('addPlanningEvent', planningEvent).then(() => {}).catch(() => {})
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

      this.$store.dispatch('updatePlanningEvent', planningEvent).then(() => {}).catch(() => {})
    },
    getName (event) {
      return (event.type === 'income' ? i18n.t('history.chart.income') : i18n.t('history.chart.outcome'))
        + ' ' + new Intl.NumberFormat(this.currenciesUser.filter((cur) => { cur.CharCode === event.currency }).locale,
        { style: 'decimal', currency: event.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(event.amount) + ' ' + i18n.t('planning.from') + ' ' + event.date;
    },
    writeInEvent (event) {
      const Event = {
        ...event,
        date: this.$moment(event.date, 'DD.MM.YYYY HH:mm').utc().format('X'),
      }

      this.$store.dispatch('addEvent', Event).then(() => {}).catch(() => {})
    }
  },
  components: {
    PlanningEventComponent,
    ViewEventComponent,
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
