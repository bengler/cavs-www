import React from 'react'
import {flattenDeep, compact, uniq} from 'lodash'
import Subjects from './Subjects'
import Layout from '../../components/Layout'

export default {

  path: '/subjects',

  async action({fetch}) {
    const query = `
      *[defined(subjects)].subjects
    `
    const subjects = await fetch(query, {})

    return {
      title: 'Subjects',
      component: <Layout><Subjects subjects={compact(uniq(flattenDeep(subjects))).sort()} /></Layout>,
    }
  },

}
