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
import dateFns from 'date-fns';

import s from './Group.css';
import Link from '../../components/Link';


class Item extends React.Component {

  static propTypes = {
    group: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
      creators: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        _id: PropTypes.string,
      })),
      locations: PropTypes.arrayOf(PropTypes.object),
    }),
  }

  static defaultProps = {
    group: {
      name: 'Untitled…',
    },
  }

  render() {
    const { group } = this.props;
    const {
      name,
      description,
      subjects = [],
      creators = [],
    } = group;

    return (
      <div className={s.root}>
        <h1>{name}</h1>
        <p>{description}</p>

        <h2>Subjects</h2>
        <ul>
          {
            subjects.map(subject => (
              <li>{subject}</li>
              ))
          }
        </ul>

        <h2>Creators</h2>
        <ul>
          {
            creators.map(creator => (
              <li>
                <Link to={`/person/${creator._id}`}>{creator.name}</Link>
              </li>
              ))
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Item);
