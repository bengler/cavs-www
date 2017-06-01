import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link/Link';

import s from './Subjects.css';

class Subjects extends React.Component {
  render() {
    const { subjects } = this.props;
    return (
      <div className={s.container}>
        <ul>
          {
            subjects.map(subject => (
              <li>
                <Link to={`/subject/${subject}`}>{subject}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Subjects);
