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
import s from './Person.css';

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
    const { name, portraits, shortBio, stillImageCollection } = person;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.name}>{name}</h1>
          <p>{shortBio}</p>
          {
            portraits && portraits.length > 0 && (
              <img src={`${portraits[0].asset.url}?w=500`} alt="" />
            )
          }

          <h2>Still images</h2>
          {
            stillImageCollection && stillImageCollection.map(stillImage => (
              <div>
                <h3>{stillImage.title}</h3>
                {
                  stillImage.imageAssets.map(image => (
                    <img src={`${image.asset.url}?w=300`} alt="" />
                  ))
                }
              </div>
              ))
          }
          <h2>Work2d</h2>


        </div>
      </div>
    );
  }
}

export default withStyles(s)(Persons);
