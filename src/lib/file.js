
import bus from '../socket.js'

const papa = require('papaparse')
const { v4: uuidv4 } = require('uuid')

function parseDate(d) {
  d = d.split('-')
  return new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0]))
}

function daysDiff(startDate, endDate) {
  const diff = endDate - startDate
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function oldestStartDate(backlog) {
  const oldest = parseDate(backlog[0].startDate)
  for (let i = 1; i < backlog.length - 1; i++) {
    const d = parseDate(backlog[i].startDate)
    if (oldest - d > 0) {
      oldest = d
    }
  }
  return oldest
}

function analyse(data, oldest) {
  const startDate = parseDate(data.startDate)
  const endDate = parseDate(data.endDate)
  return {
    id: data.id,
    commit: daysDiff(oldest, startDate),
    delivery: daysDiff(startDate, endDate)
  }
}

function createBacklog(data) {
  const oldest = oldestStartDate(data)
  const backlog = []
  for (let i = 0; i < data.length; i++) {
    const analysed = analyse(data[i], oldest)
    const card = {
      id: analysed.id,
      commit: analysed.commit,
      delivery: analysed.delivery
    }
    backlog.push(card)
  }
  bus.$emit('sendLoadBacklog', {backlog: backlog})
}

const FileFuns = {

  loadBacklog: function(file, separator) {

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
		    createBacklog(results.data)
	    }
    })
  }

}

export default FileFuns
