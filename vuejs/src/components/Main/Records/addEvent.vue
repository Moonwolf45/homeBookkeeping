<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-card elevation="2" outlined v-if="!loading">
      <v-card-title class="bordered">
        {{ $t('records.event.title') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateFormatted" :label="$t('form.date')" dense outlined v-bind="attrs" v-on="on"
                                @blur="date = parseDate(dateFormatted)" readonly></v-text-field>
                </template>
                <v-date-picker ref="picker" v-model="date" :max="new Date().toISOString().substr(0, 10)"
                               min="1970-01-01" @change="saveDate" first-day-of-week="1" :locale="this.$root.$i18n.locale">
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6" sm="12">
              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      min-width="auto" :return-value.sync="time">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="time" :label="$t('form.time')" dense outlined v-bind="attrs" v-on="on" readonly>
                  </v-text-field>
                </template>
                <v-time-picker format="24hr" v-if="menu2" v-model="time" @click:minute="$refs.menu2.save(time)">
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                    item-text="title" item-value="id" v-model="category_id" required></v-select>

          <v-radio-group v-model="currency" row :label="$t('form.currency')" :rules="currencyRules" dense outlined>
            <v-radio v-for="item in currencies" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-radio-group v-model="type" row :label="$t('form.type')" :rules="typeRules" dense outlined>
            <v-radio v-for="item in types" :key="item.type" :label="item.label" on-icon="radio_button_checked"
                     :value="item.type" off-icon="radio_button_unchecked"></v-radio>
          </v-radio-group>

          <v-text-field type="number" :label="$t('form.amount')" :rules="amountRules" v-model="amount" dense outlined
                        required></v-text-field>
          <v-text-field :label="$t('form.description')" maxlength="255" v-model="description" dense outlined></v-text-field>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.saveDate(new Date().toISOString().substr(0, 10)),
      menu: false,
      time: new Date().toTimeString().substr(0, 5),
      menu2: false,
      category_id: '',
      categoryRules: [
        v => !!v || this.$i18n.t('form.errors.categoryRequired')
      ],
      currency: 'rub',
      currencies: [
        { type: 'rub', label: 'RUB' },
        { type: 'usd', label: 'USD' },
        { type: 'eur', label: 'EUR' }
      ],
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      type: 'income',
      types: [
        { type: 'income', label: 'Доход' },
        { type: 'outcome', label: 'Расход' }
      ],
      typeRules: [
        v => !!v || this.$i18n.t('form.errors.typeRequired'),
      ],
      amount: 0,
      amountRules: [
        v => !!v || this.$i18n.t('form.errors.amountRequired'),
        v => (v > 0) || this.$i18n.t('form.errors.amountAboveZero'),
        v => (this.type === 'outcome' ? (this.currency === 'rub' ? (v < this.$store.getters.profile.balanceRUB)
            || this.$i18n.t('form.errors.amountInsufficient') : (this.currency === 'usd' ? (v < this.$store.getters.profile.balanceUSD)
            || this.$i18n.t('form.errors.amountInsufficient') : ((v < this.$store.getters.profile.balanceEUR)
            || this.$i18n.t('form.errors.amountInsufficient')))) : true)
      ],
      description: '',
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.category === null
    },
    category () {
      return this.$store.getters.category
    }
  },
  watch: {
    date () {
      this.dateFormatted = this.saveDate(this.date)
    }
  },
  methods: {
    saveDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [day, month, year] = date.split('.')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Event = {
          user_id: this.$store.getters.user.id,
          category_id: this.category_id,
          currency: this.currency,
          type: this.type,
          amount: parseFloat(this.amount),
          date: this.$moment(this.date + ' ' + this.time).format('X'),
          description: this.description
        }

        this.$store.dispatch('addEvent', Event).then(() => {
          this.$refs.form.reset()

          this.date = new Date().toISOString().substr(0, 10)
          this.dateFormatted = this.saveDate(new Date().toISOString().substr(0, 10))
          this.time = new Date().toTimeString().substr(0, 5)
          this.currency = 'rub'
          this.type = 'income'
          this.amount = 0
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordered {
  border-bottom: 1px solid #d7dde4;
  margin-bottom: 16px;
}
</style>
