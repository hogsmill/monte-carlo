import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'Monte Carlo Forecasting',
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    tab: 'forecast',
    backlog: [],
    completed: [],
    scope: '',
    backlogFrom: null,
    arrivalRate: true,
    config: {
      runs: 1000,
      runTo: 'Remaining'
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
    updateBacklogFrom: (state, payload) => {
      state.backlogFrom = payload.all
        ? null
        : payload.day + '/' + payload.month + '/' + payload.year
    },
    updateArrivalRate: (state, payload) => {
      state.arrivalRate = payload
    },
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
    updateTab: ({ commit }, payload) => {
      commit('updateTab', payload)
    },
    updateBacklog: ({ commit }, payload) => {
      commit('updateBacklog', payload)
    },
    updateScope: ({ commit }, payload) => {
      commit('updateScope', payload)
    },
    updateBacklogFrom: ({ commit }, payload) => {
      commit('updateBacklogFrom', payload)
    },
    updateArrivalRate: ({ commit }, payload) => {
      commit('updateArrivalRate', payload)
    }
  }
})
