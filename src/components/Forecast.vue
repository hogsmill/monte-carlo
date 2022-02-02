<template>
  <div class="forecast">
    <button @click="forecast()">
      Forecast
    </button>
    <div>
      <table v-if="results.percentiles[50]" class="results">
        <tr>
          <td>
            50%
          </td>
          <td>
            {{ results.percentiles[50] }} days
          </td>
        </tr>
        <tr>
          <td>
            75%
          </td>
          <td>
            {{ results.percentiles[75] }} days
          </td>
        </tr>
        <tr>
          <td>
            90%
          </td>
          <td>
            {{ results.percentiles[90] }} days
          </td>
        </tr>
        <tr>
          <td>
            95%
          </td>
          <td>
            {{ results.percentiles[95] }} days
          </td>
        </tr>
        <tr>
          <td>
           99%
          </td>
          <td>
            {{ results.percentiles[99] }} days
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import monteCarlo from '../lib/monteCarlo.js'

export default {
  data() {
    return {
      results: {
        percentiles: {}
      }
    }
  },
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  methods: {
    forecast() {
      this.results = monteCarlo.run(this.backlog, this.config)
    }
  }
}
</script>

<style lang="scss">
  .results {
    margin: 12px auto;

    td {
      padding: 6px;
      border: 1px solid;
    }
  }
</style>
