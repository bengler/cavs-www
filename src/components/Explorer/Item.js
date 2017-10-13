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

    // const style = {
    //   transform: `translate3d(
    //     ${Math.random() * 100}px,
    //     ${Math.random() * 100}px,
    //     ${Math.random() * 100}px
    //   )`
    // }

    return (
      <div className={s.root}>
        <img src={`${item.imageAssets[0].asset.url}?w=300`} alt="" />
      </div>
    )
  }
}

export default withStyles(s)(Item)
