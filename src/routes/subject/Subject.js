import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Subject.css';
import ReferenceList from '../../components/ReferenceList/ReferenceList';

class Subject extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
    })),
    subject: PropTypes.string.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  render() {
    const { items, subject } = this.props;
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{subject}</h1>
          <ReferenceList references={items} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Subject);
