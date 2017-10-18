import React from 'react'
import Search from './Search'
import Layout from '../../components/Layout'

function createQuery(query) {
  const q = query.split(' ').map(i => ` "${i}**"`).toString()

  return `
  *[
    title match [${q}]
    || name match [${q}]
  ]
  {
    _id,
    _type,
    title,
    name,
    identifier,
    portraits[0...1] {
      _key,
      asset -> {url}
    },
    imageAssets[0...1] {
      _key,
      asset -> {metadata, url}
    },
    "references": *[references(^._id)][0..10] {
      _id,
      _type,
      title,
      name,
      identifier,
      portraits[0...1] {
        _key,
        asset -> {url}
      },
      imageAssets[0...1] {
        _key,
        asset -> {url}
      },
      "references": *[references(^._id)][0...1] {
        _id,
        _type,
        title,
        name,
        identifier,
        portraits[0...1] {
          _key,
          asset -> {url}
        },
        imageAssets[0...1] {
          _key,
          asset -> {url}
        },
      }
    }
  }[0..20]
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
