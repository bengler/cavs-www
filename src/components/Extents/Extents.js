import React from 'react';
import PropTypes from 'prop-types';

class Extents extends React.Component {
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
    item: {},
  }

  render() {
    const { extents, type } = this.props;

    if (type === 'work3d' && extents) {
      return (
        <div>
          <p>{extents.description}</p>
          {extents.width} × {extents.height} × {extents.depth} meters
        </div>
      );
    }

    if (type === 'work2d' && extents) {
      return (
        <div>
          <p>{extents.description}</p>
          {extents.width} × {extents.height} meters
        </div>
      );
    }


    return <div />;
  }
}

export default Extents;
