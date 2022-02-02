<template>
  <div class="forecast">
    <h2>
      Current Backlog: {{ backlog.length }} items
    </h2>
    <h3>
      Forecasting to {{ config.runTo }} items using {{ config.runs }} runs
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
    }
  }
}
</script>
