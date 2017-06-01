import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';
import s from './Formats.css';

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
        <ul className={s.list}>
          {
            formats.map(formatTitle => (
              <li key={formatTitle} className={s.item}>
                <Link className={s.link} to={`/format/${formatTitle}`}>{formatTitle}</Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default Formats;
