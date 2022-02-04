
const shortMonthNames = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const shortMonths = {
  'Jan': 0,
  'Feb': 1,
  'Mar': 2,
  'Apr': 3,
  'May': 4,
  'Jun': 5,
  'Jul': 6,
  'Aug': 7,
  'Sep': 8,
  'Oct': 9,
  'Nov': 10,
  'Dec': 11
}

// JIRA default: 12/Feb/22
//
function parseJiraDefault(d) {
  d = d.split(' ')[0]
  d = d.split('/')
  const year = parseInt(d[2]) + 2000
  const month = shortMonths[d[1]]
  const day = parseInt(d[0])
  return new Date(year, month, day)
}

const DateFuns = {

  monthNames: function() {
    return shortMonthNames
  },

  months: function() {
    return shortMonths
  },

  parseDate: function(d) {
    let date
    if (d.match(/^[0-9]+\/[A-Z][a-z]{2}\/[0-9]{2}/)) {
      date = parseJiraDefault(d)
    }
    return date
  },

  daysFromToday: function(days) {
    const d = new Date().getTime() + (days * 86400000)
    return new Date(d)
  }
}

export default DateFuns
