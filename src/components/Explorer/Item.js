import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './Item.css'

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      imageAssets: PropTypes.array
    }).isRequired
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.item._id !== this.props.item._id
  }

  render() {
    const {item} = this.props

    const style = {
      transform: `translate(
        ${Math.random() * 150}px,
        ${Math.random() * 150}px,
        0
      )`
    }

    return (
      <div className={s.root} style={style}>
        <img src={`${item.imageAssets[0].asset.url}?w=300`} alt="" />
      </div>
    )
  }
}

export default withStyles(s)(Item)
