import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import {themeShape} from '../../themes'
import Link from '../Link/Link'
import Item from './Item'

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
      <section className={s.root}>
        <h2>
          {active && (
            <span className={s.title}>
              {title}
            </span>
          ) || (
            <Link className={s.link} to={`/explore/${type}/${key}`}>
              {title}
            </Link>
          )}
        </h2>

        <div className={s.grid}>
          {theme.items.map(item => (
            <Item key={item._id} item={item} />
          ))}
        </div>
      </section>
    )
  }
}

export default withStyles(s)(Theme)
