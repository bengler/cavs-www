import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link/Link';
import s from './Formats.css';

class Home extends React.Component {
  render() {
    const { formats } = this.props;
    return (
      <div>
        {
          formats.map(format => (
            <div>
              <Link to={`/format/${format}`}>{format}</Link>
            </div>
            ))
        }
      </div>
    );
  }
}

export default withStyles(s)(Home);
