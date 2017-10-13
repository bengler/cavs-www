import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import {themeShape} from '../../themes'
import Link from '../Link/Link'
import Item from './Item'

import s from './Theme.css'

const Fade = ({children, ...props}) => {
  return (
    <CSSTransition
      {...props}
      timeout={1000}
      classNames="fade"
    >
      {children}
    </CSSTransition>
  )
}

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

    const visibleItems = active ? theme.items : theme.items.slice(0, 3)

    return (
      <section className={s.root}>
        <h2 className={s.heading}>
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
          <TransitionGroup>
            {visibleItems.map(item => (
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
