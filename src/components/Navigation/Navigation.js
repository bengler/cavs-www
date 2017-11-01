import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Navigation.css'
import Link from '../Link'

class Navigation extends React.Component {
  render() {
    return (
      <ul className={s.root} role="navigation">
        <Link className={s.link} to="/people">People</Link>{', '}
        <Link className={s.link} to="/subjects">Subjects</Link>{', '}
        <Link className={s.link} to="/formats">Formats</Link>{', '}
        <Link className={s.link} to="/about">About</Link>,&nbsp;<Link className={s.link} to="/search">Search</Link>
      </ul>
    )
  }
}

export default withStyles(s)(Navigation)
