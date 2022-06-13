<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <template v-if="!loading">
      <template v-if="blockInput">
        <div class="pt-6 mx-auto text-center">
          <ViewEventComponent :event="event" :hidden-button="true" @callCloseModal="closeModal" />
        </div>
      </template>

      <template v-else-if="!blockInput">
        <v-card-title class="bordered">
          <span class="text-h5">{{ $t('records.event.edit_title') }}</span>

          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                {{ $t('history.table.date') }}
              </v-col>
              <v-col>
                <span>
                  {{ event.date }}
                </span>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                {{ $t('history.table.bill') }}
              </v-col>
              <v-col>
                <span>
                  {{ this.$store.getters.profileById(event.bill_id).name }}
                </span>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                {{ $t('history.table.type') }}
              </v-col>
              <v-col>
                <span :class="getColor(event.type)">
                  {{ event.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
                </span>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                {{ $t('history.table.amount') }}
              </v-col>

              <v-col>
                <span class="stat-icon" v-html="$getSymbolCurrency(event.currency)"></span>
                {{ new Intl.NumberFormat(currenciesUser.filter((cur) => { cur.CharCode === event.currency }).locale, {
                  style: 'decimal', currency: event.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(event.amount) }}

                <template v-if="event.currency !== currencyDefault" class="two-currency"> ~
                  <span class="stat-icon" v-html="$getSymbolCurrency(currencyDefault)"></span>
                  {{ new Intl.NumberFormat(currentLocale, { style: 'decimal', currency: currencyDefault, minimumFractionDigits: 2,
                    maximumFractionDigits: 2 }).format($getCurrencyBalance(currencies, event.amount, event.currency, currencyDefault)) }}
                </template>
              </v-col>
            </v-row>

            <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                      :item-text="categoryName" item-value="id" v-model="category_id" required :readonly="blockInput" />

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
    </template>
  </div>
</template>

<script>
import ViewEventComponent from './ViewEventComponent';

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
      category_id: null,
      categoryRules: [
        v => !!v || this.$i18n.t('form.errors.categoryRequired')
      ],
      description: '',
      valid: false
    }
  },
  mounted () {
    this.category_id = this.event.category_id
    this.description = this.event.description
  },
  watch: {
    event () {
      this.category_id = this.event.category_id
      this.description = this.event.description
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
    currencyDefault () {
      return this.$store.getters.mainCurrency?.CharCode
    },
    currentLocale () {
      return this.$store.getters.mainCurrency?.locale
    },
    currencies () {
      return this.$store.getters.currencies;
    }
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
    getColor (type) {
      if (type === 'income') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    }
  },
  components: {
    ViewEventComponent
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
