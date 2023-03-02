
import { createStore } from 'vuex'

function setDefaults(state) {
  console.log('setting defaults')
  for (let i = 0; i < state.companies.length; i++) {
    if (state.companies[i].name == state.current.company) {
      const teams = state.companies[i].teams
      for (let j = 0; j < teams.length; j++) {
        if (teams[j].name == state.current.team) {
          console.log(4)
          const keys = Object.keys(teams[i].defaults)
          const defaults = teams[j].defaults
          for (let k = 0; k < keys.length; k++) {
            state.current[keys[k]] = defaults[keys[k]]
          }
        }
      }
    }
  }
  console.log(state.current)
  return state.current
}

export const store = createStore({
  state: {
    thisGame: 'Monte Carlo Forecasting',
    modals: {
      setup: false,
      feedback: false
    },
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    companies: [],
    tab: 'forecast',
    backlog: [],
    completed: [],
    scope: '',
    backlogFrom: null,
    newCardsPerDay: 0,
    config: {
      runs: 1000,
      runTo: 'Remaining'
    },
    current: {
      company: '',
      team: '',
      file: '',
      delimiter: '',
      headerFieldsFound: '',
      headerFields: [],
      fieldNames: {
        id: '',
        created: '',
        delivered: ''
      },
      dateFormat: '',
      all: true,
      day: '',
      month: '',
      year: '',
      arrivalRate: true,
      arrivalRatePercentage: 1,
    },
    results: {},
    clearFields: {
      backlog: [],
      completed: [],
      backlogFrom: null,
      arrivalRate: true,
      newCardsPerDay: 0,
      results: {}
    }
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getConnections: (state) => {
      return state.connections
    },
    getConnectionError: (state) => {
      return state.connectionError
    },
    getLocalStorageStatus: (state) => {
      return state.localStorageStatus
    },
    getModals: (state) => {
      return state.modals
    },
    getTab: (state) => {
      return state.tab
    },
    getConfig: (state) => {
      return state.config
    },
    getCompanies: (state) => {
      return state.companies
    },
    getCurrent: (state) => {
      return state.current
    },
    getBacklog: (state) => {
      return state.backlog
    },
    getCompleted: (state) => {
      return state.completed
    },
    getScope: (state) => {
      return state.scope
    },
    getBacklogFrom: (state) => {
      return state.backlogFrom
    },
    getNewCardsPerDay: (state) => {
      return state.newCardsPerDay
    },
    getResults: (state) => {
      return state.results
    }
  },
  mutations: {
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    updateConnectionError: (state, payload) => {
      state.connectionError = payload
    },
    localStorageStatus: (state, payload) => {
      state.localStorageStatus = payload
    },
    showModal: (state, payload) => {
      state.modals[payload] = true
    },
    hideModal: (state, payload) => {
      state.modals[payload] = false
    },
    updateTab: (state, payload) => {
      state.tab = payload
    },
    updateCompanies: (state, payload) => {
      state.companies = payload.companies
      if (state.current.company && state.current.team) {
        state.current = setDefaults(state)
        console.log(state.current)
      }
    },
    updateCurrent: (state, payload) => {
      state.current[payload.field] = payload.value
    },
    updateCurrentField: (state, payload) => {
      state.current.fieldNames[payload.field] = payload.value
    },
    updateBacklog: (state, payload) => {
      state.backlog = payload
      state.completed = []
      for (let i = 0; i < state.backlog.length; i++) {
        if (state.backlog[i].delivery) {
          state.completed.push(state.backlog[i])
        }
      }
    },
    updateScope: (state, payload) => {
      state.scope = payload
    },
    clear: (state, payload) => {
      const fields = Object.keys(state.clearFields)
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        state[field] = state.clearFields[field]
      }
    },
    updateBacklogFrom: (state, payload) => {
      state.backlogFrom = payload.all
        ? null
        : payload.day + '/' + payload.month + '/' + payload.year
    },
    updateNewCardsPerDay: (state, payload) => {
      state.newCardsPerDay = payload
    },
    updateResults: (state, payload) => {
      state.results = payload
    }
  },
  actions: {
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    },
    updateConnectionError: ({ commit }, payload) => {
      commit('updateConnectionError', payload)
    },
    localStorageStatus: ({ commit }, payload) => {
      commit('localStorageStatus', payload)
    },
    showModal: ({ commit }, payload) => {
      commit('showModal', payload)
    },
    hideModal: ({ commit }, payload) => {
      commit('hideModal', payload)
    },
    updateTab: ({ commit }, payload) => {
      commit('updateTab', payload)
    },
    updateCompanies: ({ commit }, payload) => {
      commit('updateCompanies', payload)
    },
    updateCurrent: ({ commit }, payload) => {
      commit('updateCurrent', payload)
    },
    updateCurrentField: ({ commit }, payload) => {
      commit('updateCurrentField', payload)
    },
    updateBacklog: ({ commit }, payload) => {
      commit('updateBacklog', payload)
    },
    clear: ({ commit }) => {
      commit('clear')
    },
    updateScope: ({ commit }, payload) => {
      commit('updateScope', payload)
    },
    updateBacklogFrom: ({ commit }, payload) => {
      commit('updateBacklogFrom', payload)
    },
    updateNewCardsPerDay: ({ commit }, payload) => {
      commit('updateNewCardsPerDay', payload)
    },
    updateResults: ({ commit }, payload) => {
      commit('updateResults', payload)
    }
  }
})
