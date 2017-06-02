import React from 'react';
import { sortBy, last } from 'lodash';

import People from './People';
import Layout from '../../components/Layout';


// for counting "references": count(*[references(^._id)])

export default {

  path: '/people',

  async action({ fetch }) {
    const resp = await fetch(`
      *[_type=="person"]{
        _id,
        name
      }
      [0..5000]
    `, {});

    const people = sortBy(resp, (person) => {
      if (person.name) {
        return last(person.name.split(' '));
      }
      return false;
    });

    return {
      title: 'React Starter Kit',
      component: <Layout><People people={people} /></Layout>,
    };
  },
};
