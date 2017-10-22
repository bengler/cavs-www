import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {TransitionGroup} from 'react-transition-group'

import {themeShape} from '../../themes'
import Link from '../Link/Link'
import Item from './Item'
import Fade from './Fade'

import s from './Theme.css'

class Theme extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  static defaultProps = {
    active: false
  }

  render() {
    const {theme} = this.props
    const {type, key, title} = theme

    return (
      <section className={s.root}>
        <h2 className={s.heading}>
          <Link className={s.link} to={`/explore/${type}/${key}`}>
            {title}
          </Link>
        </h2>

        <div className={s.grid}>
          <TransitionGroup>
            {theme.items.map(item => (
              <Fade key={item._id}>
                <Item key={item._id} item={item} />
              </Fade>
            ))}
          </TransitionGroup>
        </div>
      </section>
    )
  }
}

export default withStyles(s)(Theme)
