/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Persons from './Persons';
import Layout from '../../components/Layout';

export default {

  path: '/persons',

  async action({ fetch }) {
    const resp = await fetch(`
      *[_type=="person"]{
        _id,
        name,
        "references": count(*[references(^._id)])
      }
      [0..5000]
    `, {});
    return {
      title: 'React Starter Kit',
      component: <Layout><Persons persons={resp} /></Layout>,
    };
  },
};
