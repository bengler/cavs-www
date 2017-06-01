import React from 'react';
import PropTypes from 'prop-types';
import { findLast } from 'lodash';
import LinkResolver from '../Link/Resolver';
import ResolveType from '../ResolveType';

class PartOf extends React.Component {
  static propTypes = {
    partOf: PropTypes.array,
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
              const imageUrl = part.references.map(reference =>
                 findLast(reference.imageAssets, asset => asset.asset.url).asset.url)[0];


              if (part._id) {
                return (
                  <li key={part._id}>
                    {
                      imageUrl && (
                        <img src={`${imageUrl}?w=100`} alt={part.name || part.title} />
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
