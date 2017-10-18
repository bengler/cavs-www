import React from 'react'
import Layout from '../../components/Layout'
import Explorer from '../../components/Explorer/Explorer'
import {getTheme} from '../../themes'

export default {
  path: '/explore/:type/:key',

  async action({fetch, seed, params}) {
    const {type, key} = params
    const theme = await getTheme(fetch, type, key)

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout showHeader={false} inverted>
          <Explorer theme={theme} />
        </Layout>
      ),
    }
  },
}
