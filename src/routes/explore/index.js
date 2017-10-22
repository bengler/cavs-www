import React from 'react'
import Layout from '../../components/Layout'
import Explorer from '../../components/Explorer/Explorer'
import {getTheme} from '../../themes'

export default {
  path: '/explore/:type/:key',

  async action({fetch, seed, params}) {
    const {type, key} = params
    const theme = await getTheme(fetch, type, key)
    const intro = await fetch('*[_type == "sitePage" && title == "Introduction"][0]{body}')

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      scroll: false,
      component: (
        <Layout showHeader={false}>
          <Explorer theme={theme} intro={intro} seed={seed} />
        </Layout>
      ),
    }
  },
}
