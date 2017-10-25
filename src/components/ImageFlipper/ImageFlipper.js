import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'
import s from './ImageFlipper.css'
import Link from '../Link/Link'
import Swipeable from 'react-swipeable'
import history from '../../history'
import Spinner from '../Spinner/Spinner'

function findImageIndex(images, key) {
  let currentIndex = 0
  if (key) {
    currentIndex = images.findIndex(i => i._key === key)
  }
  return currentIndex
}

function findCurrentImage(images, key) {
  return images.find(i => i._key === key) || images[0]
}

function findPrevImage(images, key) {
  const index = findImageIndex(images, key)
  return index > 0 && images[index - 1]
}
function findNextImage(images, key) {
  const index = findImageIndex(images, key)
  return images.length > 1 && index < images.length && images[index + 1]
}


class ImageFlipper extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string,
    currentImageKey: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string,
      asset: PropTypes.shape({
        url: PropTypes.string,
      })
    }))
  }

  static defaultProps = {
    images: [{}],
    url: ''
  }
  state = {
    loading: false,
    prevImage: findPrevImage(this.props.images, this.props.currentImageKey),
    currentImage: findCurrentImage(this.props.images, this.props.currentImageKey),
    nextImage: findNextImage(this.props.images, this.props.currentImageKey)
  }
  direction = undefined
  deltaX = 0

  componentWillReceiveProps(nextProps) {
    const {images, currentImageKey} = nextProps

    const prevImage = findPrevImage(images, currentImageKey)
    const currentImage = findCurrentImage(images, currentImageKey)
    const nextImage = findNextImage(images, currentImageKey)

    if (nextProps.currentImageKey !== this.props.currentImageKey) {
      this.setState({
        loading: true,
        prevImage,
        currentImage,
        nextImage
      })
    }
  }

  handleSwiping = (e, deltaX) => {
    const {nextImage, prevImage} = this.state
    if (!nextImage && !prevImage) {
      return
    }

    if (Math.abs(deltaX) < 300) {
      this.deltaX = deltaX
      if (!nextImage && deltaX > 0) {
        return
      }
      if (!prevImage && deltaX < 0) {
        return
      }
      const move = -deltaX
      this._imageWrapperElement.style.transform = `translateX(${move}px)`
    }
  }

  handleSwipingLeft = () => {
    const {nextImage} = this.state
    if (nextImage) {
      this.direction = 'left'
    }
  }

  handleSwipingRight = () => {
    const {prevImage} = this.state

    if (prevImage) {
      this.direction = 'right'
    }
  }

  handleSwiped = event => {
    this._imageWrapperElement.style.transform = `translateX(${0})`
    if (Math.abs(this.deltaX) < 250) {
      return
    }
    const {url} = this.props
    const {nextImage, prevImage} = this.state

    if (this.direction === 'left' && nextImage) {
      this.setState({
        loading: true
      })
      history.replace(`/cavs${url}?image=${nextImage._key}`)
    }
    if (this.direction === 'right' && prevImage) {
      this.setState({
        loading: true
      })
      history.replace(`/cavs${url}?image=${prevImage._key}`)
    }
  }

  handleLoad = event => {
    this.setState({
      loading: false
    })
  }

  setImageWrapperElement = element => {
    this._imageWrapperElement = element
  }

  setPrevElement = element => {
    this._prevElement = element
  }

  setNextElement = element => {
    this._nextElement = element
  }

  render() {
    const {images, url} = this.props
    const {
      loading,
      prevImage,
      currentImage,
      nextImage,
    } = this.state

    if (!images || images.length < 1) {
      return false
    }

    const width = get(currentImage, 'asset.metadata.dimensions.width')
    const height = get(currentImage, 'asset.metadata.dimensions.height')
    const aspectRatio = get(currentImage, 'asset.metadata.dimensions.aspectRatio')

    return (
      <Swipeable
        onSwiping={this.handleSwiping}
        onSwipingLeft={this.handleSwipingLeft}
        onSwipingRight={this.handleSwipingRight}
        onSwiped={this.handleSwiped}
      >
        <div className={s.root}>
          {
            prevImage && (
              <Link replace to={`${url}?image=${prevImage._key}`} className={s.prev} title="Previous" ref={this.setPrevElement}>
                <svg width="50" height="100" xmlns="http://www.w3.org/2000/svg">
                  <g transform="rotate(-180 25,50) ">
                    <line y2="50" x2="50" y1="0" x1="0" strokeWidth="1" stroke="#000" />
                    <line y2="50" x2="50" y1="100" x1="0" strokeWidth="1" stroke="#000" />
                  </g>
                </svg>
              </Link>
            )
          }
          {
            loading && (
              <div className={s.loader}>
                <Spinner />
              </div>
            )
          }

          <div className={s.imageWrapper} ref={this.setImageWrapperElement}>
            <div className={s.padder} style={{paddingTop: `${100 / aspectRatio}%`}} />
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
                  onLoad={this.handleLoad}
                  src={`${currentImage.asset.url}?w=1200`}
                  alt=""
                />
              )
            }
          </div>
          {
              nextImage && (
                <Link replace to={`${url}?image=${nextImage._key}`} className={s.next} title="Next" ref={this.setNextElement}>
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
      </Swipeable>
    )
  }
}

export default withStyles(s)(ImageFlipper)
