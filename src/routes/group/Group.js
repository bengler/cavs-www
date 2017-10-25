import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {get} from 'lodash'

import s from './Group.css'
import ReferenceGrid from '../../components/ReferenceGrid/ReferenceGrid'
import Subjects from '../../components/Subjects/Subjects'
import Creators from '../../components/Creators/Creators'
import Locations from '../../components/Locations/Locations'
import Extents from '../../components/Extents/Extents'
import ResolveType from '../../components/ResolveType'
import Annotation from '../../components/Annotation/Annotation'

class Item extends React.Component {

  static propTypes = {
    group: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
      creators: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        _id: PropTypes.string,
      })),
      extents: PropTypes.shape({
        depth: PropTypes.number,
        description: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      }),
      locations: PropTypes.arrayOf(PropTypes.object),
      references: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.title,
      })),
    }),
  }

  static defaultProps = {
    group: {
      name: 'Untitled…',
    },
  }

  render() {
    const {group} = this.props
    const {
      _type,
      name,
      description,
      subjects = [],
      creators = [],
      references = [],
      locations = [],
    } = group


    const year = get(group, 'date.date.utc')

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.type}><ResolveType type={_type} /></div>
          <h1 className={s.title}>
            {name}
            {year && (
              <span>, {year.split('-')[0]}</span>
            )}
          </h1>
          <div className={s.creators}>
            <Creators creators={creators} />
          </div>
          <p className={s.description}>{description}</p>

          <div className={s.meta}>
            {
               (_type === 'work3d' || _type === 'work2d') && (
                 <span>
                   <Extents extents={group.extents} type={group._type} />
                 </span>
               )
            }
            <Subjects subjects={subjects} />
          </div>

          {
            references && references.length > 0 && (
              <div className={s.documentation}>
                {/* <h2>Documentation</h2> */}
                <ReferenceGrid references={references} />
              </div>
            )
          }
          {
            references && references.length > 0 && references.map(ref => {
              if (ref._type == 'annotation') {
                return (
                  <div>
                    <Annotation annotation={ref} />
                  </div>
                )
              }
              return false
            })
          }

        </div>
        <div className={s.locations}>
          <Locations locations={locations} />
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Item)
