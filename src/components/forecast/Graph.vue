<template>
  <div class="graph">
    <div class="monte-carlo-percentiles rounded">
      Probability of completing all remaining cards:
      <ul>
        <li><div :class="getColor(50)" /> 50% in <b>{{ config.percentiles[50] }}</b> days ({{ getDate(config.percentiles[50]) }})</li>
        <li><div :class="getColor(75)" /> 75% in <b>{{ config.percentiles[75] }}</b> days ({{ getDate(config.percentiles[75]) }})</li>
        <li><div :class="getColor(90)" /> 90% in <b>{{ config.percentiles[90] }}</b> days ({{ getDate(config.percentiles[90]) }})</li>
        <li><div :class="getColor(95)" /> 95% in <b>{{ config.percentiles[95] }}</b> days ({{ getDate(config.percentiles[95]) }})</li>
        <li><div :class="getColor(99)" /> 99% in <b>{{ config.percentiles[99] }}</b> days ({{ getDate(config.percentiles[99]) }})</li>
      </ul>
    </div>
    <canvas id="graph" />
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import dateFuns from '../../lib/dates.js'

import cfg from './config/monteCarlo.js'

export default {
  data() {
    return{
      config: cfg.config()
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
    getColor(n) {
      return this.config.colors[n]
    },
    getDate(d) {
      return dateFuns.daysFromToday(d).toDateString()
    },
    showMonteCarlo(data) {
      this.config.projectEstimate = data.projectEstimate
      this.config.reEstimate = data.reEstimate
      this.config.cardsLeft = data.cardsLeft
      this.config.data.labels = data.results.days
      this.config.data.datasets[0].data = data.results.counts
      this.config.percentiles = data.results.percentiles
      this.config.data.datasets[0].backgroundColor = []
      this.config.data.datasets[0].borderColor = []
      const startDay = this.config.data.labels[0]
      let color
      for (let i = startDay; i < this.config.data.datasets[0].data.length + startDay; i++) {
        if (i <= data.results.percentiles[50]) {
          color = this.getColor(50)
        } else if (i <= data.results.percentiles[75]) {
          color = this.getColor(75)
        } else if (i <= data.results.percentiles[90]) {
          color = this.getColor(90)
        } else if (i <= data.results.percentiles[95]) {
          color = this.getColor(95)
        } else {
          color = this.getColor(99)
        }
        this.config.data.datasets[0].backgroundColor.push(color)
        this.config.data.datasets[0].borderColor.push(color)
      }
      const ctx = document.getElementById('graph').getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: this.config.data,
        options: this.config.options
      })
    }
  }

}
</script>

<style lang="scss">
  .graph {
    position: relative;

    .monte-carlo-percentiles {
      text-align: left;
      border: 1px solid #aaa;
      background-color: #fff;
      position: absolute;
      top: 48px;
      left: 50px;
      padding: 12px;

      ul {
        padding-left: 16px;

        li {
          text-align: left;
          list-style-type: none;

          div {
            height: 10px;
            width: 10px;
            display: inline-block;

            &.grey {
              background-color: #bbb;
            }
            &.green {
              background-color: green;
            }
            &.orange {
              background-color: orange;
            }
            &.yellow {
              background-color: yellow;
            }
            &.red {
              background-color: red;
            }
          }
        }
      }
    }

    #graph {
      height: 600px;
      margin: 0 auto;
    }
  }
</style>
