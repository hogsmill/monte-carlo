<template>
  <h3>
    Based on <b>{{ arrivalRate() }}</b> new cards per week
  </h3>
</template>

<script>
import maths from '../../lib/maths.js'

export default {
  computed: {
    current() {
      return this.$store.getters.getCurrent
    },
    newCardsPerDay() {
      return this.$store.getters.getNewCardsPerDay
    }
  },
  methods: {
    arrivalRate() {
      return maths.format(this.newCardsPerDay * 7 * this.current.arrivalRatePercentage)
    }
  }
}
</script>
