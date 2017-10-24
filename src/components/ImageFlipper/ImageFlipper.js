import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'
import s from './ImageFlipper.css'
import Link from '../Link/Link'

class ImageFlipper extends React.Component {
  static propTypes = {
    currentImageKey: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string,
      asset: PropTypes.shape({
        url: PropTypes.string,
      }),
    })),
  };

  static defaultProps = {
    images: [{}],

  }

  render() {
    const {images, currentImageKey} = this.props

    if (!images || images.length < 1) {
      return false
    }

    const currentIndex = images.findIndex(i => i._key === currentImageKey) || 0

    const prevImage = currentIndex > 0 && images[currentIndex - 1]
    const currentImage = images[currentIndex] || images[0]
    const nextImage = currentIndex < images.length && images[currentIndex + 1]

    const width = get(currentImage, 'asset.metadata.dimensions.width')
    const height = get(currentImage, 'asset.metadata.dimensions.height')
    const aspectRatio = get(currentImage, 'asset.metadata.dimensions.aspectRatio')

    return (
      <div className={s.root}>
        {
          prevImage && (
            <Link to={`?image=${prevImage._key}`} className={s.prev} title="Previous">
              <svg width="50" height="100" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(-180 25,50) ">
                  <line y2="50" x2="50" y1="0" x1="0" strokeWidth="1" stroke="#000" />
                  <line y2="50" x2="50" y1="100" x1="0" strokeWidth="1" stroke="#000" />
                </g>
              </svg>
            </Link>
          )
        }
        <div className={s.imageWrapper}>
          <div className={s.padder} style={{paddingTop: `${100 / aspectRatio}%`}} />
          <div className={s.loader}>Loading…</div>
          {
            currentImage && (
              <img
                key={`loading${currentImage._key}`}
                width={width}
                height={height}
                className={s.loadingImage}
                src={`${currentImage.asset.url}?w=300`}
                alt=""
              />
            )
          }
          {
            currentImage && (
              <img
                key={currentImage._key}
                width={width}
                height={height}
                className={s.image}
                src={`${currentImage.asset.url}?w=1200`}
                alt=""
              />
            )
          }
        </div>
        {
          nextImage && (
            <Link to={`?image=${nextImage._key}`} className={s.next} title="Next">
              <svg width="50" height="100" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <line y2="50" x2="50" y1="0" x1="0" strokeWidth="1" stroke="#000" />
                  <line y2="50" x2="50" y1="100" x1="0" strokeWidth="1" stroke="#000" />
                </g>
              </svg>
            </Link>
          )
        }
      </div>
    )
  }
}

export default withStyles(s)(ImageFlipper)
