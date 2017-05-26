/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action({ fetch }) {
    const query = `
      *[_type=="event"] {
        name,
        startDate
      }
    `;
    const events = await fetch(query, {});
    console.log('events', events);
    return {
      title: 'React Starter Kit',
      component: <Layout><Home events={events} /></Layout>,
    };
  },

};
