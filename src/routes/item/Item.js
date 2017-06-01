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
import dateFns from 'date-fns';
import { get } from 'lodash';

import s from './Item.css';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import PartOf from '../../components/PartOf/PartOf';
import Subjects from '../../components/Subjects/Subjects';
import Creators from '../../components/Creators/Creators';
import Formats from '../../components/Formats/Formats';
import Rights from '../../components/Rights/Rights';
import ResolveType from '../../components/ResolveType';

class Item extends React.Component {

  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      identifier: PropTypes.string,
      date: PropTypes.object,
      subjects: PropTypes.arrayOf(
        PropTypes.string,
      ),
      format: PropTypes.arrayOf(
        PropTypes.string,
      ),
      rights: PropTypes.shape({
        holdingInstitution: PropTypes.string,
      }),
      imageAssets: PropTypes.array,
      creators: PropTypes.array,
      partOf: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          _id: PropTypes.string,
          imageAssets: PropTypes.array,
        }),
      ),
    }),
  }

  static defaultProps = {
    item: {
      title: 'Untitled',
    },
  }

  getYear = (date) => {
    const utc = get(date, 'date.utc');
    if (utc) {
      return dateFns.format(new Date(utc), 'YYYY');
    }

    return '';
  }

  render() {
    const { item } = this.props;
    const {
      _type,
      title,
      description,
      date,
      imageAssets,
      rights = {},
      format = [],
      creators = [],
      subjects = [],
      partOf = [],
    } = item;

    if (!item) {
      return <div>Nothing here</div>;
    }

    return (
      <div className={s.root}>
        {
          imageAssets && imageAssets[0]
          && <img className={s.mainImage} src={`${imageAssets[0].asset.url}?w=1200`} alt="" />
        }
        <div className={s.container}>
          <div className={s.type}><ResolveType type={_type} /></div>
          <h1 className={s.title}>{title}{this.getYear(date)}</h1>
          <Creators creators={creators} />
          <p className={s.description}>
            {description || 'No description'}
          </p>
          <ImageGallery images={imageAssets} excludeFirst />
          <PartOf partOf={partOf} />
          <Subjects subjects={subjects} />
          <Formats formats={format} />
          <Rights rights={rights} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Item);
