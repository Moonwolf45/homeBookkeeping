<template>
  <v-card class="elevation-2 auth-block">
    <v-card-title class="auth-header">
      <img src="/images/404.jpg" alt="404">
      <h1 class="auth-title">
        {{ $t('all.notFoundText') }} </h1>

      <router-link :to="'/'" custom v-slot="{ navigate, href }">
        <v-btn class="ma-2" :href="href" @click="navigate" elevation="2">{{ $t('all.buttonNotFoundText') }}</v-btn>
      </router-link>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'NotFoundComponent'
}
</script>

<style scoped lang="scss">
.auth-block {
  width: 100%;
  margin: 0 auto;

  .v-card__title+.v-card__subtitle {
    margin-top: 0;
  }

  .auth-header {
    flex-direction: column;
    text-align: center;
    border-bottom: 1px solid #52bcd3;
    justify-content: center;

    .auth-title {
      color: #97a4b1;
      padding: 4px;
      line-height: 30px;
      font-size: 26px;
      font-weight: 600;
      margin: 0;
    }
  }
}
</style>
