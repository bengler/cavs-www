import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './Rights.css'

class Rights extends React.Component {
  static propTypes = {
    rights: PropTypes.shape({
      copyrightHolders: PropTypes.arrayOf(PropTypes.string),
      holdingInstitution: PropTypes.string,
    }),
  };

  static defaultProps = {
    rights: {},
  }

  render() {
    const {rights} = this.props
    return (
      <ul className={s.root}>
        {
          rights.holdingInstitution && (
            <li className={s.item}>Holding Institution: {rights.holdingInstitution}</li>
          )
        }
        &emsp;
        {
          rights.copyrightHolders && rights.copyrightHolders.length && (
            <li className={s.item}>
              Copyright Holders:&nbsp;
              {
                rights.copyrightHolders.map(holder => <span key={holder} className={s.item}>{holder}</span>)
              }
            </li>
          )
        }

      </ul>
    )
  }
}

export default withStyles(s)(Rights)
