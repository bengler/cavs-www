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
        <ul className={s.list}>
          {
          formats.map(format => (
            <li className={s.item}>
              <Link className={s.link} to={`/format/${format}`}>{format}</Link>
            </li>
            ))
        }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Home);
