import React from 'react'
import PropTypes from 'prop-types'
import Link from '../Link/Link'
import s from './Formats.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

class Formats extends React.Component {
  static propTypes = {
    formats: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    formats: [],
  }

  render() {
    const {formats} = this.props
    return (
      <div>
        <h2>
          Format: {
            formats.map(formatTitle => (
              <Link key={formatTitle} className={s.link} to={`/format/${formatTitle}`}>{formatTitle}</Link>
            ))
          }
        </h2>
      </div>
    )
  }
}

export default withStyles(s)(Formats)
