/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import url from 'url'
import {get, sortBy, debounce} from 'lodash'
import history from '../../history'
import LinkResolver from '../../components/Link/Resolver'
import Spinner from '../../components/Spinner/Spinner'

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
    const query = event.target.value
    this.setState({
      query: query,
      isSearching: true
    })
    this.doSearch(query)
  }

  doSearch = debounce(query => {
    const currentUrl = url.parse(document.location.href, true)
    currentUrl.query.q = query
    delete currentUrl.search
    history.push(url.parse(url.format(currentUrl)).path)
  }, 300)

  renderItem = item => {
    const aspectRatio = get(item, 'asset.metadata.dimensions.aspectRatio') || 1

    return (
      <li
        key={item._id}
        className={`
          ${item._type == 'person' ? s.itemPerson : s.item}
          ${aspectRatio < 1 ? s.aspectPortrait : s.aspectLandscape}
        `}
      >
        <LinkResolver item={item} className={s.link}>
          <div className={s.imageContainer}>
            <div className={s.padder} style={{paddingTop: `${100 / aspectRatio}%`}} />
            {
              item.asset && (
                <img src={`${item.asset.url}?w=500`} className={s.image} />
              )
            }
            {
              !item.asset && (
                <div className={s.noImage} />
              )
            }
          </div>
          <h3 className={s.itemTitle}>
            {item.title || item.name || 'Untitled…'}
          </h3>
        </LinkResolver>
      </li>
    )
  }

  checkItemForImage = item => {
    let asset
      = get(item, 'portraits[0].asset')
      || get(item, 'imageAssets[0].asset')
      || get(item, 'references[0].imageAssets[0].asset')

    if (item.references && item.references.length > 0) {
      item.references.forEach(ref => {
        const refAsset = get(ref, 'imageAssets[0].asset.url')
        if (refAsset) {
          asset = get(ref, 'imageAssets[0].asset')
        }
      })
    }
    return asset
  }

  render() {
    const {result} = this.props
    const {query, isSearching} = this.state

    const itemsWithImage = []
    const itemsWithoutImage = []

    result.forEach(item => {
      const asset = this.checkItemForImage(item)
      if (asset) {
        const itemWithImage = Object.assign(item, {})
        itemWithImage.asset = asset
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

          const asset = this.checkItemForImage(ref)
          if (asset) {
            const itemWithImage = Object.assign(ref, {})
            itemWithImage.asset = asset
            itemsWithImage.push(itemWithImage)
          } else {
            itemsWithoutImage.push(ref)
          }
        })
      }
    })

    return (
      <div className={s.root}>
        <form method="get" action="/cavs/search">
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
        {
          isSearching && (
            <div className={s.spinner}>
              <Spinner>Loading</Spinner>
            </div>
          )
        }
        {
          !isSearching && result && (
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
          )
        }
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
