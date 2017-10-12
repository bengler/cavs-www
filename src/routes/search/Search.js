/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import url from 'url'
import history from '../../history'

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

  handleInputChange = event => {
    const currentUrl = url.parse(document.location.href, true)
    currentUrl.query.q = event.target.value
    delete currentUrl.search
    history.push(url.parse(url.format(currentUrl)).path)
  }

  render() {
    const {result, query} = this.props

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
              return (
                <li key={item._id}>{item.title}</li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default withStyles(s)(Search)
