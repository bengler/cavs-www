import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Link from '../Link/Link'
import s from './Creators.css'

class Creators extends React.Component {
  static propTypes = {
    creators: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.name,
    })),
  };

  static defaultProps = {
    creators: [],
  }

  static defaultProps = {
    onClick: null,
  };

  render() {
    const {creators} = this.props
    return (
      <div className={s.root}>
        {/* <h2>Creators</h2> */}
        <ul className={s.list}>
          {
            creators.map(creator => (
              <li key={creator._id} className={s.item}>
                <Link to={`/person/${creator._id}`}>{creator.name}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    )
  }
}

export default withStyles(s)(Creators)
