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

//socket.on('connect_error', (err) => { bus.emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.emit('updateConnections', data) })

// Send

bus.on('sendBacklogLoaded', (data) => { bus.emit('backlogLoaded', data) })

bus.on('sendUpdateHeaderFields', (data) => { bus.emit('updateHeaderFields', data) })

bus.on('sendForecast', () => { bus.emit('forecast') })

// Receive

//socket.on('testMessage', (data) => { bus.emit('testMessage', data) })

export default bus
