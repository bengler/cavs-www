/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Item from './Item';
import Layout from '../../components/Layout';

export default {

  path: '/item/:identifier',

  async action({ fetch, params }) {
    const query = `
      *[identifier=="${params.identifier}"] {
        _id,
        _type,
        title,
        description,
        identifier,
        date,
        subjects,
        format,
        rights,
        imageAssets[] {
          _key,
          asset -> {url}
        },
        partOf[] -> {
          _id,
          _type,
          name,
          ...
        },
        creators[] -> {
          name,
          _id
        }
      }
    `;
    const result = await fetch(query, {});
    if (!result) {
      return {
        title: 'Error',
        component: <Layout>Not found</Layout>,
      };
    }
    return {
      title: result[0].title,
      component: <Layout><Item item={result[0]} /></Layout>,
    };
  },
};
