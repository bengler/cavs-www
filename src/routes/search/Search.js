/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import url from 'url'
import {get} from 'lodash'
import history from '../../history'
import Link from '../../components/Link'
import LinkResolver from '../../components/Link/Resolver'

import s from './Search.css'

function isItem(type) {
  return (
    type == 'building'
    || type == 'event'
    || type == 'exhibition'
    || type == 'institution'
    || type == 'multipleInstallation'
    || type == 'multipleTimebased'
    || type == 'work2d'
    || type == 'work3d'
    || type == 'workTimebased'
    || type == 'audioRecording'
    || type == 'correspondence'
    || type == 'document'
    || type == 'ephemera'
    || type == 'eResource'
    || type == 'floorplan'
    || type == 'movingImage'
    || type == 'newsClipping'
    || type == 'poster'
    || type == 'publication'
    || type == 'stillImage'
  )
}

class Search extends React.PureComponent {

  static propTypes = {
    result: PropTypes.arrayOf(
      PropTypes.object
    ),
    query: PropTypes.string
  }

  static defaultProps = {
    result: [],
    query: ''
  }

  state = {
    query: this.props.query
  }

  handleInputChange = event => {
    this.setState({
      query: event.target.value
    })
    const currentUrl = url.parse(document.location.href, true)
    currentUrl.query.q = event.target.value
    delete currentUrl.search
    history.push(url.parse(url.format(currentUrl)).path)
  }

  renderItem = item => {
    const portrait = get(item, 'portraits[0].asset.url')
    const image = get(item, 'imageAssets[0].asset.url')
    const src = portrait || image
    let to = `/${item._type}/${item._id}`

    if (isItem(item._type)) {
      to = `/item/${item.identifier || item._id}`
    }

    return (
      <li key={item._id} className={item._type == 'person' ? s.itemPerson : s.item}>
        <LinkResolver item={item} className={s.link}>
          {
            src && (
              <img src={`${src}?w=500`} className={s.image} />
            )
          }
          <h3 className={s.itemTitle}>
            {item.title || item.name}
          </h3>
        </LinkResolver>
      </li>
    )
  }

  render() {
    const {result} = this.props
    const {query} = this.state

    return (
      <div className={s.root}>
        <form method="get" action="/search">
          <input
            type="search"
            tabIndex="0"
            autoFocus="true"
            value={query}
            name="q"
            placeholder="Search…"
            className={s.input}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={this.handleInputChange}
          />
          <button type="submit" className={s.submit}>Search</button>
        </form>
        <ul className={s.result}>
          {
            result.map(item => {
              return this.renderItem(item)
            })
          }
          {
            result.map(item => {
              return (
                item.references && item.references.map(ref => {
                  return this.renderItem(ref)
                })
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default withStyles(s)(Search)
