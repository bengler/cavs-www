/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { get } from 'lodash';
import s from './Person.css';
import LinkResolver from '../../components/Link/Resolver';
import ImageGallery from '../../components/ImageGallery/ImageGallery';

class Persons extends React.Component {

  static propTypes = {
    person: PropTypes.shape({
      name: PropTypes.string,
      portraits: PropTypes.array,
    }),
  }

  static defaultProps = {
    person: {
      name: 'Untitled',
      portraits: [],
    },
  }

  render() {
    const { person } = this.props;
    const { name, portraits, shortBio, references = [] } = person;
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{name}</h1>
          <p className={s.description}>{shortBio}</p>

          <ImageGallery images={portraits} />

          <h2>References</h2>
          {
            references.length && references.map((reference) => {
              const year = get(reference, 'date.date.utc');
              if (!reference.identifier) {
                return (
                  <div key={reference._id}>{reference._type} ({reference._id})</div>
                );
              }
              return (
                <div key={reference.identifier}>
                  <h3>
                    <LinkResolver item={reference}>{reference.title || 'Untitled…'}</LinkResolver>
                    {year && year.split('-')[0]} ({reference._type})
                  </h3>
                  {
                    reference.imageAssets
                    && reference.imageAssets.length
                    && <ImageGallery images={reference.imageAssets} />
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Persons);
