import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import Link from '../../components/Link/Link';
import s from './Subjects.css';

class Subjects extends React.Component {

  static propTypes = {
    subjects: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    subjects: [],
  }
  render() {
    const { subjects } = this.props;
    return (
      <div className={s.container}>
        <ul className={s.list}>
          {
            subjects.map(subject => (
              <li className={s.item}>
                <Link className={s.link} to={`/subject/${subject}`}>{subject}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Subjects);
