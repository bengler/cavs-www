import React from 'react';
import Format from './Format';
import Layout from '../../components/Layout';

export default {

  path: '/format/:format',

  async action({ fetch, params }) {
    const resp = await fetch(`
      *["${params.format}" in format] {
        _id,
        identifier,
        _type,
        name,
        title,
        imageAssets[] { asset -> {url}}
      }
    `, {});

    return {
      title: params.format,
      component: <Layout><Format items={resp} format={params.format} /></Layout>,
    };
  },
};
