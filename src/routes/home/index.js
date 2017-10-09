import React from 'react'
// import { shuffle, first, union, flattenDeep } from 'lodash';
import Layout from '../../components/Layout'
import Home from './Home'

export default {
  path: '/',

  async action({fetch}) {
    // const query = `*[defined(subjects)].subjects`
    // const items = await fetch(query, {})
    // const subjects = union(flattenDeep(items))
    // const subject = first(shuffle(subjects))

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout>
          <Home />
        </Layout>
      ),
    }
  },
}
