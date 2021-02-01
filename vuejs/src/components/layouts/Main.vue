<template>
  <v-app>
    <v-navigation-drawer app permanent dark color="#3a4651" width="320">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <div class="logo">
              <span class="l l1"></span>
              <span class="l l2"></span>
              <span class="l l3"></span>
              <span class="l l4"></span>
              <span class="l l5"></span>
            </div>

            {{ $t('main.homeBookkeeping') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item-group>
<!--          <v-list-item :to="/overview">-->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>account_balance_wallet</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t('main.bill') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

<!--          <v-list-item :to="/history">-->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>history</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t('main.history') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

<!--          <v-list-item :to="/planning">-->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>business_center</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t('main.planning') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

<!--          <v-list-item :to="/records">-->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>add_box</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t('main.recording') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="language">
            <template v-slot:activator>
              <v-list-item-title>{{ $t('main.language') }}</v-list-item-title>
            </template>

            <v-list-item @click="setLocale('ru')">
              <v-list-item-content>
                <v-list-item-title>{{ $t('main.russian') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="setLocale('en')">
              <v-list-item-content>
                <v-list-item-title>{{ $t('main.english') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="content">
      <v-toolbar color="#d7dde4">
        <v-spacer></v-spacer>

        <div class="header-block header-block-nav">
          {{ $t('main.hello', { name: username }) }}
        </div>

        <v-btn>
          <v-icon left>exit_to_app</v-icon>

          {{ $t('main.logout') }}
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.logo {
  display: inline-block;
  width: 45px;
  height: 25px;
  vertical-align: middle;
  margin-right: 5px;
  position: relative;

  .l {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: #52bcd3;
    position: absolute;
  }

  .l.l1 {
    bottom: 0;
    left: 0;
  }

  .l.l2 {
    width: 7px;
    height: 7px;
    bottom: 13px;
    left: 10px;
  }

  .l.l3 {
    width: 7px;
    height: 7px;
    bottom: 4px;
    left: 17px;
  }

  .l.l4 {
    bottom: 13px;
    left: 25px;
  }

  .l.l5 {
    bottom: 0;
    left: 34px;
  }
}

.header-block {
  padding: .5rem 15px;
}

.header-block-nav {
  margin-left: auto;
  padding: 0 15px;
  font-weight: 700;
  color: #4f5f6f;
}

.content {
  background-color: #f0f3f6;
  box-shadow: 0 0 3px #ccc;
  transition: left 0.3s ease;
}
</style>

<script>
export default {
  data () {
    return {
      username: ''
    }
  },
  methods: {
    beforeMount() {
      const locale = localStorage.getItem('locale') || 'ru';
      this.$root.$i18n.locale = locale;
      // if (locale === 'ru') {
      //   this.$material.locale = RUSSIAN_DATEPICKER_LOCALE;
      // } else if (locale === 'en') {
      //   this.$material.locale = ENGLISH_DATEPICKER_LOCALE;
      // }
    },
    setLocale(locale) {
      this.$root.$i18n.locale = locale;
      // if (locale === 'ru') {
      //   this.$material.locale = RUSSIAN_DATEPICKER_LOCALE;
      // } else if (locale === 'en') {
      //   this.$material.locale = ENGLISH_DATEPICKER_LOCALE;
      // }
      localStorage.setItem('locale', locale);
    }
  }
}
</script>
