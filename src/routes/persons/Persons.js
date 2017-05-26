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
import s from './Persons.css';

class Persons extends React.Component {

  static propTypes = {
    persons: PropTypes.array.isRequired,
  }

  render() {
    const { persons } = this.props;
    console.log('persons', persons);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Persons</h1>
          <ul>
            {
              persons.map(person => (
                <li>
                  {person.name}
                </li>
                ))
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Persons);
