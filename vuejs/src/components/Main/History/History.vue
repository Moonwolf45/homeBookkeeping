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

    <v-row>
      <v-col v-if="!income" cols="12" md="6" sm="12">
        <v-skeleton-loader class="mx-auto" type="card-heading, image"></v-skeleton-loader>
      </v-col>

      <v-col v-if="income" cols="12" md="6" sm="12">
        <v-card elevation="2" outlined>
          <v-card-title>
            <h4 class="title">{{ $t('history.chart.income') }}</h4>
          </v-card-title>
          <div>
            <chart :data="this.chart_1"></chart>
          </div>
        </v-card>
      </v-col>

      <v-col v-if="!outcome" cols="12" md="6" sm="12">
        <v-skeleton-loader class="mx-auto" type="card-heading, image"></v-skeleton-loader>
      </v-col>

      <v-col v-if="outcome" cols="12" md="6" sm="12">
        <v-card elevation="2" outlined>
          <v-card-title>
            <h4 class="title">{{ $t('history.chart.outcome') }}</h4>
          </v-card-title>
          <div>
            <chart :data="this.chart_2"></chart>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-skeleton-loader v-if="!events_loading" width="100%" type="table-thead, table-tbody"></v-skeleton-loader>
<!--      <v-simple-table v-if="events_loading" width="100">-->
<!--        <template v-slot:default>-->
<!--          <thead>-->
<!--            <tr>-->
<!--              <th v-for="header in headers" :key="header.title" class="text-center">-->
<!--                {{ header.title }}-->
<!--              </th>-->
<!--            </tr>-->
<!--          </thead>-->

<!--          <tbody>-->
<!--            <tr v-for="item in events" :key="item.id">-->
<!--              <td class="text-center">{{ item.id }}</td>-->
<!--              <td class="text-center">{{ item.date }}</td>-->
<!--              <td class="text-center">{{ item.category_id }}</td>-->
<!--              <td class="text-center">{{ item.type }}</td>-->
<!--              <td class="text-center">{{ item.currency }}</td>-->
<!--&lt;!&ndash;              <td v-if="" class="text-center">{{ item.amount }}</td>&ndash;&gt;-->
<!--              <td class="text-center">{{ new Intl.NumberFormat('ru-RU', { style: 'decimal', currency: 'RUB',-->
<!--                minimumSignificantDigits: 3 }).format(item.amount) }}</td>-->
<!--              <td class="text-center"></td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--        </template>-->
<!--      </v-simple-table>-->

      <v-data-table v-if="events_loading" class="elevation-2" :headers="headers" :items="events" :disable-sort=true
                    :footer-props="{ disableItemsPerPage: true, prevIcon: 'keyboard_arrow_left',
                    nextIcon: 'keyboard_arrow_right' }" :locale="this.$root.$i18n.locale">
        <template v-slot:item.type="{ item }">
          <span :class="getColor(item.type)">
            {{ item.type === 'income' ? $t('history.chart.income') : $t('history.chart.outcome') }}
          </span>
        </template>

<!--        <template v-slot:top>-->
<!--          <v-dialog v-model="dialog" max-width="500px">-->
<!--            <v-card>-->
<!--              <v-card-title>-->
<!--                <span class="headline">{{ formTitle }}</span>-->
<!--              </v-card-title>-->

<!--              <v-card-text>-->
<!--                <v-container>-->
<!--                  <v-row>-->
<!--                    <v-col cols="12" sm="6" md="4">-->
<!--                      <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>-->
<!--                    </v-col>-->

<!--                    <v-col cols="12" sm="6" md="4">-->
<!--                      <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>-->
<!--                    </v-col>-->

<!--                    <v-col cols="12" sm="6" md="4">-->
<!--                      <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>-->
<!--                    </v-col>-->

<!--                    <v-col cols="12" sm="6" md="4">-->
<!--                      <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>-->
<!--                    </v-col>-->

<!--                    <v-col cols="12" sm="6" md="4">-->
<!--                      <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>-->
<!--                    </v-col>-->
<!--                  </v-row>-->
<!--                </v-container>-->
<!--              </v-card-text>-->

<!--              <v-card-actions>-->
<!--                <v-spacer></v-spacer>-->
<!--                <v-btn color="blue darken-1" text @click="closeDialog">-->
<!--                  Cancel-->
<!--                </v-btn>-->

<!--                <v-btn color="blue darken-1" text @click="save">-->
<!--                  Save-->
<!--                </v-btn>-->
<!--              </v-card-actions>-->
<!--            </v-card>-->
<!--          </v-dialog>-->

<!--          <v-dialog v-model="dialogDelete" max-width="500px">-->
<!--            <v-card>-->
<!--              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>-->
<!--              <v-card-actions>-->
<!--                <v-spacer></v-spacer>-->
<!--                <v-btn color="blue darken-1" text @click="closeDialogDelete">Cancel</v-btn>-->
<!--                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>-->
<!--                <v-spacer></v-spacer>-->
<!--              </v-card-actions>-->
<!--            </v-card>-->
<!--          </v-dialog>-->
<!--        </template>-->

