
import { createStore } from 'vuex'

export const store = createStore({
  state: {
    thisGame: 'Monte Carlo Forecasting',
    modals: {
      feedback: false
    },
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    tab: 'forecast',
    backlog: [],
    completed: [],
    scope: '',
    backlogFrom: null,
    arrivalRate: true,
    arrivalRatePercentage: 1,
    newCardsPerDay: 0,
    config: {
      runs: 1000,
      runTo: 'Remaining'
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
    getArrivalRate: (state) => {
      return state.arrivalRate
    },
    getArrivalRatePercentage: (state) => {
      return state.arrivalRatePercentage
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
    updateArrivalRate: (state, payload) => {
      state.arrivalRate = payload
    },
    updateArrivalRatePercentage: (state, payload) => {
      state.arrivalRatePercentage = payload
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
    updateArrivalRate: ({ commit }, payload) => {
      commit('updateArrivalRate', payload)
    },
    updateArrivalRatePercentage: ({ commit }, payload) => {
      commit('updateArrivalRatePercentage', payload)
    },
    updateNewCardsPerDay: ({ commit }, payload) => {
      commit('updateNewCardsPerDay', payload)
    },
    updateResults: ({ commit }, payload) => {
      commit('updateResults', payload)
    }
  }
})
