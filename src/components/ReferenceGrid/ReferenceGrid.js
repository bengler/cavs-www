import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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
                <h3>
                  <LinkResolver item={reference}>
                    {
                      reference.imageAssets
                      && reference.imageAssets.length
                      && <ImageGallery images={reference.imageAssets} />
                    }
                  </LinkResolver>

                  <div className={`${reference.imageAssets && reference.imageAssets.length ? s.itemTitle : s.itemTitleLarge}`}>
                    <LinkResolver item={reference}>
                      {reference.title || reference.name}, {year && year.split('-')[0]}
                    </LinkResolver>&nbsp;
                    <span className={s.reference}>(<ResolveType type={reference._type} />)</span>
                  </div>
                </h3>

              </div>
            );
          })
        }
      </div>
    );
  }
}

export default withStyles(s)(ReferencesGrid);
