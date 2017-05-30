import React from 'react';
import Subject from './Subject';
import Layout from '../../components/Layout';

export default {

  path: '/subject/:subject',

  async action({ fetch, params }) {
    const resp = await fetch(`
      *["${params.subject}" in subjects] {
        _id,
        identifier,
        _type,
        name,
        title,
        imageAssets[] { asset -> {url}}
      }
    `, {});
    return {
      title: params.subject,
      component: <Layout><Subject items={resp} subject={params.subject} /></Layout>,
    };
  },
};
