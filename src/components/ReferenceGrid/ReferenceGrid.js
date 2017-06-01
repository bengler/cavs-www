import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import LinkResolver from '../Link/Resolver';
import ImageGallery from '../ImageGallery/ImageGallery';
import ResolveType from '../ResolveType';

import s from './ReferenceGrid.css';

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
    const { references } = this.props;
    return (
      <div className={s.grid}>
        {
          references.map((reference) => {
            const year = get(reference, 'date.date.utc');
            return (
              <div key={reference._id} className={s.item}>
                {
                  reference.imageAssets
                  && reference.imageAssets.length
                  && <ImageGallery images={reference.imageAssets} />
                }
                <h3>
                  <LinkResolver item={reference} />
                  {year && year.split('-')[0]} (<ResolveType type={reference._type} />)
                </h3>

              </div>
            );
          })
        }
      </div>
    );
  }
}

export default ReferencesGrid;
