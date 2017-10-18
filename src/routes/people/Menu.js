import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './Menu.css'
import Link from '../../components/Link'

class PeopleMenu extends React.PureComponent {
  render() {
    return (
      <ul className={s.menu}>
        <li><Link to="/people">Alphabetical</Link></li>
        <li><Link to="/people/portraits">Portraits</Link></li>
        <li><Link to="/people/timeline">Timeline</Link></li>
        <li><Link to="/people/map">Map</Link></li>
      </ul>
    )
  }
}

export default withStyles(s)(PeopleMenu)
