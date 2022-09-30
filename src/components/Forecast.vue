<template>
  <div class="forecast">
    <h1 v-if="!results.percentiles" class="calculating">
      Calculating results...
      <span class="spinner-border" />
    </h1>
    <div v-if="results.percentiles" class="forecast-display">
      <i class="fas fa-table" title="Show results table" :class="{ 'selected': scope == 'table' }" @click="setScope('table')" />
      <i class="fas fa-chart-line" title="Show results graph" :class="{ 'selected': scope == 'graph' }" @click="setScope('graph')" />
    </div>
    <div>
      <ArrivalRate />
      <Table v-if="results.percentiles && scope == 'table'" />
      <Graph v-if="results.percentiles && scope == 'graph'" />
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import monteCarlo from '../lib/monteCarlo.js'

import ArrivalRate from './forecast/ArrivalRate.vue'
import Table from './forecast/Table.vue'
import Graph from './forecast/Graph.vue'

export default {
  components: {
    ArrivalRate,
    Table,
    Graph
  },
  data() {
    return {
      scope: null
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
    current() {
      return this.$store.getters.getCurrent
    },
    newCardsPerDay() {
      return this.$store.getters.getNewCardsPerDay
    },
    results() {
      return this.$store.getters.getResults
    }
  },
  mounted() {
    bus.on('forecast', () => {
      this.forecast()
    })

    window.setTimeout(() => {
      bus.emit('sendForecast')
    }, 100)
  },
  methods: {
    setScope(scope) {
      this.scope = scope
    },
    forecast() {
      let backlogLength
      if (this.current.arrivalRate) {
         backlogLength = parseInt(this.backlog.length * (1 + this.newCardsPerDay))
      }
      const config = {
        runs: 10000,
        runTo: this.current.arrivalRate ? backlogLength : 'Remaining',
        arrivalRate: this.current.arrivalRate
      }
      const results = monteCarlo.run(this.backlog, this.completed, config)
      this.setScope('table')
      this.$store.dispatch('updateResults', results)
    }
  }
}
</script>

<style lang="scss">
  .calculating {
    padding-top: 48px;

    .spinner-border {
      border-width: 0.3rem;
      position: relative;
      top: -10px;
      color: #f4511e;
    }
  }

  .forecast-display {
    .fas {
      margin: 12px 6px;
      font-size: xxx-large;
      color: #888;

      &.selected {
        color: #f4511e;
      }
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
