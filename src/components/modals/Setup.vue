<template>
  <vue-final-modal name="setup" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['setup']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Set Up</h4>
      <table class="setup-form">
        <tr>
          <td rowspan="2" class="title">
            Company
          </td>
          <td>
            New:
          </td>
          <td>
            <input type="text" id="new-company">
          </td>
        </tr>
        <tr>
          <td>
            Select:
          </td>
          <td>
            <select id="existing-company" @change="setTeams()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(company, index) in companies" :key="index" :value="company.company">
                {{ company.company }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="title">
            Team
          </td>
          <td>
            New:
          </td>
          <td>
            <input type="text" id="new-team">
          </td>
        </tr>
        <tr>
          <td>
            Select:
          </td>
          <td>
            <select id="existing-team">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, index) in teams" :key="index">
                {{ team.name }}
              </option>
            </select>
          </td>
        </tr>
      </table>
      <button class="btn btn-sm btn-secondary smaller-font" @click="setup()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      currentCompany: '',
      teams: []
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    companies() {
      return this.$store.getters.getCompanies
    }
  },
  created() {
    bus.emit('sendGetCompanies')
  },
  methods: {
    hide() {
      this.$store.dispatch('updateScope', '')
      this.$store.dispatch('hideModal', 'setup')
    },
    getDefault(company, team) {
      bus.emit('sendGetDefault', {company: company, team, team})
    },
    setTeams() {
      const company = document.getElementById('existing-company').value
      this.teams = company ? this.companies.find((c) => {
        return c.company == company
      }).teams : []
    },
    setup() {
      const newCompany = document.getElementById('new-company').value
      const existingCompany = document.getElementById('existing-company').value
      const newTeam = document.getElementById('new-team').value
      const existingTeam = document.getElementById('existing-team').value
      const company = newCompany ? newCompany : existingCompany
      const team = newTeam ? newTeam : existingTeam
      bus.emit('sendAddCompany', {company: company, team: team})
      this.$store.dispatch('updateCurrent', {field: 'company', value: company})
      this.$store.dispatch('updateCurrent', {field: 'team', value: team})
      this.hide()
    }
  }
}
</script>

<style scoped lang="scss">
  .modal-container {

    .setup-form {
      width: 50%;
      margin: 12px auto;

      .title {
        font-weight: bold;
      }

      input, select {
        margin: 6px;
        width: 100%;
      }
    }
  }
</style>
