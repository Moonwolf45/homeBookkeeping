<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
export default {
  data () {
    return { }
  },
  computed: {
    layout () {
      return this.$route.meta.layout || 'main-layout'
    }
  }
}
</script>
