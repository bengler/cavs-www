import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link/Resolver';
import s from './Type.css';

class Type extends React.Component {
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
