import React from 'react'
// import { shuffle, first, union, flattenDeep } from 'lodash';
import Layout from '../../components/Layout'
import Explore from './Explore'

export default {
  path: '/explore/:theme',

  async action({ fetch, params }) {
    // const query = `*[defined(subjects)].subjects`
    // const items = await fetch(query, {})
    // const subjects = union(flattenDeep(items))
    // const subject = first(shuffle(subjects))

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout>
          <Explore theme={params.theme} />
        </Layout>
      ),
    }
  },
}
