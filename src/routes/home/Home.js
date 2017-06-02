import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    items: [{}],
  }

  render() {
    const { items } = this.props;
    return (
      <div className={s.root}>
        <ReferenceGrid references={items} />
      </div>
    );
  }
}

export default withStyles(s)(Home);
