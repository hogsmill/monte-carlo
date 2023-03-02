import io from 'socket.io-client'
import bus from './EventBus'

const prod = location.hostname != 'localhost'

let asConnStr, connStr
if (!prod) {
  asConnStr = 'http://localhost:3099'
  connStr = 'http://localhost:3016'
} else {
  asConnStr = 'https://agilesimulations.co.uk:3099'
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

const connectToAgileSimulations = location.hostname != 'localhost'
let asSocket
if (connectToAgileSimulations) {
  console.log('Connecting to: ' + asConnStr)
  asSocket = io(asConnStr)
}

// Agile Simulations (login)

if (connectToAgileSimulations) {

  bus.on('sendCheckLogin', (data) => { asSocket.emit('sendCheckLogin', data) })

  bus.on('sendRating', (data) => { asSocket.emit('sendRating', data) })

  asSocket.on('loginSuccess', (data) => { bus.emit('loginSuccess', data) })

  asSocket.on('logout', (data) => { bus.emit('logout', data) })
}

socket.on('connect_error', (err) => { bus.emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.emit('updateConnections', data) })

// Send

bus.on('sendGetCompanies', () => { socket.emit('sendGetCompanies') })

bus.on('sendGetDefault', () => { socket.emit('sendGetDefault') })

bus.on('sendAddCompany', (data) => { socket.emit('sendAddCompany', data) })

bus.on('sendUpdateDefault', (data) => { socket.emit('sendUpdateDefault', data) })

bus.on('sendUpdateHeaderFields', (data) => { bus.emit('updateHeaderFields', data) })

bus.on('sendBacklogLoaded', (data) => { bus.emit('backlogLoaded', data) })

bus.on('sendForecast', () => { bus.emit('forecast') })

// Receive

socket.on('updateCompanies', (data) => { bus.emit('updateCompanies', data) })

export default bus
