/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { range, get } from 'lodash';

import s from './Home.css';


class Home extends React.Component {
  render() {
    const { events } = this.props;
    const years = range(1967, new Date().getFullYear());
    return (
      <div className={s.root}>
        {
          years.map(year => (
            <div className={s.year} key={year}>
              {year}
              {
                events.map((event) => {
                  const startYear = get(event, 'startDate.date.utc');

                  if (startYear && (startYear.split('-')[0] === year)) {
                    return (
                      <div style={{ fontSize: '50px' }}>
                        {event.name}
                      </div>
                    );
                  }
                  return false;
                })
              }
            </div>
            ))
        }
      </div>
    );
  }
}

export default withStyles(s)(Home);
