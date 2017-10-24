import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'
import s from './ImageGallery.css'

class ImageGallery extends React.Component {
  static propTypes = {
    excludeFirst: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string.isRequired,
      asset: PropTypes.shape({
        url: PropTypes.string,
      }),
    })),
  };

  static defaultProps = {
    images: [],
    excludeFirst: false,
  }

  render() {
    const {images, excludeFirst} = this.props

    if (!images.length || (images.length === 1 && excludeFirst)) {
      return false
    }
    return (
      <div className={images.length > 1 ? s.grid : s.root}>
        {
          images.map((image, i) => {
            const url = get(image, 'asset.url')
            if (excludeFirst && i === 0) {
              return false
            }
            return (
              <div className={s.item} key={image._key}>
                <img className={s.image} src={`${url}?w=300`} alt="" />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default withStyles(s)(ImageGallery)
