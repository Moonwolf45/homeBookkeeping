<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading, card-heading, card-heading, card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-card elevation="2" outlined v-if="!loading">
      <v-card-text>
        <v-card-title class="justify-space-between">
          <h4 class="title">{{ $t('overview.bills') }}</h4>

          <div class="text-right">
            <v-btn dark color="teal" @click="onAddBill">
              <v-icon dark>
                add
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <div class="card-content">
          <v-list-item two-line v-for="bill in profile" :key="bill.id">
            <v-list-item-content>
              <v-list-item-title class="table-bill">
                <div class="stat">{{ bill.name }}</div>

                <div class="currency-content">
                  <div class="stat-icon" v-html="$getSymbolCurrency(bill.currency)"></div>
                  <div class="stat-value">
                    <div class="value">{{ new Intl.NumberFormat(currenciesUser.filter((cur) => {
                      cur.CharCode === bill.currency }).locale, { style: 'decimal', currency: bill.currency,
                      minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bill.balance) }}
                    </div>
                  </div>
                  <div v-if="bill.currency !== currencyDefault" class="two-currency"> ~
                    <div class="stat-icon" v-html="$getSymbolCurrency(currencyDefault)"></div>
                    <div class="stat-value">
                      <div class="value"> {{ new Intl.NumberFormat(currentLocale, { style: 'decimal',
                        currency: currencyDefault, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          $getCurrencyBalance(currencies, bill.balance, bill.currency, currencyDefault)) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="action_button">
                  <v-btn dark small color="teal" @click="onEditBill(bill.id)">
                    <v-icon dark>
                      edit
                    </v-icon>
                  </v-btn>
                  <v-btn dark small color="teal" @click="onDeleteBill(bill.id)">
                    <v-icon dark>
                      delete
                    </v-icon>
                  </v-btn>
                </div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-progress-linear value="100" color="#008000" height="2"></v-progress-linear>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-card-text>
    </v-card>

    <ModalWindow :dialog="openModal">
      <v-card-title>
        <span class="text-h5">{{ $t('overview.createAnInvoice') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field :label="$t('form.billName')" maxlength="255" v-model="name" dense outlined />

            <v-radio-group :disabled="editModal" v-model="currency" :value="currencyDefault" row dense
                           :label="$t('form.currency')" :rules="currencyRules">
              <v-radio v-for="item in currenciesUser" :key="item.CharCode" :label="item.CharCode" on-icon="radio_button_checked"
                       :value="item.CharCode" off-icon="radio_button_unchecked" required></v-radio>
            </v-radio-group>

            <v-text-field :disabled="editModal" type="number" :label="$t('form.amount')" :rules="amountRules" dense
                          v-model="amount" required outlined />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal()">
          {{ $t('all.cancel') }}
        </v-btn>
        <v-btn color="blue darken-1" text @click="createAccount(editModal)" :loading="loading" :disabled="!valid || loading">
          {{ editModal ? $t('overview.edit') : $t('overview.create') }}
        </v-btn>
      </v-card-actions>
    </ModalWindow>
  </div>
</template>

<script>
import ModalWindow from './../../Other/ModalComponent';

export default {
  data () {
    return {
      openModal: false,
      editModal: false,
      bill_id: null,
      name: null,
      currency: this.currencyDefault,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      amount: 0,
      amountRules: [
        v => (v !== '' && v !== null) || this.$i18n.t('form.errors.amountRequired'),
        v => (v >= 0) || this.$i18n.t('form.errors.amountAboveZero')
      ],
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.profile === null || this.$store.getters.loadingMainCurrency
          || this.$store.getters.loadingCurrencyUser || this.$store.getters.loadingCurrency
    },
    profile () {
      return this.$store.getters.profile
    },
    currencyDefault () {
      return this.$store.getters.mainCurrency?.CharCode
    },
    currencies () {
      return this.$store.getters.currencies
    },
    currenciesUser () {
      return this.$store.getters.currenciesUser;
    },
    currentLocale () {
      return this.$store.getters.mainCurrency?.locale
    }
  },
  methods: {
    onAddBill () {
      this.openModal = !this.openModal;
    },
    onEditBill (id) {
      this.openModal = !this.openModal;
      const profile = this.$store.getters.profileById(id);
      this.editModal = profile.countEvent > 0;

      this.user_id = this.$store.getters.user.id;
      this.name = profile.name;
      this.amount = profile.balance;
      this.currency = profile.currency;
      this.bill_id = profile.id;
    },
    onDeleteBill (id) {
      let isConfirmDelete = confirm(this.$i18n.t('form.wantDeleteAccount'));
      if (isConfirmDelete) {
        const profile = this.$store.getters.profileById(id);

        this.$store.dispatch('deleteProfile', { id: profile.id, name: profile.name }).then(() => {})
          .catch(() => {})
      }
    },
    closeModal () {
      this.openModal = !this.openModal;
      this.editModal = false;

      this.$refs.form.reset();
      this.bill_id = null;
      this.name = null;
      this.currency = this.$store.getters.mainCurrency?.CharCode || 'RUB'
      this.amount = 0;
    },
    createAccount (edit = false) {
      if (this.$refs.form.validate()) {
        const Profile = {
          user_id: this.$store.getters.user?.id,
          name: this.name,
          balance: this.amount,
          currency: this.currency,
        }

        if (!edit) {
          this.$store.dispatch('createProfile', Profile).then(() => {
            this.closeModal();
          }).catch(() => {})
        } else {
          this.$store.dispatch('editProfile', {id: this.bill_id, ...Profile}).then(() => {
            this.closeModal();
          }).catch(() => {})
        }
      }
    }
  },
  components: {
    ModalWindow
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
.card-content {
  max-height: 500px;
  overflow-y: auto;
}
.table-bill {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.currency-content {
  display: flex;
}
.stat-icon {
  display: inline-block;
  width: 20px;
  margin-right: 5px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  color: #52bcd3;
}
.stat {
  display: inline-block;
  min-width: 100px;
  width: 35%;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;

  .value {
    font-size: 1.3vw;
    line-height: 24px;
    font-weight: 500;
    color: #4f5f6f;
  }
}
.stat-value {
  margin-right: 10px;
}
.stat-value,
.action_button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;

  font-size: 25px;
  line-height: 30px;
  font-weight: 500;
  color: #4f5f6f;

  .v-btn {
    margin: 0 5px 0 0;
  }

  .v-btn:last-child {
    margin: 0;
  }
}
.action_button {
  overflow: unset;
}
.two-currency {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  .stat-icon {
    width: 10px;
    margin-left: 10px;
    margin-right: 0;
    font-size: 15px;
    color: rgba(0, 0, 0, .6);
  }
  .stat-value {
    font-size: 15px;
    line-height: inherit;
    margin-right: 0;
  }
}

@media screen and (max-width: 1599px) {
  .v-btn:not(.v-btn--round).v-size--small {
    min-width: 40px;
    padding: 0 5px;
  }
}

@media screen and (max-width: 1439px) {
  .currency-content {
    flex-wrap: wrap;
  }
  .stat-value {
    font-size: 15px;
  }
}
@media screen and (max-width: 1023px) {
  .table-bill {
    flex-wrap: wrap;
  }
}
@media screen and (max-width: 424px) {

}
</style>
