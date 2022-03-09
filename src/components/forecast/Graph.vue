<template>
  <div>
    Canvas here...
    <canvas id="graph" />
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import cfg from './config/monteCarlo.js'

export default {
  data() {
    return{
      monteCarlo: cfg.config()
    }
  },
  computed: {
    results() {
      return this.$store.getters.getResults
    }
  },
  mounted() {
    this.showMonteCarlo({results: this.results})
  },
  methods: {
    showMonteCarlo(data) {
      this.monteCarlo.projectEstimate = data.projectEstimate
      this.monteCarlo.reEstimate = data.reEstimate
      this.monteCarlo.cardsLeft = data.cardsLeft
      this.monteCarlo.data.labels = data.results.days
      this.monteCarlo.data.datasets[0].data = data.results.counts
      this.monteCarlo.percentiles = data.results.percentiles
      this.monteCarlo.data.datasets[0].backgroundColor = []
      this.monteCarlo.data.datasets[0].borderColor = []
      const startDay = this.monteCarlo.data.labels[0]
      let color
      for (let i = startDay; i < this.monteCarlo.data.datasets[0].data.length + startDay; i++) {
        if (i <= data.results.percentiles[50]) {
          color = 'grey'
        } else if (i <= data.results.percentiles[75]) {
          color = 'green'
        } else if (i <= data.results.percentiles[90]) {
          color = 'orange'
        } else if (i <= data.results.percentiles[95]) {
          color = 'yellow'
        } else {
          color = 'red'
        }
        this.monteCarlo.data.datasets[0].backgroundColor.push(color)
        this.monteCarlo.data.datasets[0].borderColor.push(color)
      }
      const ctx = document.getElementById('graph').getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: this.monteCarlo.data,
        options: this.monteCarlo.options
      })
    }
  }

}
</script>

<style lang="scss">
  #graph {
    height: 600px;
    margin: 0 auto;
  }
</style>
