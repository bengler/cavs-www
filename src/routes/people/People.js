import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'
import PeopleTimeline from '../../components/PeopleTimeline/PeopleTimeline'
import Menu from './Menu'

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
    view: PropTypes.oneOf(['alphabetical', 'portraits', 'timeline']).isRequired,
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

  renderPortraits = people => {
    if (!people) {
      return 'No people'
    }

    return (
      <ul className={s.portraitList}>
        {
          people.map(item => {
            const id = item._id
            const src = get(item, 'portraits[0].asset.url')
            if (!src) {
              return false
            }
            const aspectRatio = get(item, 'portraits[0].asset.metadata.dimensions.aspectRatio') || 1

            return (
              <li key={item._id} className={s.portraitItem}>
                <Link to={`/person/${id}`} className={s.portraitLink}>
                  <span className={s.portraitImageWrapper}>
                    <span
                      className={s.padder}
                      style={{paddingTop: `${100 / aspectRatio}%`}}
                    />
                    <img src={`${src}?w=300&fit=max`} className={s.portraitImage} />
                  </span>
                  <span className={s.portraitTitle}>
                    {item.name || 'No name…'}
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }

  render() {
    const {people, chunks, view} = this.props
    return (
      <div>
        <Menu />

        <div className={s.container}>
          
          {
            view === 'alphabetical' && chunks && chunks.length && chunks.map(chunk => {
              return (
                <div className={s.grid}>
                  <div key={chunk.title} className={s.chunk}>
                    <h2 className={s.chunkTitle}>{chunk.title}</h2>
                    <ul className={s.chunkInnerList}>
                      {this.renderItems(chunk.items)}
                    </ul>
                  </div>
                </div>
              )
            })
          }

          {
            view === 'portraits' && people && this.renderPortraits(people)
          }
        </div>
        
        {
          view === 'timeline' && people && <PeopleTimeline people={people} />
        }
      </div>
    )
  }
}

export default withStyles(s)(Persons)
