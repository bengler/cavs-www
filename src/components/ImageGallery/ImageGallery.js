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
import s from './ImageGallery.css';

class ImageGallery extends React.Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.string.isRequired,
      asset: PropTypes.shape({
        url: PropTypes.string,
      }),
    })),
  };

  static defaultProps = {
    images: [],
  }

  render() {
    const { images } = this.props;
    if (!images.length) {
      return false;
    }
    return (
      <div className={s.root}>
        {
          images.map((image) => {
            const url = get(image, 'asset.url');
            return (
              <img key={image._key} className={s.image} src={`${url}?w=300`} alt="" />
            );
          })
        }
      </div>
    );
  }
}

export default withStyles(s)(ImageGallery);
