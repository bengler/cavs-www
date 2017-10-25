import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import LinkResolver from '../Link/Resolver'
import ImageGallery from '../ImageGallery/ImageGallery'

class ReferenceList extends React.Component {
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
      <div>
        {
          references.map(reference => {
            const year = get(reference, 'date.date.utc')
            return (
              <div key={reference._id}>
                <h3>
                  <LinkResolver item={reference} />
                  &nbsp;{year && year.split('-')[0]}
                </h3>
                <LinkResolver item={reference}>
                  {
                    reference.imageAssets
                    && reference.imageAssets.length
                    && <ImageGallery images={reference.imageAssets} />
                  }
                </LinkResolver>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default ReferenceList
