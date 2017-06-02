import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import Link from '../../components/Link/Resolver';
import s from './Type.css';

class Type extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        references: PropTypes.number,
      }),
    ),
    type: PropTypes.string,
  }

  static defaultProps = {
    items: [],
    type: '',
  }

  render() {
    const { items, type } = this.props;
    return (
      <div className={s.container}>
        <h1>{type}s</h1>
        <ul>
          {
          items.map(item => (
            <li>
              <Link item={item} />
            </li>
            ))
        }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Type);
