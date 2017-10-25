import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import LinkResolver from '../Link/Resolver'

import s from './Item.css'

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      _type: PropTypes.string.isRequired,
      imageAssets: PropTypes.array
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
            <LinkResolver item={item.link} className={s.link}>
              <img src={`${item.imageAssets[0].asset.url}?w=600`} alt="" />
            </LinkResolver>
          )
        }
        {
          !item.link && (
            <img src={`${item.imageAssets[0].asset.url}?w=600`} alt="" />
          )
        }
      </div>
    )
  }
}

export default withStyles(s)(Item)