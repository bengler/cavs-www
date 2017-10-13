import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import PropTypes from 'prop-types'

import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'

import s from './Home.css'

class Home extends React.Component {
  static propTypes = {
    people: PropTypes.array,
    recentObjects: PropTypes.array
  }

  static defaultProps = {
    items: [{}],
  }


  render() {
    const {people, recentObjects} = this.props

    return (
      <div className={s.root}>
        <ReferenceGrid references={recentObjects} />
      </div>
    )
  }
}

export default withStyles(s)(Home)
