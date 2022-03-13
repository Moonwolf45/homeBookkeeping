<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent :max-width="maxWidthBlock" class="modal-window">
      <v-card>
        <slot></slot>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['dialog', 'maxWidth'],
  data () {
    return {}
  },
  computed: {
    maxWidthBlock: function () {
      return this.maxWidth || '600px'
    }
  }
}
</script>

<style scoped lang="scss">
</style>
