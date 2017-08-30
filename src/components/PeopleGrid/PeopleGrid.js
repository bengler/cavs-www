import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import LinkResolver from '../Link/Resolver'
import ImageGallery from '../ImageGallery/ImageGallery'
import ResolveType from '../ResolveType'
import processPeople from './processPeople'
import normalizePeriods from './normalizePeriods'
import {SwimLaneKeeper} from './swimLanes'

import s from './PeopleGrid.css'

const TOTAL_HEIGHT = 6000

class Period extends React.Component {
  render() {
    const {period, laneWidth} = this.props

    const periodStyle = {
      position: 'absolute',
      top: `${period._start * TOTAL_HEIGHT}px`,
      height: `${period._duration * TOTAL_HEIGHT}px`,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,1)',
      border: '1px solid white'
    }

    const paddingLeft = 4;

    const contentStyle = {
      position: 'sticky',
      color: '#fff',
      width: `${(period._duration * TOTAL_HEIGHT) - (paddingLeft*2)}px`,
      transformOrigin: 'top left',
      fontSize: '10px',
      fontWeight: '300',
      paddingLeft: `${paddingLeft}px`,
      marginLeft: `${laneWidth - laneWidth / 7}px`,
      transform: 'rotate(90deg)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }

    const positionStyle = {
      fontStyle:'italic',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }


    // {period.start.getFullYear()} - {period.end.getFullYear()}
    
    return (
      <div style={periodStyle}>
        <div style={contentStyle}>
          {period.name}
          <div style={positionStyle}>
            {period.role}
          </div>
        </div>
      </div>
    )

  }
}

class Lane extends React.Component {
  render() {
    const {lane, laneWidth} = this.props
    const periods = lane.getPeriods()

    return (
      <div>
        {
          periods.map(period => {
            return (
              <Period key={period._start + period.role} laneWidth={laneWidth} period={period} />
            )
          })
        }
      </div>
    )
  }
}

class PeopleGrid extends React.Component {

  static propTypes = {
    // people: PropTypes.arrayOf(PropTypes.shape({
    //   _id: PropTypes.string.isRequired,
    //   identifier: PropTypes.string, // This tells that it is an item
    // })),
  }

  state = {
    inBrowser: false
  }

  componentDidMount() {
    this.setState({inBrowser: true})
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

    console.info(screenWidth, laneTotal, margin, laneWidth)

    console.info(laneWidth)

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
              <div key={idx} style={laneStyle}>
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
