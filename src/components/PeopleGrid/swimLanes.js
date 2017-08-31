

class Lane {

  constructor(period) {
    this.periods = []

    function BusyException(message) {
      this.message = message
      this.name = 'BusyException'
    }

    if (period) {
      if (this.freeForPeriod(period)) {
        this.addPeriod(period)
      } else {
        throw new BusyException('Tried to add period in busy lane')
      }
    }
  }

  getPeriods() {
    return this.periods
  }

  sort() {
    this.periods = this.periods.sort((aPeriod, bPeriod) => {
      return aPeriod._start - bPeriod._start
    })
  }

  freeForPeriod(period) {

    if (this.periods.length == 0) {
      return true
    }
    const start = period._start
    const end = period._end

    // find lack of intersections
    const intersections = this.periods.filter(lanePeriod => {
      if ((end <= (lanePeriod._start + 0.01)) 
        || 
         (start >= (lanePeriod._end - 0.01))) {
        return false
      }
      return true
    })

    return intersections.length == 0
  }

  addPeriod(period) {
    this.periods.push(period)
  }

}

export class SwimLaneKeeper {

  constructor(periods, stops) {
    this.lanes = []

    if (periods) {
      this.addPeriodList(periods)
    }
  }

  addPeriodList(periodList) {
    periodList.forEach(period => this.addPeriod(period))
    this.sortLanes()
  }

  sortLanes() {
    this.lanes.forEach(lane => {
      lane.sort()
    })
  }

  addPeriod(period) {
    const freeLanes = this.lanes.filter(lane => {
      return lane.freeForPeriod(period)
    })

    if (freeLanes.length > 0) {
      freeLanes[0].addPeriod(period)
    } else {
      this.addLane(period)
    }
  }

  addLane(period) {
    const lane = new Lane(period)
    this.lanes.push(lane)
    return lane
  }

  getLanes() {
    return this.lanes
  }

}
