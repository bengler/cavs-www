import React from 'react'
import PropTypes from 'prop-types'
import {get, groupBy, toArray} from 'lodash'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import LinkResolver from '../Link/Resolver'
import ImageGallery from '../ImageGallery/ImageGallery'
import ResolveType from '../ResolveType'

import s from './ReferenceGrid.css'

class ReferencesGrid extends React.Component {
  static propTypes = {
    references: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      identifier: PropTypes.string, // This tells that it is an item
    })),
  };

  static defaultProps = {
    references: [],
  }

  render() {
    const {references} = this.props

    const used = []
    const groupedReferences = groupBy(references, ref => {
      return ref._type
    })

    const sortedReferences = []

    const workTypes = [
      'work2d',
      'work3d',
      'workTimebased',
      'event',
      'exhibition',
      'conference',
      'building',
      'institution',
      'multipleInstallation',
      'multipleTimebased'
    ]

    const itemTypes = [
      'stillImage',
      'movingImage',
      'correspondence',
      'audioRecording',
      'document',
      'poster',
      'publication',
      'ephemera',
      'eResource',
      'floorplan',
      'newsClipping'
    ]

    workTypes.forEach(key => {
      if (groupedReferences[key]) {
        if (groupedReferences[key]) {
          groupedReferences[key].forEach(item => {
            sortedReferences.push(item)
          })
        }
      }
    })

    itemTypes.forEach(key => {
      if (groupedReferences[key]) {
        if (groupedReferences[key]) {
          groupedReferences[key].forEach(item => {
            sortedReferences.push(item)
          })
        }
      }
    })

    return (
      <div className={s.grid}>
        {
          sortedReferences.map(reference => {
            const year = get(reference, 'date.date.utc')
            let imageAssets = []
            if (used.includes(reference._id)) {
              return false
            }
            used.push(reference._id)
            if (reference.references && reference.references.length > 0) {
              let isUsed = false
              reference.references.forEach(ref => {
                if (used.includes(ref._id)) {
                  isUsed = true
                }
                used.push(ref._id)
              })
              if (isUsed) {
                return false
              }
            }
            if (reference.imageAssets && reference.imageAssets.length > 0) {
              imageAssets = reference.imageAssets
            } else if (reference.references && reference.references.length > 0) {
              reference.references.forEach(ref => {
                if (ref.imageAssets && ref.imageAssets.length > 0) {
                  imageAssets = ref.imageAssets
                }
              })
            }

            return (
              <div key={reference._id} className={s.item}>
                {
                  imageAssets && imageAssets.length > 0 && (
                    <LinkResolver item={reference} className={s.image}>
                      <ImageGallery images={imageAssets} onlyOne />
                    </LinkResolver>
                  )
                }

                {
                  !imageAssets || imageAssets.length < 1 && (
                    <LinkResolver item={reference} className={s.link}>
                      <div className={s.noImage}><div className={s.padder} /></div>
                    </LinkResolver>
                  )
                }

                <div className={`${reference.imageAssets && reference.imageAssets.length ? s.itemTitle : s.itemTitleLarge}`}>
                  <span className={s.itemType}>
                    <ResolveType type={reference._type} />
                  </span>
                  <h3 className={s.itemTitle}>
                    <LinkResolver item={reference} className={s.link}>
                      {reference.title || reference.name}
                      {year && (
                        <span>, {year.split('-')[0]}</span>
                      )}
                    </LinkResolver>
                  </h3>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default withStyles(s)(ReferencesGrid)
