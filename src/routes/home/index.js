import React from 'react'
import Layout from '../../components/Layout'
import App from '../../components/Home/App'

export default {
  path: '/',

  action({fetch, seed}) {
    return {
      title: 'MIT Center for Advanced Visual Studies Special Collection',
      component: (
        <Layout showHeader={false} inverted>
          <App fetch={fetch}/>
        </Layout>
      ),
    }
  },
}
