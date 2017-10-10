

function normalize(periods, stops) {
  const {start, duration} = stops

  const scale = 1 / duration

  periods.forEach(period => {
    period._start = (period.start.getTime() - start) * scale
    period._end = (period.end.getTime() - start) * scale
    period._duration = period._end - period._start
  })
}

function findStops(periods) {
  let start = Infinity
  let end = -Infinity

  periods.forEach(period => {
    start = Math.min(start, period.start.getTime())
    end = Math.max(end, period.end.getTime())

    // if (period.end.getTime() - period.start.getTime() == 0) {
    //   console.info(period.name, ' - ', period.role)
    //   console.info(period.start, ' - ' , period.end)
    //   console.info()
    //   console.info()
    // }
  })

  const duration = end - start

  return {start, end, duration}
}

export default function swimLanes(periods) {

  const stops = findStops(periods)
  //console.info('start', new Date(stops.start))
  //console.info('end', new Date(stops.end))
  //console.info('total dur', stops.duration / 1000 / 60 / 60 / 24 / 365, ' yrs')
  normalize(periods, stops)

  const normalizedPeriods = periods.sort((pa, pb) => {
    return pb._duration - pa._duration
  })

  return {normalizedPeriods, stops}
}
