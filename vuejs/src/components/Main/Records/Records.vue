<template>
  <div>
    <div class="title-block">
      <h3 class="main_title left">
        {{ $t('records.name') }}
      </h3>
    </div>

    <v-row>
      <v-col cols="12" md="6" sm="12">
        <addEvent></addEvent>
      </v-col>

      <v-col cols="12" md="6" sm="12">
        <addCategory></addCategory>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" sm="12">
        <editCategory></editCategory>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import addEvent from '@/components/Main/Records/addEvent';
import addCategory from '@/components/Main/Records/addCategory';
import editCategory from '@/components/Main/Records/editCategory';

export default {
  data () {
    return {}
  },
  components: {
    addEvent: addEvent,
    addCategory: addCategory,
    editCategory: editCategory
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
</style>
