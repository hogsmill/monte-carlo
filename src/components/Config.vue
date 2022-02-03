<template>
  <div class="forecast">
    <h2>
      Current Backlog: {{ backlog.length }} items, {{ completed.length }} completed
    </h2>
    <h3>
      Forecasting to complete remaining {{ backlog.length - completed.length }} items using {{ config.runs }} runs
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
    completed() {
      return this.$store.getters.getCompleted
    }
  }
}
</script>
