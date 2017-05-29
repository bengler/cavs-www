/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Person from './Person';
import Layout from '../../components/Layout';

export default {

  path: '/person/:id',

  async action({ fetch, params }) {
    const query = `
      *[_id=="${params.id}"] {
        ...,
        portraits[] {
          ...,
          asset -> {url}
        },
        "references": *[references(^._id)]{
          title,
          description,
          identifier,
          date,
          subjects,
          format,
          rights,
          imageAssets[] {
            asset -> {url}
          }
        } | order(date.date.utc asc)
      }
    `;
    const result = await fetch(query, {});
    console.log('result', result.length);
    return {
      title: 'Person',
      component: <Layout><Person person={result[0]} /></Layout>,
    };
  },
};
