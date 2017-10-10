import React from 'react'
import { keys, union, flattenDeep } from 'lodash';
import seedrandom from 'seedrandom'
import Layout from '../../components/Layout'
import Explorer from '../../components/Explorer/Explorer'
import { getRandomTheme } from '../themes'

export default {
  path: '/',

  async action({ fetch, seed }) {
    const theme = await getRandomTheme(fetch, seed)

    theme.tangents = [
      await getRandomTheme(fetch, theme.key),
      await getRandomTheme(fetch, theme.key + '2')
    ]

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout>
          <Explorer theme={theme} />
        </Layout>
      ),
    }
  },
}
