<template>
  <section class="container">
    <h1>{{model.fields.title}}</h1>
  </section>
</template>

<script>
import BasePage from '@/plugins/mixins/BasePage'

export default {
  components: {},
  mixins: [
    BasePage
  ],
  // data: () => {
    

  // },
  props: [
    'model'
  ],
  created () {},
  updated () {}
}
</script>

<style lang="scss" scoped>

</style>
