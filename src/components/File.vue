<template>
  <table class="backlog">
    <tr>
      <td>
        Load from file<br>
        <i>(Must have columns Created and Resolved</i>)
      </td>
      <td class="upload">
        <table class="inner-table">
          <Delimiter :scope="'load'" />
          <tr>
            <td>
              File
            </td>
            <td>
              <input id="backlog-file" type="file">
            </td>
          </tr>
          <tr>
            <td rowspan="2">
              Load
            </td>
            <td>
              <input id="full-backlog" type="checkbox" :checked="all" @click="entireBacklog()"> Entire backlog
            </td>
          </tr>
          <tr>
            <td>
              From
              <select id="start-day" :value="day" @change="setDate()">
                <option value="">
                  -- DD --
                </option>
                <option v-for="(d, index) in 31" :key="index">
                  {{ d }}
                </option>
              </select> /
              <select id="start-month" :value="month" @change="setDate()">
                <option value="">
                  -- MM --
                </option>
                <option v-for="(m, index) in 12" :key="index">
                  {{ monthName(m) }}
                </option>
              </select> /
              <select id="start-year" :value="year" @change="setDate()">
                <option value="">
                  -- YY --
                </option>
                <option v-for="(y, index) in 5" :key="index">
                  {{ y + 2020 }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Use Arrival Rate?
            </td>
            <td>
              <input id="arrival-rate" type="checkbox" :checked="arrivalRate" @click="toggleArrivalRate()">
            </td>
          </tr>
          <tr>
            <td colspan="2" class="button-row">
              <button class="btn btn-sm btn-secondary smaller-font" @click="loadBacklog()">
                Load
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../socket.js'

import dateFuns from '../lib/dates.js'
import fileFuns from '../lib/file.js'

import Delimiter from './backlog/Delimiter.vue'

export default {
  components: {
    Delimiter
  },
  data() {
    return {
      months: {},
      day: null,
      month: null,
      year: null,
      all: true
    }
  },
  computed: {
    completed() {
      return this.$store.getters.getCompleted
    },
    backlog() {
      return this.$store.getters.getBacklog
    },
    arrivalRate() {
      return this.$store.getters.getArrivalRate
    }
  },
  created() {
    this.months = dateFuns.monthNames()

    bus.on('backlogLoaded', (data) => {
      const newCardsPerDay = this.arrivalRate ? fileFuns.calculateArrivalRate(data.backlog) : 0
      this.$store.dispatch('updateBacklog', data.backlog)
      this.$store.dispatch('updateNewCardsPerDay', newCardsPerDay)
      alert('Backlog loaded. Backlog has ' + this.backlog.length + ' items, ' + this.completed.length + ' completed')
      document.getElementById('backlog-file').value = ''
    })
  },
  methods: {
    monthName(n) {
      return this.months[n]
    },
    entireBacklog() {
      this.all = !this.all
      if (this.all) {
        this.day = null
        this.month = null
        this.year = null
      }
    },
    toggleArrivalRate() {
      const arrivalRate = !this.arrivalRate
      this.$store.dispatch('updateArrivalRate', arrivalRate)
    },
    setDate() {
      this.day = document.getElementById('start-day').value
      this.month = document.getElementById('start-month').value
      this.year = document.getElementById('start-year').value
      this.all = !this.day || !this.month ||! this.year
    },
    loadBacklog() {
      const file = document.getElementById('backlog-file').files[0]
      if (!file) {
        alert('Please select a file')
      } else {
        const separator = document.getElementById('backlog-load-file-separator').value
        const scope = {
          day: this.day,
          month: dateFuns.months()[this.month],
          year: this.year,
          all: this.all,
          arrivalRate: this.arrivalRate,
        }
        this.$store.dispatch('updateBacklogFrom', {all: this.all, day: this.day, month: this.month, year: this.year})
        fileFuns.loadBacklog(file, separator, scope)
      }
    }
  }
}
</script>

<style lang="scss">
  .backlog {
    margin: 24px auto;

    td {
      padding: 6px;
    }

    .inner-table {
      td {
        text-align: left;
        border: 1px solid #888;

        &.button-row {
          text-align: center;
        }
      }
    }
  }
</style>
