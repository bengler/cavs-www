/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import url from 'url'
import {get, sortBy} from 'lodash'
import history from '../../history'
import LinkResolver from '../../components/Link/Resolver'

import s from './Search.css'

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
    query: this.props.query,
    isSearching: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.result != this.props.result) {
      this.setState({isSearching: false})
    }
  }

  handleInputChange = event => {
    this.setState({
      query: event.target.value,
      isSearching: true
    })
    const currentUrl = url.parse(document.location.href, true)
    currentUrl.query.q = event.target.value
    delete currentUrl.search
    history.push(url.parse(url.format(currentUrl)).path)
  }

  renderItem = item => {

    const aspect = get(item, 'imageAssets[0].asset.metadata.dimensions.aspectRatio')

    return (
      <li
        key={item._id}
        className={`
          ${item._type == 'person' ? s.itemPerson : s.item}
          ${aspect < 1 ? s.aspectPortrait : s.aspectLandscape}
        `}
      >
        <LinkResolver item={item} className={s.link}>
          {
            item.src && (
              <img src={`${item.src}?w=500`} className={s.image} />
            )
          }
          <h3 className={s.itemTitle}>
            {item.title || item.name || 'Untitled…'}
          </h3>
        </LinkResolver>
      </li>
    )
  }

  checkItemForImage = item => {
    const portrait = get(item, 'portraits[0].asset.url')
    const image = get(item, 'imageAssets[0].asset.url')
    let refImg = get(item, 'references[0].imageAssets[0].asset.url')

    if (item.references && item.references.length > 0) {
      item.references.forEach(ref => {
        const src = get(ref, 'imageAssets[0].asset.url')
        if (src) {
          refImg = src
        }
      })
    }
    return portrait || image || refImg
  }

  render() {
    const {result} = this.props
    const {query, isSearching} = this.state

    const itemsWithImage = []
    const itemsWithoutImage = []

    result.forEach(item => {
      const src = this.checkItemForImage(item)
      if (src) {
        const itemWithImage = Object.assign(item, {})
        itemWithImage.src = src
        itemsWithImage.push(itemWithImage)
      } else {
        itemsWithoutImage.push(item)
      }
    })

    // Also show references
    result.forEach(item => {
      if (item.references && item.references.length > 0) {
        item.references.forEach(ref => {
          const copies = itemsWithImage.find(i => {
            const match = i._id === ref._id
            return match
          })
          const copies2 = itemsWithoutImage.find(i => {
            const match = i._id === ref._id
            return match
          })

          // Not show if we have item in result
          if (copies || copies2) {
            return
          }

          const refSrc = this.checkItemForImage(ref)
          if (refSrc) {
            const itemWithImage = Object.assign(ref, {})
            itemWithImage.src = refSrc
            itemsWithImage.push(itemWithImage)
          } else {
            itemsWithoutImage.push(ref)
          }
        })
      }
    })

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
            sortBy(itemsWithImage, 'type').map(item => {
              return this.renderItem(item)
            })
          }
          {
            itemsWithoutImage.map(item => {
              return this.renderItem(item)
            })
          }
        </ul>
        {
          !isSearching && query && result && (result.length < 1) && (
            <div className={s.noResult}>
              No result for <span>{query}</span>
            </div>
          )
        }
      </div>
    )
  }
}

export default withStyles(s)(Search)
