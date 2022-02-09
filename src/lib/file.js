
import bus from '../socket.js'
import dateFuns from './dates.js'

const papa = require('papaparse')
const { v4: uuidv4 } = require('uuid')

function daysDiff(startDate, endDate) {
  const diff = endDate - startDate
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function newestStartDate(backlog) {
  let newest = dateFuns.parseDate(backlog[0].Created)
  for (let i = 1; i < backlog.length - 1; i++) {
    const d = dateFuns.parseDate(backlog[i].Created)
    if (d - newest > 0) {
      newest = d
    }
  }
  return newest
}

function oldestStartDate(backlog) {
  let oldest = dateFuns.parseDate(backlog[0].Created)
  for (let i = 1; i < backlog.length - 1; i++) {
    const d = dateFuns.parseDate(backlog[i].Created)
    if (oldest - d > 0) {
      oldest = d
    }
  }
  return oldest
}

function analyse(data, oldest) {
  const startDate = dateFuns.parseDate(data.Created)
  const endDate = data.Resolved ? dateFuns.parseDate(data.Resolved) : null
  return {
    id: data.id,
    commit: daysDiff(oldest, startDate),
    delivery: endDate ? daysDiff(startDate, endDate) : null,
  }
}

function startBacklogFrom(data, scope) {
  const backlog = []
  const from = new Date(scope.year, scope.month, scope.day)
  for (let i = 0; i < data.length; i++) {
    const startDate = dateFuns.parseDate(data[i].Created)
    const endDate = data[i].Resolved ? dateFuns.parseDate(data[i].Resolved) : null
    if (daysDiff(from, startDate) >= 0 && (!endDate || daysDiff(from, startDate) >= 0)) {
      backlog.push(data[i])
    }
  }
  return backlog
}

function createBacklog(data, scope) {
  if (!scope.all) {
    data = startBacklogFrom(data, scope)
  }
  const oldest = oldestStartDate(data)
  const backlog = []
  for (let i = 0; i < data.length; i++) {
    const analysed = analyse(data[i], oldest)
    const card = {
      id: analysed.id,
      commit: analysed.commit,
      delivery: analysed.delivery,
      Created: data[i].Created
    }
    backlog.push(card)
  }
  bus.$emit('sendBacklogLoaded', {backlog: backlog})
}

const FileFuns = {

  loadBacklog: function(file, separator, scope) {

    switch(separator) {
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
    const results = papa.parse(file, {
      delimiter: separator,
      header: true,
      skipEmptyLines: true,
	    complete: function(results) {
		    createBacklog(results.data, scope)
	    }
    })
  },

  calculateArrivalRate: function(backlog) {
    const days = daysDiff(oldestStartDate(backlog), newestStartDate(backlog))
    return days / backlog.length
  }

}

export default FileFuns
