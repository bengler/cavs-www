import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import React from 'react'
import ReactDOM from 'react-dom/server'
import PrettyError from 'pretty-error'
import raven from 'raven'
import App from './components/App'
import Html from './components/Html'
import {ErrorPageWithoutStyle} from './routes/error/ErrorPage'
import errorPageStyle from './routes/error/ErrorPage.css'
import createFetch from './createFetch'
import router from './router'
import assets from './assets.json' // eslint-disable-line import/no-unresolved
import config from './config'

raven.config().install()

const app = express()

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

//
// Register Node.js middleware
// -----------------------------------------------------------------------------

app.get('/robots.txt', async (req, res, next) => {
  res.status(200)
  res.send('ok')
})

app.use('/cavs', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//
// Register API middleware
// -----------------------------------------------------------------------------
// app.use('/graphql', expressGraphQL(req => ({
//   schema,
//   graphiql: __DEV__,
//   rootValue: { request: req },
//   pretty: __DEV__,
// })));
app.use(raven.requestHandler())
//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const seed = Math.random()
    const css = new Set()

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()))
      },
      // Universal HTTP client
      fetch: createFetch()
    }

    const route = await router.resolve({
      path: req.path,
      query: req.query,
      fetch: context.fetch,
      seed: seed
    })

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
      return
    }

    const data = {...route}
    data.seed = seed
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>)
    data.styles = [
      {id: 'css', cssText: [...css].join('')},
    ]
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ]
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js)
    }
    // data.app = {
    //   apiUrl: config.api.clientUrl,
    // };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

//
// Error handling
// -----------------------------------------------------------------------------
app.use(raven.errorHandler())

const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(pe.render(err))
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{id: 'css', cssText: errorPageStyle._getCss()}]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})

//
// Launch the server
// -----------------------------------------------------------------------------

app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`) // eslint-disable-line
})
