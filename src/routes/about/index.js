import React from 'react'
import About from './About'
import Layout from '../../components/Layout'

function createQuery(title) {
  return `
  {
    "pages": *[_type == 'sitePage']{_id, title},
    "current": *[_type == "sitePage" && title == "${title}"]
  }
  `
}

export default {

  path: '/about',
  children: [
    {
      path: '',
      async action({fetch, params}) {
        const title = 'About'
        const content = await fetch(createQuery(title), {}) || [{}]
        return {
          title: title,
          component: <Layout><About title={title} content={content} /></Layout>
        }
      }
    },
    {
      path: '/:page',
      async action({fetch, params}) {
        const title = params.page
        const content = await fetch(createQuery(title), {}) || [{}]
        return {
          title: title,
          component: <Layout><About title={title} content={content} /></Layout>
        }
      }
    }
  ]
}
