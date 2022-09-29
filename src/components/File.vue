<template>
  <div>
    <div class="instructions">
      <div v-if="step == 1">
        1) Select a file and delimiter, then click '<b>Get Field Names</b>'
      </div>
      <div v-if="step == 2">
        2) Select the correct fields for Id, Creation date and completed date
      </div>
      <div v-if="step == 3">
        3) Select the correct date format, and how much of the backlog to load. Note: it is best to
        use the last few months maximum to get the best predictions.
      </div>
    </div>
    <table class="backlog">
      <tr>
        <td>
          File
        </td>
        <td>
          <input id="backlog-file" type="file" @change="selectFile()">
        </td>
      </tr>
      <Delimiter :scope="'load'" />
      <tr>
        <td colspan="2" class="center">
          <button class="btn btn-sm btn-secondary smaller-font" :disabled="!fileSelected" @click="getHeaderFields()">
            Get Field Names
          </button>
        </td>
      </tr>
      <tr v-if="step > 1">
        <td>
          Field Names
        </td>
        <td>
          <table class="fields">
            <tr>
              <td>
                Id:
              </td>
              <td>
                <select id="id-field" :value="id" @change="setField('id')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in headerFields" :key="index">
                    {{ field }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                Created:
              </td>
              <td>
                <select id="created-field" :value="created" @change="setField('created')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in headerFields" :key="index">
                    {{ field }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                Delivered:
              </td>
              <td>
                <select id="delivered-field" :value="delivered" @change="setField('delivered')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in headerFields" :key="index">
                    {{ field }}
                  </option>
                </select>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr v-if="step > 2">
        <td>
          Date Format:
        </td>
        <td>
          <select id="dateformat-field" @change="setField('dateformat')" :value="dateformat">
            <option value="JIRA Default">
              12/Feb/22 (JIRA Default)
            </option>
            <option value="UK Short">
              15/07/22 (DD/MM/YY)
            </option>
            <option value="US Short">
              7/15/22 (MM/DD/YY)
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="step > 2">
        <td rowspan="2">
          Load
        </td>
        <td>
          <input id="full-backlog" type="checkbox" :checked="all" @click="entireBacklog()"> Entire backlog
        </td>
      </tr>
      <tr v-if="step > 2">
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
      <tr v-if="step > 2">
        <td>
          Use Arrival Rate?
        </td>
        <td>
          <input id="arrival-rate" type="checkbox" :checked="arrivalRate" @click="toggleArrivalRate()">
          (<i>Recommended - take into account the rate of creation of new items</i>)
          <div v-if="arrivalRate">
            Arrival rate percentage:
            <select id="arrival-rate-percentage" :value="arrivalRatePercentage" @change="updateArrivalRatePercentage()">
              <option value="0.1">
                10
              </option>
              <option value="0.1">
                20
              </option>
              <option value="0.25">
                25
              </option>
              <option value="0.33">
                33
              </option>
              <option value="0.5">
                50
              </option>
              <option value="0.75">
                75
              </option>
              <option value="0.9">
                90
              </option>
              <option value="1">
                100
              </option>
            </select>
          </div>
        </td>
      </tr>
      <tr v-if="step > 2">
        <td colspan="2" class="button-row">
          <button class="btn btn-sm btn-secondary smaller-font" @click="loadBacklog()">
            Load
          </button>
        </td>
      </tr>
    </table>
  </div>
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
      step: 1,
      id: 'id',
      created: 'Created',
      delivered: 'Resolved',
      dateformat: 'JIRA Default',
      months: {},
      day: null,
      month: null,
      year: null,
      all: true,
      fileSelected: false,
      headerFields: []
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
    },
    arrivalRatePercentage() {
      return this.$store.getters.getArrivalRatePercentage
    }
  },
  created() {
    this.months = dateFuns.monthNames()

    bus.on('updateHeaderFields', (data) => {
      this.headerFields = data.fields
    })

    bus.on('backlogLoaded', (data) => {
      const scope = {
        dateFormat: this.dateformat,
        created: 'created',
        delivered: 'delivered',
        arrivalRatePercentage: this.arrivalRatePercentage
      }
      const newCardsPerDay = this.arrivalRate ? fileFuns.calculateArrivalRate(data.backlog, scope) : 0
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
    selectFile() {
      this.fileSelected = !!document.getElementById('backlog-file').value
    },
    selectDelimiter() {
      this.delimiter = !!document.getElementById('backlog-load-file-separator').value
    },
    setField(field) {
      this[field] = document.getElementById(field + '-field').value
      if (this.id && this.created && this.delivered) {
        this.step = 3
      }
    },
    getHeaderFields() {
      const file = document.getElementById('backlog-file').files[0]
      const separator = document.getElementById('backlog-load-file-separator').value
      if (!separator) {
        alert('Please select a delimiter')
      } else {
        fileFuns.headerFields(file, separator)
        this.step = 2
      }
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
      this.all = !this.day || !this.month || !this.year
      if (this.all || (this.day && this.month && this.year)) {
        this.step = 4
      }
    },
    updateArrivalRatePercentage() {
      const rate = document.getElementById('arrival-rate-percentage').value
      this.$store.dispatch('updateArrivalRatePercentage', rate)
    },
    loadBacklog() {
      const file = document.getElementById('backlog-file').files[0]
      if (!file) {
        alert('Please select a file')
      } else {
        const separator = document.getElementById('backlog-load-file-separator').value
        const scope = {
          id: this.id,
          created: this.created,
          delivered: this.delivered,
          dateFormat: this.dateformat,
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
  .instructions {
    width: 80%;
    height: 110px;
    margin: 12px auto;
    font-size: x-large;
    display: flex;

    div {
      margin: auto auto;
    }
  }

  .backlog {
    margin: 24px auto;

    td {
      text-align: left;
      border: 1px solid #888;
      padding: 6px;

      &.center {
        text-align: center !important;
      }

      .button-row {
        text-align: center;
      }

      .fields {
        td {
          border: 0;
        }
      }
    }
  }
</style>
