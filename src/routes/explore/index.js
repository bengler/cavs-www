import React from 'react'
import Layout from '../../components/Layout'
import Explorer from '../../components/Explorer/Explorer'
import {getTheme, getRandomTheme} from '../../themes'

export default {
  path: '/explore/:type/:key',

  async action({fetch, seed, params}) {
    const {type, key} = params
    const theme = await getTheme(fetch, type, key)

    theme.related = [
      await getRandomTheme(fetch, theme.key),
      await getRandomTheme(fetch, `${theme.key}-2`)
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