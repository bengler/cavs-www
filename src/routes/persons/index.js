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
