import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Link from '../../components/Link/Link';
import s from './Formats.css';

class Home extends React.Component {
  static propTypes = {
    formats: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    formats: [],
  }
  render() {
    const { formats } = this.props;
    return (
      <div className={s.container}>
        <h1>Formats</h1>
        <ul>
          {
          formats.map(format => (
            <li>
              <Link to={`/format/${format}`}>{format}</Link>
            </li>
            ))
        }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Home);
