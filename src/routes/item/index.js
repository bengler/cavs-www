import React from 'react'
import Item from './Item'
import Layout from '../../components/Layout'

export default {

  path: '/item/:identifier',

  async action({fetch, params, query}) {
    const q = `
      *[identifier=="${params.identifier}"] {
        _id,
        _type,
        title,
        description,
        identifier,
        date,
        videoUrl,
        subjects,
        format,
        rights,
        imageAssets[] {
          _id,
          _key,
          asset -> {url, metadata {dimensions}}
        },
        partOf[] -> {
          _id,
          _type,
          name,
          creators[] -> {
            name,
            _type,
            _id
          },
          "references": *[references(^._id)] {
            name,
            _type,
            title,
            _key,
            imageAssets[] {
              asset -> {url, metadata {dimensions}}
            }
          },
          ...
        },
        creators[] -> {
          name,
          _type,
          _id
        }
      }
    `
    const result = await fetch(q, {})
    if (!result || !result[0]) {
      return {
        title: 'Error',
        component: <Layout>Not found</Layout>,
      }
    }

    return {
      title: result[0].title,
      component: <Layout><Item item={result[0]} currentImageKey={query.image} /></Layout>,
    }
  },
}
