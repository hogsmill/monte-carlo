<template>
  <div class="actions">
    <i class="fas fa-user-cog" title="Set Up" :class="{ 'selected': scope == 'setup' }" @click="showSetup()" />
    <i class="fas fa-file-alt" title="Load Backlog" :class="{ 'selected': scope == 'loadBacklog' }" @click="setScope('loadBacklog')" />
    <i class="fas fa-chart-line" title="Show Forecast" :class="{ 'selected': scope == 'showForecast' }" @click="setScope('showForecast')" />
  </div>
</template>

<script>
export default {
  computed: {
    scope() {
      return this.$store.getters.getScope
    }
  },
  methods: {
    setScope(scope) {
      if (scope == 'loadBacklog') {
        this.$store.dispatch('clear')
      }
      this.$store.dispatch('updateScope', scope)
    },
    showSetup() {
      this.setScope('setup')
      this.$store.dispatch('showModal', 'setup')
    }
  }
}
</script>

<style lang="scss">
  .actions {
    .fas {
      margin: 12px;
      font-size: 48pt;
      color: #888;

      &:hover {
        color: #444;
        cursor: pointer;
      }

      &.selected {
        color: #f4511e;
      }
    }
  }
</style>
