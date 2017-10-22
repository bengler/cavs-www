import React from 'react'
import Layout from '../../components/Layout'
import Explorer from '../../components/Explorer/Explorer'
import {getRandomTheme} from '../../themes'

export default {
  path: '/',

  async action({fetch, seed}) {
    const theme = await getRandomTheme(fetch, seed)
    const intro = await fetch('*[_type == "sitePage" && title == "Introduction"][0]{body}')

    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout showHeader={false}>
          <Explorer theme={theme} intro={intro} seed={seed} />
        </Layout>
      ),
    }
  },
}
