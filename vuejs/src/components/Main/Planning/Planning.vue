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
      <PlanningEventComponent @callCreatePlanningEvent="createPlanningEvent" @callCloseModal="closeModalEventComponent" />
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
              <v-col cols="5">
                <v-treeview :active.sync="active" :items="itemsTree" :load-children="fetchUsers" :open.sync="open"
                            activatable color="success" open-on-click transition>
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="!item.children">
                      mdi-account
                    </v-icon>
                  </template>
                </v-treeview>
              </v-col>

              <v-divider vertical></v-divider>

              <v-col class="d-flex text-center">
                <v-scroll-y-transition mode="out-in">
                  <div v-if="!selected" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                    {{ users.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                  </div>
                  <v-card v-else :key="selected.id" class="pt-6 mx-auto" flat max-width="400">
                    <v-card-text>
                      <h3 class="text-h5 mb-2">
                        {{ selected.name }}
                      </h3>
                      <div class="blue--text mb-2">
                        {{ selected.email }}
                      </div>
                      <div class="blue--text subheading font-weight-bold">
                        {{ selected.username }}
                      </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-row class="text-left" tag="v-card-text">
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Company:
                      </v-col>
                      <v-col>{{ selected.company.name }}</v-col>
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Website:
                      </v-col>
                      <v-col>
                        <a :href="`//${selected.website}`" target="_blank">{{ selected.website }}</a>
                      </v-col>
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Phone:
                      </v-col>
                      <v-col>{{ selected.phone }}</v-col>
                    </v-row>
                  </v-card>
                </v-scroll-y-transition>
              </v-col>
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
              <v-col cols="5">
                <v-treeview :active.sync="active1" :items="itemsTree1" :load-children="fetchUsers" :open.sync="open1"
                            activatable color="success" open-on-click transition>
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="!item.children">
                      mdi-account
                    </v-icon>
                  </template>
                </v-treeview>
              </v-col>

              <v-divider vertical></v-divider>

              <v-col class="d-flex text-center">
                <v-scroll-y-transition mode="out-in">
                  <div v-if="!selected1" class="text-h6 grey--text text--lighten-1 font-weight-light justify-center align-self-center flex-grow-1">
                    {{ users1.length > 0 ? $t('planning.selectPlanningEvent') : $t('planning.selectPlanningDate') }}
                  </div>
                  <v-card v-else :key="selected1.id" class="pt-6 mx-auto" flat max-width="400">
                    <v-card-text>
                      <h3 class="text-h5 mb-2">
                        {{ selected1.name }}
                      </h3>
                      <div class="blue--text mb-2">
                        {{ selected1.email }}
                      </div>
                      <div class="blue--text subheading font-weight-bold">
                        {{ selected1.username }}
                      </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-row class="text-left" tag="v-card-text">
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Company:
                      </v-col>
                      <v-col>{{ selected1.company.name }}</v-col>
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Website:
                      </v-col>
                      <v-col>
                        <a :href="`//${selected1.website}`" target="_blank">{{ selected1.website }}</a>
                      </v-col>
                      <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                        Phone:
                      </v-col>
                      <v-col>{{ selected1.phone }}</v-col>
                    </v-row>
                  </v-card>
                </v-scroll-y-transition>
              </v-col>
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

export default {
  data() {
    return {
      tab: this.$i18n.t('planning.tabs.active'),
      items: [
        this.$i18n.t('planning.tabs.active'), this.$i18n.t('planning.tabs.notActive'),
      ],
      active: [],
      active1: [],
      open: [],
      open1: [],
      users: [],
      users1: [],

      actionPlanningEvent: false,
      objectPlanningEventElement: null
    }
  },
  computed: {
    loadingPlanningEvents () {
      return this.$store.getters.loadingPlanningEvents
    },
    itemsTree () {
      return [{ name: 'Users', children: this.users }]
    },
    itemsTree1 () {
      return [{ name: 'Users', children: this.users1 }]
    },
    selected () {
      if (!this.active.length) return undefined
      const id = this.active[0]

      return this.users.find(user => user.id === id)
    },
    selected1 () {
      if (!this.active1.length) return undefined
      const id = this.active1[0]

      return this.users1.find(user => user.id === id)
    },
  },
  watch: {
    // selected: 'randomAvatar',
    // selected1: 'randomAvatar',
  },
  methods: {
    async fetchUsers (item) {
      // Remove in 6 months and say
      // you've made optimizations! :)
      return fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(json => (item.children.push(...json)))
      .catch(err => console.warn(err))
    },
    addPlanEvent () {
      this.actionPlanningEvent = !this.actionPlanningEvent
    },
    createPlanningEvent (planningEvent) {
      this.objectPlanningEventElement = planningEvent

      // this.$store.dispatch('getAllEvents', Filter).then(() => {
      //   this.setChart_1();
      //   this.setChart_2();
      // }).catch(() => {})
    },
    closeModalEventComponent () {
      this.actionPlanningEvent = !this.actionPlanningEvent;
    }
  },
  components: {
    PlanningEventComponent,
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
</style>
