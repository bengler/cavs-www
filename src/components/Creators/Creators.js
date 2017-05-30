import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

class Creators extends React.Component {
  static propTypes = {
    creators: PropTypes.array,
  };

  static defaultProps = {
    creators: [],
  }

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { creators } = this.props;
    return (
      <div>
        <h2>Creators</h2>
        <ul>
          {
            creators.map(creator => (
              <li key={creator._id}>
                <Link to={`/person/${creator._id}`}>{creator.name}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default Creators;
