<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
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
              <v-text-field v-model="dateFormatted" :label="$t('form.date')" dense readonly outlined
                            @blur="date = parseDate(dateFormatted)" />
            </v-col>

            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="time" :label="$t('form.time')" dense readonly outlined />
            </v-col>
          </v-row>

          <v-select :items="profile" :label="$t('form.selectAccount')" :rules="billRules" dense outlined
                    item-text="name" item-value="id" v-model="bill_id" required readonly />

          <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                    :item-text="categoryName" item-value="id" v-model="category_id" required :readonly="blockInput" />

          <v-radio-group v-model="currency" row :label="$t('form.currency')" :rules="currencyRules" dense readonly>
            <v-radio v-for="item in currenciesUser" :key="item.CharCode" :label="item.CharCode" readonly
                     on-icon="radio_button_checked" :value="item.CharCode" off-icon="radio_button_unchecked" />
          </v-radio-group>

          <v-radio-group v-model="type" row :label="$t('form.type')" :rules="typeRules" dense readonly>
            <v-radio v-for="item in types" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked" readonly />
          </v-radio-group>

          <v-text-field type="number" :label="$t('form.amount')" :rules="amountRules" v-model="amount" dense required
                        outlined readonly />
          <v-text-field :label="$t('form.description')" maxlength="255" v-model="description" dense outlined
                        :readonly="blockInput" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" text @click="closeModal()">
          {{ $t('main.close') }}
        </v-btn>
        <v-btn v-if="!blockInput" color="blue darken-1" text @click="closeAndSaveModal()">
          {{ $t('form.edit') }}
        </v-btn>
      </v-card-actions>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      require: true
    },
    blockInput : {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      dateFormatted: this.saveDate(this.$moment().format('YYYY-MM-DD')),
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
      convertAmount: 0,
      amountRules: [
        v => !!v || this.$i18n.t('form.errors.amountRequired'),
        v => (v > 0) || this.$i18n.t('form.errors.amountAboveZero')
      ],
      description: '',
      valid: false
    }
  },
  mounted () {
    this.date = this.$moment(this.event.date, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')
    this.dateFormatted = this.event.date
    this.time = this.$moment(this.event.date, 'DD.MM.YYYY HH:mm').format('HH:mm')
    this.bill_id = this.event.bill_id
    this.category_id = this.event.category_id
    this.currency = this.event.currency
    this.type = this.event.type
    this.amount = this.event.amount
    this.convertAmount = this.event.convertAmount
    this.description = this.event.description
  },
  watch: {
    event () {
      this.date = this.$moment(this.event.date, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD')
      this.dateFormatted = this.event.date
      this.time = this.$moment(this.event.date, 'DD.MM.YYYY HH:mm').format('HH:mm')
      this.bill_id = this.event.bill_id
      this.category_id = this.event.category_id
      this.currency = this.event.currency
      this.type = this.event.type
      this.amount = this.event.amount
      this.convertAmount = this.event.convertAmount
      this.description = this.event.description
    },
    date () {
      this.dateFormatted = this.saveDate(this.date)
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
  methods: {
    closeModal () {
      this.$emit('callCloseModal');
    },
    closeAndSaveModal () {
      if (this.$refs.form.validate()) {
        let EditEvent = {...this.event}
        EditEvent.category_id = this.category_id;
        EditEvent.description = this.description;

        this.$emit('callCloseAndSaveModal', EditEvent);
      }
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
    }
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
