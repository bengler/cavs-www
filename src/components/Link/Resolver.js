import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

class LinkResolver extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string,
      identifier: PropTypes.string,
    }),
    children: PropTypes.node,
  };

  static defaultProps = {
    item: {},
  }

  render() {
    const { item, children } = this.props;
    if (item.identifier) {
      return (
        <Link to={`/item/${item.identifier}`}>
          {children || item.title || item.name || 'Untitled'}
        </Link>
      );
    }
    if (!item.identifier && item._id) {
      return (
        <Link to={`/group/${item._id}`}>
          {children || item.title || item.name || 'Untitled'}
        </Link>
      );
    }
    return (
      <span>
        Could not resolve link
        {children || item.title || item.name || 'Untitled'}
      </span>
    );
  }
}

export default LinkResolver;
