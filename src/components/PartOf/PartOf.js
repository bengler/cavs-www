import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

class PartOf extends React.Component {
  static propTypes = {
    partOf: PropTypes.array,
  };

  static defaultProps = {
    partOf: [],
  }

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { partOf } = this.props;

    if (!partOf.length) {
      return (
        <div>part of Nothing</div>
      );
    }

    return (
      <div>
        <h2>Part of</h2>
        <ul>
          {
            partOf.map(part => (
              part._id && (
                <li key={part._id}>
                  <Link to={`/group/${part._id}`}>{part.name || 'Untitled'}</Link> ({part._type})
                </li>
              )
            ))
          }
        </ul>
      </div>
    );
  }
}

export default PartOf;
