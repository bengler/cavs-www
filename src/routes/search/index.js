import React from 'react'
import Search from './Search'
import Layout from '../../components/Layout'

function createQuery(query) {
  return `*[][title match "${query}"]{...}[0..100]`
}

export default {

  path: '/search',

  async action({router, fetch, query}) {
    const result = query.q ? await fetch(createQuery(query.q), {}) : []
    return {
      title: `Search ${query.q}`,
      component: <Layout><Search router={router} result={result} query={query.q} /></Layout>
    }
  }
}