<!--        <template v-slot:item.action="{ item }">-->
<!--          <v-icon small class="mr-2" @click="editItem(item)">-->
<!--            edit-->
<!--          </v-icon>-->
<!--          <v-icon small @click="deleteItem(item)">-->
<!--            delete-->
<!--          </v-icon>-->
<!--        </template>-->
      </v-data-table>
    </v-row>
  </div>
</template>

<script>
import Chart from '@/components/Main/History/Chart';

export default {
  data () {
    return {
      headers: [
        { text: '#', value: 'id' },
        { text: this.$i18n.t('history.table.date'), value: 'date' },
        { text: this.$i18n.t('history.table.category'), value: 'category_id' },
        { text: this.$i18n.t('history.table.type'), value: 'type' },
        { text: this.$i18n.t('history.table.currency'), value: 'currency' },
        { text: this.$i18n.t('history.table.amount'), value: 'amount' },
        { text: this.$i18n.t('history.table.action'), value: 'action' }
      ],
      chart_1: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      chart_2: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      // dialog: false,
      // dialogDelete: false,
      // editedIndex: -1,
      // editedItem: {
      //   name: '',
      //   calories: 0,
      //   fat: 0,
      //   carbs: 0,
      //   protein: 0,
      // },
      // defaultItem: {
      //   name: '',
      //   calories: 0,
      //   fat: 0,
      //   carbs: 0,
      //   protein: 0,
      // },
    }
  },
  computed: {
    events_loading () {
      return this.$store.getters.events !== null
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
    loadEvents () {
      return !this.$store.getters.loadEvents
    }
  },
  watch: {
    income () {
      if (this.income !== false) {
        this.setChart_1()
      }
    },
    outcome () {
      if (this.outcome !== false) {
        this.setChart_2()
      }
    },
    // dialog (val) {
    //   val || this.closeDialog()
    // },
    // dialogDelete (val) {
    //   val || this.closeDialogDelete()
    // },
  },
  mounted () {
    this.getCharts()
  },
  methods: {
    getCharts () {
      this.$store.dispatch('getAllEvents', '').then(() => {}).catch(() => {})
    },
    setChart_1 () {
      let labels_chart_1 = []
      const colors_chart_1 = []
      const dats_chart_1 = []

      if (this.$store.getters.income !== null) {
        Object.keys(this.$store.getters.income).map((income) => {
          labels_chart_1.push(this.$store.getters.income[income].label)
          colors_chart_1.push(this.$store.getters.income[income].color)
          dats_chart_1.push(this.$store.getters.income[income].total)
        })
      }

      this.chart_1 = {
        labels: labels_chart_1,
        datasets: [{ backgroundColor: colors_chart_1, data: dats_chart_1 }]
      }
    },
    setChart_2 () {
      let labels_chart_2 = []
      const colors_chart_2 = []
      const dats_chart_2 = []

      if (this.$store.getters.outcome !== null) {
        Object.keys(this.$store.getters.outcome).map((outcome) => {
          labels_chart_2.push(this.$store.getters.outcome[outcome].label)
          colors_chart_2.push(this.$store.getters.outcome[outcome].color)
          dats_chart_2.push(this.$store.getters.outcome[outcome].total)
        })
      }

      this.chart_2 = {
        labels: labels_chart_2,
        datasets: [{ backgroundColor: colors_chart_2, data: dats_chart_2 }]
      }
    },
    onFilter () {

    },
    getColor (type) {
      if (type === 'income') {
        return 'green--text'
      } else {
        return 'red--text'
      }
    },
    // editItem (item) {
    //   this.editedIndex = this.desserts.indexOf(item)
    //   this.editedItem = Object.assign({}, item)
    //   this.dialog = true
    // },
    // deleteItem (item) {
    //   this.editedIndex = this.desserts.indexOf(item)
    //   this.editedItem = Object.assign({}, item)
    //   this.dialogDelete = true
    // },
    // deleteItemConfirm () {
    //   this.desserts.splice(this.editedIndex, 1)
    //   this.closeDelete()
    // },
    // closeDialog () {
    //   this.dialog = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },
    // closeDialogDelete () {
    //   this.dialogDelete = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },
    // save () {
    //   if (this.editedIndex > -1) {
    //     Object.assign(this.desserts[this.editedIndex], this.editedItem)
    //   } else {
    //     this.desserts.push(this.editedItem)
    //   }
    //   this.close()
    // }
  },
  components: {
    chart: Chart,
  }
}
</script>

<style scoped lang="scss">
.main_title {
  float: left;
  font-size: 1.45rem;
  line-height: 1.1;
  font-weight: 600;
  margin: 0;
  color: #4f5f6f;
}
.v-data-table {
  width: 100%;
}
</style>
