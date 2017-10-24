import React from 'react'
import Person from './Person'
import Layout from '../../components/Layout'

export default {

  path: '/person/:id',

  async action({fetch, params}) {
    const query = `
      *[_id=="${params.id}"] {
        _id,
        _type,
        name,
        shortBio,
        portraits[0...1] {
          asset -> {url, metadata {dimensions}}
        },
        deceased,
        dob,
        affiliationsPeriods[],
        "references": *[references(^._id)]{
          _id,
          _type,
          title,
          name,
          description,
          identifier,
          date,
          subjects,
          format,
          rights,
          imageAssets[0...1] {
            _key,
            asset -> {url, metadata {dimensions}}
          },
          "references": *[references(^._id)] {
            _id,
            _type,
            title,
            name,
            description,
            identifier,
            date,
            subjects,
            format,
            rights,
            imageAssets[0...1] {
              _key,
              asset -> {url, metadata {dimensions}}
            }
          }
        } | order(date.date.utc asc)
      }
    `
    const result = await fetch(query, {})
    return {
      title: result[0].name,
      component: <Layout><Person person={result[0]} /></Layout>,
    }
  },
}
