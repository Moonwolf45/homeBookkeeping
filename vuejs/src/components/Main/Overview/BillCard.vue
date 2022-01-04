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

        <v-list-item two-line v-for="bill in profile" :key="bill.id">
          <v-list-item-content>
            <v-list-item-title class="table-bill">
              <div class="stat">{{ bill.name }}</div>

              <div class="currency-content">
                <div v-if="bill.currency === 'RUB'" class="stat-icon">&#8381;</div>
                <div v-else-if="bill.currency === 'USD'" class="stat-icon">&#36;</div>
                <div v-else-if="bill.currency === 'EUR'" class="stat-icon">&euro;</div>
                <div class="stat-value">
                  <div class="value">{{ new Intl.NumberFormat(currencies.filter(currency =>
                    currency.CharCode === bill.currency).locale, { style: 'decimal', currency: bill.currency,
                    minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bill.balance) }}
                  </div>
                </div>
              </div>

              <div class="action_button">
                <v-btn dark color="teal" @click="onEditBill(bill.id)">
                  <v-icon dark>
                    edit
                  </v-icon>
                </v-btn>
                <v-btn dark color="teal" @click="onDeleteBill(bill.id)">
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
      </v-card-text>
    </v-card>

    <modalWindow :dialog="openModal">
      <v-card-title>
        <span class="text-h5">{{ $t('overview.createAnInvoice') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field :label="$t('form.billName')" maxlength="255" v-model="name" dense outlined></v-text-field>

            <v-radio-group :disabled="editModal" v-model="currency" row :label="$t('form.currency')" dense outlined
                           :rules="currencyRules">
              <v-radio v-for="item in currencies" :key="item.CharCode" :label="item.CharCode" on-icon="radio_button_checked"
                       :value="item.CharCode" off-icon="radio_button_unchecked" required></v-radio>
            </v-radio-group>

            <v-text-field :disabled="editModal" type="number" :label=" $t('form.amount')" :rules="amountRules"
                          v-model="amount" dense outlined required></v-text-field>
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
    </modalWindow>
  </div>
</template>

<script>
import ModalWindow from '@/components/Other/Modal';

export default {
  data () {
    return {
      openModal: false,
      editModal: false,
      bill_id: null,
      name: null,
      currency: null,
      currencyRules: [
        v => !!v || this.$i18n.t('form.errors.currencyRequired')
      ],
      amount: 0,
      amountRules: [
        v => (v !== '' && v !== null) || this.$i18n.t('form.errors.amountRequired'),
        v => (v >= 0) || this.$i18n.t('form.errors.amountAboveZero'),
      ],
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.profile === null
    },
    profile () {
      return this.$store.getters.profile
    },
    mainCurrency () {
      return this.$store.getters.mainCurrency
    },
    currencies () {
      return this.$store.getters.currenciesUser;
    }
  },
  watch: {
    mainCurrency () {
      this.currency = this.mainCurrency.CharCode
    }
  },
  methods: {
    onAddBill () {
      this.openModal = !this.openModal;
    },
    onEditBill (id) {
      this.openModal = !this.openModal;
      this.editModal = true;
      const profile = this.$store.getters.profileById(id);

      this.user_id = this.$store.getters.user.id;
      this.name = profile.name;
      this.balance = profile.amount;
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
      this.name = null;
      this.currency = 'rub';
      this.amount = 0;
    },
    createAccount (edit = false) {
      if (this.$refs.form.validate()) {
        const Profile = {
          user_id: this.$store.getters.user.id,
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
    modalWindow: ModalWindow
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
.table-bill {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.currency-content {
  display: flex;
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
  width: 35%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;

  .value {
    font-size: 1.3vw;
    line-height: 24px;
    font-weight: 500;
    color: #4f5f6f;
  }
}
.stat-value,
.action_button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;

  font-size: 1.3vw;
  line-height: 24px;
  font-weight: 500;
  color: #4f5f6f;

  .v-btn {
    margin: 0 5px 0 0;
  }
}
</style>
