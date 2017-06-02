import React from 'react';
import PropTypes from 'prop-types';
import { findLast } from 'lodash';
import LinkResolver from '../Link/Resolver';
import ResolveType from '../ResolveType';

class PartOf extends React.Component {
  static propTypes = {
    partOf: PropTypes.arrayOf(PropTypes.shape({
      references: PropTypes.array,
      _id: PropTypes.string,
      _type: PropTypes.string,
    })),
  };

  static defaultProps = {
    partOf: [],
  }

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { partOf } = this.props;

    if (!partOf.length) {
      return (
        <div>part of Nothing</div>
      );
    }

    return (
      <div>
        <h2>Part of</h2>
        <ul>
          {
            partOf.map((part) => { // eslint-disable-line
              const image = part.references
                && part.references.length
                && part.references.map((reference) => {
                  if (reference.imageAssets && reference.imageAssets.length) {
                    return findLast(reference.imageAssets, (asset) => {
                      if (asset && asset.asset && asset.asset.url) {
                        return asset.asset.url;
                      }
                      return false;
                    });
                  }
                  return false;
                },
              )[0];

              if (part._id) {
                return (
                  <li key={part._id}>
                    {
                      image && image.asset && image.asset.url && (
                        <img src={`${image.asset.url}?w=100`} alt={part.name || part.title} />
                      )
                    }
                    <LinkResolver item={part} /> (<ResolveType type={part._type} />)
                  </li>
                );
              }
            })
          }
        </ul>
      </div>
    );
  }
}

export default PartOf;
