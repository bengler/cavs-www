import React from 'react';
import { union, flattenDeep } from 'lodash';
import Formats from './Formats';
import Layout from '../../components/Layout';

export default {

  path: '/formats',

  async action({ fetch }) {
    const query = `
      *[defined(format)].format
    `;
    const formats = await fetch(query, {});

    return {
      title: 'React Starter Kit',
      component: <Layout><Formats formats={union(flattenDeep(formats))} /></Layout>,
    };
  },

};
