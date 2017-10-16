import React from 'react'
import Group from './Group'
import Layout from '../../components/Layout'

export default {

  path: '/group/:id',

  async action({fetch, params}) {
    const query = `
      *[_id =="${params.id}"] {
        name,
        _type,
        description,
        subjects,
        creators[] -> {_id, name},
        locations,
        date,
        extents,
        "references": *[references(^._id)] {
          _id,
          _type,
          title,
          body,
          identifier,
          imageAssets[] {_key, asset -> {url}}
        }
      }
    `
    const result = await fetch(query, {})
    return {
      title: `${result[0].name}`,
      component: <Layout><Group group={result[0]} /></Layout>,
    }
  },
}
