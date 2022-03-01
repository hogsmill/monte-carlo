<template>
  <div class="forecast">
    <button class="btn btn-info" @click="forecast()">
      Forecast
    </button>
    <div class="forecast-display">
      <i class="fas fa-table" title="Table" :class="{ 'selected': scope == 'table' }" @click="setScope('table')" />
      <i class="fas fa-chart-line" title="Graph" :class="{ 'selected': scope == 'graph' }" @click="setScope('graph')" />
    </div>
    <div>
      <table v-if="results.percentiles[50] && scope == 'table'" class="results">
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
      <div v-if="scope == 'graph'">
        <BarChart :chartdata="monteCarlo.data" :options="monteCarlo.options" />
      </div>
    </div>
  </div>
</template>

<script>
import dateFuns from '../lib/dates.js'
import fileFuns from '../lib/file.js'
import monteCarlo from '../lib/monteCarlo.js'

import BarChart from './forecast/BarChart.vue'

export default {
  components: {
    BarChart
  },
  data() {
    return {
      scope: 'table',
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
    },
    arrivalRate() {
      return this.$store.getters.getArrivalRate
    },
    newCardsPerDay() {
      return this.$store.getters.getNewCardsPerDay
    }
  },
  methods: {
    setScope(scope) {
      this.scope = scope
    },
    getDate(d) {
      return dateFuns.daysFromToday(d).toDateString()
    },
    forecast() {
      let backlogLength
      if (this.arrivalRate) {
         backlogLength = parseInt(this.backlog.length * (1 + this.newCardsPerDay))
      }
      const config = {
        runs: 100000,
        runTo: this.arrivalRate ? backlogLength : 'Remaining',
        arrivalRate: this.arrivalRate
      }
      this.results = monteCarlo.run(this.backlog, this.completed, config)
    }
  }
}
</script>

<style lang="scss">
  .forecast-display {
    .fas {
      margin: 3px;
      font-size: x-large;
      color: #888;
    }
  }

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
