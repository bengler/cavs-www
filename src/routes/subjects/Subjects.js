import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link/Link';

import s from './Subjects.css';

class Subjects extends React.Component {
  render() {
    const { subjects } = this.props;
    return (
      <div>
        {
          subjects.map(subject => (
            <div>
              <Link to={`/subject/${subject}`}>{subject}</Link>
            </div>
            ))
        }
      </div>
    );
  }
}

export default withStyles(s)(Subjects);
