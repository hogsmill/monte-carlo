<template>
  <div class="forecast">
    <button class="btn btn-info" @click="forecast()">
      Forecast
    </button>
    <div>
      <table v-if="results.percentiles[50]" class="results">
        <thead>
          <tr>
            <th>
              Probability
            </th>
            <th>
              Complete In
            </th>
            <th>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            50%
          </td>
          <td>
            {{ results.percentiles[50] }} days
          </td>
          <td>
            {{ getDate(results.percentiles[50]) }}
          </td>
        </tr>
        <tr>
          <td>
            75%
          </td>
          <td>
            {{ results.percentiles[75] }} days
          </td>
          <td>
            {{ getDate(results.percentiles[75]) }}
          </td>
        </tr>
        <tr>
          <td>
            90%
          </td>
          <td>
            {{ results.percentiles[90] }} days
          </td>
          <td>
            {{ getDate(results.percentiles[90]) }}
          </td>
        </tr>
        <tr>
          <td>
            95%
          </td>
          <td>
            {{ results.percentiles[95] }} days
          </td>
          <td>
            {{ getDate(results.percentiles[95]) }}
          </td>
        </tr>
        <tr>
          <td>
            99%
          </td>
          <td>
            {{ results.percentiles[99] }} days
          </td>
          <td>
            {{ getDate(results.percentiles[99]) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dateFuns from '../lib/dates.js'
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
    },
    completed() {
      return this.$store.getters.getCompleted
    }
  },
  methods: {
    getDate(d) {
      return dateFuns.daysFromToday(d).toDateString()
    },
    forecast() {
      const config = {
        runs: 1000,
        runTo: 'Remaining'
      }
      this.results = monteCarlo.run(this.backlog, this.completed, config)
    }
  }
}
</script>

<style lang="scss">
  .results {
    margin: 24px auto;

    th {
      font-weight: bold;
    }

    th, td {
      font-size: x-large;
      padding: 18px;
      border: 1px solid #bbb;
    }
  }
</style>
