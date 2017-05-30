import React from 'react';
import PropTypes from 'prop-types';

class Formats extends React.Component {
  static propTypes = {
    formats: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    formats: [],
  }

  render() {
    const { formats } = this.props;
    return (
      <div>
        <h2>Format</h2>
        <ul>
          {
            formats.map(formatTitle => (
              <li key={formatTitle}>{formatTitle}</li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default Formats;
