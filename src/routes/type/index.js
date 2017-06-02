import React from 'react';
import Type from './Type';
import Layout from '../../components/Layout';

export default {

  path: '/type/:type',

  async action({ fetch, params }) {
    const query = `
      *[_type == "${params.type}"]
    `;
    const items = await fetch(query, {});

    return {
      title: params.type,
      component: <Layout><Type items={items} type={params.type} /></Layout>,
    };
  },

};
