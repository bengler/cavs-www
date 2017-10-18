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
        <Link to="/" className={s.title}>
          Center for Advanced Visual Studies Special&nbsp;Collection
        </Link>
        <Navigation />
        <a href="http://web.mit.edu/">
          <img src="/MIT-logo-black-gray.svg" className={s.logo} />
        </a>
      </div>
    )
  }
}

export default withStyles(s)(Header)
