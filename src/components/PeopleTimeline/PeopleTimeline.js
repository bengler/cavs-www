/* eslint-disable react/no-multi-comp */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
// import ImageGallery from '../ImageGallery/ImageGallery'
// import ResolveType from '../ResolveType'
import processPeople from './processPeople'
import normalizePeriods from './normalizePeriods'
import {SwimLaneKeeper} from './swimLanes'
import Link from '../Link/Link'

import s from './PeopleTimeline.css'

const TOTAL_HEIGHT = 4600
const TOTAL_WIDTH = 6000

class Period extends React.PureComponent {
  static propTypes = {
    period: PropTypes.object,
    laneHeight: PropTypes.number
  }
  render() {
    const {period, laneHeight} = this.props

    const periodStyle = {
      left: `${period._start * TOTAL_WIDTH}px`,
      width: `${period._duration * TOTAL_WIDTH}px`,
      height: `${laneHeight}px`
    }

    return (
      <Link to={`/person/${period._id}`}>
        <div style={periodStyle} className={s.period}>
          <div className={s.periodContent}>
            <div className={s.periodYear}>{period.start.getFullYear()}</div>
            <div className={s.periodName}>{period.name}</div>
            <div className={s.periodRole}>
              {period.role}
            </div>
          </div>
        </div>
      </Link>
    )

  }
}

class Lane extends React.Component {
  static propTypes = {
    lane: PropTypes.object,
    laneHeight: PropTypes.number
  }
  render() {
    const {lane, laneHeight} = this.props
    const periods = lane.getPeriods()

    return (
      <div>
        {
          periods.map(period => {
            return (
              <Period
                key={period._start + period.role}
                laneHeight={laneHeight}
                period={period}
              />
            )
          })
        }
      </div>
    )
  }
}

class PeopleGrid extends React.Component {

  static propTypes = {
    people: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      identifier: PropTypes.string, // This tells that it is an item
    }))
  }

  state = {
    inBrowser: false
  }

  componentDidMount() {
    this.setState({inBrowser: true}) //eslint-disable-line
  }

  render() {
    if (!this.state.inBrowser) {
      return (
        <div />
      )
    }

    const {people} = this.props
    const affiliationPeriods = processPeople(people)
    const {normalizedPeriods} = normalizePeriods(affiliationPeriods)
    const swimLanes = new SwimLaneKeeper(normalizedPeriods).sort().getLanes()
    const laneTotal = swimLanes.length

    const margin = 1
    const laneHeight = (TOTAL_HEIGHT - (laneTotal * margin)) / (laneTotal)

    // console.info(screenWidth, laneTotal, margin, laneWidth)
    // console.info(laneWidth)

    return (
      <div className={s.root}>
        <div
          className={s.grid} style={{
            height: `${TOTAL_HEIGHT}px`,
            width: `${TOTAL_WIDTH}px`
          }}
        >
          {
            swimLanes.map((lane, idx) => {

              const laneStyle = {
                position: 'absolute',
                top: `${laneHeight * idx}px`,
              }

              return (
                <div key={idx} style={laneStyle} className={s.lane}>
                  <Lane laneHeight={laneHeight} lane={lane} />
                </div>
              )

            })
          }
        </div>
      </div>
    )
  }
}

export default withStyles(s)(PeopleGrid)
