<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loading">
    </v-skeleton-loader>

    <template v-if="!loading">
      <v-card-title class="bordered">
        <span class="text-h5">{{ $t('records.event.title') }}</span>

        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateFormatted" :label="$t('form.date')" dense v-bind="attrs" v-on="on"
                                @blur="date = parseDate(dateFormatted)" readonly outlined />
                </template>
                <v-date-picker ref="picker" v-model="date" :min="$moment().add(1, 'd').format('YYYY-MM-DD')"
                               @change="saveDate" :first-day-of-week="this.$root.$i18n.locale === 'ru' ? 1 : 0"
                               :locale="this.$root.$i18n.locale">
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto" :return-value.sync="time">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="time" :label="$t('form.time')" dense v-bind="attrs" v-on="on" readonly outlined />
                </template>
                <v-time-picker format="24hr" v-if="menu2" v-model="time" @click:minute="$refs.menu2.save(time)">
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>


          <v-select :items="profile" :label="$t('form.selectAccount')" :rules="billRules" dense outlined
                    item-text="name" item-value="id" v-model="bill_id" required></v-select>

          <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                    :item-text="categoryName" item-value="id" v-model="category_id" required></v-select>

          <v-radio-group v-model="currency" row :label="$t('form.currency')" :rules="currencyRules" dense>
            <v-radio v-for="item in currenciesUser" :key="item.CharCode" :label="item.CharCode" on-icon="radio_button_checked"
                     :value="item.CharCode" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-radio-group v-model="type" row :label="$t('form.type')" :rules="typeRules" dense>
            <v-radio v-for="item in types" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-text-field type="number" :label="$t('form.amount')" :rules="amountRules" v-model="amount" dense
                        required outlined />
          <v-text-field :label="$t('form.description')" maxlength="255" v-model="description" dense outlined />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="closeModal()">
          {{ $t('main.close') }}
        </v-btn>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.add') }}
        </v-btn>
      </v-card-actions>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: this.$moment().add(1, 'd').format('YYYY-MM-DD'),
      dateFormatted: this.saveDate(this.$moment().add(1, 'd').format('YYYY-MM-DD')),
      menu: false,
      time: this.$moment().format('HH:mm'),
      menu2: false,
      bill_id: null,
      category_id: null,
      billRules: [
        v => !!v || this.$i18n.t('form.errors.billRequired')
      ],
      categoryRules: [
        v => !!v || this.$i18n.t('form.errors.categoryRequired')
      ],
      currency: this.$store.getters.mainCurrency?.CharCode,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      type: 'income',
      types: [
        { type: 'income', label: this.$i18n.t('history.chart.income') },
        { type: 'outcome', label: this.$i18n.t('history.chart.outcome') }
      ],
      typeRules: [
        v => !!v || this.$i18n.t('form.errors.typeRequired'),
      ],
      amount: 0,
      amountRules: [
        v => !!v || this.$i18n.t('form.errors.amountRequired'),
        v => (v > 0) || this.$i18n.t('form.errors.amountAboveZero')
      ],
      description: '',
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loadingCategory || this.$store.getters.loadingMainCurrency
          || this.$store.getters.loadingCurrencyUser || this.$store.getters.loadingCurrency
          || this.$store.getters.loadingProfile
    },
    category () {
      return this.$store.getters.category
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    currencies () {
      return this.$store.getters.currencies;
    },
    profile () {
      return this.$store.getters.profile
    },
  },
  watch: {
    date () {
      this.dateFormatted = this.saveDate(this.date)
    },
    bill_id () {
      this.$refs.form.validate()
    },
    currency () {
      this.$refs.form.validate()
    },
    type () {
      this.$refs.form.validate()
    }
  },
  methods: {
    closeModal () {
      this.$emit('callCloseModal');
    },
    categoryName (item) {
      return this.$i18n.t(item.title)
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
    onSubmit () {
      if (this.$refs.form.validate()) {
        const PlanningEvent = {
          user_id: this.$store.getters.user.id,
          category_id: this.category_id,
          bill_id: this.bill_id,
          currency: this.currency,
          type: this.type,
          amount: parseFloat(this.amount),
          date: this.$moment(this.date + ' ' + this.time).format('X'),
          description: this.description
        }

        this.$emit('callCreatePlanningEvent', PlanningEvent);
        this.$refs.form.reset()

        this.date = this.$moment().format('YYYY-MM-DD')
        this.dateFormatted = this.saveDate(this.$moment().format('YYYY-MM-DD'))
        this.time = this.$moment().format('HH:mm')

        this.bill_id = null
        this.category_id = null
        this.currency = this.$store.getters.mainCurrency?.CharCode || 'RUB'
        this.type = 'income'
        this.amount = 0
        this.convertAmount = 0
      }
    },
  }
}
</script>

<style scoped lang="scss">
.v-card__title {
  justify-content: space-between;
  border-bottom: 1px solid #d7dde4;
}
.bordered {
  border-bottom: 1px solid #d7dde4;
  margin-bottom: 16px;
}
</style>
