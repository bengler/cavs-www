import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

// import Link from '../../components/Link/Resolver';
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid';
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
        <h1 className={s.title}>{type}s</h1>
        <ReferenceGrid references={items} />
      </div>
    );
  }
}

export default withStyles(s)(Type);
