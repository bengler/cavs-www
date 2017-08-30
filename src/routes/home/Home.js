import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid';
import PeopleGrid from '../../components/PeopleGrid/PeopleGrid';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    // people: PropTypes.array(PropTypes.object),
    // recentObjects: PropTypes.array(PropTypes.object)
  }

  static defaultProps = {
    items: [{}],
  }

  
  render() {
    const { people, recentObjects } = this.props;
    
    return (
      <div className={s.root}>
        <ReferenceGrid references={recentObjects} />
        <PeopleGrid people={people} />
      </div>
    );
  }
}

export default withStyles(s)(Home);
