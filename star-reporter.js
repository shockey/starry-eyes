const toCSV = require("csv-stringify/lib/sync")

module.exports = async function makeReport(stargazerEvents) {
  const eventsByMonth = {}

  stargazerEvents.forEach(e => {
    const yearMonth = e["starred_at"].slice(0, 7)

    if(Array.isArray(eventsByMonth[yearMonth])) {
      eventsByMonth[yearMonth].push(e)
    } else {
      eventsByMonth[yearMonth] = [e]
    }
  })

  const eventCountsByMonth = []

  let runningTotal = 0

  Object.keys(eventsByMonth).forEach(k => {
    const valueForMonth = eventsByMonth[k].length || 0
    runningTotal += valueForMonth
    eventCountsByMonth.push([
      k,
      valueForMonth,
      runningTotal
    ])
  })
  return toCSV(eventCountsByMonth, {
    header: true,
    columns: ['Month', 'Stars', 'Running total']
  })
}