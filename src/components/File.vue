<template>
  <div>
    <div class="instructions">
      <div v-if="!current.headerFieldsFound">
        1) Select a file and delimiter, then click '<b>Get Field Names</b>'
      </div>
      <div v-if="current.headerFieldsFound && !fieldsSelected()">
        2) Select the correct fields for <b>Id</b>, <b>Creation Date</b> and
        <b>Completed Date</b>
      </div>
      <div v-if="fieldsSelected() && !current.dateFormat">
        3) Select the correct <b>Date Format</b>, and how much of the backlog to load. <br>
        Note: it is best to use the last few months maximum to get the best predictions.
      </div>
    </div>
    <table class="backlog">
      <tr>
        <td>
          File
        </td>
        <td>
          <input id="backlog-file" type="file" @change="selectFile()">
          <br>
          Current File: {{ current.file ? current.file.name : 'No File Selected' }}
        </td>
      </tr>
      <Delimiter :scope="'load'" />
      <tr>
        <td colspan="2" class="center">
          <button class="btn btn-sm btn-secondary smaller-font" :disabled="!current.file" @click="getHeaderFields()">
            Get Field Names
          </button>
        </td>
      </tr>
      <tr v-if="fileSelected() && current.headerFieldsFound">
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
                <select id="id-field" :value="current.fieldNames.id" @change="setField('id')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in current.headerFields" :key="index">
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
                <select id="created-field" :value="current.fieldNames.created" @change="setField('created')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in current.headerFields" :key="index">
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
                <select id="delivered-field" :value="current.fieldNames.delivered" @change="setField('delivered')">
                  <option value="">
                    -- Select --
                  </option>
                  <option v-for="(field, index) in current.headerFields" :key="index">
                    {{ field }}
                  </option>
                </select>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr v-if="fieldsSelected()">
        <td>
          Date Format:
        </td>
        <td>
          <select id="date-format" @change="setDateFormat()" :value="current.dateFormat">
            <option>
              -- Select --
            </option>
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
      <tr v-if="fieldsSelected()">
        <td rowspan="2">
          Load
        </td>
        <td>
          <input id="full-backlog" type="checkbox" :checked="current.all" @click="entireBacklog()"> Entire backlog
        </td>
      </tr>
      <tr v-if="fieldsSelected()">
        <td>
          From
          <select id="start-day" :value="current.day" @change="setDate()">
            <option value="">
              -- DD --
            </option>
            <option v-for="(d, index) in 31" :key="index">
              {{ d }}
            </option>
          </select> /
          <select id="start-month" :value="current.month" @change="setDate()">
            <option value="">
              -- MM --
            </option>
            <option v-for="(m, index) in 12" :key="index">
              {{ monthName(m) }}
            </option>
          </select> /
          <select id="start-year" :value="current.year" @change="setDate()">
            <option value="">
              -- YY --
            </option>
            <option v-for="(y, index) in 5" :key="index">
              {{ y + 2020 }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="fieldsSelected()">
        <td>
          Use Arrival Rate?
        </td>
        <td>
          <input id="arrival-rate" type="checkbox" :checked="current.arrivalRate" @click="toggleArrivalRate()">
          (<i>Recommended - take into account the rate of creation of new items</i>)
          <div v-if="current.arrivalRate">
            Arrival rate percentage:
            <select id="arrival-rate-percentage" :value="current.arrivalRatePercentage" @change="updateArrivalRatePercentage()">
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
      <tr v-if="fieldsSelected()">
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
      months: {},
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
    current() {
      return this.$store.getters.getCurrent
    }
  },
  created() {
    this.months = dateFuns.monthNames()

    bus.on('updateHeaderFields', (data) => {
      this.updateDefault('headerFields', data.fields)
      this.$store.dispatch('updateCurrent', {field: 'headerFields', value: data.fields})
    })

    bus.on('backlogLoaded', (data) => {
      const scope = {
        dateFormat: this.current.dateFormat,
        created: 'created',
        delivered: 'delivered',
        arrivalRatePercentage: this.current.arrivalRatePercentage
      }
      const newCardsPerDay = this.current.arrivalRate ? fileFuns.calculateArrivalRate(data.backlog, scope) : 0
      this.$store.dispatch('updateBacklog', data.backlog)
      this.$store.dispatch('updateNewCardsPerDay', newCardsPerDay)
      alert('Backlog loaded. Backlog has ' + this.backlog.length + ' items, ' + this.completed.length + ' completed')
      document.getElementById('backlog-file').value = ''
    })
  },
  methods: {
    updateDefault(field, value) {
      if (this.current.company && this.current.team) {
        bus.emit('sendUpdateDefault', {
          company: this.current.company,
          team: this.current.team,
          field: field,
          value: value
        })
      }
    },
    monthName(n) {
      return this.months[n]
    },
    fileSelected() {
      return this.current.file
    },
    fieldsSelected() {
      return this.fileSelected && this.current.fieldNames.id &&
             this.current.fieldNames.created && this.current.fieldNames.delivered
    },
    selectFile() {
      const file = document.getElementById('backlog-file').files[0]
      this.$store.dispatch('updateCurrent', {field: 'file', value: file})
      this.$store.dispatch('updateCurrent', {field: 'headerFieldsFound', value: false})
    },
    selectDelimiter() {
      this.delimiter = !!document.getElementById('backlog-load-file-separator').value
    },
    setDateFormat() {
      const format = document.getElementById('date-format').value
      this.updateDefault('dateFormat', format)
      this.$store.dispatch('updateCurrent', {field: 'dateFormat', value: format})
    },
    setField(field) {
      const value = document.getElementById(field + '-field').value
      this.$store.dispatch('updateCurrentField', {field: field, value: value})
      this.updateDefault('fieldNames', this.current.fieldNames)
    },
    getHeaderFields() {
      const file = this.current.file
      const separator = this.current.delimiter
      if (!separator) {
        alert('Please select a delimiter')
      } else {
        fileFuns.headerFields(file, separator)
        this.updateDefault('delimiter', separator)
        this.$store.dispatch('updateCurrent', {field: 'headerFieldsFound', value: true})
      }
    },
    entireBacklog() {
      if (document.getElementById('full-backlog').checked) {
        this.$store.dispatch('updateCurrent', {field: 'day', value: ''})
        this.$store.dispatch('updateCurrent', {field: 'month', value: ''})
        this.$store.dispatch('updateCurrent', {field: 'year', value: ''})
        this.$store.dispatch('updateCurrent', {field: 'all', value: true})
      }
    },
    toggleArrivalRate() {
      const arrivalRate = document.getElementById('arrival-rate').value
      this.$store.dispatch('updateCurrent', {field: 'arrivalRate', value: arrivalRate})
    },
    all() {
      return !this.current.day || !this.current.month || !this.current.year
    },
    setDate() {
      const day = document.getElementById('start-day').value
      const month = document.getElementById('start-month').value
      const year = document.getElementById('start-year').value
      this.$store.dispatch('updateCurrent', {field: 'day', value: day})
      this.$store.dispatch('updateCurrent', {field: 'month', value: month})
      this.$store.dispatch('updateCurrent', {field: 'year', value: year})
      this.$store.dispatch('updateCurrent', {field: 'all', value: this.all()})
    },
    updateArrivalRatePercentage() {
      const rate = document.getElementById('arrival-rate-percentage').value
      this.$store.dispatch('updateCurrent', {field: 'arrivalRatePercentage', value: rate})
    },
    readyToLoad() {
      return this.current.file &&
        this.current.delimiter &&
        this.current.fieldNames.id &&
        this.current.fieldNames.created &&
        this.current.fieldNames.delivered &&
        this.current.dateFormat
    },
    loadBacklog() {
      console.log(this.current)
      if (!this.readyToLoad()) {
        alert('Please complete all fields')
      } else {
        const scope = {
          delimiter: this.current.delimiter,
          id: this.current.id,
          created: this.current.fieldNames.created,
          delivered: this.current.fieldNames.delivered,
          dateFormat: this.current.dateFormat,
          day: this.current.day,
          month: dateFuns.months()[this.current.month],
          year: this.current.year,
          all: this.current.all,
          arrivalRate: this.current.arrivalRate,
        }
        this.$store.dispatch('updateBacklogFrom', {
          delimiter: scope.delimiter,
          all: scope.all,
          day: scope.day,
          month: scope.month,
          year: scope.year
        })
        fileFuns.loadBacklog(this.current.file, scope)
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
