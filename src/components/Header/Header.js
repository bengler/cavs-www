import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Link from '../Link'
import Navigation from '../Navigation'

class Header extends React.Component {
  static propTypes = {
    inverted: PropTypes.bool
  }
  static defaultProps = {
    inverted: false
  }
  render() {
    const {inverted} = this.props
    return (
      <div className={inverted ? s.rootInverted : s.root}>
        <div className={s.logos}>
          {
            inverted && (
              <a href="http://act.mit.edu/" className={s.logoLink}>
                <img src="/cavs/act_white_rgb_RZ.svg" className={s.actLogo} />
              </a>
            )
          }
          <a href="http://web.mit.edu/" className={s.logoLink}>
            {
              inverted
                ? <img src="/cavs/MIT-logo-white.svg" className={s.mitLogo} />
                : <img src="/cavs/MIT-logo-black-gray.svg" className={s.mitLogo} />
            }
          </a>
        </div>
        <Link to="/" className={s.title}>
          Center for Advanced Visual Studies Special&nbsp;Collection
        </Link>
        <div className={s.navigation}>
          <Navigation />
        </div>

      </div>
    )
  }
}


export default withStyles(s)(Header)
