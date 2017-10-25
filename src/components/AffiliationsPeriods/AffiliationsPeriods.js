import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import approximationDate from '../ApproximationDate/ApproximationDate'

import s from './AffiliationsPeriods.css'

class AffiliationsPeriods extends React.PureComponent {
  static propTypes = {
    affiliationsPeriods: PropTypes.arrayOf(PropTypes.shape({
      role: PropTypes.string,
      start: PropTypes.object,
      end: PropTypes.object
    }))
  }

  static defaultProps = {
    affiliationsPeriods: []
  }

  static defaultProps = {
    affiliationsPeriods: []
  }

  render() {
    const {affiliationsPeriods} = this.props
    return (
      <ul className={s.list}>
        {
          affiliationsPeriods.map(period => (
            <li key={period._key} className={s.item}>
              {period.role}&nbsp;
              {approximationDate(period.start)}&#8202;–&#8202;{approximationDate(period.end)}
            </li>
          ))
        }
      </ul>
    )
  }
}

export default withStyles(s)(AffiliationsPeriods)
