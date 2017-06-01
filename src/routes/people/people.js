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
import s from './People.css';
import Link from '../../components/Link';


class Persons extends React.Component {

  static propTypes = {
    people: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        references: PropTypes.number,
      }),
    ).isRequired,
  }

  render() {
    const { people } = this.props;
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>Persons</h1>
          <ul>
            {
              people && people.length && people.map((person) => {
                const id = person._id;
                return (
                  <li key={person._id}>
                    <Link to={`/person/${id}`}>{person.name || 'No name…'}</Link>
                    <span style={{ fontWeight: '400' }}> {person.references}</span>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Persons);
