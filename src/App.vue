<template>
  <div id="app">
    <Header />
    <div v-if="connectionError" class="not-connected">
      WARNING: You are not connected to the server: {{ connectionError }}
    </div>
    <div v-if="localStorageStatus != 'ok'" class="not-connected">
      WARNING: {{ localStorageStatus }} - please enable cookies in browser settings
    </div>
    <Actions />
    <Config />
    <File v-if="scope == 'loadBacklog'" />
    <Forecast v-if="scope == 'showForecast'" />
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import ls from './lib/localStorage.js'

import Header from './components/Header.vue'
import Actions from './components/Actions.vue'
import Config from './components/Config.vue'
import File from './components/File.vue'
import Forecast from './components/Forecast.vue'
import Modals from './components/Modals.vue'

export default {
  name: 'App',
  components: {
    Header,
    Actions,
    Config,
    File,
    Forecast,
    Modals
  },
  computed: {
    connectionError() {
      return this.$store.getters.getConnectionError
    },
    localStorageStatus() {
      return this.$store.getters.getLocalStorageStatus
    },
    scope() {
      return this.$store.getters.getScope
    },
    newCardsPerDay() {
      return this.$store.getters.getNewCardsPerDay
    }
  },
  created() {
    this.$store.dispatch('localStorageStatus', ls.check())

    bus.on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    bus.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.on('updateCompanies', (data) => {
      this.$store.dispatch('updateCompanies', data)
    })

    bus.on('updateDefaults', (data) => {
      console.log(data)
      //this.$store.dispatch('updateCompanies', data)
    })
  }
}
</script>

<style lang="scss">

  h1 {
    margin-top: 24px;
  }

  .not-connected {
    background-color: red;
    color: #fff;
    font-weight: bold;
    margin: 6px;
  }

</style>
