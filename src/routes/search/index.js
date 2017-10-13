import React from 'react'
import Search from './Search'
import Layout from '../../components/Layout'

function createQuery(query) {
  return `
  *[
    title match "${query}"
    || name match "${query}"
    || name match "${query}"
  ]
  {
    ...,
    identifier,
    portraits[] {
      _key,
      asset -> {url}
    },
    imageAssets[] {
      _key,
      asset -> {url}
    },
    "references": *[references(^._id)] {
      ...,
      identifier,
      portraits[] {
        _key,
        asset -> {url}
      },
      imageAssets[] {
        _key,
        asset -> {url}
      }
    }
  }[0..100]
`
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
