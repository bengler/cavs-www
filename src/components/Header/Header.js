import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.css'
import Link from '../Link'
import Navigation from '../Navigation'

class Header extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <Link to="/" className={s.title}>
          Center for Advanced Visual Studies Special Collection
        </Link>
        <Navigation />
        <img src="/MIT-logo-black-gray.svg" className={s.logo} />
      </div>
    )
  }
}

export default withStyles(s)(Header)
