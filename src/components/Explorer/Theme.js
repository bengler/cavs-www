import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {themeShape} from '../../themes'

import Link from '../Link/Link'

import s from './Theme.css'

class Theme extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    theme: themeShape.isRequired
  }

  static defaultProps = {
    active: false
  }

  render() {
    const {theme, active} = this.props
    const {type, key, title} = theme

    return (
      <section>
        <h2>
          {active && (
            title
          ) || (
            <Link to={`/explore/${type}/${key}`}>
              {title}
            </Link>
          )}
        </h2>
      </section>
    )
  }
}

export default withStyles(s)(Theme)
