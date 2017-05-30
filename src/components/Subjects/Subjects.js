import React from 'react';
import PropTypes from 'prop-types';
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
        <ul>
          {
            subjects.map(subject => (
              <li key={subject}>
                <Link to={`/subject/${subject}`}>{subject || 'No subject'}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default Subjects;
