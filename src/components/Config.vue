<template>
  <div class="forecast">
    <h2>
      Current Backlog:
      <span v-if="backlogFrom">(from {{ backlogFrom }})</span>
      {{ backlog.length }} items, {{ completed.length }} completed
    </h2>
    <h3 v-if="!arrivalRate">
      Forecasting to complete remaining {{ backlog.length - completed.length }} items using {{ config.runs }} runs
    </h3>
    <h3 v-if="arrivalRate">
      Forecasting to complete {{ backlogLength() }} items using {{ config.runs }} runs<br>
      (<i>Remaining {{ backlog.length - completed.length }} items plus {{ remaining() }} predicted new items</i>)
    </h3>
  </div>
</template>

<script>
export default {
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    backlog() {
      return this.$store.getters.getBacklog
    },
    backlogFrom() {
      return this.$store.getters.getBacklogFrom
    },
    completed() {
      return this.$store.getters.getCompleted
    },
    arrivalRate() {
      return this.$store.getters.getArrivalRate
    },
    newCardsPerDay() {
      return this.$store.getters.getNewCardsPerDay
    }
  },
  methods: {
    backlogLength() {
      return parseInt(this.backlog.length * (1 + this.newCardsPerDay))
    },
    remaining() {
      return this.backlogLength() - this.backlog.length
    }
  }
}
</script>
