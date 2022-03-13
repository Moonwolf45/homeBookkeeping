<template>
  <div>
    <v-card elevation="2" outlined>
      <v-card-title class="bordered">
        {{ $t('records.category.add_title') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field type="text" :label="$t('form.title')" v-model="title" dense required outlined />

          <v-color-picker elevation="2" v-model="color" mode="rgba" hide-mode-switch required></v-color-picker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :disabled="!valid">
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
      title: '',
      color: '',
      valid: false
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Category = {
          user_id: this.$store.getters.user.id,
          title: this.title,
          color: this.color,
        }

        this.$store.dispatch('addCategory', Category).then(() => {
          this.$refs.form.reset()
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
