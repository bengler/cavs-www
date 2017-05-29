/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Group from './Group';
import Layout from '../../components/Layout';

export default {

  path: '/group/:id',

  async action({ fetch, params }) {
    const query = `
      *[_id =="${params.id}"] {
        name,
        description,
        subjects,
        creators[] -> {_id, name},
        locations
      }
    `;
    const result = await fetch(query, {});
    return {
      title: 'Item',
      component: <Layout><Group group={result[0]} /></Layout>,
    };
  },
};
