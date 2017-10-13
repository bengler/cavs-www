import React from 'react'
import Home from './Home'
import Layout from '../../components/Layout'

export default {

  path: '/',

  async action({fetch}) {
    const query = `
      {"recentObjects":
        *[
        _type == "building" ||
        _type == "event" ||
        _type == "exhibition" ||
        _type == "institution" ||
        _type == "multipleInstallation" ||
        _type == "multipleTimebased" ||
        _type == "work2d" ||
        _type == "work3d" ||
        _type == "workTimebased" ||
        _type == "audioRecording" ||
        _type == "correspondence" ||
        _type == "document" ||
        _type == "ephemera" ||
        _type == "eResource" ||
        _type == "floorplan" ||
        _type == "movingImage" ||
        _type == "newsClipping" ||
        _type == "poster" ||
        _type == "publication" ||
        _type == "stillImage"
      ] {
        _type,
        _id,
        _createdAt,
        identifier,
        title,
        date,
        name,
        imageAssets[] {
          _key,
          asset -> {url}
        },
        "references": *[references(^._id)]{
          _id,
          imageAssets[] {
            _key,
            asset -> {url}
          }
        }
      } | order(_createdAt desc) [0..20]
      }
    `
    const items = await fetch(query, {})
    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: <Layout><Home recentObjects={items.recentObjects} people={items.people} /></Layout>,
    }
  },

}
