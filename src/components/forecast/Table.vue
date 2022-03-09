<template>
  <table class="results">
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
</template>

<script>
import dateFuns from '../../lib/dates.js'

export default {
  computed: {
    results() {
      return this.$store.getters.getResults
    }
  },
  methods: {
    getDate(d) {
      return dateFuns.daysFromToday(d).toDateString()
    }
  }
}
</script>
