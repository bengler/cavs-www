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
import s from './Group.css';
import ReferenceList from '../../components/ReferenceList/ReferenceList';
import Subjects from '../../components/Subjects/Subjects';
import Creators from '../../components/Creators/Creators';
import Locations from '../../components/Locations/Locations';


class Item extends React.Component {

  static propTypes = {
    group: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
      creators: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        _id: PropTypes.string,
      })),
      locations: PropTypes.arrayOf(PropTypes.object),
      references: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.title,
      })),
    }),
  }

  static defaultProps = {
    group: {
      name: 'Untitled…',
    },
  }

  render() {
    const { group } = this.props;
    const {
      _type,
      name,
      description,
      subjects = [],
      creators = [],
      references = [],
      locations = [],
    } = group;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{name} ({_type})</h1>
          <p className={s.description}>{description}</p>

          <ReferenceList references={references} />

          <Subjects subjects={subjects} />

          <Creators creators={creators} />

          <Locations locations={locations} />

        </div>
      </div>
    );
  }
}

export default withStyles(s)(Item);
