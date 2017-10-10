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
      <div>
        {
          rights.holdingInstitution && (
            <h2>Holding Institution: {rights.holdingInstitution}</h2>
          )
        }

        {
          rights.copyrightHolders && rights.copyrightHolders.length && (
            <div>
              <h2>
                Copyright Holders:&nbsp;
                {
                  rights.copyrightHolders.map(holder => <span key={holder} className={s.item}>{holder}</span>)
                }
              </h2>

            </div>
          )
        }

      </div>
    )
  }
}

export default withStyles(s)(Rights)
