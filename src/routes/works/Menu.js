import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './Menu.css'
import Link from '../../components/Link'

class PeopleMenu extends React.PureComponent {
  render() {
    return (
      <ul className={s.menu}>
        <li><Link to="/works">Chronological</Link></li>
        <li><Link to="/formats">Formats</Link></li>
        <li><Link to="/subjects">Subjects</Link></li>
      </ul>
    )
  }
}

export default withStyles(s)(PeopleMenu)
