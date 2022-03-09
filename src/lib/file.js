
import bus from '../socket.js'
import dateFuns from './dates.js'

const papa = require('papaparse')
const { v4: uuidv4 } = require('uuid')

function daysDiff(startDate, endDate) {
  const diff = endDate - startDate
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function newestStartDate(backlog, scope) {
  const createdField = scope.created
  const deliveredField = scope.delivered
  let newest = dateFuns.parseDate(backlog[0][createdField], scope.dateFormat)
  for (let i = 1; i < backlog.length - 1; i++) {
    const d = dateFuns.parseDate(backlog[i][createdField], scope.dateFormat)
    if (d - newest > 0) {
      newest = d
    }
  }
  return newest
}

function oldestStartDate(backlog, scope) {
  const createdField = scope.created
  const deliveredField = scope.delivered
  let oldest = dateFuns.parseDate(backlog[0][createdField], scope.dateFormat)

  for (let i = 1; i < backlog.length - 1; i++) {
    const d = dateFuns.parseDate(backlog[i][createdField], scope.dateFormat)
    if (oldest - d > 0) {
      oldest = d
    }
  }
  return oldest
}

function analyse(data, scope, oldest) {
  const idField = scope.id
  const createdField = scope.created
  const deliveredField = scope.delivered
  const startDate = dateFuns.parseDate(data[createdField], scope.dateFormat)
  const endDate = data[deliveredField] ? dateFuns.parseDate(data[deliveredField], scope.dateFormat) : null
  if (daysDiff(startDate, endDate) > 0) {
    console.log(startDate, endDate, data)
  }
  return {
    id: data[idField],
    commit: daysDiff(oldest, startDate),
    delivery: endDate ? daysDiff(startDate, endDate) : null,
  }
}

function startBacklogFrom(data, scope) {
  const createdField = scope.created
  const deliveredField = scope.delivered
  const backlog = []
  const from = new Date(scope.year, scope.month, scope.day)
  for (let i = 0; i < data.length; i++) {
    const startDate = dateFuns.parseDate(data[i][createdField], scope.dateFormat)
    const endDate = data[i][deliveredField] ? dateFuns.parseDate(data[i][deliveredField], scope.dateFormat) : null
    if (daysDiff(from, startDate) >= 0 && (!endDate || daysDiff(from, startDate) >= 0)) {
      backlog.push(data[i])
    }
  }
  return backlog
}

function createBacklog(data, scope) {
  const createdField = scope.created
  const deliveredField = scope.delivered
  if (!scope.all) {
    data = startBacklogFrom(data, scope)
  }
  const oldest = oldestStartDate(data, scope)
  const backlog = []
  for (let i = 0; i < data.length; i++) {
    const analysed = analyse(data[i], scope, oldest)
    const card = {
      id: analysed.id,
      commit: analysed.commit,
      delivery: analysed.delivery,
      created: data[i][createdField]
    }
    backlog.push(card)
  }
  bus.emit('sendBacklogLoaded', {backlog: backlog, createdField: createdField, deliveredField: deliveredField})
}

function getSeparator(sep) {
  let separator
  switch(sep) {
    case 'tab':
      separator = '\t'
      break
    case 'comma':
      separator = ','
      break
    case 'semicolon':
      separator = ';'
      break
    case 'colon':
      separator = ':'
      break
    case 'space':
      separator = ' '
      break
  }
  return separator
}

const FileFuns = {

  headerFields: function(file, separator) {
    const results = papa.parse(file, {
      delimiter: getSeparator(separator),
      header: true,
      skipEmptyLines: true,
	    complete: function(results) {
        const fields = Object.keys(results.data[0])
        const header = []
        for (let i = 0; i < fields.length; i++) {
          if (!fields[i].match(/^Custom field/)) {
            header.push(fields[i])
          }
        }
        bus.emit('sendUpdateHeaderFields', {fields: header})
	    }
    })
  },

  loadBacklog: function(file, separator, scope) {


    const results = papa.parse(file, {
      delimiter: getSeparator(separator),
      header: true,
      skipEmptyLines: true,
	    complete: function(results) {
		    createBacklog(results.data, scope)
	    }
    })
  },

  calculateArrivalRate: function(backlog, scope) {
    const days = daysDiff(oldestStartDate(backlog, scope), newestStartDate(backlog, scope))
    return days / backlog.length
  }

}

export default FileFuns
