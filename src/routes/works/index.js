import React from 'react'
import Works from './Works'
import Layout from '../../components/Layout'

// 'work2d',
// 'work3d',
// 'workTimebased',
// 'event',
// 'exhibition',
// 'conference',
// 'building',
// 'institution',
// 'multipleInstallation',
// 'multipleTimebased'

export default {

  path: '/works',

  async action({fetch}) {
    const query = `
      *[
        _type == "work2d" ||
        _type == "work2d" ||
        _type == "workTimebased" ||
        _type == "event" ||
        _type == "exhibition" ||
        _type == "conference" ||
        _type == "building" ||
        _type == "institution" ||
        _type == "multipleInstallation" ||
        _type == "multipleTimebased"
    ] {
        name,
        _id,
        _type,
        description,
        subjects,
        creators[] -> {_id, name},
        locations,
        date,
        extents,
        startDate,
        "references": *[references(^._id)] {
          _id,
          _type,
          title,
          body,
          identifier,
          imageAssets[] {
            _key,
            asset -> {url, metadata {dimensions}}
          }
        }
      }
    `
    const result = await fetch(query, {})

    const sortedResult = result.sort((a, b) => {
      if (a.startDate && b.startDate) {
        return a.startDate.date.utc - b.startDate.date.utc
      }
      return b
    })

    return {
      title: 'Works',
      component: <Layout><Works works={sortedResult} /></Layout>,
    }
  },
}
