import React from 'react'
import Search from './Search'
import Layout from '../../components/Layout'

function createQuery(query) {
  const q = query.split(' ').map(i => ` "${i}**"`).toString()

  return `
  *[
    title match [${q}]
    || name match [${q}]
    || name match [${q}]
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
      asset -> {metadata, url}
    },
    "references": *[references(^._id)] {
      ...,
      _id,
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
