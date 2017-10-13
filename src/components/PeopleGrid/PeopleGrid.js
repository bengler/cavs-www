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

import s from './PeopleGrid.css'

const TOTAL_HEIGHT = 6000

class Period extends React.PureComponent {
  static propTypes = {
    period: PropTypes.object,
    laneWidth: PropTypes.number
  }
  render() {
    const {period, laneWidth} = this.props

    const periodStyle = {
      top: `${period._start * TOTAL_HEIGHT}px`,
      height: `${period._duration * TOTAL_HEIGHT}px`
    }

    const paddingLeft = 4

    const contentStyle = {
      width: `${(period._duration * TOTAL_HEIGHT) - (paddingLeft * 2)}px`,
      paddingLeft: `${paddingLeft}px`,
      marginLeft: `${laneWidth - laneWidth / 7}px`
    }

    // {period.start.getFullYear()} - {period.end.getFullYear()}

    return (
      <Link to={`/person/${period._id}`}>
        <div style={periodStyle} className={s.period}>
          <div className={s.periodYear}>
            {period.start.getFullYear()}
          </div>
          <div style={contentStyle} className={s.periodContent}>
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
    laneWidth: PropTypes.number
  }
  render() {
    const {lane, laneWidth} = this.props
    const periods = lane.getPeriods()

    return (
      <div>
        {
          periods.map(period => {
            return (
              <Period
                key={period._start + period.role}
                laneWidth={laneWidth}
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
    const swimLanes = new SwimLaneKeeper(normalizedPeriods).getLanes()
    const laneTotal = swimLanes.length

    const screenWidth = window.innerWidth
    const margin = 1
    const laneWidth = (screenWidth - (laneTotal * margin)) / (laneTotal)

    // console.info(screenWidth, laneTotal, margin, laneWidth)
    // console.info(laneWidth)

    return (
      <div className={s.grid}>
        {
          swimLanes.map((lane, idx) => {

            const laneStyle = {
              position: 'absolute',
              width: `${laneWidth}px`,
              left: `${(laneWidth + margin) * idx}px`,
              top: 0
            }

            return (
              <div key={idx} style={laneStyle} className={s.lane}>
                <Lane laneWidth={laneWidth} lane={lane} />
              </div>
            )

          })
        }
      </div>
    )
  }
}

export default withStyles(s)(PeopleGrid)
