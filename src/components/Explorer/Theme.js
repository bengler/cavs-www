import React from 'react';
import { filter } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import themeShape from './themeShape';

import Link from '../Link/Link'
import MatrixCamera from '../MatrixCamera/MatrixCamera'
import MatrixElement from '../MatrixElement/MatrixElement'

import s from './Theme.css';

class Theme extends React.Component {
  static propTypes = {
    theme: themeShape.isRequired
  }

  render () {
    const { theme, active } = this.props
    const { type, key, title, items } = theme


    return (
      <section>
        <h2>
          {active && (
            title
          ) || (
            <Link to={`/explore/${type}/${key}`}>
              {title}
            </Link>
          )}
        </h2>
      </section>
    )
  }
}

export default withStyles(s)(Theme);
