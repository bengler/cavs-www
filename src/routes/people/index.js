import React from 'react';
import People from './People';
import Layout from '../../components/Layout';

export default {

  path: '/people',

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
      component: <Layout><People persons={resp} /></Layout>,
    };
  },
};
