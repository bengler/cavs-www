import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'

import s from './People.css'
import Link from '../../components/Link'

class Persons extends React.Component {

  static propTypes = {
    people: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        references: PropTypes.number,
      }),
    ),
    chunks: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.array
    }))
  }

  renderItems = items => {
    if (!items && !items.length) {
      return false
    }

    return items.map(item => {
      const id = item._id
      return (
        <li key={item._id} className={s.item}>
          <Link className={item.references > 0 ? s.link : s.emptyLink} to={`/person/${id}`}>{item.name || 'No name…'}</Link>
        </li>
      )
    })
  }

  render() {
    const {people, chunks} = this.props
    return (
      <div>
        <ul className={s.menu}>
          <li><Link to="/people/alphabetical">Alphabetical</Link></li>
          <li><Link to="/people/portraits">Portraits</Link></li>
          <li><Link to="/people/timeline">Timeline</Link></li>
        </ul>

        <div className={s.container}>
          <div className={s.grid}>
            {
              chunks && chunks.length && chunks.map(chunk => {
                return (
                  <div key={chunk.title} className={s.chunk}>
                    <h2 className={s.chunkTitle}>{chunk.title}</h2>
                    <ul className={s.chunkInnerList}>
                      {this.renderItems(chunk.items)}
                    </ul>
                  </div>
                )
              })
            }
            {
              !chunks && people && (
                <ul className={s.list}>
                  {
                    people.map(item => {
                      const id = item._id
                      const src = get(item, 'portraits[0].asset.url')
                      return (
                        <li key={item._id} className={s.portraitItem}>
                          <Link to={`/person/${id}`}>
                            {
                              src && <img src={`${src}?w=300&fit=max`} />
                            }
                            {
                              !src && <div className={s.imagePlaceholder}><div /></div>
                            }
                            {item.name || 'No name…'}
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Persons)
