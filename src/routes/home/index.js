import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action({ fetch }) {
    const query = `
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
        imageAssets[] {asset -> {url}}
      } | order(_createdAt desc) [0..20]
    `;
    const items = await fetch(query, {});
    return {
      title: 'React Starter Kit',
      component: <Layout><Home items={items} /></Layout>,
    };
  },

};
