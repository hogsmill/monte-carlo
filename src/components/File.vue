<template>
  <table class="backlog">
    <tr>
      <td>
        Load from file<br>
        <i>(Must be CSV, with columns Id, StartDate, EndDate</i>)
      </td>
      <td class="upload">
        <table class="inner-table">
          <Delimiter :scope="'load'" />
          <tr>
            <td>
              <input id="backlog-file" type="file">
            </td>
          </tr>
          <tr>
            <td>
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

import fileFuns from '../lib/file.js'

import Delimiter from './backlog/Delimiter.vue'

export default {
  components: {
    Delimiter
  },
  computed: {
    completed() {
      return this.$store.getters.getCompleted
    },
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  created() {
    bus.$on('backlogLoaded', (data) => {
      this.$store.dispatch('updateBacklog', data.backlog)
      alert('Backlog loaded. Backlog has ' + this.backlog.length + ' items, ' + this.completed.length + ' completed')
      document.getElementById('backlog-file').value = ''
    })
  },
  methods: {
    loadBacklog() {
      const file = document.getElementById('backlog-file').files[0]
      const separator = document.getElementById('backlog-load-file-separator').value
      fileFuns.loadBacklog(file, separator)
    }
  }
}
</script>

<style lang="scss">
  .backlog {
    margin: 0 auto;

    td {
      border: 1px solid #888;
      padding: 6px;
    }
  }
</style>
