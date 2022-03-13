<template>
  <div>
    <v-skeleton-loader class="mx-auto" type="card-heading" v-if="loading">
    </v-skeleton-loader>

    <v-card elevation="2" outlined v-if="!loading">
      <v-card-title class="bordered">
        {{ $t('records.category.edit_title') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-select :items="category" :label="$t('form.category')" :rules="categoryRules" dense outlined
                    :item-text="categoryName" item-value="id" v-model="category_id" @change="changeData"></v-select>

          <v-text-field type="text" :label="$t('form.title')" v-model="title" dense required outlined />

          <v-color-picker elevation="2" v-model="color" mode="rgba" hide-mode-switch required></v-color-picker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" @click="onSubmit()" :loading="loading" :disabled="!valid || loading">
          {{ $t('form.edit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      category_id: '',
      categoryRules: [
        v => !!v || this.$i18n.t('form.errors.categoryRequired')
      ],
      title: '',
      user_id: '',
      color: '',
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loadingCategory
    },
    category () {
      return this.$store.getters.category
    }
  },
  methods: {
    categoryName (item) {
      return this.$i18n.t(item.title)
    },
    changeData () {
      let cat = this.$store.getters.categoryById(this.category_id)
      this.title = this.$i18n.t(cat.title)
      this.user_id = cat.user_id
      this.hexToRgbA(cat.color)
    },
    hexToRgbA (hex) {
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('')
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')

        this.color = 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',1)'
      }

      this.color = hex
    },
    onSubmit () {
      if (this.$refs.form.validate()) {
        const Category = {
          id: this.category_id,
          user_id: this.user_id,
          title: this.title,
          color: this.color,
        }

        this.$store.dispatch('editCategory', Category).then(() => {
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
