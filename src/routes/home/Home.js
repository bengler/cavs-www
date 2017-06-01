import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid';

import s from './Home.css';


class Home extends React.Component {
  render() {
    const { items } = this.props;
    console.log('items', items);
    return (
      <div className={s.root}>
        <ReferenceGrid references={items} />
      </div>
    );
  }
}

export default withStyles(s)(Home);
