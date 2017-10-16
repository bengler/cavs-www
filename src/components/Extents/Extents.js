import React from 'react'
import PropTypes from 'prop-types'

class Extents extends React.PureComponent {
  static propTypes = {
    extents: PropTypes.shape({
      description: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
      depth: PropTypes.number,
    }),
    type: PropTypes.string,
  };

  static defaultProps = {
    extents: {},
    type: '',
  }

  render() {
    const {extents, type} = this.props

    if (!extents.width || !extents.height) {
      return false
    }

    if (type === 'work3d' && extents) {
      if (!extents.depth) {
        return false
      }
      return (
        <span>
          <span>{extents.description}</span>
          {extents.width} × {extents.height} × {extents.depth} meters
        </span>
      )
    }

    if (type === 'work2d' && extents) {
      return (
        <span>
          <span>{extents.description}</span>
          {extents.width} × {extents.height} meters
        </span>
      )
    }


    return <span />
  }
}

export default Extents
