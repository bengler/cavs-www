import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
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


    return (
      <div className={s.grid}>
        {
          references.map(reference => {
            const year = get(reference, 'date.date.utc')
            let imageAssets = []

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
                      <ImageGallery images={imageAssets} />
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
