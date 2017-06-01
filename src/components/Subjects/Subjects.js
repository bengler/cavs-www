import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Subjects.css';

import Link from '../Link/Link';

class Subjects extends React.Component {
  static propTypes = {
    subjects: PropTypes.arrayOf(PropTypes.string.isRequired),
  };

  static defaultProps = {
    subjects: [],
  }

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { subjects } = this.props;
    return (
      <div>
        <h2>Subjects</h2>
        <ul className={s.list}>
          {
            subjects.map(subject => (
              <li key={subject} className={s.item}>
                <Link className={s.link} to={`/subject/${subject}`}>{subject || 'No subject'}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Subjects);
