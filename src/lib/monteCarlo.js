
function getNoOfCardsForDay(cardsPerDay) {
  const index = parseInt(Math.random() * (cardsPerDay.length - 1))
  return cardsPerDay[index]
}

function getCardsToRunTo(config, cards, completed) {
  let runConfig = {}
  if (config.runTo == 'Remaining') {
    runConfig = {
      from: completed.length,
      to: cards.length - completed.length
    }
  } else {
    runConfig = {
      from: completed.length,
      to: parseInt(config.runTo) - completed.length
    }
  }
  return runConfig
}

function monteCarloRun(cardsPerDay, noOfCards, startFrom) {
  let cardsDone = 0, day = startFrom
  while (cardsDone < noOfCards) {
    cardsDone = cardsDone + getNoOfCardsForDay(cardsPerDay)
    day = day + 1
  }
  return day
}

function monteCarlo(cardsPerDay, startFrom, runs, runTo) {
  const results = {}
  for (let i = 0; i < runs; i++) {
    const run = monteCarloRun(cardsPerDay, runTo, startFrom)
    if (!results[run]) {
      results[run] = 1
    } else {
      results[run] = results[run] + 1
    }
  }
  return results
}

function cardsPerDayDistribution(cards) {
  const cardsPerDay = {}
  for (let i = 0; i < cards.length; i++) {
    // Catch if delivery is undefined - need to find root cause
    if (cards[i].delivery) {
      if (!cardsPerDay[cards[i].delivery]) {
        cardsPerDay[cards[i].delivery] = 1
      } else {
        cardsPerDay[cards[i].delivery] = cardsPerDay[cards[i].delivery] + 1
      }
    }
  }
  const days = [],
        min = Math.min(...Object.keys(cardsPerDay)),
        max = Math.max(...Object.keys(cardsPerDay))
  for (let j = min; j <= max; j++) {
    const day = cardsPerDay[j] ? cardsPerDay[j] : 0
    days.push(day)
  }
  return {
    startFrom: min,
    cards: days
  }
}

function percentages(counts, days, config) {
  const percentiles = {},
        _50 = config.runs * 0.5,
        _75 = config.runs * 0.75,
        _90 = config.runs * 0.90,
        _95 = config.runs * 0.95,
        _99 = config.runs * 0.99
  let count = 0
  for (let i = 0; i < config.runs; i++) {
    count = count + counts[i]
    if (count >= _99) {
      percentiles[99] = days[i]
    } else if (count >= _95) {
      percentiles[95] = days[i]
    } else if (count >= _90) {
      percentiles[90] = days[i]
    } else if (count >= _75) {
      percentiles[75] = days[i]
    } else if (count >= _50) {
      percentiles[50] = days[i]
    }
  }
  return percentiles
}

module.exports = {

  run: function(cards, completed, config) {
    const data = {
      days: [],
      counts: []
    }
    if (completed.length) {
      const cardsToRunTo = getCardsToRunTo(config, cards, completed)
      const cardsPerDay = cardsPerDayDistribution(completed)
      const results = monteCarlo(cardsPerDay.cards, cardsPerDay.startFrom, config.runs, cardsToRunTo.to)
      const max = Math.max(...Object.keys(results))
      console.log(cardsPerDay, max)
      for (let i = cardsPerDay.startFrom; i <= max; i++) {
        data.days.push(i)
        const result = results[i] ? results[i] : 0
        data.counts.push(result)
      }
    }
    data.percentiles = percentages(data.counts, data.days, config)
    return data
  }

}
