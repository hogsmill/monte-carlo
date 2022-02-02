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
    scope: '',
    config: {
      runs: 1000,
      runTo: 50
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
    getScope: (state) => {
      return state.scope
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
    },
    updateScope: (state, payload) => {
      state.scope = payload
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
    updateTab: ({ commit }, payload) => {
      commit('updateTab', payload)
    },
    updateBacklog: ({ commit }, payload) => {
      commit('updateBacklog', payload)
    },
    updateScope: ({ commit }, payload) => {
      commit('updateScope', payload)
    }
  }
})
