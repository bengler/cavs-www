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
    } = item;

    return (
      <div className={s.root}>
        {
          imageAssets && imageAssets.length && imageAssets.map(image => (
            <img className={s.mainImage} src={`${image.asset.url}?w=500`} alt="" />
          ))
        }
        <h1>{title}</h1>
        <p>{dateFns.format(new Date(date.date.utc), 'YYYY')}</p>
        <p>{description}</p>
        {
          imageAssets && imageAssets.length && imageAssets.map(image => (
            <img className={s.mainImage} src={`${image.asset.url}?w=500`} alt="" />
          ))
        }
        <h2>Creators</h2>
        <ul>
          {
            creators.map(creator => (
              <li>
                <Link to={`/person/${creator._id}`}>{creator.name}</Link>
              </li>
              ))
          }
        </ul>

        <h2>Subjects</h2>
        <ul>
          {
            subjects.map(subject => (
              <li>{subject}</li>
              ))
          }
        </ul>

        <h2>Format</h2>
        <ul>
          {
            format.map(formatTitle => (
              <li>{formatTitle}</li>
              ))
          }
        </ul>

        <h2>Rights</h2>
        <p>{rights.holdingInstitution}</p>
      </div>
    );
  }
}

export default withStyles(s)(Item);
