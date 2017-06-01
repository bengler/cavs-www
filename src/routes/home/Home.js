import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReferenceList from '../../components/ReferenceList/ReferenceList';

import s from './Home.css';


class Home extends React.Component {
  render() {
    const { items } = this.props;
    console.log('items', items);
    return (
      <div className={s.root}>
        <ReferenceList references={items} />
      </div>
    );
  }
}

export default withStyles(s)(Home);
