import React from 'react';
import { union, flattenDeep } from 'lodash';
import Subjects from './Subjects';
import Layout from '../../components/Layout';

export default {

  path: '/subjects',

  async action({ fetch }) {
    const query = `
      *[defined(subjects)].subjects
    `;
    const subjects = await fetch(query, {});

    return {
      title: 'React Starter Kit',
      component: <Layout><Subjects subjects={union(flattenDeep(subjects))} /></Layout>,
    };
  },

};
