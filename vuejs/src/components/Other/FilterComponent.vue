<template>
  <div>
    <v-card-title>
      <span class="text-h5">{{ $t('history.filter.name') }}</span>

      <v-btn icon @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="mt-2 mb-2">
            <v-alert outlined type="warning" prominent border="left" v-if="dateType === 'year' || dateType === 'customDate'">
              {{ $t('history.filter.warningMoreTimeRange') }}
            </v-alert>
          </div>

          <div class="pb-1">
            <div class="text-h6 mb-1">{{ $t('history.filter.timeRange') }}</div>
            <div class="time-range m-0 mb-2">
              <v-btn outlined @click="changeDateType('today')" :class="{'activeButton': dateType === 'today' }">
                {{ $t('history.filter.today') }}
              </v-btn>
              <v-btn outlined @click="changeDateType('week')" :class="{'activeButton': dateType === 'week' }">
                {{ $t('history.filter.week') }}
              </v-btn>

              <v-btn outlined @click="changeDateType('month')" :class="{'activeButton': dateType === 'month' }">
                {{ $t('history.filter.month') }}
              </v-btn>

              <v-btn outlined @click="changeDateType('year')" :class="{'activeButton': dateType === 'year' }">
                {{ $t('history.filter.year') }}
              </v-btn>

              <v-btn outlined @click="changeDateType('customDate')" :class="{'activeButton': dateType === 'customDate' }">
                {{ $t('history.filter.customDate') }}
              </v-btn>
            </div>

            <v-row v-if="datePickerShow" class="date-pickers_block">
              <v-col cols="12" md="6" sm="12">
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                        min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="dataFrom" :label="$t('form.dateFrom')" dense v-bind="attrs" v-on="on"
                                  @blur="date1 = parseDate(dataFrom)" readonly outlined />
                  </template>
                  <v-date-picker ref="picker" v-model="date1" :max="$moment().format('YYYY-MM-DD')" min="1970-01-01"
                                 @change="saveDate" :first-day-of-week="this.$root.$i18n.locale === 'ru' ? 1 : 0"
                                 :locale="this.$root.$i18n.locale">
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="6" sm="12">
                <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                        min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="dataTo" :label="$t('form.dateTo')" dense v-bind="attrs" v-on="on"
                                  @blur="date2 = parseDate(dataTo)" readonly outlined />
                  </template>
                  <v-date-picker ref="picker" v-model="date2" :max="$moment().format('YYYY-MM-DD')" min="1970-01-01"
                                 @change="saveDate" :first-day-of-week="this.$root.$i18n.locale === 'ru' ? 1 : 0"
                                 :locale="this.$root.$i18n.locale">
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>

          <div class="m-0 mt-3">
            <v-select required :items="profile" :label="$t('form.selectAccount')" dense multiple
                      item-text="name" item-value="id" v-model="bills">
              <template v-slot:prepend-item>
                <v-list-item ripple @mousedown.prevent @click="toggleAllBills">
                  <v-list-item-action>
                    <v-icon :color="bills.length > 0 ? 'indigo darken-4' : ''">
                      {{ iconBills }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('form.selectAll') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index <= 1">
                  <span>{{ item.name }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption">
                  ({{ $tc('form.countElements', bills.length - 2) }})
                </span>
              </template>
            </v-select>
          </div>

          <div class="m-0 mt-3">
            <v-select required :items="category" :label="$t('form.category')" dense multiple
                      :item-text="categoryName" item-value="id" v-model="categories">
              <template v-slot:prepend-item>
                <v-list-item ripple @mousedown.prevent @click="toggleAllCategories">
                  <v-list-item-action>
                    <v-icon :color="categories.length > 0 ? 'indigo darken-4' : ''">
                      {{ iconCategories }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('form.selectAll') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index <= 1">
                  <span>{{ categoryName(item) }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption">
                  ({{ $tc('form.countElements', categories.length - 2) }})
                </span>
              </template>
            </v-select>
          </div>

          <div class="m-0 mt-3">
            <v-select :items="currenciesUser" :label="$t('form.currency')" dense multiple
                      item-text="CharCode" item-value="CharCode" v-model="currencies" required>
              <template v-slot:prepend-item>
                <v-list-item ripple @mousedown.prevent @click="toggleAllCurrencies">
                  <v-list-item-action>
                    <v-icon :color="currencies.length > 0 ? 'indigo darken-4' : ''">
                      {{ iconCurrencies }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('form.selectAll') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index <= 1">
                  <span>{{ item.CharCode }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption">
                  ({{ $tc('form.countElements', currencies.length - 2) }})
                </span>
              </template>
            </v-select>
          </div>

          <div class="m-0 mt-3">
            <v-select required :items="arrTypes" :label="$t('form.type')" dense multiple item-text="label"
                      item-value="id" v-model="types">
              <template v-slot:prepend-item>
                <v-list-item ripple @mousedown.prevent @click="toggleAllTypes">
                  <v-list-item-action>
                    <v-icon :color="types.length > 0 ? 'indigo darken-4' : ''">
                      {{ iconTypes }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('form.selectAll') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index <= 1">
                  <span>{{ item.label }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption">
                  ({{ $tc('form.countElements', types.length - 2) }})
                </span>
              </template>
            </v-select>
          </div>
        </v-form>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="resetFilterForm()">
        {{ $t('history.filter.reset') }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="closeModal()">
        {{ $t('all.cancel') }}
      </v-btn>
      <v-btn color="blue darken-1" text @click="confirmFilter()" :disabled="!valid">
        {{ $t('all.apply') }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  props: ['billsParent', 'categoriesParent', 'currenciesParent', 'typesParent'],
  data () {
    return {
      dateType: 'today',
      datePickerShow: false,
      menu: false,
      menu2: false,
      date1: this.$moment().format('YYYY-MM-DD'),
      date2: this.$moment().format('YYYY-MM-DD'),
      dataFrom: this.saveDate(this.$moment().format('YYYY-MM-DD')),
      dataTo: this.saveDate(this.$moment().format('YYYY-MM-DD')),
      bills: [],
      categories: [],
      currencies: [],
      types: [],
      arrTypes: [
        { id: 1, type: 'income', label: this.$i18n.t('history.chart.income') },
        { id: 2, type: 'outcome', label: this.$i18n.t('history.chart.outcome') }
      ],
      valid: false
    }
  },
  mounted () {
    this.bills = this.billsParent
    this.categories = this.categoriesParent
    this.currencies = this.currenciesParent
    this.types = this.typesParent
  },
  computed: {
    profile () {
      return this.$store.getters.profile
    },
    category () {
      return this.$store.getters.category
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    allBills () {
      return this.bills.length === this.profile.length
    },
    someBills () {
      return this.bills.length > 0 && !this.allBills
    },
    iconBills () {
      if (this.allBills) return 'mdi-close-box'
      if (this.someBills) return 'mdi-minus-box'

      return 'mdi-checkbox-blank-outline'
    },
    allCategories () {
      return this.categories.length === this.category.length
    },
    someCategories () {
      return this.categories.length > 0 && !this.allCategories
    },
    iconCategories () {
      if (this.allCategories) return 'mdi-close-box'
      if (this.someCategories) return 'mdi-minus-box'

      return 'mdi-checkbox-blank-outline'
    },
    allUserCurrencies () {
      return this.currencies.length === this.currenciesUser.length
    },
    someCurrencies () {
      return this.currencies.length > 0 && !this.allUserCurrencies
    },
    iconCurrencies () {
      if (this.allUserCurrencies) return 'mdi-close-box'
      if (this.someCurrencies) return 'mdi-minus-box'

      return 'mdi-checkbox-blank-outline'
    },
    allTypes () {
      return this.types.length === this.arrTypes.length
    },
    someTypes () {
      return this.types.length > 0 && !this.allTypes
    },
    iconTypes () {
      if (this.allTypes) return 'mdi-close-box'
      if (this.someTypes) return 'mdi-minus-box'

      return 'mdi-checkbox-blank-outline'
    }
  },
  watch: {
    date1 () {
      this.dataFrom = this.saveDate(this.date1)
    },
    date2 () {
      this.dataTo = this.saveDate(this.date2)
    }
  },
  methods: {
    closeModal () {
      this.$emit('callCloseModal');
    },
    changeDateType(type) {
      this.dateType = type

      this.datePickerShow = type === 'customDate'
      switch (type) {
        case 'today':
          this.date1 = this.$moment().startOf('day').format('YYYY-MM-DD')
          this.date2 = this.$moment().endOf('day').format('YYYY-MM-DD')
          break

        case 'week':
          this.date1 = this.$moment().startOf('isoWeek').format('YYYY-MM-DD')
          this.date2 = this.$moment().endOf('isoWeek').format('YYYY-MM-DD')
          break

        case 'month':
          this.date1 = this.$moment().startOf('month').format('YYYY-MM-DD')
          this.date2 = this.$moment().endOf('month').format('YYYY-MM-DD')
          break

        case 'year':
          this.date1 = this.$moment().startOf('year').format('YYYY-MM-DD')
          this.date2 = this.$moment().endOf('year').format('YYYY-MM-DD')
          break

        default:
          this.date1 = this.$moment().format('YYYY-MM-DD')
          this.date2 = this.$moment().format('YYYY-MM-DD')
      }

      this.dataFrom = this.saveDate(this.date1)
      this.dataTo = this.saveDate(this.date2)
    },
    confirmFilter () {
      if (this.$refs.form.validate()) {
        const Filter = {
          user_id: this.$store.getters.user.id,
          dataFrom: this.$moment(this.dataFrom, 'DD-MM-YYYY').utc().format('X'),
          dataTo: this.$moment(this.dataTo, 'DD-MM-YYYY').utc().format('X'),
          bills: this.bills,
          categories: this.categories,
          currencies: this.currencies,
          types: this.types
        }

        this.$emit('callUpdateChartAndDataGrid', Filter);
      }
    },
    saveDate (date) {
      if (!date) return null

      const momentDate = this.$moment(date, 'YYYY-MM-DD')
      return momentDate.format('DD.MM.YYYY')
    },
    parseDate (date) {
      if (!date) return null

      const momentDate = this.$moment(date, 'DD.MM.YYYY')
      return momentDate.format('YYYY-MM-DD')
    },
    categoryName (item) {
      return this.$i18n.t(item.title)
    },
    toggleAllBills () {
      this.$nextTick(() => {
        if (this.allBills) {
          this.bills = []
        } else {
          this.bills = []
          this.profile.forEach((item) => {
            this.bills.push(item.id)
          })
        }
      })
    },
    toggleAllCategories () {
      this.$nextTick(() => {
        if (this.allCategories) {
          this.categories = []
        } else {
          this.categories = []
          this.category.forEach((item) => {
            this.categories.push(item.id)
          })
        }
      })
    },
    toggleAllCurrencies () {
      this.$nextTick(() => {
        if (this.allUserCurrencies) {
          this.currencies = []
        } else {
          this.currencies = []
          this.currenciesUser.forEach((item) => {
            this.currencies.push(item.CharCode)
          })
        }
      })
    },
    toggleAllTypes () {
      this.$nextTick(() => {
        if (this.allTypes) {
          this.types = []
        } else {
          this.types = []
          this.arrTypes.forEach((item) => {
            this.types.push(item.id)
          })
        }
      })
    },
    resetFilterForm () {
      this.dateType = 'today'
      this.datePickerShow = false
      this.menu = false
      this.menu2 = false
      this.date1 = this.$moment().format('YYYY-MM-DD')
      this.date2 = this.$moment().format('YYYY-MM-DD')
      this.dataFrom = this.saveDate(this.$moment().format('YYYY-MM-DD'))
      this.dataTo = this.saveDate(this.$moment().format('YYYY-MM-DD'))
      this.bills = []
      this.categories = []
      this.currencies = []
      this.types = []
    }
  }
}
</script>

<style scoped lang="scss">
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
