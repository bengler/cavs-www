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
import s from './Subject.css';
import ReferenceList from '../../components/ReferenceList/ReferenceList';

class Subject extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
    })),
    subject: PropTypes.string.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  render() {
    const { items, subject } = this.props;
    return (
      <div>
        <div className={s.container}>
          <h1 className={s.title}>{subject}</h1>
          <ReferenceList references={items} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Subject);
