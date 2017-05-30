/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Subject.css';
import Link from '../../components/Link';

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
      <div className={s.root}>
        <h1>{subject}</h1>
        <ul>
          {
            items.map((item) => {
              if (item.identifier) {
                return (
                  <li key={item.identifier}>
                    <Link to={`/item/${item.identifier}`}>{item.name || item.title}</Link> ({item._type}) identifier
                  </li>
                );
              }
              if (!item.identifier) {
                return (
                  <li key={item._id}>
                    <Link to={`/group/${item._id}`}>{item.name || item.title}</Link> ({item._type}) id
                  </li>
                );
              }
              return false;
            })
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Subject);
