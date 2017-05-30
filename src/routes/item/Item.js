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

import s from './Item.css';
import Link from '../../components/Link';
import ImageGallery from '../../components/ImageGallery/ImageGallery';

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
        }),
      ),
    }),
  }

  static defaultProps = {
    item: {
      title: 'Untitled',
    },
  }

  render() {
    const { item } = this.props;
    const {
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
        <h1>{title} ({item._type})</h1>
        {
          date && (
            <p>{dateFns.format(new Date(date.date.utc), 'YYYY')}</p>
          )
        }
        <p>{description}</p>
        <ImageGallery images={imageAssets} />
        <h2>Creators</h2>
        <ul>
          {
            creators.map(creator => (
              <li key={creator._id}>
                <Link to={`/person/${creator._id}`}>{creator.name}</Link>
              </li>
              ))
          }
        </ul>

        <h2>Subjects</h2>
        <ul>
          {
            subjects.map(subject => (
              <li key={subject}>
                <Link to={`/subject/${subject}`}>{subject}</Link>
              </li>
              ))
          }
        </ul>

        <h2>Format</h2>
        <ul>
          {
            format.map(formatTitle => (
              <li key={formatTitle}>{formatTitle}</li>
              ))
          }
        </ul>

        <h2>Rights</h2>
        <p>{rights.holdingInstitution}</p>

        <h2>Part of</h2>
        <ul>
          {
            partOf.map(part => (
              part._id && (
                <li key={part._id}>
                  <Link to={`/group/${part._id}`}>{part.name || 'Untitled'}</Link> ({part._type})
                </li>
              )
            ))
          }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(Item);
