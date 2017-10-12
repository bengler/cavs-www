/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Blocks from '@sanity/block-content-to-react'

import Link from '../../components/Link'

import s from './About.css'

class About extends React.PureComponent {

  static propTypes = {
    content: PropTypes.shape(
      {
        current: PropTypes.arrayOf(
          PropTypes.shape({
            body: PropTypes.object,
            title: PropTypes.string
          })
        ),
        pages: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string,
            title: PropTypes.string,
          })
        )
      }
    )
  }

  static defaultProps = {
    content: {}
  }

  render() {
    const {content} = this.props
    const {pages, current} = content
    return (
      <div className={s.root}>
        <ul className={s.menu}>
          {
            pages.map(page => {
              return (
                <li key={page._id} className={s.menuItem}>
                  <Link to={`/about/${page.title}`}>{page.title}</Link>
                </li>
              )
            })
          }
        </ul>
        <div className={s.content}>
          <Blocks blocks={current[0].body} />
        </div>
      </div>
    )
  }
}

export default withStyles(s)(About)
