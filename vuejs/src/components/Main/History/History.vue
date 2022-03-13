<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('history.name') }}
      </h3>
      <div class="text-right">
        <v-btn dark color="teal" @click="onFilter">
          <v-icon dark>
            filter_list
          </v-icon>
        </v-btn>
      </div>
    </div>

    <template v-if="loadingEvents">
      <v-row>
        <v-col cols="12" md="6" sm="12">
          <v-skeleton-loader class="mx-auto" type="card-heading, image"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-skeleton-loader class="mx-auto" type="card-heading, image"></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row>
        <v-skeleton-loader width="100%" type="table-thead, table-tbody"></v-skeleton-loader>
      </v-row>
    </template>

    <template v-if="!loadingEvents">
      <h2 v-if="!income && !outcome && events === null" class="error-text"> {{ $t('history.notTransaction') }}</h2>

      <v-row>
        <v-col cols="12" md="6" sm="12" :class="{'nonVisible': !income }">
          <v-card elevation="2" outlined>
            <v-card-title>
              <h4 class="title">{{ $t('history.chart.income') }}</h4>
            </v-card-title>
            <div>
              <chart :chart-data="chart_1" :height="400"></chart>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" sm="12" :class="{'nonVisible': !outcome }">
          <v-card elevation="2" outlined>
            <v-card-title>
              <h4 class="title">{{ $t('history.chart.outcome') }}</h4>
            </v-card-title>
            <div>
              <chart :chart-data="chart_2" :height="400"></chart>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="events !== null">
        <v-data-table class="elevation-2" :headers="headers" :items="events" :disable-sort=true
          :footer-props="{ disableItemsPerPage: true, prevIcon: 'keyboard_arrow_left', nextIcon: 'keyboard_arrow_right' }"
          :locale="this.$root.$i18n.locale">

          <template v-slot:item.category_id="{ item }">
            <span>
              {{ getCategoryName(item.category_id) }}
            </span>
          </template>

          <template v-slot:item.bill_id="{ item }">
            <span>
              {{ getBillName(item.bill_id) }}
            </span>
          </template>

          <template v-slot:item.type="{ item }">
            <span :class="getColor(item.type)">
              {{ item.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
            </span>
          </template>

          <template v-slot:item.amount="{ item }">
            <div>
              <span v-html="$getSymbolCurrency(item.currency)"></span>
              <span>{{ new Intl.NumberFormat(currenciesUser.filter((cur) => {
                cur.CharCode === item.currency }).locale, { style: 'decimal', currency: item.currency,
                minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.amount) }}
              </span>
            </div>

            <div v-if="item.currency !== mainCurrency.CharCode"> ~
              <span v-html="$getSymbolCurrency(mainCurrency.CharCode)"></span>
              <span> {{ new Intl.NumberFormat(mainCurrency.locale, { style: 'decimal',
                currency: mainCurrency.CharCode, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                $getCurrencyBalance(allCurrencies, item.amount, item.currency, mainCurrency.CharCode)) }}
              </span>
            </div>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn icon class="mx-2" outlined small fab @click="openInfoEvent(item)">
              <v-icon>info</v-icon>
            </v-btn>
            <v-btn icon class="mx-2" outlined small fab @click="openEditEvent(item)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-2" outlined small fab @click="onDeleteEvent(item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-row>
    </template>

    <modalWindow :dialog="actionEvent" :maxWidth="'720px'">
      <EventComponent :event="objectEventElement" :blockInput="blockInputEventComponent"
                      @callCloseModal="closeModalEventComponent" @callCloseAndSaveModal="closeModalAndSaveEventComponent" />
    </modalWindow>

    <modalWindow :dialog="openFilter" :maxWidth="'720px'">
      <FilterComponent :billsParent="bills" :categoriesParent="categories" :currenciesParent="currencies"
        :typesParent="types" @callUpdateChartAndDataGrid="updateChartAndDataGrid" @callCloseModal="closeModal" />
    </modalWindow>
  </div>
</template>

<script>
import Chart from './Chart';
import ModalWindow from './../../Other/ModalComponent';
import FilterComponent from './../../Other/FilterComponent';
import EventComponent from './../../Other/EventComponent';

export default {
  data () {
    return {
      headers: [
        { text: '#', value: 'id' },
        { text: this.$i18n.t('history.table.date'), align: 'center', value: 'date' },
        { text: this.$i18n.t('history.table.category'), align: 'center', value: 'category_id' },
        { text: this.$i18n.t('history.table.bill'), align: 'center', value: 'bill_id' },
        { text: this.$i18n.t('history.table.type'), align: 'center', value: 'type' },
        { text: this.$i18n.t('history.table.amount'), align: 'center', value: 'amount' },
        { text: this.$i18n.t('history.table.action'), align: 'center', value: 'action' }
      ],
      chart_1: null,
      chart_2: null,
      filter: null,
      openFilter: false,

      actionEvent: false,
      objectEventElement: null,
      blockInputEventComponent: true,

      arrTypes: [
        { id: 1, type: 'income', label: this.$i18n.t('history.chart.income') },
        { id: 2, type: 'outcome', label: this.$i18n.t('history.chart.outcome') }
      ],
      bills: [],
      categories: [],
      currencies: [],
      types: []
    }
  },
  mounted () {
    this.getCharts()
  },
  computed: {
    loadingEvents () {
      return this.$store.getters.loadingEvents || this.$store.getters.loadingProfile || this.$store.getters.loadingCategory
        || this.$store.getters.loadingMainCurrency || this.$store.getters.loadingCurrencyUser
        || this.$store.getters.loadingCurrency
    },
    events () {
      return this.$store.getters.events
    },
    income () {
      return this.$store.getters.income !== null
    },
    outcome () {
      return this.$store.getters.outcome !== null
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    mainCurrency () {
      return this.$store.getters.mainCurrency;
    },
    allCurrencies () {
      return this.$store.getters.currencies
    },
    profile () {
      return this.$store.getters.profile
    },
    category () {
      return this.$store.getters.category
    },
  },
  methods: {
    getCharts () {
      this.$store.dispatch('getAllEvents', null).then(() => {
        this.setChart_1();
        this.setChart_2();
      }).catch(() => {})
    },
    setChart_1 () {
      let labels_chart_1 = []
      let colors_chart_1 = []
      let dats_chart_1 = []

      if (this.$store.getters.income !== null) {
        this.$store.getters.income.forEach((income) => {
          let normalIncome = JSON.parse(income)

          labels_chart_1.push(this.$i18n.t(normalIncome.label))
          colors_chart_1.push(normalIncome.color)
          dats_chart_1.push(parseFloat(normalIncome.total.toFixed(2)))
        })
      }

      this.chart_1 = {
        labels: labels_chart_1,
        datasets: [{ label: this.$i18n.t('history.chart.income'), backgroundColor: colors_chart_1, data: dats_chart_1 }]
      }
    },
    setChart_2 () {
      let labels_chart_2 = []
      let colors_chart_2 = []
      let dats_chart_2 = []

      if (this.$store.getters.outcome !== null) {
        this.$store.getters.outcome.forEach((outcome) => {
          let normalOutcome = JSON.parse(outcome)

          labels_chart_2.push(this.$i18n.t(normalOutcome.label))
          colors_chart_2.push(normalOutcome.color)
          dats_chart_2.push(parseFloat(normalOutcome.total.toFixed(2)))
        })
      }

      this.chart_2 = {
        labels: labels_chart_2,
        datasets: [{ label: this.$i18n.t('history.chart.outcome'), backgroundColor: colors_chart_2, data: dats_chart_2 }]
      }
    },
    getColor (type) {
      if (type === 'income') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    },
    getCategoryName (category_id) {
      let categoryItem = this.$store.getters.categoryById(category_id)
      return this.$i18n.t(categoryItem.title)
    },
    getBillName (bill_id) {
      let billItem = this.$store.getters.profileById(bill_id)
      return billItem.name
    },
    onFilter () {
      if (this.bills.length === 0) {
        this.profile.forEach((item) => {
          this.bills.push(item.id)
        })
      }

      if (this.categories.length === 0) {
        this.category.forEach((item) => {
          this.categories.push(item.id)
        })
      }

      if (this.currencies.length === 0) {
        this.currenciesUser.forEach((item) => {
          this.currencies.push(item.CharCode)
        })
      }

      if (this.types.length === 0) {
        this.arrTypes.forEach((item) => {
          this.types.push(item.id)
        })
      }

      this.openFilter = !this.openFilter;
    },
    updateChartAndDataGrid (Filter) {
      this.filter = Filter

      this.$store.dispatch('getAllEvents', Filter).then(() => {
        this.setChart_1();
        this.setChart_2();

        this.openFilter = false;
      }).catch(() => {})
    },
    closeModal () {
      this.openFilter = false;
    },
    openInfoEvent(item) {
      this.blockInputEventComponent = true
      this.objectEventElement = item

      this.actionEvent = !this.actionEvent;
    },
    openEditEvent (item) {
      this.blockInputEventComponent = false
      this.objectEventElement = item

      this.actionEvent = !this.actionEvent;
    },
    onDeleteEvent(item) {
      let isConfirmDeleteEvent = confirm(this.$i18n.t('history.table.isDeleteEvent'))

      if (isConfirmDeleteEvent) {
        this.$store.dispatch('deleteEvent', item).then(() => {
          this.updateChartAndDataGrid(this.filter)
        }).catch(() => {})
      }
    },
    closeModalEventComponent () {
      this.actionEvent = !this.actionEvent;
    },
    closeModalAndSaveEventComponent (EditEvent) {
      this.$store.dispatch('updateEvent', EditEvent).then(() => {
        this.actionEvent = false;
        this.blockInputEventComponent = true

        this.updateChartAndDataGrid(this.filter)
      }).catch(() => {})
    }
  },
  components: {
    chart: Chart,
    modalWindow: ModalWindow,
    FilterComponent,
    EventComponent
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
.nonVisible {
  display: none;
}
.error-text {
  color: #4f5f6f;
  text-align: center;
}
.v-data-table {
  width: 100%;
}
.v-card__title {
  justify-content: space-between;
  border-bottom: 1px solid #d7dde4;
}
.time-range {
  button {
    margin: 5px 8px;
  }
  button.activeButton {
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=10, Direction=0, Color=#49A8FE)";
    -moz-box-shadow: 0 0 10px 5px #49A8FE;
    -webkit-box-shadow: 0 0 10px 5px #49A8FE;
    box-shadow: 0 0 10px 5px #49A8FE;
    filter: progid:DXImageTransform.Microsoft.Shadow(Strength=10, Direction=135, Color=#49A8FE);
  }
}
.date-pickers_block {
  margin: 0;
}
.v-select.v-input--dense .v-chip {
  margin: 5px 4px;
}
</style>
