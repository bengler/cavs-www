import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Link from '../Link/Link'

import s from './Item.css'

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.item._id !== this.props.item._id
  }

  render() {
    const {item} = this.props

    return (
      <div className={s.root}>
        {
          item.link && (
            <Link to="/" className={s.link}>
              <img src={`${item.url}?w=600`} alt="" />
            </Link>
          )
        }
        {
          !item.link && (
            <img src={`${item.url}?w=600`} alt="" />
          )
        }
      </div>
    )
  }
}

export default withStyles(s)(Item)
